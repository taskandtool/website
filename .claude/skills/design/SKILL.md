---
name: design
description: "Designs this website's look: the first screen, the design system record and how it grows, type, colour, imagery, layout and the review gate. Use for change the look, it looks generic, new colours or fonts, or a site growing past its homepage. Not for starting a site (new-site) or its words (writing)."
---

# Design

The look is one record, `design/system.yaml`, compiled by `npm run system`
into `styles/theme.css`, `DESIGN.md` and `src/fonts.ts`; the compile refuses a broken record. The starter's record is a working default:
read `DESIGN.md`, then make it this business's.

## Making it theirs

- **Tokens** from their brand (`brand/`, the colours and fonts `from-site`
  read), or from a site the owner likes or a library record.
- **Components and the skeleton** (`src/components`, the header and footer
  in `src/layout.tsx`): restyle them to match, with Tailwind utilities in
  the tokens, and add sections the material calls for (a gallery, the team,
  the process, the area), each in `Section`. The proof components
  (`RatingLine`, `ReviewsSection`, `LogosSection`…) stay, restyled.
- **A site the owner mentioned** liking or wanting to use: take its shape
  (`tt-crawl reference <url>` captures its look), never its words, pictures
  or logo. Otherwise borrow from the library record that suits them:
  `references/library.md` lists who each suits, its look and its preview,
  and how to show the owner a few.

Done when the first screen is their best photograph at full width with the
promise and one action (`Hero`), all their proof is on the page (`npm run
check:facts`), a stranger could tell whose site it is, and the review gate below
finds nothing left to fix. When the owner asks for a copy of an existing
design, copy it.

## When the site grows

When the owner wants more than the homepage: `references/growing.md`.

## Review gate

Look at the rendered page, never the code: `npm run shots`, then every
image it names, in its order, at full size (never a sheet you scale down). Check the page's shape, then each section,
then the phone; set it beside the page it replaces
(`raw/site/<host>/shots/`) or the one the owner pointed at: is it clearly
better, and would the owner send it to someone? Each hint `npm run
check` printed is fixed, or kept on purpose with
`data-lint-allow="<rule>"` on its element and said so. Write every problem
in one list, fix them in one pass, then `npm run check` and `npm run shots`
once more.
