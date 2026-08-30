// Single source of truth for site content — from docs/profile.md

export const profile = {
  name: "Muhammed Hashim EA",
  short: "Hashim",
  role: "Software & AI Engineer",
  location: "Dubai, UAE",
  years: "8+",
  email: "hashimea@outlook.com",
  github: "https://github.com/Mhashimea",
  linkedin: "https://www.linkedin.com/in/hashim-ea",
  x: "https://x.com/hashim_ea",
  followers: "3,000+",
  // Hero
  headline: "I build AI agents\nand the backend that runs them.",
  sub: "8+ years shipping production software. Now architecting AI agent platforms, real-time voice agents, and the durable systems behind them.",
};

export const stats = [
  { value: "8+", label: "years shipping" },
  { value: "60–80%", label: "LLM cost cut on tmmate" },
  { value: "~75ms", label: "voice TTS latency, Truepick" },
  { value: "500+", label: "employees on RadixHR payroll" },
];

export type TimelineItem = {
  year: string;
  role: string;
  org: string;
  note?: string;
  now?: boolean;
};

export const timeline: TimelineItem[] = [
  {
    year: "2025 — now",
    role: "Senior Software Engineer (AI & Backend)",
    org: "Data Nexus Labs",
    note: "Agent platforms, voice agents, LLM orchestration.",
    now: true,
  },
  {
    year: "2025 — now",
    role: "Co-founder / Founding Engineer",
    org: "Flowtrail AI",
    note: "Conversational analytics AI, from zero.",
    now: true,
  },
  {
    year: "2021 — 24",
    role: "Full-Stack Developer",
    org: "Flaunte Portal LLC · Dubai",
  },
  {
    year: "2020 — 21",
    role: "Software Engineer",
    org: "Webdura Technologies · Kochi",
  },
  {
    year: "2019 — 20",
    role: "Junior Software Engineer",
    org: "Acube Innovations · Kochi",
  },
  {
    year: "2018 — 19",
    role: "Web Developer",
    org: "Sevendyne LLP · Kochi",
  },
  {
    year: "2018",
    role: "B.Sc. Computer Science",
    org: "Calicut University",
  },
];

