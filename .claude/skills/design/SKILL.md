---
name: design
description: "Designs the look of this website: the homepage built for real and shown, the first screen, the design system record and how it grows with the site, type, colour, imagery and layout, and the rendered review. Use when building or changing how a page looks, when the owner says change the look or it looks generic, and when the site grows past its homepage."
---

# Design

The site's design system is one record, `design/system.yaml`: its tokens,
its rules with their reasons, and how each kind of content is laid out.
`npm run system` compiles it into `styles/theme.css` (the classes) and
`DESIGN.md` (the readable contract); never edit those two by hand. Read
`DESIGN.md` and the notes in `brand/` before designing.

Make the page unmistakably this business, for its customers, doing its one
job. A new palette on a familiar landing-page template is not a design.
When the owner asks for a faithful copy of an existing design, fidelity
wins. Design with the real words (the `writing` skill), never around
placeholder copy.

## The homepage first

Build one homepage for real and show it, rather than planning the site.
Most owners judge a design by looking at it.

1. **Look before choosing.** Their current site (`raw/site/<host>/`, its
   screenshot in `shots/`), anything they linked or said they like
   (`tt-crawl reference <url>` captures a site's look into
   `raw/external/<host>/`), and the design library
   (`references/library.md`: fourteen systems with a preview each). Find
   the one or two closest to what this business needs and take ideas from
   them, never another site's words, pictures or logo. The site's system is
   always its own.
2. **Write the brief,** `design/briefs/home.md` in the `pages` skill's
   format (`references/brief.md` there); for a first homepage, the
   frontmatter and the hero's lines are enough.
3. **Set the look** in `design/system.yaml`: `npm run from-site` seeded the
   tokens from their current site; change what this design needs (colours
   by role, fonts, sizes, radii), then `npm run system`. The tokens are all
   a first page needs.
4. **Build the page** in `src/pages/home.tsx`, written whole in one go
   (the `website` skill's "How a page is written"; `npm run parts` lists
   what it is built from), then `npm run verify` and fix what is a mistake.
   When the owner asked for something the lint flags, put
   `data-lint-allow="<rule>"` on that element and say so in one line.
5. **Review, commit, show.** The review gate below, then commit (one plain
   line), so any version the owner has seen comes back with one `git
   checkout`. Then `npm run show -- --from-shots`.

Then follow the owner. A small change is an edit to the same page. When
they want options, or a change worth comparing, build each option as the
real page in turn, commit each, show them side by side, and keep the one
they pick.

## The first screen

The owner judges the whole site by it, so the work goes here. A short
headline at scale that says what the business does, one supporting line,
one action: a visitor names what this is in five seconds, and the owner is
proud to send the link.

- **Lead with an image when there is a good one:** the business's best
  photograph of the work, the place or the product, crisp and large. A
  photograph runs full-bleed only when it is at least 2000px wide; never
  enlarge one past its own width. A photograph too small to be sharp is set
  at its own size, framed, or left out, and the head becomes type-led.
- **Words over a photograph stay readable:** a fade, a scrim, a band, or
  placement beside the subject, with contrast checked over the image.
- **Commit to a colour world:** a saturated field, black, or the
  photograph. A warm off-white ground is a choice, not a default.
- **One signature move** that belongs to this business: an oversized word,
  a numeral crossing a photograph's edge, the product lit on black, a live
  detail (today's hours). One, not five.
- **The form is not the hero.** A form sits beside the promise only when
  booking on the first screen is the page's whole job.

## Making it good

- **Layout.** Sequence, comparison and hierarchy each look different. One
  section is the peak; the rest are quieter. Cards only for comparable
  things (services, people, plans), never around a paragraph. No two
  adjacent sections share a composition or a ground.
- **Type.** Display, reading and labels each have a job. Body copy at 18px
  or more, normal weight; the heaviest weight once. A type personality that
  belongs to the subject, not the cliché for the industry.
- **Colour.** Every colour has a job; the accent is for actions. Contrast
  holds in every state: hover, focus, over a photograph.
- **Imagery.** A generated image is described apart from the layout:
  subject, composition, light, crop and the space the words need. Words
  stay in HTML, never baked into an image.
- **Motion.** One orchestrated moment, or none. Nothing waits behind it,
  and reduced motion shows the finished page.
- **Proof.** The logos and reviews in `public/proof.md` (`MarksSection`,
  `ProofSection`) go on the homepage and every service page: every logo,
  under an honest label for its kind (members of, certified by, brands we
  service, partners, clients), near the promise or the action; reviews
  word for word where a visitor decides. Their old site's proof left off
  is a regression. Real proof is content, never a default to refuse.
- **Phone and desktop** are two compositions of the same content, both
  checked.

Refuse the generated-page defaults unless the brief gives a reason: a
centred headline over a glow; a logo strip, three feature cards,
testimonials, pricing, FAQ and a final call to action whatever the
content; a split hero with a form; a small tracked-caps label above every
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
   composition or a ground? Is the proof (their logos, their reviews) on
   the page when the notes hold any?
2. **The strips: each section in turn.** For each, say what it is for and
   the worst thing you can see: text that wraps badly or runs over an
   image, a crop that cuts the subject, uneven spacing or alignment, low
   contrast, an empty or broken image, a section that could be another
   business's. Then the first screen against their current homepage
   (`raw/site/<host>/shots/`): is it clearly better, would the owner send
   it to someone?
3. **The phone strips:** the first screen holds the promise and the action;
   nothing is cut off, squeezed or tiny.
4. **Every claim** on the page is in the notes.

The first render always shows something the code did not. Write the
problems as one list, section by section, fix them all in one pass (rewrite
the file, or one script for several edits; not one edit per problem), then
`npm run verify` and `npm run shots` once more. Two looks are usually
enough; a third only for something still broken. Then `npm run show --
--from-shots` sends each page whole, one image per width, to the chat.
