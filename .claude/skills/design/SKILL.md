---
name: design
description: "Designs this website's look: the first screen, the design system record and how it grows, type, colour, imagery, layout and the review gate. Use for change the look, it looks generic, new colours or fonts, or a site growing past its homepage. Not for starting a site (new-site) or its words (writing)."
---

# Design

The site's design system is one record, `design/system.yaml`: its tokens,
its rules with their reasons, and how each kind of content is laid out.
`npm run system` compiles it into `styles/theme.css` (the classes) and
`DESIGN.md` (the readable contract); never edit those two by hand. Change
values with `npm run system -- set colors.accent=#435331
identity.direction="…"`: it keeps the file as written, refuses a broken
record, and compiles. Read `DESIGN.md` and the notes in `brand/` before
designing. The starter's record is a placeholder: every token is chosen
again for this business, starting from the colours and fonts `from-site`
read from their site.

Make the page unmistakably this business, for its customers, doing its one
job. A new palette on a familiar landing-page template is not a design.
When the owner asks for a faithful copy of an existing design, fidelity
wins. The steps for a first homepage are in the `new-site` skill; this
skill is what makes it good.

## The first screen

The owner judges the whole site by it, so the work goes here. A short
headline at scale that says what the business does, one supporting line,
one action: a visitor names what this is in five seconds, and the owner is
proud to send the link.

- **Lead with an image when there is a good one:** the business's best
  photograph of the work, the place or the product, crisp and large. When
  the business is visual (food, a place, a view, a craft), prefer it
  full-bleed behind the headline, or a short muted looping video when they
  have one. A photograph runs full-bleed from 1600px wide; never enlarge one
  past its own width. A photograph too small to be sharp is set
  at its own size, framed, or left out, and the head becomes type-led.
- **Words over a photograph stay readable:** a scrim (`scrim`, `scrim-up`
  on a layer over the image), a band, or placement beside the subject,
  with contrast checked over the image.
- **Commit to a colour world:** a saturated field, black, or the
  photograph. A warm off-white ground is a choice, not a default; one deep
  brand colour against white reads stronger than tints of one hue.
- **One signature move** that belongs to this business: an oversized word,
  a numeral crossing a photograph's edge, the product lit on black, a live
  detail (today's hours). One, not five.
- **The form is not the hero.** A form sits beside the promise only when
  a quote or a booking on the first screen is the page's whole job.

## Making it good

- **Impact, not only clarity.** Beyond the first screen, one or two moments
  a visitor remembers: a photograph at full width with words over it, a band of deep brand colour, an
  oversized word. Every section still reads at a glance.
- **Layout.** Sequence, comparison and hierarchy each look different. One
  section is the peak; the rest are quieter. Cards only for comparable
  things (services, people, plans), never around a paragraph. No two
  adjacent sections share a composition; where the system separates bands
  by ground, they change ground too. Every band's content
  starts on one left edge (the `Section` frame); `npm run shots` names a
  band that does not.
- **Type.** Display, reading and labels each have a job. Body copy at 18px
  or more, normal weight; the heaviest weight once. A type personality that
  belongs to the subject, not the cliché for the industry: start from the
  business's own fonts or a library record's pairing.
- **Colour.** Every colour has a job; the accent is for actions. Contrast
  holds in every state: hover, focus, over a photograph.
- **Imagery.** Describe a generated image apart from the layout: its
  subject, composition, light, crop and the space the words need. Words
  stay in HTML, never baked into an image.
- **Motion.** The first screen's words rise in (`data-rise`) and one or
  two later bands come into view (`data-reveal`); nothing waits behind
  it.
- **Proof, front and centre.** What others say persuades more than
  anything the business says, so use all of `public/proof.md`, on the
  homepage and every service page, and design it as boldly as the rest:
  the rating by the first action, walls or bands of logos, star-rated
  reviews (`RatingLine`, `ReviewsSection`, `LogosSection`, `PeopleSection`,
  `NumbersSection`, or your own from `content.facts`). Reviews:
  `ReviewsSection`, restyled to the system rather than replaced. `npm run
  proof` fails while any of it is missing from the homepage.
- **Phone and desktop** are two compositions of the same content, both
  checked.

Refuse the generated-page defaults unless the brief gives a reason: a
centred headline over a glow; three feature cards, pricing, FAQ and a
final call to action whatever the content; a split hero with a form; a small tracked-caps label above every
heading; cream with a soft serif; Inter with Playfair; icons in coloured
circles; gradients, blur or glass to make up for a weak idea; fake proof; a
page that could be another business with the logo swapped.

## When the site grows

When the owner wants more than the homepage, the record carries the look to
every page: `references/growing.md` (fill the record, rebuild it blind,
check it). The other pages then follow the record (the `pages` skill).

## Review gate

Look at the rendered page, never the code:

```bash
npm run shots          # per width (1280, 390): uploads/home-1280/overview.png, then 01.png, 02.png …
```

`overview.png` is the whole page in one image (for a long page); the
strips are the same page at full size, top to bottom. Read them in order:

1. **The overview: the page's shape.** Name the sections top to bottom. Is
   there one peak, or do they all shout? Do two neighbours share a
   composition or a ground? Is all the proof on it?
2. **The strips: each section in turn.** For each, say what it is for and
   the worst thing you can see: text that wraps badly or runs over an
   image, a crop that cuts the subject, uneven spacing or alignment, low
   contrast, an empty or broken image, a section that could be another
   business's.
3. **The page it replaces beside it** (`raw/site/<host>/shots/`), or the
   one the owner pointed at (`tt-crawl reference <url>`): name each of its
   sections and whether the new page keeps it, does it better, or is
   better without it. A gallery, a video or questions a reader would miss
   come over; a weak old page sets no floor. What did it do better in
   layout, imagery or proof? Carry that over. Is the new page clearly
   better? Would the owner send it to someone?
4. **The phone strips:** the first screen holds the promise and the action;
   nothing is cut off, squeezed or tiny.

Write the problems as one list, section by section, fix them all in one pass (rewrite
the file, or one script for several edits; not one edit per problem), then
`npm run verify` and `npm run shots` once more. Two looks are usually
enough; a third only for something still broken.
