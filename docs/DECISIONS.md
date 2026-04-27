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


- ...

- ...

- ...

## MVP definition

What did you decide to include in your implementation of the feature in Part 2, and why? What did you consider and rule out? What would you add next if you had more time?

...
