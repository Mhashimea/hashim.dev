---
title: "I Replaced GPT-5 mini With Jev for One Step in Our CV Pipeline: 9× Faster, 93% Cheaper, Same Accuracy"
description: "The “is this actually a CV?” check: what changed when a decision model replaced an LLM."
date: "2026-09-21"
status: ready
---

Our CV pipeline makes four AI calls per upload. I replaced just one of them: the step that asks **"is this actually a CV?"**

Before, GPT-5 mini would think for about 3.3 seconds and generate around 170 paid tokens of reasoning and JSON, and we kept one word from all of it: `true`.

Jev, TypeSafe's new decision model, answers the same question in **0.37 seconds**, and its output tokens are free.

This post covers what I changed, how I tested it without risking real uploads, the numbers, and the two things that surprised me: the cheaper model fixed a bug the expensive one had, and it read Arabic CVs whose text came out of the PDF *backwards*.

For the general question of when to use Jev and when to use an LLM, see my guide [Choose the model by the work: Jev vs. an LLM](/blog/when-to-use-jev-vs-an-llm). This post is the hands-on companion: one real swap, measured.

---

## The problem: paying for a paragraph to read a yes or no

When a recruiter bulk-uploads CVs to our recruitment platform, the first AI step is a sanity check. We read the top of the document, the "header", and ask a model whether it's a CV at all. People upload all sorts of things: invoices, contracts, cover letters, job descriptions. Catching those early means we don't run the expensive steps on them (candidate extraction, embeddings, and a full AI review).

We used GPT-5 mini for this. It's a reasonable choice for a classification task, but look at what we were paying for:

- **Reasoning tokens.** GPT-5 mini is a reasoning model, and the endpoint won't let you turn reasoning off.
- **JSON syntax**: braces, keys and quotes.
- **An explanation string**: *"Contains a personal name at top plus email, phone…"*
- **A confidence number** the model made up to match our prompt's rubric.

All of that is output, billed at output rates, to produce what is really a single boolean. It also took 3–4 seconds, on every upload.

## What is Jev?

Jev is the first **"System One" model** from TypeSafe AI, released in September 2026. It isn't a chat model and can't write text. You send it some **state** (our CV header) and a set of **typed questions**. It sends back typed answers with probabilities, evaluating all the questions in parallel in a single call:

- **Choice**: pick one of the options you define;
- **Score**: place the state on a rubric;
- **Noul**: a yes/no probability.

**Pricing:** $0.042 per million input tokens. **Output tokens are free.** It's available through OpenRouter, so I didn't need a new account or key.

## What I changed

I asked Jev two questions about each header, in one call:

```ts
const QUESTIONS = {
  isResume: {
    type: "choice",
    instructions: "Is this document header from a resume/CV? ...",
    criteria: {
      resume: "A personal name with contact details such as email, phone or LinkedIn",
      not_resume: "An invoice, contract, cover letter, report or other business document",
    },
  },
  documentType: {
    type: "choice",
    instructions: "What kind of document does this header come from?",
    criteria: {
      resume: "...", cover_letter: "...", invoice: "...",
      contract: "...", other_business_document: "...", unclear: "...",
    },
  },
};
```

The second question costs almost nothing, because Jev answers questions in parallel. It lets us tell the recruiter *why* a file was rejected: *"This file does not appear to be a CV (it looks like an invoice)."*

I didn't just swap one model for the other. I put a small router in front, with three modes:

| Mode | Who decides | Why |
|---|---|---|
| `off` | GPT-5 mini | The default. Nothing changes. |
| `shadow` | GPT-5 mini, with Jev running alongside | Compare both on real traffic with zero risk. |
| `live` | Jev | The goal. |

In `live` mode, two things still go to GPT-5 mini:

1. **Headers that are 15% or more Arabic.** Jev is trained mainly on English, and we're a Gulf-market product, so I didn't want to trust it blind.
2. **Any Jev failure** (timeout, rate limit or unexpected response). No upload is lost; it falls back to GPT-5 mini.

Jev's calls also go through our existing credit ledger, so every call is billed to the right customer, like any other AI call.

## How I tested it

I built a labelled test set of **33 fictional documents**. The contact details were fake, and I deliberately included the hard cases:

- **CVs:** English CVs across professions (software, nursing, accounting), a new graduate, a two-column layout, a CV with the contact details at the *end*, a minimal name-and-phone-only CV, three Arabic CVs and two mixed Arabic/English headers.
- **Not CVs:** invoices (English and Arabic), contracts (English and Arabic), a job description, a reference letter, an offer letter, a certificate, a proposal, meeting minutes, and two cover letters, one of them with a full contact header, which is the nastiest case.

Each header was extracted **exactly as our real pipeline does it**, with the same PDF reader and all its quirks. Both models classified every document, **twice**.

For cost, I didn't trust list prices. Every call went through our real billing ledger, and I checked a sample against **OpenRouter's actual charges**. They matched to the cent, including GPT-5 mini's hidden reasoning tokens.

## The results

31 documents classified, 2 runs *(2 of the 33 were excluded; see "Points to note")*:

