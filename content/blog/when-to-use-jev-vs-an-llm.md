---
title: "Choose the model by the work: Jev vs. an LLM"
description: "A technical guide to routing user requests to a generative model, a structured decision model, or both."
date: "2026-09-21"
status: ready
---

Most AI products begin with one question: *which LLM should we use?*

That is useful, but it is not the first design question. The first question is: **what kind of work does this user request require?**

Some requests need a model to write, explain, reason through an unfamiliar problem, or propose tool calls for the application to execute. A generative LLM can support that work. Other requests are narrower: should this workflow continue, which queue should receive this ticket, is this output safe to publish, or should a human review it? Those are decisions that software needs to consume directly.

Jev is TypeSafe AI's first System One model, designed for that second category. TypeSafe distinguishes it from a conventional text-generating LLM. It takes application state plus typed questions and returns structured choices, scores, or boolean probabilities. It does not generate a natural-language answer for the user. [TypeSafe describes this interface as “unstructured state in, typed probabilistic decisions out.”](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

**Both Jev and LLMs can make decisions.** The distinction is how they produce and expose those decisions, and which tasks their interfaces support. Choose each part of the workflow separately.

## What actually changes

TypeSafe describes System One as a separate model class, trained for calibrated decisions. Jev understands natural-language input, but it does not write replies, generate code, or explain its reasoning. Its current input support is text, including state represented as strings, JSON objects, or arrays of text; it does not accept images, audio, or video. [System One documentation](https://docs.typesafe.ai/concepts/system-one)

| Dimension | Conventional generative LLM | Jev |
| --- | --- | --- |
| Output mechanism | Autoregressive token generation | Typed answers and probabilities without free-form text generation |
| Output constraints | Supported structured-output modes can constrain a response to a schema | The application defines questions and possible outcomes through typed primitives |
| Several questions | Can answer several in a response; separate calls can also run concurrently | Evaluates independent questions together against shared state |
| Open-ended output | Can produce prose, code, and explanations | Returns bounded judgments for application code |

The parallelism distinction concerns Jev's question evaluation versus an LLM's token generation. It does **not** mean applications cannot run LLM requests in parallel. TypeSafe also provides an [LLM-backed adapter](https://github.com/typesafe-ai/system-one-adapter-python) for the same decision interface: a useful reminder that structured decisions are not exclusive to Jev.

> **Companion prototype:** The [Jev + LLM support router](https://github.com/Mhashimea/jev-llm-support-router) demonstrates this separation through OpenRouter. It uses fixture account data and prepares a route; it does not connect to a real billing system or issue refunds. See the confidence caveat below before adapting the sample.

## Start with the user's question

Take a support assistant. A person writes:

> “My subscription renewed after I cancelled it. Can you help?”

That one message creates several different jobs:

1. Understand the issue and ask for any missing information.
2. Look up the subscription, cancellation, and payment history.
3. Explain the result in a helpful, accurate response.
4. Decide whether the case can be resolved automatically, needs a refund review, or needs a human immediately.

An LLM is appropriate for the first and third jobs. It handles ambiguous wording and produces the response a person will read. The second job should normally be ordinary application code and tools: query the billing system; do not ask a model to invent account facts. The fourth job is a candidate for Jev because the system needs a bounded, code-readable decision.

```text
user question
   │
   ↓
code: retrieve verified records and calculate policy facts
   ↓
Jev: evaluate independent questions about the shared state
   ↓
code: validate results, apply rules, choose a permitted route
   ↓
LLM: explain that outcome or ask for missing information
```

This division keeps language generation where it is useful and keeps control flow explicit.

## The decision table

Use this as a starting point for evaluation, rather than a rule that every decision requires Jev.

| If the user request needs… | Start with… | Why |
| --- | --- | --- |
| A written answer, summary, explanation, or draft | An LLM | The output is language for a person to read. |
| Multi-step investigation or tool selection | An LLM plus tools | The path is open-ended and may require reasoning. |
| A fixed choice from known options | Jev or an LLM with structured outputs | The application needs a typed value it can branch on. |
| Bounded judgments with probability distributions | Evaluate Jev | The result is a decision signal, not prose. |
| A generated response that needs a rubric-based check | LLM plus an evaluator and code | Jev is one candidate evaluator; enforce hard requirements separately. |
| Retrieval of user or business facts | Application code | Models should not be the source of truth. |

Both approaches can produce decisions. Conventional LLMs generate tokens, and supported structured-output modes can constrain those tokens to a schema. Jev returns typed answers and probability distributions directly. Compare them on your own task: valid structure alone does not guarantee a correct judgment.

## Where Jev fits

Jev evaluates a shared state against typed questions. Its documented primitives are:

- **Choice** — select an option from a list.
- **Score** — evaluate a state against a rubric.
- **Noul** — estimate the probability that a statement is true, from 0 to 1.

Questions can be mixed in one request and are evaluated in parallel and independently against the same state. TypeSafe recommends keeping them atomic: ask one well-scoped question at a time, then combine the answers in your own code. [TypeSafe documentation](https://docs.typesafe.ai/introduction)

For the cancellation request, the following is **illustrative application pseudocode**, not a copy-paste SDK call. Each question uses the same input state; none reads another question's answer.

```ts
const questions = {
  route: {
    type: 'choice',
    instructions: 'Which support queue should handle this request?',
    criteria: {
      resolve: 'A routine information request with no charge dispute or urgent issue.',
      billing_review: 'A charge dispute requiring billing investigation, without an urgent issue.',
      human_support: 'An urgent account issue requiring immediate human support.',
    },
  },
  urgent: {
    type: 'noul',
    instructions: 'Does the customer need immediate human attention?',
  },
  complaintClarity: {
    type: 'score',
    instructions: 'How well does the message explain the customer’s billing complaint?',
    criteria: [
      'No identifiable billing complaint is described.',
      'A complaint is described but the disputed event is unclear.',
      'The disputed event and requested help are both clearly described.',
    ],
  },
};

// Your adapter calls the provider and validates its response.
const answers = await evaluateDecision({ state, questions });
```

The state should contain the user message, verified account records, and the relevant policy. Code should calculate exact facts, such as whether the required records exist and whether a date falls inside a policy window. The Score above evaluates the clarity of a complaint, which requires interpretation; it does not replace those checks.

Question names are identifiers, not instructions. Put the full question in `instructions`, and describe each option or level clearly. If question B requires question A's answer, use a second call with that answer included in the new state; questions in one call do not read each other's results.

A Score is a probability-weighted position on the ordered levels. With three levels, its range is 0–2 and values can be fractional. It is not automatically a percentage. Read it alongside the distribution. [Score documentation](https://docs.typesafe.ai/primitives/score)

## Confidence is not correctness

Choice and Score include probability distributions and a derived `confidence` value. Noul returns its probability without a separate confidence field. A model can be highly confident that the complaint is unclear: that does not mean the complaint scored highly. [Confidence documentation](https://docs.typesafe.ai/confidence)

A confidence value of `0.95` also should not be presented as “this decision is 95% certain to be correct.” TypeSafe derives confidence from the distribution; calibration is assessed across groups of predictions. Neither a high confidence value nor a valid schema guarantees a correct individual decision. [System One documentation](https://docs.typesafe.ai/concepts/system-one)

Likewise, the launch article's “can't hallucinate” wording should be read with its schema-matching explanation. A model can return an allowed option that is wrong for the case. We should evaluate decision errors, not just malformed responses.

## Combine the answers in code

For this support workflow, code should choose a permitted outcome before the LLM writes the final reply. First validate the provider response: check the question types, allowed choices, numeric ranges, and required fields. On a timeout, API error, or invalid response, take a review path.

The following is application pseudocode for already validated answers. The thresholds are illustrative values to tune on evaluated cases, not provider-recommended defaults.

```ts
const route = answers.route;
const urgency = answers.urgent.noul;
let outcome;

if (urgency >= 0.8 || route.choice === 'human_support') {
  outcome = 'escalate_to_human';
} else if (urgency > 0.2 || !verifiedFactsComplete || route.confidence < 0.95) {
  outcome = 'queue_review';
} else if (route.choice === 'billing_review') {
  outcome = 'queue_billing_review';
} else if (
  route.choice === 'resolve' &&
  policyAllowsRoutineReply
) {
  outcome = 'prepare_routine_reply';
} else {
  outcome = 'queue_review';
}
```

Here, `verifiedFactsComplete` and `policyAllowsRoutineReply` come from deterministic application checks. The complaint-clarity Score can help tailor a follow-up question; it does not grant permission to resolve the case. The intermediate urgency range goes to review, rather than treating an uncertain urgency signal as a clear no. Neither a route nor a confidence threshold authorizes a refund.

**Prototype limitation:** The [companion repository](https://github.com/Mhashimea/jev-llm-support-router) predates this refinement. Its `policyConfidence` field reads confidence from a Score answer, rather than the route Choice, and the Score wording refers to a “chosen route” that is not shared between questions. Treat it as an architecture demonstration, not a production policy implementation. The approach above corrects those assumptions; the linked repository has not been updated as part of this article revision.

## Use the LLM to explain the permitted outcome

Once code selects a route, the LLM can turn verified facts and the permitted next step into a clear response. It can also help clarify an ambiguous request earlier in the workflow. Supplying tool definitions alone does not guarantee that a model has fetched any facts; your application must execute approved calls and pass back their results.

```ts
// Application pseudocode: facts and outcome were prepared above.
const draft = await writeSupportReply({
  message: userMessage,
  verifiedFacts,
  permittedOutcome: outcome,
  instructions: [
    'Explain only the supplied facts and permitted next step.',
    'Ask for missing information when the outcome requires it.',
    'Do not say a refund or account change has been completed.',
  ],
});

// Apply response checks or human review before delivery.
await reviewDraft({ draft, verifiedFacts, permittedOutcome: outcome });
```

This is one arrangement, not a mandatory execution order. If the task is to assess an LLM draft against a rubric, generate the draft first, then include it in Jev's state for evaluation. In either arrangement, application code owns permissions, policy enforcement, and side effects.

## Good Jev use cases

Jev is worth evaluating when the user’s request eventually becomes a stable question inside your product:

- **Agent routing:** Which tool, sub-agent, or workflow step should run next?
- **Human review:** Is the evidence sufficient to proceed, or should the case be escalated?
- **Policy triage:** Which known policy path applies to the current state?
- **Quality checks:** Does an LLM result satisfy a rubric before it is shown or stored?
- **Risk scoring:** Is this request low, medium, or high risk under a predefined rubric?
- **Product workflows:** Should the system retry, ask a clarifying question, continue, or stop?

Each case has one property in common: the model is deciding among outcomes **the application already knows how to handle**.

## When not to use Jev

Do not force a decision model into a generative problem. Use an LLM when the value is in the text itself: explaining an unfamiliar concept, drafting code, synthesizing research, planning an investigation, or holding a conversation.

Also avoid using any model as a substitute for deterministic checks. If the rule is “a refund is only possible within 14 days,” calculate the date in code. Let a model help interpret a message or choose a review route when the situation is ambiguous; do not ask it to replace a rule your database can answer exactly.

## Evaluate before choosing

Compare Jev with a structured-output LLM baseline on the same representative cases and allowed outcomes. Include missing records, ambiguous requests, conflicting facts, and examples where an incorrect automatic route would be costly.

Measure decision accuracy, false automatic resolutions, review rate, end-to-end latency, and cost per completed workflow. Sweep confidence thresholds and check whether the cases accepted above a threshold meet your target error rate. Keep evaluation cases separate from those used to refine question wording.

TypeSafe's launch benchmarks are vendor measurements, not a guarantee for your workload. The article notes that its short-input demo favors Jev, and its workflow evaluation uses large-model predictions as reference answers. That is useful evidence to investigate, but it is not a replacement for labeled cases from your own product. [Launch article and benchmark caveats](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

## A practical routing checklist

Before every model call, ask:

1. Does a human need to read the output? Use an LLM.
2. Does code need to branch on the output? Use a typed decision interface.
3. Can code answer it exactly from trusted data? Do not use a model.
4. Does the request involve an irreversible action? Put policy and authorization in code, with review where needed.
5. Can the question be broken into small, independent judgments? That is a good Jev-shaped problem.

The model layer should reflect the work, not the trend. LLMs remain the right interface for open-ended language and reasoning. Jev offers a decision layer for software that needs bounded, structured answers. Measure latency and decision quality on your own workload. Together, they let an AI product be conversational at the edge and controlled at its core.

## Sources

- [Introducing System One Models & Jev — TypeSafe AI](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe AI documentation: Introduction](https://docs.typesafe.ai/introduction)
- [System One: capabilities and limitations](https://docs.typesafe.ai/concepts/system-one)
- [Choice](https://docs.typesafe.ai/primitives/choice), [Score](https://docs.typesafe.ai/primitives/score), and [Noul](https://docs.typesafe.ai/primitives/noul)
- [Confidence](https://docs.typesafe.ai/confidence)
- [TypeSafe's LLM-backed decision adapter](https://github.com/typesafe-ai/system-one-adapter-python)
- [Jev 1.13 — OpenRouter](https://openrouter.ai/typesafe/jev-1.13)

> Jev and its provider integrations are evolving. Verify the current API and model availability before implementation. Benchmark performance and decision quality on your own cases.
