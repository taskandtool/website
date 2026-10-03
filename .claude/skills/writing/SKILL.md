---
name: writing
description: "Writes the words for this site in the owner's voice: headlines, sections and calls to action, and the editing passes that strip what generated text falls into. Use whenever copy is written or rewritten, with the design skill before laying out a page."
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

- **Headlines** name the offer, the result or the audience. A defensible
  promise beats an inflated one; a poetic line needs a concrete one beside
  it.
- **Body copy:** a real number, place, step or example beats an adjective.
  Cut sentences that exist only to sound complete.
- **Actions** say what happens next ("Book a workshop visit", never "Learn
  more"). One verb for one action, one noun for one thing, everywhere.
- **Interface text:** errors are a diagnosis and a recovery; an empty state
  says what belongs there and the next step.

## Slop to refuse

Most tells are sentence shapes, not words; word lists rot as models change.
Mark the strongest first and rewrite the passage, never one phrase at a
time. Before cutting, ask whether you would flatten a sentence the owner
actually wrote. Never add a fact to fill the gap a cut leaves.

- the negation pivot: "It's not X. It's Y.", "not just X, but Y", stacked;
- the staccato tricolon: "No fluff. No filler. No stress.";
- significance inflation: "stands as a testament", "pivotal", "evolving
  landscape";
- promotional adjectives with nothing behind them: "boasts", "vibrant",
  "nestled", "in the heart of", "renowned";
- "-ing" riders that restate the sentence: "ensuring", "fostering",
  "showcasing";
- "serves as", "features", "offers" where "is" and "has" would do;
- openers and closers: "In today's fast-paced world", "Welcome to our
  website", "Look no further", "In summary";
- small-business clichés: "We're passionate about", "We pride ourselves",
  "solutions" for what the business sells;
- em dashes (a comma, a colon or a new sentence instead), title-case
  headings, emoji as bullets;
- uniform sentence length: people write four-word sentences and fifty-word
  ones.

Three checks no word list can do, on every page:

1. In any ten sentences, the longest is more than fifteen words longer than
   the shortest.
2. Every section carries a particular from the owner's material: a name, a
   number, a place, a date.
3. At most one triad on the page.

`npm run lint` catches em dashes and the commonest stock phrases in the
rendered pages (legal pages are exempt); the rest are yours to catch.

## Editing passes

In order: **truth** (every claim in the notes), **meaning** (offer,
relevance and next step are clear), **structure** (each section answers
one question once), **voice**, **language** (concrete nouns, active verbs),
**sound** (read it aloud), **compression** (cut what adds no fact, proof,
instruction or character). Then read the words in the rendered page at
phone and desktop width: copy that is clear in a document but truncated on
the page is not finished.
