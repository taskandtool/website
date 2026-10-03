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
4. **Build the page** in `src/pages/home.tsx` (the `website` skill's "How a
   page is written"; `npm run parts` lists what it is built from), then
   `npm run verify` and fix what is a mistake. When the owner asked for something the lint flags, put
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
  subject, composition, light, crop and the empty space the words need.
  Words stay in HTML, never baked into an image.
- **Motion.** One orchestrated moment, or none. Nothing waits behind it,
  and reduced motion shows the finished page.
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
every page:

1. **Fill the rest of the record** by `references/authoring.md`: the rules
   with their reasons, the imagery, the motion, `x_layout` for every shape
   of content (not only what the homepage shows), and `identity` from the
   brief. `references/records/` holds two proven library records as worked
   examples, and `references/authoring.md` ends with a filled identity. Then `npm run system`.
2. **Rebuild it blind.** Give a sub-agent with a fresh context only
   `design/briefs/home.md`, `public/`, `brand/` and `design/system.yaml`,
   and have it build the homepage as a scratch page at `/rebuild`
   (`src/pages/rebuild.tsx`). Screenshot both (`npm run shots -- /rebuild`).
   Where they differ in a way the owner would notice, the record left it
   out: add it, rebuild once more, then delete the scratch page. Without a
   sub-agent, skip this and say so.
3. **Check it:** `npm run verify`.

The other pages then follow the record (the `pages` skill). A later change
to the look is a change to the record.

## Review gate

Look at the rendered page, never the code:

```bash
npm run shots          # the whole page at 1280 and 390 wide: uploads/home-1280/01.png, 02.png …, uploads/home-390/…
```

Read the images in order, and answer:

1. Can a stranger name the business, the offer and the next action at once?
2. Is the first screen clearly better than their current homepage's
   (`raw/site/<host>/shots/`), and would the owner send it to someone?
3. Does the composition come from this business, or from a trend?
4. Which element is there only to look busy? Remove it.
5. Is every claim on the page in the notes?

Fix the largest problem and look again; the first render always shows
something the code did not. Then `npm run show -- --from-shots` sends the
screenshots you looked at to the chat.