export type CaseStudy = {
  slug: string;
  name: string;
  tag: string;
  metric: { value: string; label: string };
  url?: string;
  role: string;
  summary: string;
  points: string[];
  stack: string[];
  accent: "marigold" | "teal" | "terracotta";
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "tmmate",
    name: "tmmate",
    tag: "Enterprise AI Agent Builder",
    metric: { value: "60–80%", label: "LLM cost saved" },
    url: "https://tmmate.ai",
    role: "Core Platform Engineer",
    summary:
      "A platform where organizations build, deploy, and govern their own AI “employees” — an Agent Studio, a visual workflow builder, knowledge bases, and a self-service agent marketplace.",
    points: [
      "Built the Agent Studio where agents are declared (instructions, tools, knowledge, guardrails, memory, model, triggers) with spec validation, versioning, and changelogs.",
      "Designed the durable workflow engine v2 — scheduled & webhook triggers, multi-step execution, delays, circuit breakers, plus AI-assisted workflow generation.",
      "Implemented the RAG layer on Postgres + pgvector: ingestion, chunking, pluggable embeddings, cosine-similarity search as agent tools.",
      "Multi-agent orchestration with handoffs, long-term memory, and PII / tool-result guardrails; 170+ integrations via Composio and MCP.",
      "Enterprise governance: multi-tenant RBAC, SSO, audit logs, credits & usage metering with multi-provider routing — 60–80% cost savings.",
    ],
    stack: [
      "Bun",
      "Hono",
      "React",
      "Postgres + pgvector",
      "Drizzle",
      "BullMQ",
      "Inngest",
      "Mastra",
      "MCP",
      "Composio",
    ],
    accent: "marigold",
  },
  {
    slug: "truepick",
    name: "Truepick",
    tag: "AI Recruitment · Voice Agent",
    metric: { value: "~75ms", label: "TTS latency" },
    url: "https://truepick.ai",
    role: "Backend & AI Engineer",
    summary:
      "A real-time AI video-call interviewer that autonomously conducts job interviews over live video with a lip-synced avatar.",
    points: [
      "Engineered the end-to-end voice pipeline: Silero VAD + multilingual turn-detection, ElevenLabs STT (EN/AR), GPT-4o reasoning, ElevenLabs TTS at ~75ms, optional Tavus avatar.",
      "Built a configurable 12-step interview engine with AI-interviewer and interviewer-assist modes and automatic conclusion detection.",
      "Real-time transcript streaming with HMAC-authenticated batched sync, LiveKit egress recording, and automated post-interview scoring.",
      "AI candidate screening that parses resumes (PDF/DOCX) and matches them against open roles.",
      "Multi-provider routing (Grok / Claude) with Langfuse observability and S3-backed media.",
    ],
    stack: [
      "Next.js 15",
      "Python",
      "LiveKit Agents",
      "ElevenLabs",
      "GPT-4o",
      "Tavus",
      "Drizzle",
      "Redis",
    ],
    accent: "teal",
  },
  {
    slug: "flowtrail",
    name: "Flowtrail AI",
    tag: "Conversational Analytics · Co-founded",
    metric: { value: "~40%", label: "faster responses" },
    url: "https://flowtrail.ai",
    role: "Co-founder / Founding Engineer",
    summary:
      "A conversational AI assistant that talks to your data — grounded answers across warehouses and databases.",
    points: [
      "Architected the core AI-agent backend (Mastra + Python microservices) for multi-step reasoning and tool-calling.",
      "Built LLM orchestration with smart routing and fallback across OpenAI, Claude, Gemini, and DeepSeek.",
      "Connected Snowflake, BigQuery, MySQL, MSSQL, Mongo, and DynamoDB for data-grounded responses.",
      "Secure auth (JWT, Lucia), subscription billing with Stripe & Razorpay, webhook-driven events.",
      "Cut response times ~40% through query tuning and Redis caching.",
    ],
    stack: [
      "SvelteKit",
      "Python",
      "Prisma",
      "Postgres",
      "Mastra",
      "Inngest",
      "Stripe",
    ],
    accent: "marigold",
  },
  {
    slug: "radixhr",
    name: "RadixHR",
    tag: "HR Automation Platform",
    metric: { value: "500+", label: "employees" },
    role: "Backend Engineer",
    summary:
      "The core HR backend — attendance, payroll, and employee management — running for 500+ employees.",
    points: [
      "Built a payroll calculation engine covering overtime, variable pay, deductions, and tax logic with full accuracy.",
      "Type-safe tRPC API layer and durable Inngest workflows for scheduled payroll runs with retries.",
      "Optimized Postgres via strategic indexing, query tuning, and connection pooling.",
    ],
    stack: ["Bun", "Hono", "tRPC", "Drizzle", "Postgres", "Inngest", "Next.js"],
    accent: "teal",
  },
  {
    slug: "taqat",
    name: "Taqat AI",
    tag: "DevOps & Deployment Infra",
    metric: { value: "1", label: "host runs prod + dev" },
    role: "Infrastructure Engineer",
    summary:
      "Isolated production and dev environments on a single EC2 host, with automated CI/CD deploys and full observability.",
    points: [
      "Isolated prod/dev on one AWS EC2 host via Docker Compose + Traefik with automatic SSL.",
      "GitHub Actions CI/CD → GHCR with Watchtower-driven automated container deploys.",
      "Cloudflare Tunnel ingress, SOPS-encrypted secrets, Netdata + Dozzle observability, scheduled backups.",
    ],
    stack: [
      "AWS EC2",
      "Docker",
      "Traefik",
      "Cloudflare",
      "GitHub Actions",
      "SOPS",
    ],
    accent: "terracotta",
  },
  {
    slug: "flaunte",
    name: "Flaunte",
    tag: "Salon Management System",
    metric: { value: "RT", label: "booking engine" },
    url: "https://flaunte.com",
    role: "Backend Engineer",
    summary:
      "A booking-management platform with real-time availability and multi-gateway payments.",
    points: [
      "Booking backend with real-time availability tracking, conflict resolution, automated scheduling.",
      "Secure multi-gateway payments with transaction management and fraud checks.",
      "Real-time notifications with Socket.io + FCM; shared API patterns across Angular web and React Native mobile.",
    ],
    stack: ["Node.js", "Express", "Postgres", "Socket.io", "Angular", "React Native"],
    accent: "marigold",
  },
];

export type Service = { title: string; body: string };

export const services: Service[] = [
  {
    title: "AI agent platforms",
    body: "Agent studios, workflow engines, multi-agent orchestration, memory and guardrails — built to ship.",
  },
  {
    title: "Real-time voice agents",
    body: "Low-latency LiveKit + ElevenLabs pipelines, turn-taking, avatars, evaluation and recording.",
  },
  {
    title: "LLM orchestration & RAG",
    body: "Multi-provider routing, fallbacks, pgvector RAG, MCP integrations, cost and usage metering.",
  },
  {
    title: "Backend & DevOps for AI",
    body: "Durable workflows, event systems, multi-tenant auth, and reliable, observable infra behind AI products.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "Python", "SQL"] },
  { group: "Backend", items: ["Bun", "Node", "Hono", "NestJS", "FastAPI", "tRPC", "GraphQL"] },
  { group: "AI / Agents", items: ["Mastra", "Vercel AI SDK", "LangGraph", "MCP", "Composio", "RAG (pgvector)"] },
  { group: "Models", items: ["OpenAI", "Anthropic Claude", "xAI Grok", "Gemini", "Ollama"] },
  { group: "Voice / Real-time", items: ["LiveKit", "ElevenLabs", "GPT-4o", "Silero VAD", "Tavus"] },
  { group: "Frontend", items: ["Next.js", "React 19", "SvelteKit", "Tailwind", "shadcn/ui"] },
  { group: "Data", items: ["Postgres", "pgvector", "Redis", "Snowflake", "BigQuery", "Mongo"] },
  { group: "Cloud / Ops", items: ["Docker", "Kubernetes", "AWS", "Traefik", "Cloudflare", "CI/CD"] },
];

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#timeline", label: "Path" },
  { href: "#writing", label: "Writing" },
  { href: "#about", label: "About" },
];
