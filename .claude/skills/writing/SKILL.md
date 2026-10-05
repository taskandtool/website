---
name: writing
description: "Writes the words for this site in the owner's voice: headlines, sections and calls to action, the editing passes and the cold read. Use whenever copy is written or rewritten, with the design skill before laying out a page."
---

# Writing

The voice lives in `brand/voice.md` (the `brand` skill fills it from the
owner's own words); the facts a page may state live in `public/` and
`brand/`. Nothing else is a source. What a page must say, to whom and to
what end is its brief (the `pages` skill's `references/brief.md`).

Write as a specific business speaking to a specific reader for a specific
reason. If the words could appear on a competitor's site unchanged, they
are not ready. Write the real words before the layout; a design around
placeholder copy breaks when the real copy arrives.

## The voice

Follow `brand/voice.md` in ways a reader could notice. A trait is a
behaviour, not an adjective: "direct" means the headline names the offer
and sentences don't hedge; "grounded" means materials, places, steps and
limits instead of grandeur; "warm" means contractions and reassurance,
never talking down. Keep the owner's character where their language is
clear; clean up confusion without sanding it away. The test is whether the
owner says "that sounds like us".

## Drafting

Write for the reader's questions, not a template's sections: what is this,
is it for me, what do I get, why trust it, what does it cost, what next.
Use the ones the page needs, each once.

- **Each section answers its question in its first line.** The commonest
  failure in generated copy is answering the question next to it.
- **The headline:** a stranger can repeat the offer after reading it alone.
  It says what the business does, not how to get in touch.
- **Every line:** would a person say it aloud, can the reader picture it,
  could it be proven false, could only this business say it? A real number,
  place, step or name beats an adjective.
- **Actions** say what happens next ("Book a workshop visit", never "Learn
  more"). One verb for one action, everywhere.
- **Lead with the thing, not the pronoun:** no run of lines starting "We".
- **Others' words** stay exactly as written, in a `<blockquote>` (lint
  leaves them alone), shortened only with "…", credited as the source gives
  them, never used as a heading.
- **Interface text:** errors are a diagnosis and a recovery; an empty state
  says what belongs there and the next step.

## Tropes

`npm run lint` runs the `tropes` skill's checker on every built page,
section by section: the sentence shapes generated text falls into, weak
actions, a line that repeats its heading, a phrase repeated across
sections. Its catalogue (`tropes/references/copy.md`) says how to fix
each. Rewrite the passage, never one phrase at a time, and never flatten a
sentence the owner actually wrote.

## The cold read

When a page is built, give a fresh sub-agent only the rendered words
(`dist/<page>.html`), `public/` and `brand/voice.md`, and ask for every line
to change as `| line, exactly | replacement, or CUT | why |`: a claim the
notes don't hold, a line no person would say, a vague line, a tell the
checker missed. Apply the table in one pass. Without a sub-agent, read the
page yourself as a stranger and say so.

## Editing passes

In order: **truth** (every claim in the notes), **meaning** (offer,
relevance and next step are clear), **structure** (each section answers
one question once), **voice**, **language** (concrete nouns, active verbs),
**sound** (read it aloud), **compression** (cut what adds no fact, proof,
instruction or character). Then read the words in the rendered page at
phone and desktop width: copy that is clear in a document but truncated on
the page is not finished.
