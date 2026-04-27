# AI usage

This is a key part of the submission that we read closely. Remember ...

> **We are not testing whether you used AI. We are testing how you directed it.**

Keep each bullet specific. "I used Cursor for 40% of the code" is not useful. "I asked Cursor to wire the WS stream into Redux; it produced A; I kept B and rewrote C because D" is.

## Delegated

What I delegated and gave to AI to implement wholesale. 1–2 sentences each.

- Initial high-fidelity prototype of the composer flow. I had Claude build a single-file React prototype of the drawer end-to-end (header rows, body, thread-context picker, optimistic note logging, mock send) so I could iterate on UX shape before touching the real codebase. Drawer width, footer wrap behaviour, mobile safe-area, ⌘↵ + Esc handling, and the [Reply sent] note convention all came out of that pass largely unchanged.
- The styled-components rewrite of the prototype for handoff into the Next.js codebase. Once the prototype settled, I delegated the mechanical work of re-expressing each piece against the existing theme, Panel/Button/EmptyState/Spinner primitives, and useSubmitNoteMutation hook.
- Field validation and email-pattern check in the composer — I delegated the regex + the inline error messaging because I didn't want to overthink it for an MVP.

## Overrode (this is important to us)

Where I rejected or reworked AI output. For each: include what it suggested, what I did instead, and why. Be specific.

- Suggested putting selection checkboxes directly on the live email rows in the panel. Claude wrote a selectable prop on EmailsPanel that toggled checkboxes on the panel rows behind the drawer overlay. In use it felt wrong — the panel was dimmed behind the modal, and the split focus implied the panel was still primary when it wasn't. I rejected it and had selection moved entirely inside the drawer (mirroring the prototype's ThreadContext picker), where the user's attention already is.
- Suggested pre-filling the To field from the most recent email's from_address. I overrode this after reading the seed script — senders and recipients are randomised per email, so there's no canonical "counterparty contact" to honestly pre-fill from. Any heuristic ("most recent external sender") would be misleading more often than helpful. Left the field empty; users type the real address.
- Auto-quoting the entire thread by default. First pass auto-included every email. I changed it to pre-tick only the latest message, with Select all / Clear actions — break threads have multiple turns and the relevant message is often not the most recent.
- A bold "Subject" header that looked like a static label, while To and Cc looked editable. I caught the inconsistency in review and reworked the field rows to share weight + colour, with a hover/:focus-within rule on the row's bottom border carrying the "this is editable" signal — the Gmail compose pattern. Avoids using weight to falsely signal staticness.
- An overly chatty Disclosure explaining at length that "sending" actually means logging a note. I cut it down to two lines because the brief explicitly defines the constraint and a verbose explainer would only undermine confidence in the feature.
- First AI pass built a full select-and-quote thread composer. I sent it; backend 422'd because the structured note + quoted bodies blew past the 500-char limit. Overrode the design rather than papering over it with a counter — descoped quoting, kept the thread as read-only context, made the budget visible (dynamic body ceiling derived from header overhead, hard `maxLength`, pre-flight guard).

## Misled

Where AI led me down a wrong path before I caught it. How I noticed. Roughly what it cost me in terms of time.

- Claude initially treated the email panel as a single-org internal log. It assumed the senders were all internal teammates and proposed UI affordances around that ("counterparty" badge logic on names that turned out to be cross-org). I caught it when I read the seed script and saw three separate firm domains; that corrected my own mental model too. Cost: ~10 minutes, but it forced me to read the seed properly which paid back later when ruling out the To pre-fill.
- First handoff version dropped the thread-context picker entirely without flagging it. Claude shipped what it called an "MVP subset" that quietly omitted a feature we'd already designed and agreed on. I only noticed when I diffed against the prototype. Cost: maybe 15 minutes of "why doesn't this match the design we agreed on" before catching the omission. Lesson: when porting a prototype to production code, demand a feature-parity checklist before accepting the diff.
- Suggested a circular-ish import between sibling components (NotesPanel importing isReplyNote from ComposerDrawer). It works, but in a real review I'd push back; should have lived in a small shared lib/replyNotes.ts. Caught it in self-review of the handoff README, mentioned it as a follow-up.

## Next time

Things I'd do differently on my next AI-assisted task, based on what I've learned from working on this test.

- Lock the contract before writing code. I let Claude pick the structured-note format ([Reply sent] prefix, key-value lines) on first try. It's fine, but I'd rather have specified it explicitly up front — including how it round-trips for the Notes panel — so the parser and writer aren't independently invented.
- Keep the prototype as the source of truth and diff against it. When porting to the real codebase, instead of asking for "the equivalent in styled-components", I'd ask for an explicit feature checklist (Compose button, selection picker, quoted body, keyboard shortcuts, responsive footer...) and have Claude tick them off. Would have caught the missing thread-picker before I copied files into the repo.
- Push back faster on AI defaults that betray a misunderstanding of the data model. The To-prefill suggestion came from Claude treating the trade like a CRM record with a single counterparty contact. I should have asked "what does the data actually contain?" earlier — reading the seed script first would have framed the whole conversation more accurately.
- Demand smaller, reviewable diffs. Several handoff iterations were full file rewrites where a focused patch would have been easier to read. I'd ask for str_replace-style targeted edits by default, full rewrites only when the file is genuinely changing shape.
- Treat AI screenshots / "trust me it works" as unverified. Twice during this session a change "looked right" in description but didn't actually appear in the running app because of a stale copy or a missing import. I'd add a quick smoke check after every non-trivial change rather than assuming the description matches reality.
