---
name: writing
description: "Writes this site's words in the owner's voice: headlines, sections, calls to action, and the cold read before a page is shown. Use when copy is written or rewritten, or the owner says it sounds generic or salesy. Not for the tells of AI-made copy (tropes)."
---

# Writing

The facts a page may state are in `public/` and `brand/`; nothing else is a
source. The voice is `brand/voice.md`: follow it so a reader could notice,
and keep the owner's own phrasing wherever it is clear. Write the real
words before the layout, so the design fits them.

- **Each section answers its reader's question in its first line,** and the
  headline says what the business does, plainly enough for a stranger to
  repeat.
- **Specific beats general:** a real number, place, step or name from the
  notes, and the words customers use in their reviews.
- **Others' words** stay exactly as written, in a `<blockquote>` (the check
  leaves them alone), shortened only with "…", credited as the source gives
  them, never used as a heading.

`npm run check:copy` runs the `tropes` skill on every built page, with the fix for
each finding. Rewrite the whole passage it flags, and never flatten a
sentence the owner wrote.

## The cold read

When a page is built, give a fresh sub-agent only the rendered words
(`dist/index.html` for the homepage, `dist/<path>.html` for a page),
`public/` and `brand/voice.md`, and ask it to list every line that should
change as `| line, exactly | replacement, or CUT | why |`: a claim the
notes don't hold, a line no person would say, a vague line, a tell the
checker missed. Apply the table in one pass, then read the words on the
rendered page at phone and desktop width. Without a sub-agent, read the
page yourself as a stranger and say so.
