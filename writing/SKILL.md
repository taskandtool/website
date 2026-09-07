---
description: "Set the voice and write or edit the words for this site: the voice card from the owner's own sentences, the copy inventory, headlines and calls to action, and the editing passes that remove the patterns generated text falls into. Use with the design skill before laying out a page, and whenever the owner says write the copy, rewrite this, it sounds like AI, or make it sound like us."
---

# Writing

In this app the voice lives in `brand/voice.md`: the card, the three
example sentences, and the fingerprint beneath them (signatures with quoted
evidence, the never-list, rewrite pairs, the lexicon, how the sentences
run, tone by surface). Fill it there from the owner's own words and keep it
current; every line quotes its sample, and a line with no sample stays
"to fill" rather than guessed. The facts a page may
state come from the owner, from a Company Brain mirrored into this app (a
folder holding a `_mirror.md`), or from a captured site that is the
owner's own; nothing else is a source.

Write as a specific person or company speaking to a specific reader for a
specific reason. If the words could appear on a competitor's site unchanged,
they are not ready.

For a web page, read the `design` skill with this one. Copy determines hierarchy,
space, navigation, and interaction. Do not decorate placeholder prose.

## 1. Build the Content Brief

Before drafting, establish:

- **Reader:** Who are they, what do they know, and what are they trying to do?
- **Speaker:** Who is talking, and what gives them the right to say this?
- **One job:** What should the reader understand, believe, decide, or do next?
- **Primary action:** The exact verb and object.
- **Source material:** Product behavior, customer language, founder notes, data,
  constraints, prices, policies, and existing brand copy.
- **Required copy:** Names, legal text, product terms, and wording that must stay
  verbatim.

Read the project's real material first. Keep a simple evidence ledger: each
important claim beside the source that supports it. When support is missing,
soften the claim, label it as an aspiration, or remove it.

Never invent customers, quotations, results, market position, awards, dates,
prices, integrations, or feature behavior to make a draft feel complete.

## 2. Define Voice as Observable Behavior

Choose three useful voice traits and define what each changes on the page.
Adjectives without rules are moodboard filler.

Use a voice card:

```text
VOICE CARD
reader:
speaker:
relationship: [peer, guide, operator, expert, host, etc.]
register: [plain, technical, formal, conversational, terse]
cadence: [sentence length, paragraph rhythm, fragments or no fragments]
vocabulary: [preferred nouns and verbs]
proof style: [demonstration, numbers, examples, process, credentials]
humor: [kind, frequency, or none]
taboos: [claims, tones, phrases, and jargon to refuse]
primary action:
```

Examples of behavioral traits:

- **Direct:** lead with the concrete offer; use active verbs; remove hedges.
- **Grounded:** name materials, places, steps, limits, and proof; avoid grandeur.
- **Warm:** use natural contractions and reassurance; never talk down to people.
- **Expert:** explain the important distinction plainly; do not perform expertise
  through jargon.
- **Spare:** one thought per sentence; few modifiers; let evidence carry weight.

Match the owner where their language is clear: vocabulary, cadence, humor, and
favorite distinctions. Clean up confusion without sanding away their character.

A filled card, for the specimen business the design catalogue uses:

```text
VOICE CARD
reader:        a Bristol homeowner planning a kitchen, comparing makers, wary of showrooms
speaker:       the two people who make and fit the kitchens
relationship:  operator
register:      plain
cadence:       short sentences; one thought each; a longer one when the detail needs it
vocabulary:    fit, build, workshop, drawing, oak, ash, ply, worktop; never "bespoke", "solutions"
proof style:   process and named materials; three finished kitchens, by area
humor:         none
taboos:        invented reviews or counts; "passionate"; "we pride ourselves"; a price without a drawing
primary action: book a workshop visit
```

Three sentences in that voice: "We measure the room and talk through how
you cook." "A drawing you can read, with the price on it." "The people who
built it install it, usually in three days." The test is whether the owner
says "that sounds like us"; if they change a word, the card changes with it.

## 3. Create the Copy Inventory

List the copy the experience actually needs before writing long-form prose:

- page title and promise;
- navigation and wayfinding;
- primary and secondary actions;
- section claims and supporting evidence;
- product, plan, or feature names;
- form labels, help, validation, and confirmation;
- empty, loading, error, and success states;
- footer, contact, policy, and trust information.

Lock approved wording before visual exploration. If the design requires a
different length, revise for clarity with the same meaning; do not shrink type,
truncate the promise, or replace it with a vague slogan just to fit.

## 4. Draft in the Reader's Order

Write for the questions the reader has, not the sections a landing-page template
expects.

1. What is this?
2. Is it for someone like me?
3. What do I get or what can I do?
4. How does it work?
5. Why should I trust it?
6. What does it cost or require?
7. What should I do next?

Not every page needs all seven answers or that exact sequence. Use the ones the
decision demands. Give each section one job and remove repeated claims.

### Headlines

- Communicate before decorating.
- Name the product, result, mechanism, audience, or meaningful tension.
- Prefer a defensible promise to an inflated one.
- A poetic line needs concrete support beside it.
- Read the headline aloud with its intended line breaks; visual rhythm must not
  change the meaning.

### Body copy

- Specific beats generic: a real action, number, place, limit, or example.
- Use active voice when the actor matters.
- Keep paragraphs easy to scan on a phone, but let the thought determine their
  length.
