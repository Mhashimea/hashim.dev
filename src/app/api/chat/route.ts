import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { cerebras } from "@ai-sdk/cerebras";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  tool,
  type LanguageModel,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/persona";

export const maxDuration = 30;

/* Use whichever free provider has a key set (add just one). */
function resolveModel(): LanguageModel | null {
  if (process.env.OPENROUTER_API_KEY) {
    const or = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
    // Primary + fallbacks: OpenRouter auto-routes to the next if a free pool is
    // rate-limited. All non-reasoning models (no chain-of-thought leaking into chat).
    return or.chat("google/gemma-4-31b-it:free", {
      models: [
        "google/gemma-4-31b-it:free",
        "google/gemma-4-26b-a4b-it:free",
        "minimax/minimax-m3:free",
      ],
    });
  }
  if (process.env.GROQ_API_KEY) return groq("llama-3.3-70b-versatile");
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return google("gemini-2.0-flash");
  if (process.env.CEREBRAS_API_KEY) return cerebras("gpt-oss-120b");
  return null;
}

/* ---- tiny per-instance rate limit (MVP; swap for Upstash/CF in prod) ---- */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 14;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

/* ---- send a captured lead to Hashim's inbox (Resend, free tier) ---- */
async function sendLeadEmail(lead: { name: string; email: string; summary: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL ?? "hashimea@outlook.com";
  if (!key) {
    console.log("[lead] (no RESEND_API_KEY set) captured:", lead);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM ?? "hashim.dev <onboarding@resend.dev>",
        to,
        reply_to: lead.email,
        subject: `New lead from hashim.dev — ${lead.name}`,
        text: `Name: ${lead.name}\nEmail: ${lead.email}\n\nWhat they need:\n${lead.summary}\n\n— captured by the AI chat on hashim.dev`,
      }),
    });
  } catch (err) {
    console.error("[lead] email failed:", err);
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "anon").split(",")[0].trim();
  if (rateLimited(ip)) {
    return new Response(
      "I'm getting a lot of messages right now — give it a minute, or just email me at hashimea@outlook.com 🙏",
      { status: 429 },
    );
  }

  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const model = resolveModel();
  if (!model) {
    return new Response(
      "The chat isn't switched on yet (no LLM key set). In the meantime, email me at hashimea@outlook.com!",
      { status: 503 },
    );
  }

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature: 0.6,
    stopWhen: stepCountIs(4),
    tools: {
      captureLead: tool({
        description:
          "Send the visitor's details to Hashim once you have their name, email, and a one-line summary of what they need. Only call when there's genuine interest in working together.",
        inputSchema: z.object({
          name: z.string().describe("The visitor's name"),
          email: z.string().describe("The visitor's email address"),
          summary: z.string().describe("One or two lines: what they're building / need"),
        }),
        execute: async (lead) => {
          await sendLeadEmail(lead);
          return { ok: true };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