| | GPT-5 mini | **Jev** |
|---|---|---|
| **Median latency** | 3,275 ms | **371 ms** (8.8× faster) |
| **Slowest 10% (p90)** | 3.9–4.6 s | **0.7–1.1 s** |
| **Slowest call** | 6.6 s | **1.2 s** |
| **Cost per check** | $0.000464 | **$0.0000325** (14.3× cheaper, **−93%**) |
| **Accuracy** | 96.8% | **96.8%** |
| **Real CVs wrongly rejected** | 0 | **0** |

**The two models agreed on every document, in both runs.** Same answers, a tenth of the time, a fourteenth of the price.

At scale, for this one step:

| Header checks | GPT-5 mini | Jev |
|---|---|---|
| 100,000 | $46.45 | **$3.25** |
| 1,000,000 | $464.49 | **$32.51** |

## What surprised me

### 1. Jev reads *more* tokens and is still 14× cheaper

Jev's input is bigger: 774 tokens on average against GPT-5 mini's 505, because the question rubric is part of the input. It doesn't matter. GPT-5 mini's cost was mostly **output**, about 169 tokens of reasoning and JSON at $2 per million. Jev's output is free.

**Lesson:** for classification, what you pay for is the output, not the input.

### 2. The cheaper model fixed a bug the expensive one had

This was the real find. Our upload rule is: *reject the file if the model says it's not a CV **and** its confidence is at least 80.*

With GPT-5 mini, that rule **almost never fired**. Our prompt defined confidence as "how CV-like is this?", so a clear invoice scored about 10. Low confidence meant the file was never rejected. On the job description and the reference letter, though, GPT-5 mini reported 95, meaning "how sure". It wasn't even consistent.

Jev's confidence means one thing: how sure it is of its answer. So the rule finally works as intended:

| Non-CVs stopped at the check (of 14) | |
|---|---|
| GPT-5 mini | **0** (run 1), **2** (run 2) |
| Jev | **10** (with Arabic still routed to GPT-5 mini) |

That matters more than the per-call saving. A non-CV that gets past this check goes through candidate extraction, embeddings and a full AI review, **about 20 seconds and $0.0035 of AI work**, and can end up as a junk applicant. With Jev, the invoice I uploaded was rejected **in 0.8 seconds, for $0.00004**, with the message *"it looks like an invoice."*

### 3. It read Arabic CVs whose text came out backwards

When our PDF reader extracts right-to-left text, some Arabic lines come out **reversed, character by character**. A name like نورة الشهري arrives as `ريهشلا ةورن`. Real Arabic CVs often extract this way.

Jev got **all 8 Arabic documents right**: 5 CVs and 3 non-CVs, with 99–100 confidence on the CVs.

I'm still routing Arabic to GPT-5 mini for now. Eight documents is encouraging, not proof. But it's the result I least expected.

### 4. Its second answer caught what its first missed

Both models failed on the same document: **a cover letter with a full contact block at the top**. Both called it a CV. But Jev's `documentType` answer said **`cover_letter`**. It recognised the document; its two answers just disagreed. If you only accept a file when *both* answers say "resume", the test set scores **31/31**. That's my next experiment.

## Points to note

I want to be precise about what this does and doesn't show.

- **This is one step, not the whole pipeline.** The header check is one of four AI calls per CV. Across the whole pipeline, a CV gets **about 11.5% cheaper and 3.4 seconds faster** (about 15%). The 93% applies to this step.
- **The test set is small and synthetic.** 31 documents I wrote to cover the edge cases, not a sample of real uploads. The next step is running `shadow` mode on real traffic.
- **TypeSafe's headline numbers are 193× faster and 444× cheaper. I measured 8.8× and 14.3×.** That's not a contradiction: my baseline was already a small, fast model on a very short task. Expect your ratio to depend on what you're replacing.
- **Confidence means something different.** Swapping models changed which files our rule rejects, as described in surprise 2. If you have thresholds tuned to an LLM's self-reported confidence, re-check them.
- **Two documents couldn't be tested**: a French CV and a payslip. That's not Jev's fault. Our own PDF reader discarded their text because it only trusts text containing common English words. That's a bug I'm fixing separately.
- **Jev is brand new.** I pinned the model version, and the router falls back to GPT-5 mini on any error.

## Summary

Swapping GPT-5 mini for Jev on one step of our CV pipeline gave us:

- **8.8× faster** (3.3 s → 0.37 s)
- **93% cheaper** ($0.000464 → $0.0000325 per check)
- **The same accuracy** (96.8%, zero real CVs rejected)
- **A working "reject non-CVs" rule**, which the LLM had quietly broken

The bigger takeaway isn't about Jev specifically. Go through your AI calls and ask: **how many of them are really yes/no, pick-one or rate-it questions dressed up as text generation?** For those, you may be paying for a paragraph you throw away.

---

## Sources

- [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), TypeSafe AI
- [TypeSafe on OpenRouter](https://openrouter.ai/provider/typesafe)
- [Choose the model by the work: Jev vs. an LLM](/blog/when-to-use-jev-vs-an-llm), the companion guide on this blog
