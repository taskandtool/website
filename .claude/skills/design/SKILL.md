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

A fresh pair of eyes judges a page better than the one that built it, and
the screenshots then stay out of your turn. After `npm run check` and
`npm run shots`, give a fresh sub-agent (not a fork) the images `shots`
names, the page it replaces (`raw/site/<host>/shots/`) or the one the
owner pointed at, and `DESIGN.md`. Ask it to look at every image at full
size, the page's shape first, then each section, then the phone, and to
return `| page, width, section | what is wrong | the fix |`: anything
broken, cramped, out of line, hard to read or generic, and last, whether
the page is clearly better than the one it replaces and the owner would
send it to someone. Without a sub-agent, look yourself and say so.

Fix its list in one pass, with each hint `npm run check` printed fixed or
kept on purpose (`data-lint-allow="<rule>"` on its element, said so), then
`npm run check` once more.
