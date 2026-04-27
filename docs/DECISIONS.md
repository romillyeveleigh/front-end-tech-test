# Decisions

Use this document to log meaningful decisions you made. Short entries of a sentence or two are fine.

Explain what you chose and why, and what the downside is. Being able to communicate technical and design trade-offs is a crucial part of our daily work.

Don't feel you have to include every minor decision.

---

## Observations

What did you find in Part 1? Include what you noticed, and what you did about it, or would do if you had more time. Aim for breadth across categories.

Things I noticed on the main page:
- Row is not immediately clickable and no indication of clickability, user needs to click on the Trade ID to go to the trade details page.
- Dispute is a verb whilst Submitted, Confirmed, Deleted and Error are nouns. Consider something like "In dispute" or "Disputed" for the status.
- If I click Dispute filter then Submitted changes to 0, but then if I click Submitted filter then Submitted changes to 8. This will not be intuitive to the user and will likely confuse them. Consider something like a total count in the header, which changes as the filters are applied, with the filter counts remaining static. It is not clear to the user if clicking 2 filters is and AND or OR condition.
- There is no pagination (or infinite scroll), so this will be a problem if there are a lot of trades.
- There is no sorting by any column, so the user cannot sort the trades by any column. 
- There is no no search bar. A free text search box would be useful to allow the user to search for a trade by any field.
- Might want to use a data table library such as tanstack table to handle the pagination, sorting and filtering.
- There is no light/dark mode toggle.

My main, big question is:
- Who is the user of this application? 
- What is the user's goal?
- What is the user's workflow?
- Is this a small feature of a larger application, or a standalone application?
- What is their main goal -- do they want to clear the disputes as efficiently as possible? 
- How much of this is automatable and how much needs human intervention? If it needs human intervention, what is the crucial part that needs their judgement or analysis and what could be handed off to AI? 

Things I noticed on the trade details page:
- This is not a standard email thread, there are a list of emails with different subjects and senders. We don't know if these people are from the same company or not. Would be useful to have a header or something to indicate this such as their email address.
- I can't collapse anything or jump to a section.
- The cards do not stack on mobile.
- The assistant drawer does not show the context of the trade or page that the user is on.
- Should be able to navigate forward and back through trades without having to go back to the main page.

## MVP definition

What did you decide to include in your implementation of the feature in Part 2, and why? What did you consider and rule out? What would you add next if you had more time?

### What I included in the MVP

- A status-gated "Compose" entry point in the Emails panel header. I gated to dispute because that's the only BREAK_STATUSES member today and the brief frames the whole feature around break resolution; matching the existing notes-panel gate keeps the UI consistent with what the API will accept.
- A right-side slide-in drawer. I considered three shapes — modal, inline-expand, side drawer — and ruled out modal (blocks the thread, defeats the "without leaving the app" framing) and inline-expand (crowds the email list, hard to land responsively). The drawer keeps the thread visible at desktop widths and degrades to full-bleed on mobile.
- A thread-context picker inside the drawer. Quoting prior emails is part of any real reply workflow, but I didn't want to bake "always quote the latest" in — break threads have multiple turns, and the relevant message is often not the most recent. So: a checkbox list with inline expand-to-read, latest pre-ticked as the sensible default.
- Reply sent notes rendered distinctly in the Notes panel. Once "send = log a note", the natural risk is that long structured replies drown out terse human ops notes. I prefixed composer notes with [Reply sent] and rendered them as a collapsed card with subject as the summary — full record one click away.
- Keyboard + responsive basics. ⌘↵ to send, Esc to close, autofocus on body, footer wraps on narrow widths, iOS safe-area honoured. Cheap to add and the kind of thing that would be flagged in review otherwise.
- Drawer a11y baseline: `aria-modal`, body scroll lock while open, focus restored to the Compose button on close, Escape handled at the `document` level so it works even when focus has left the drawer. Discard-draft confirm on close prevents an accidental click destroying a half-typed reply. Stops short of a full focus trap — see "What I'd add next".
- Send is `isLoading`-guarded against double-submit (matters for the ⌘↵ path where a quick repeat would otherwise dispatch two notes). The Notes panel save button now disables the same way.

### What I considered and ruled out

