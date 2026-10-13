---
name: design
description: "Designs this website's look: the first screen, the design system record and how it grows, type, colour, imagery, layout and the review gate. Use for change the look, it looks generic, new colours or fonts, or a site growing past its homepage. Not for starting a site (new-site) or its words (writing)."
---

# Design

The site's design system is one record, `design/system.yaml`: its tokens,
its rules with their reasons, and how each kind of content is laid out.
`npm run system` compiles it into `styles/theme.css` and `DESIGN.md`; never
edit those two by hand. Change values with `npm run system -- set
colors.accent=#435331`, or edit the record and run `npm run system`. Read
`DESIGN.md` and the notes in `brand/` before designing.

Make the page unmistakably this business, for its customers, doing its one
job. A new palette on a familiar template is not a design. When the owner
asks for a faithful copy of an existing design, fidelity wins.

## Shape the skeleton first

Every site starts from the same skeleton: the header and footer in
`src/layout.tsx`, the components `npm run parts` lists, the starter record.
Change it for this business before building the page: the header, the
footer, how sections are framed and how proof is shown. Take the shape
from a site the owner pointed at (`tt-crawl reference <url>` captures its
look) or from the design library (`references/library.md`: previews and
records), never another site's words, pictures or logo.

## What makes it good

- **Stunning heroes and full-bleed photographs.** Their own best photographs
  are the strongest thing the site has; `brand/images.md` says what each
  shows and its size.
- **One signature move** that belongs to this business: an oversized word,
  the product lit on black, a live detail (today's hours).
- **A colour world and a type personality of its own,** from the business's
  own colours and fonts or a library record's.
- **Proof, front and centre:** all of `public/proof.md` on the homepage and
  every service page, designed as boldly as the rest (`RatingLine`,
  `ReviewsSection`, `LogosSection`, `PeopleSection`, `NumbersSection`, or
  your own from `content.facts`). `npm run proof` fails while any is
  missing.
- **Motion:** the first screen's words rise in (`data-rise`); a later band
  may come into view (`data-reveal`).
- **A generated image** is described apart from the layout (subject, light,
  crop, room for the words); words stay in HTML, never in the image.

Refuse the generated-page defaults unless the brief gives a reason: a
centred headline over a glow; three feature cards, pricing, FAQ and a
final call to action whatever the content; a split hero with a form; a small tracked-caps label above every
heading; cream with a soft serif; Inter with Playfair; icons in coloured
circles; gradients, blur or glass to make up for a weak idea; fake proof; a
page that could be another business with the logo swapped.

## When the site grows

When the owner wants more than the homepage: `references/growing.md`.

## Review gate

Look at the rendered page, never the code: `npm run shots` writes, per
width (1280, 390), `uploads/home-<width>/overview.png` (the whole page) and
the strips `01.png`, `02.png` … at full size. Check the page's shape, then
each section, then the phone; set it beside the page it replaces
(`raw/site/<host>/shots/`) or the one the owner pointed at: is it clearly
better, and would the owner send it to someone? Write every problem in one
list, fix them in one pass, then `npm run verify` and `npm run shots` once
more.
