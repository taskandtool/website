---
name: design
description: "Designs this website's look: the first screen, the design system record and how it grows, type, colour, imagery, layout and the review gate. Use when the owner says \"change the look\" or \"it looks generic\", asks for new colours or fonts, or wants more than the homepage. Not for starting a site (new-site) or its words (writing)."
---

# Design

The look is one record, `design/system.yaml`. `npm run apply-design`
compiles it into `styles/theme.css`, `DESIGN.md` and `src/fonts.ts`, and
refuses a broken record. The starter's record is a working default: read
`DESIGN.md`, then make it this business's.

Done when the first screen is their best photograph at full width with the
promise and one action (`Hero`), all their proof is on the page (`npm run
check:facts`), a stranger could tell whose site it is, and you find
nothing left to fix at the review gate below.

## Making it theirs

- **Tokens** from their brand (`brand/`, the colours and fonts `brand-from-site`
  read), or from a site the owner likes or a library record.
- **Components and the skeleton** (`src/components`, the header and footer
  in `src/layout.tsx`): restyle them to match, with Tailwind utilities in
  the tokens. Add a section for each thing they have material for (a
  gallery, the team, the process, the area), each in `Section`. Keep the
  proof components (`RatingLine`, `ReviewsSection`, `LogosSection`…) and
  restyle them.
- **A site the owner likes** or wants to use: take its shape (`tt-crawl
  reference <url>` captures its look) but not its words, pictures or logo.
  When they ask for a copy of a design, copy it. Otherwise borrow from the
  library record that suits them. `references/library.md` lists who each
  record suits, its look and its preview, and how to show the owner a few.

## When the site grows

When the owner wants more than the homepage: `references/growing.md`.

## Review gate

Look at the rendered page, not the code. After `npm run check`, run
`tt-crawl shoot /` (and each other page you changed). Look at every image
it names, in order, at full size: the page's shape first, then each
section, then the phone. Compare it with the page it replaces
(`raw/site/<host>/shots/`) or the one the owner pointed at. Is it clearly
better, and would the owner send it to someone?

List every problem (broken, cramped, out of line, hard to read, generic),
then fix the whole list in one pass. Fix each hint `npm run check` printed,
or keep it on purpose with `data-lint-allow="<rule>"` on its element and
say so. Then run `npm run check` once more.