- Pre-filling the To field from the thread. I checked the seed script — senders and recipients are randomised per email, there's no canonical "counterparty contact". Pre-filling would be guess-work and wrong often enough to be misleading. Empty field is honest; users type the real address.
- Per-email Reply buttons with pre-fill. Cleaner mental model, but adds a second action surface for marginal benefit. The composer-level button plus the quoting picker covers the same workflow at less surface area. I'd revisit this with more time.
- Putting selection checkboxes on the live email panel rows behind the drawer. I built this first and it felt wrong in use — the panel is dimmed behind the overlay, split focus suggests the panel is still primary. Moved selection entirely inside the drawer.
- Real outbound delivery. Explicitly out of scope per the brief. I treated "send = log a note" as the contract and made the structured record the primary deliverable.
- A separate schema field or endpoint for replies. The brief says use the existing notes endpoint. Encoding the structure as a parseable prefix in the content string keeps me inside the constraint while still letting the UI treat replies differently — easy to migrate to a typed field later.
- Lazy-loading the drawer via `next/dynamic`. `NotesPanel` imports `isReplyNote` from `ComposerDrawer`, so the drawer's bundle gets pulled into the trade-detail page even when the drawer isn't open. The right production fix is to extract the helper into `lib/` and `dynamic()`-load the drawer; for the time budget, I left the import in place and noted it. Acceptable today because the drawer only renders on a single page, but worth doing before the panels are reused elsewhere.
- A bug found while writing this section: the original `submitNote` mutation invalidated only the `Trades` list tag, not the per-trade `Trade` tag that `getTrade` provides — so the new reply card wouldn't have appeared on the open detail page until a manual refresh. Fixed in `tradesApi.ts`.

### 500-char note limit shaped the composer scope

Discovered mid-build that `POST /notes` caps `content` at 500 chars
([src/models.py:53-56](../src/models.py#L53-L56)). Inline thread quoting
couldn't fit reliably — even one moderately-sized email exceeds the
budget. Descoped the selection-to-quote feature; kept the thread
visible in the drawer as read-only context while drafting. The note
records the user's reply (structured headers + body); thread continuity
is left to the (downstream) outbound delivery the brief describes.
Trade-off: the audit-log note no longer carries the inline quote, so
you have to look at the EmailsPanel + the note side-by-side to see what
was being replied to. Acceptable for an MVP given the constraint.
Visible budget (live counter, dynamic ceiling reflecting current
header overhead, hard `maxLength` on the textarea, pre-flight guard in
`send()`) makes the limit honest instead of a surprise 422.

### Reply card renders body inline, no longer collapsed

`ReplyNoteCard` originally hid the structured note body behind a Show/Hide
details toggle as defence against long quoted threads dominating the panel.
With quoting descoped, the body is bounded by the same 500-char ceiling
and the toggle is friction without payoff. Now: subject as the heading,
a small muted `To: <addr> · Cc: <addr>` line so the recipient is visible
at a glance, body inline, timestamp underneath. Parses headers out of
`note.content` rather than dumping the raw structured string, so the
redundant `[Reply sent] ts` / `From:` / `Subject:` lines aren't
re-rendered alongside the card chrome that already conveys them.

### What I'd add next

- Move the reply record into the Emails panel rather than Notes. Conceptually a sent reply is a thread turn, not an ops note, and visual continuity with the message it answers matches the user's mental model. Held off because it spreads the `[Reply sent]` string-prefix encoding to a third component (EmailsPanel would need to filter `notes` for `isReplyNote`, splice into the email timeline by timestamp, and add a "sent by us" affordance). The clean version pairs with extracting `lib/replyNote.ts` first so the Emails panel reads through a typed surface instead of re-parsing.
- Optimistic insertion of the new note via RTK Query's onQueryStarted. Today the panel waits on cache invalidation; feels slightly laggy on send.
- Draft persistence keyed by trade.id in localStorage so closing the drawer mid-compose isn't destructive. The discard-draft confirm shipped today is a stop-gap, not a replacement.
- Per-email Reply with Re: <subject> and that one email pre-quoted — earns its keep alongside Compose once the basic flow is settled.
- Finish the a11y pass: full focus-trap inside the drawer (Tab cycles within the dialog), and aria-describedby linking the disclosure to the form. The basics — `aria-modal`, scroll lock, return-focus, document-level Escape — are in place.
- A real outbound channel behind the same UI once the API exposes one — swap the write-path, keep the surface.
