"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "./Avatar";

const STARTERS = [
  "What can you build for me?",
  "Tell me about tmmate",
  "Are you available for freelance?",
  "What's your stack?",
];

function textOf(parts: { type: string; text?: string }[]) {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [conversationId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  );
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { conversationId } }),
    [conversationId],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  // Open via the "#chat" hash (the "Chat with me" CTAs link here)
  useEffect(() => {
    const check = () => window.location.hash === "#chat" && setOpen(true);
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  // Autoscroll to newest
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  };

  const lastRole = messages[messages.length - 1]?.role;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full border border-marigold/30 bg-ink-soft py-2 pl-2 pr-4 shadow-2xl shadow-black/50 transition-transform hover:-translate-y-0.5"
            aria-label="Chat with Hashim"
          >
            <Avatar size={34} ring={false} />
            <span className="text-sm font-medium text-cream">Chat with me</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 right-5 z-[70] flex h-[min(600px,calc(100vh-3rem))] w-[min(384px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-ink-soft shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Avatar size={38} ring={false} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-cream">Hashim</p>
                  <span className="rounded-full border border-teal/40 bg-teal/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-teal">
                    AI
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-cream-dim">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" /> online — usually replies instantly
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-cream-dim transition-colors hover:bg-ink-card hover:text-cream"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {/* Greeting (UI only) */}
              <Bubble role="assistant">Hey 👋 I&apos;m Hashim. What are you building?</Bubble>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-ink-card px-3 py-1.5 text-xs text-cream-dim transition-colors hover:border-marigold/40 hover:text-cream"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => {
                const t = textOf(m.parts as { type: string; text?: string }[]);
                if (!t) return null;
                return (
                  <Bubble key={m.id} role={m.role === "user" ? "user" : "assistant"}>
                    {t}
                  </Bubble>
                );
              })}

              {status === "submitted" && lastRole === "user" && <Typing />}

              {error && (
                <Bubble role="assistant">
                  Hmm, something glitched on my end. Mind emailing me at hashimea@outlook.com?
                </Bubble>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="min-w-0 flex-1 rounded-full border border-line bg-ink-card px-4 py-2.5 text-sm text-cream placeholder:text-cream-faint focus:border-marigold/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-marigold text-ink transition-opacity disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill="currentColor" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-marigold px-3.5 py-2 text-sm leading-relaxed text-ink">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <div className="mb-0.5 shrink-0">
        <Avatar size={26} ring={false} />
      </div>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-line bg-ink-card px-3.5 py-2 text-sm leading-relaxed text-cream">
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2">
      <div className="mb-0.5 shrink-0">
        <Avatar size={26} ring={false} />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-ink-card px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream-dim"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