- Explain unfamiliar product terms once, then use the same term consistently.
- Cut sentences that exist only to sound complete.

### Calls to action and UI text

- Name what happens next: “Create a workspace,” “Review the draft,” or “Publish
  the site.”
- Keep one verb for one action across navigation, buttons, menus, and help.
- Use one noun for one object across marketing and product UI.
- Put helpful detail near the decision: price, time, reversibility, requirements,
  or what follows.
- Write errors as diagnosis plus recovery. Do not blame the user.
- Empty states should explain what belongs here and offer the next useful action.

## Slop Patterns to Refuse

Most of these are structural, not lexical. Word lists rot (the vocabulary
of generated text moved from "delve" to "showcasing" in two model
generations); the sentence shapes stay. Mark the strongest tells first and
rewrite the whole passage, never patch one phrase at a time. Flag only clear
matches, and before cutting ask whether the cut would flatten a sentence the
owner actually wrote: real voice is not sanded off. Never add a fact to fill
the gap a cut leaves.

The strongest tells, in order:

- the negation pivot: "It's not X. It's Y.", "not just X, but Y", "X rather
  than Y", especially stacked in threes;
- the staccato tricolon: "No fluff. No filler. No stress.", "Fast. Simple.
  Effective.";
- significance inflation: "stands as a testament", "pivotal", "crucial role",
  "underscores", "evolving landscape", "setting the stage";
- promotional adjectives with nothing behind them: "boasts", "vibrant",
  "nestled", "in the heart of", "renowned", "groundbreaking", "diverse
  array";
- "-ing" riders that restate the sentence: "highlighting", "ensuring",
  "fostering", "enhancing", "showcasing";
- "serves as", "features", "offers" where "is" and "has" would do;
- vague attribution: "experts agree", "industry reports";
- em dashes (write a comma, a colon, or a new sentence), bold list stems,
  title-case headings, emoji as bullets or headers, summarising closers
  ("In summary", "Remember,"), a heading every eighty words;
- uniform sentence length. Generated text puts most sentences at fifteen to
  twenty-eight words; people write four-word sentences and fifty-word ones.

Three checks a word list cannot do (do them on every page):

1. In any ten sentences, the longest minus the shortest is more than fifteen
   words. If not, cut one sentence to a fragment's length and let one run.
2. Every section carries at least one particular from the owner's material:
   a proper noun, a number, a place, a date, a product name. A section with
   none is generic by construction.
3. At most one triad on the page.

`npm run check` refuses the phrases below in pages and posts (legal pages
are verbatim and exempt). Delete or rewrite:

- openers such as “In today's fast-paced world,” “In a world where,” “Imagine
  a world,” “Are you looking for,” “Hi there,” and “Welcome to”;
- fake-casual pivots: “Here's the thing,” “And honestly?”, “You know what's
  wild?”, “That changes everything”;
- audience sweeps: “Whether you're X or Y,” “Look no further”;
- ad clichés: “Say goodbye to,” “Ready to take X to the next level?”, “Don't
  just X, Y,” “game-changer,” “all-in-one”;
- small-business site clichés: “We're passionate about,” “We pride
  ourselves,” “We do things differently,” “Making X simple,” “I love what I
  do,” “solutions” as a noun for what the business sells;
- empty transitions such as “Let's dive in,” “Without further ado,” and “So,
  let's get started”;
- hedge filler such as “It's important to note that” and “It goes without
  saying”;
- default formulas such as “X, reimagined,” “Where X meets Y,” “Built for the
  future,” “Your partner in X,” and “Everything you need, all in one place”;
- vague prestige language about dreams, possibilities, or changing the world
  without a concrete offer beside it;
- fake urgency, unsupported superlatives, and invented proof;
- the same intro → feature list → testimonials → FAQ → CTA structure regardless
  of the reader's questions;
- headings that all use the same sentence pattern;
- decorative microcopy that competes with instructions.

Avoid these words when they are filler: leverage, elevate, streamline,
cutting-edge, world-class, passion, journey, unlock, empower, revolutionize,
robust, seamless, holistic, synergy, paradigm, innovative, transform, and
comprehensive.

The problem is not a forbidden dictionary; it is language that performs value
instead of demonstrating it.

## Editing Passes

Edit in this order:

1. **Truth:** Is every claim supported and internally consistent?
2. **Meaning:** Can the reader identify the offer, relevance, and next step?
3. **Structure:** Does each section answer a necessary question once?
4. **Voice:** Does the draft follow the voice card in observable ways?
5. **Language:** Replace abstraction with concrete nouns and active verbs.
6. **Interface:** Make labels, actions, errors, and product terms consistent.
7. **Sound:** Read it aloud; fix repetition, awkward cadence, and forced line
   breaks.
8. **Compression:** Cut every sentence that adds no fact, proof, instruction, or
   character.

Then review the words in the rendered design at mobile and desktop widths. A
draft is not finished if it is clear in a document but unreadable, truncated,
or misleading in the interface.

## The Test

Before showing the work, ask:

- Could this copy belong to a competitor after changing the name?
- Does it sound like the stated speaker, or like a general-purpose marketer?
- Is the strongest sentence true, specific, and useful?
- Are product nouns and action verbs consistent everywhere?
- Did the design force any sentence into vagueness?
- What can be cut without losing meaning, proof, instruction, or character?

Fix the weakest answer. Keep the parts only this company could say.
