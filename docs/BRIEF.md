# Yantra front-end test

**Time budget: 2.5 hours.** There are two parts. Work through them in order. We are assessing on quality over quantity / completeness.

## AI policy

We use AI tooling heavily ourselves. **We expect you will want to use it, and we are testing how you directed it.** Use `AI_USAGE.md`, to tell us specifically how you steered your AI tools toward a solution you are happy with submitting.

## Part 1: Explore the app (~50 minutes)

Before writing any feature code, get the app running and spend time with it. Read the code, use it in the browser, open DevTools. The app is functional but it is not polished - there are a number of issues across a range of categories including accessibility, UX, performance, responsive behaviour, and visual consistency.

Your job in this part is to find them. Document what you notice in the **Observations** section of `DECISIONS.md`, noting what you found and what you did about it (if anything). We are not expecting you to fix everything; we want to see what you notice and how you document those findings.

## Part 2: Build (~90 minutes)

Below is a brief for a new product feature you have been tasked with implementing. It's deliberately loosely defined. Consider what an MVP might look like in your opinion, and implement it. We are looking to understand how you interpret the product requirement and prioritise and design functionality.

### The product feature brief

When a trade is in dispute, our users spend a lot of time context-switching: they read the email thread in the app, then switch to their email client to draft a response to the counterparty, then come back to log what they did. We want to close that loop by letting users compose and send a reply to a counterparty without leaving the app.

It is up to you to decide what the MVP of this feature looks like and implement it. It does not need to be a perfectly crafted UI, but it should show some consideration for user experience based on how you think users might interact with the application as part of their workflow. Document your scoping decisions in `DECISIONS.md`.

### Constraints

- The `POST /api/trades/{id}/notes` endpoint is the only write path the API provides. The API has no email-sending capability, so for this MVP "sending" means logging the composed reply as a note — the assumption being it is picked up downstream. Your implementation should use this endpoint.
- Plain text is fine, no rich-text editor needed.
- There are existing styled-components primitives you can use. Anything new that you add should feel as though it is part of the same design.
- Auth is out of scope. If you need to reference the current user's address (e.g. in the content of a note), assume `trader@hedgefund.com`. The notes endpoint only accepts a `content` string — there is no sender field.
- The AI assistant drawer is an existing feature — you do not need to integrate it with your implementation.

## Deliverables

Fork the repo, commit and push your work, and share the link with us. Your submission **must** include:

1. The feature code (however far you got).
2. `DECISIONS.md` - document your observations from Part 1, and the decisions that shaped what you built in Part 2.
3. `AI_USAGE.md` - four short sections: **delegated / overrode / misled / next-time**. The override section is the one we read most closely.

## What we are evaluating

We care about:

- **What you notice.** Do you pick up on issues across different areas of the product?
- **Code quality inside the feature slice.** Does your new code fit the patterns already in place? Is it PR-reviewable?
- **UX, accessibility & interaction judgement.** Does the feature feel considered? Does it handle edge cases gracefully?
- **Written artefacts.** Clear, specific entries in `DECISIONS.md` and `AI_USAGE.md` tell us a lot about how you think.

We are **not** evaluating: how _much_ work you do. We care more about quality code and written notes than we do the sheer volume of either.

## What happens next

- **Submission review** - we read the code and your DECISIONS/AI_USAGE files before the next call.
- **60-minute video call** - you walk us through what you built, we will ask you follow-up questions.
- **On-site final** - an in person demo of your solution to more of our team, a technical and product discussion, and Q&A for assessing team-fit.
