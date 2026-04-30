---
description: Audit a component, page, or section against DESIGN.md and CLAUDE.md rules
argument-hint: <file-path-or-glob>
---

Run the `design-reviewer` agent against the files matching: $ARGUMENTS

If $ARGUMENTS is empty, audit the most recently modified `.astro` files (last 5).

Pass the file paths directly to the agent — don't pre-read them yourself. The agent will produce a punch-list and a final verdict.

After the agent returns, surface the verdict line at the top of your response so the user sees pass/fail at a glance.
