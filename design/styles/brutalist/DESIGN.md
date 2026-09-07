# DESIGN.md

The design system of this website: what each token is for, how pages are
composed, and what to refuse. The values live in `styles/theme.css` (the
brand's colours and fonts, the roles they play, the scale, edges, rhythm);
this file explains them and is updated from the brand notes in `brand/`
(`BRAND.md`, and "Updating from the brand" at the end of this file). Change
a value there, then update its row here. The AI reads this file before it
designs or changes a page, and `npm run check` enforces the parts that can
be checked. Sections follow the common DESIGN.md order so any tool that
reads the format finds what it expects.

## Style

Name: brutalist
Thesis: Raw, loud, and honest: 2px black borders instead of hairlines, no radius, hard offset shadows with no blur, one huge display face, mono labels, and one loud accent against black and off-white.
Best for: workshops, makers, studios, agencies, events, independent shops, a product with one strong claim, anyone whose work is physical and can be said in short plain words.
Not for: healthcare, finance, law, or anything that must feel calm and cautious; long-form reading sites (the borders and heavy type tire the eye over many screens); brands whose identity is soft, pastel, or ornate.
Signature: blocks that sit on a hard 6px black shadow (the hero, the buttons, the ticket) and one giant wide word in `text-specimen` inside a frame.
References: Gumroad's 2021 redesign, the Figma Config site, Bloomberg Businessweek covers.
Fonts: Archivo for headings (weight 900, set wide), Archivo for reading (weight 400), IBM Plex Mono for labels and numerals.

## Identity

The part that makes this site *this* site. It is empty on day one and is
filled once, from the `design` skill's brief and its three directions,
before the first real page is built. A site whose identity is still "to
fill" is a template, not a design.

```text
Subject:            to fill — what this site sells, explains, or does
Audience:           to fill — who arrives, and what they already know
One job:            to fill — what the page must make clear or help someone do
Direction:          to fill — the chosen direction's name and one-sentence thesis
Source:             to fill — the real-world artifact or behaviour it borrows from
Signature:          to fill — the one moment a visitor should remember
Rejection:          to fill — the familiar pattern this site deliberately avoids
Photography:        to fill — real photos the owner has, or the honest slot until they do
```

## Visual Theme & Atmosphere

A page built like a poster pasted to a wall: everything has a black edge,
nothing is rounded, nothing is soft. The ground is an off-white with a
little grey in it, not pure white; white is kept for the blocks that sit on
it. Text is a true near-black. One saturated accent (a loud blue) does every
action and appears once more as a solid bar in the night band. Headings are
set in a very heavy, wide sans, upper-case, and allowed to run to the edge
of their block; labels and numerals are in a monospace face, so hierarchy
comes from weight, width, and case rather than from colour or decoration.
Depth is a hard offset shadow, the same black as the border, never blurred.
Every section is composed differently from the one before it, and the
grounds alternate so the borders always read.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep
the principles unless the brief says otherwise: black edges, zero radius,
hard shadows, one accent, one giant word, off-white ground, honest content.

## Color Palette & Roles

Two layers in `styles/theme.css`. **Brand colours** (`--brand-primary`,
`--brand-dark`, `--brand-light`, `--brand-neutral`, plus any named extras)
are what the business owns, copied from `brand/visual-identity.md`. **Role
tokens** say what each is *for*, and are the only colours markup may use
(as `bg-*`, `text-*`, `border-*`, `divide-*`). The Tailwind default palette
is switched off, so `bg-blue-500` does not exist here; add a brand colour
and give it a role instead. Contrast is measured against the ground named.

| Token | Value | Role |
|---|---|---|
| `--color-canvas` | brand light, #fafaf7 | The page ground: off-white, never pure white. Most sections sit on it. |
| `--color-surface` | #ffffff | A bordered block on the canvas: the hero, a ticket, a strip in a stacked list. |
| `--color-panel` | #f0efe9 | One step down: a grey-cream band, or a cell inside a block. At most two bands per page, never adjacent. |
| `--color-night` | brand dark, #0a0a0a | The dark ground: the footer, and at most one statement band. The same black as the ink and the lines. Never a card. |
| `--color-ink` | #0a0a0a | Headings and body on light grounds (18.9:1 on canvas). |
| `--color-ink-2` | brand neutral, #3d3d3a | Secondary text on light grounds; must reach 4.5:1 on canvas and panel (10.4:1 and 9.5:1). |
| `--color-ink-3` | #57574f | Captions and mono labels on light grounds (7.0:1 on canvas, 6.3:1 on panel). Never a border. |
| `--color-night-ink` | brand light, #fafaf7 | Text on night; must reach 4.5:1 on night (18.9:1). |
| `--color-night-ink-2` | #b5b5ad | Secondary text on night (9.6:1). |
| `--color-accent` | brand primary, #0033ff | The one action colour: primary buttons, links in body copy, the focus ring, and the solid bar in the night band. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (6.9:1 and 7.2:1). A loud blue against black and off-white: a deliberate high-contrast pair, not a hue relation. |
| `--color-accent-ink` | #ffffff | Text on the accent. |
| `--color-accent-hover` | #0026c2 | The accent's hover and active state (10.2:1 under `accent-ink`). |
| `--color-line` | #0a0a0a | Every edge on light grounds, always 2px (`border-2`): block frames, dividers, the grid lines. Solid black, never a tint. |
| `--color-line-strong` | #0a0a0a | The same black: input edges, table frames, the secondary button's edge. There is one line weight in this style. |
| `--color-line-on-night` | #fafaf7 | Edges inside a night surface, 2px, solid off-white. |

Rules:

- The accent appears on actions and on one thing more: the solid bar in the
  night band. Not on headings, not on icons, not as a section ground, not as
  a border.
- Lines are always solid and always black on light, off-white on night.
  `border-line` and `border-line-strong` are the same colour on purpose; a
  tint of the ink is not a line in this style.
- Text meets 4.5:1 against its ground; focus rings and input edges meet 3:1.
  `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. A brand's primary that fails as text on the
  canvas becomes a ground with its own ink token instead; a brand's
  neutral that is too light gets a darker role value. The brand's colours
  stay what they are; the roles bend.
- Photographs, product shots, and the brand's own artwork carry colour. The
  interface around them stays in the palette above: black, off-white, white,
  one accent.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

Three families: a display face and a text face that are the same family at
two weights, and a mono face for labels and numerals, named in
`styles/theme.css` (`--font-display`, `--font-body`, `--font-mono`) from
`brand/visual-identity.md`, and loaded by the URL in `src/site.ts`
(`fonts.googleFontsUrl`) or self-hosted in `static/fonts/`. Archivo carries
a width axis: headings and the specimen word set it wide with
`font-stretch-expanded`.

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 48 to 120px, fluid | 0.92 | -0.02em | 900 | The h1, upper-case, `font-stretch-expanded`. One per page. No measure: it runs to the edge of its block and wraps where it wraps. |
| `text-section` | 36 to 68px, fluid | 0.95 | -0.02em | 900 | Every h2, upper-case, wrap at `max-w-[12ch]` to `max-w-[16ch]`. Also the big index numeral in `font-mono` (weight follows the mono face). |
| `text-title` | 24 to 32px, fluid | 1.05 | -0.01em | 700 | The h3 of a cell, a strip, or a callout, upper-case. |
| `text-lede` | 18 to 22px, fluid | 1.45 | 0 | 400 | The supporting thought under a heading, `max-w-2xl`, in `text-ink-2`. Also a photo caption in `font-mono`. |
| `text-copy` | 18px | 1.55 | 0 | 400 | Body copy (the body default). Measure under 70 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 500 | Interface text: nav, captions under images; buttons in `font-mono` upper-case. |
| `text-label` | 13px | 1.4 | +0.06em | 500 | The one small label style, always `font-mono` and upper-case: an eyebrow, a strip header, metadata. Nothing renders smaller. |
| `text-specimen` | 72 to 192px, fluid | 0.85 | -0.02em | 900 | One giant word inside a frame (`role="img"`), upper-case, `font-stretch-expanded`. Once per page. Never for a heading. |

Rules:

- Headings use `font-display` at weight 900 and are upper-case; body copy
  is always 400 and sentence case. The mono face is for labels, numerals,
  captions, and button text, at weight 500, and never for a paragraph.
- Headings have no measure unless they sit beside something; set it with
  `max-w-[Nch]`. Paragraphs take `max-w-prose` or `max-w-2xl`. Long words
  wrap; nothing truncates. Upper-case headings need short words: rewrite a
  headline before shrinking it.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them) even
  when the visual scale breaks convention.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both. `uppercase` is the only case class in use.
- Grey type is not a hierarchy device: `text-ink-3` is for mono labels only,
  never for a sentence someone has to read.

## Component Stylings

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-6`,
`border-2 border-line`, `shadow-hard`, no radius, label in `font-mono
text-base font-medium uppercase`. Primary is `bg-accent text-accent-ink`,
hover `bg-accent-hover`; secondary is `bg-surface text-ink` with a
`bg-panel` hover, the same black edge and shadow. On hover the button moves
`translate-x-0.5 translate-y-0.5` and the shadow becomes `shadow-hard-sm`;
on active it moves `translate-x-1.5 translate-y-1.5` and the shadow goes to
`shadow-none`, so it presses flat. On the night ground use
`border-line-on-night shadow-hard-on-night`. Give the wrapper `pb-1.5
pr-1.5` so the shadow is not clipped. One primary per section. The label
says what happens next: "Book a visit", "See the work", never "Learn more".

**Links in copy**: underlined, 2px, offset; inherit the text colour; on hover
the underline stays. Nav links are `text-ink-2`, not underlined, `text-ink`
on hover, with `aria-current="page"` on the current page.

**Eyebrow** (`Eyebrow`): `text-label uppercase text-ink-3` inside a
`font-mono` parent; when the preset is applied, add `font-mono` to the
component itself. It lives in a strip: a `border-b-2` row at the top of a
block, with a second label on the right.

**Blocks** (this style's card): `border-2 border-line bg-surface`, no
radius. A block that should feel like an object (the hero, a ticket, one
framed visual) adds `shadow-hard`; a block inside a list does not. Cells
inside a block are separated by `border-r-2` or `border-t-2`, never by a
tint. On night, `border-line-on-night` with no fill. Never a block around a
single paragraph.

**Stacked strips** (a list of comparable things with a photo each):
`divide-y-2 divide-line border-2 border-line bg-surface`; each strip is a
`grid sm:grid-cols-[7rem_minmax(0,1fr)]` with the index in `font-mono
text-section` on `bg-canvas` behind a `border-r-2`, and the photo slot on
the right, `min-h-64`, caption in `font-mono text-lede` at the bottom.

**Numbered grid** (a process, a comparison): `grid gap-0.5 border-2
border-line bg-line sm:grid-cols-2 lg:grid-cols-4`; every cell `bg-canvas`
(or `bg-surface`) so the 2px gap shows the line colour as a thick divider.
Cell: mono numeral in `text-section text-ink`, `h3` in `text-title`, one
sentence in `text-ink-2`.

**Ticket** (the contact block): a `border-2 border-line bg-surface
shadow-hard` block split `lg:grid-cols-[minmax(0,1fr)_22rem]`, the stub on
`bg-panel` behind a `border-dashed` line (`border-t-2` stacked, `lg:border-l-2`
side by side), the action at the bottom of the stub.

**Inputs**: 48px tall, no radius, `border-2 border-line-strong`, the canvas
as ground, label above in `font-mono text-label uppercase`, help text in
`text-ink-2` (a sentence, not a label). Error text is a diagnosis plus a
recovery in `text-ink`, next to the field.

**Sections** (`Section`): `py-section` vertical padding; `max-w-content`
(72rem) for reading sections, `max-w-wide` (80rem) for the hero and a wide
visual; horizontal padding `px-5 sm:px-8`. Grounds: canvas, panel, night.

**Images**: no radius, `border-2 border-line`, real alt text, `object-cover`,
sized by the grid, never stretched. A hero image is either full-bleed with a
`border-y-2` or inside a block, not both. An honest photo slot is a cell in
a block with its caption inside it, never a grey rectangle with an icon.

**Header and footer** (`src/layout.tsx`): when the preset is applied the
header's rule becomes `border-b-2 border-line` and the footer's top rule
`border-t-2 border-line-on-night`; the wordmark is `font-display` at 900,
upper-case.

## Layout Principles

- The base unit is 4px. Section padding is `py-section` (64 to 112px).
  Heading group to what it introduces is `mt-block` (40 to 56px). Inside a
  heading group: heading to lede `mt-8` or `mt-10`, lede to actions `mt-8`.
- Compose from the content. Each content job takes a different form: the
  hero is one heavy block with the h1 running to its edge and the giant
  word in a bottom frame; a list of work is stacked strips with an index;
  a process is a numbered grid with thick dividers; a statement is the
  inverted band with the accent bar; contact is a ticket with a stub.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground (canvas, panel, night, canvas is the usual run).
- One section is the peak: the hero block, tallest and heaviest. Everything
  after it is a table, a grid, or a band, and quieter.
- Prefer document flow. Absolute positioning is for one deliberate layer,
  never the skeleton. Nothing overlaps text.
- Space is plain: gaps are 4px multiples, `gap-0.5` (2px) when the gap is
  the line itself.

## Depth & Elevation

Three levels and no more, all made with a border and a hard offset:

1. Flat: sections, text, and any block inside a list (`border-2`, no
   shadow). Most of the page.
2. Lifted: a block that is an object (the hero, a ticket, one framed
   visual, every button): `border-2 border-line` plus `shadow-hard` (6px,
   no blur, the line colour). `shadow-lift` (4px) is the same idea at a
   smaller size for an image or a small card.
3. Overlay: a menu or dialog, `bg-surface`, `border-2 border-line`,
   `shadow-hard`, no radius.

No soft shadows, no inner shadows, no glass or blur, no gradients anywhere,
no radius anywhere.

## Motion

Only the button press moves. On hover a button translates 2px right and
down and its shadow shrinks from 6px to 4px; on active it translates 6px and
the shadow goes, so the button lands flat on the page. Duration 150ms,
`ease-soft`, on `translate` and `box-shadow` (`transition-all duration-150
ease-soft`). Nothing animates on load, nothing follows the scroll, nothing
marquees, and the finished composition is always visible without motion.
`prefers-reduced-motion` turns every transition off (already in
`styles/input.css`): the button then changes state without moving.

## Responsive Behavior

Mobile and desktop are two compositions of the same content, not one page
that collapses. Type sizes are fluid, so headings need no mobile overrides;
the h1 at 48px upper-case wraps to four or five lines on a phone, which is
the poster look, not a fault.

- Below `lg` (1024px) the hero's lede and actions stack; the giant word
  strip keeps its frame. The ticket's stub moves under the body with a
  dashed `border-t-2`.
- Stacked strips stay strips; below `sm` the index sits above the slot
  instead of beside it. The numbered grid goes 4 to 2 to 1 columns.
- Touch targets are at least 44px; buttons are 48px plus their shadow.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word in upper-case at 900: it must wrap, not
  overflow the block.

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the accent ring, 2px
with a 3px offset, which reads against the black borders), useful alt text,
and no information carried by colour alone. Upper-case headings keep normal
capitalisation in the markup so screen readers read words, not letters.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page: the hero block with its giant word.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body, measure under 70 characters,
  contrast as in the table above, sentence case for anything longer than a
  heading.
- Keep every edge 2px and black, every corner square, every shadow hard.

Don't:

- A centered hero over an abstract glow, then a logo strip, three feature
  cards, testimonials, pricing, FAQ, and a final call to action, whatever
  the content.
- Icons in coloured circles as the default visual language.
- Fake proof: invented customers, quotes, counts, awards, or prices.
- Gradients, blur, glass, or glow to make up for a weak idea.
- Grey-on-grey body text, tiny labels, or missing focus states.
- Hex values, Tailwind default colours, `tracking-*`, `leading-*`,
  `font-bold`, gradients, blur, glass, or `animate-*` in page markup
  (`npm run check` refuses each of these).
- A page that could belong to a different business after swapping the logo.
- An Identity block still reading "to fill" on a page presented as done.
- Acid green on black: the 2026 tell. The accent is blue or hot orange, not a
  neon.
- Soft shadows of any kind; a shadow here is an offset in the line colour.
- Rounded corners anywhere, including inputs, images, and the focus ring.
- A marquee, a ticker, or anything that scrolls by itself.
- Text set over other text, or the giant word behind a heading.
- Grey type as a hierarchy device: `text-ink-3` is for mono labels only.
- Lowercase-everything as a gimmick; headings are upper-case, copy is
  sentence case.
- Illegible overlap: nothing crosses a border, a heading, or a photo.
- Purple, indigo, or violet accents; blue-to-purple gradients; gradient
  text; coloured glows; glass or backdrop blur; glow blobs behind a hero.
- A palette that is only tints of one hue with no accent.
- Inter, Roboto, Arial, Poppins, Space Grotesk, Instrument Serif, Geist,
  DM Serif, or Playfair as reflex choices (a brand that owns one may keep it).
- A centred hero with a badge above the h1 and a "Get Started" button; three
  equal cards with an icon on top; a bento grid; emoji as bullets; a
  "Trusted by" logo strip with no real logos; stat rows of unverifiable
  numbers; testimonial grids with generated faces; a terminal mockup with
  three dots; a fake dashboard.
- The same padding on every section; every heading centred; fade-up on
  every section; "Built with ❤️".
- Text under 4.5:1; text over an image without a checked scrim; stripped
  focus rings; placeholder as the only label; skipped heading levels; "Learn
  more" or "Click here" links; targets under 44px; animation without a
  reduced-motion state.

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page), `bg-surface` (a bordered block), `bg-panel`
  (band, or a cell inside a block), `bg-night` (dark band and footer),
  `bg-line` (behind a `gap-0.5` grid so the gaps become thick dividers).
- Text: `text-ink`, `text-ink-2`, `text-ink-3` (mono labels only); on night
  `text-night-ink`, `text-night-ink-2`.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover` with `border-2
  border-line shadow-hard` and the hover and active translate; or the
  `Button` component.
- Sizes: `text-display` (h1, upper-case, `font-stretch-expanded`),
  `text-section` (h2, upper-case; also the big mono index), `text-title`
  (h3), `text-lede`, `text-label` (always `font-mono uppercase`),
  `text-specimen` (the one giant word); body needs no class.
- Faces: `font-display`, `font-mono`; body is the default.
- Edges: every edge is `border-2 border-line` (`border-line-strong` is the
  same black); on night `border-line-on-night`; `divide-y-2 divide-line` in a
  stacked list; `border-dashed` on a ticket stub. `rounded-*` tokens are all
  zero, so leave them off.
- Depth: `shadow-hard` (blocks and buttons), `shadow-hard-sm` (a button on
  hover), `shadow-hard-on-night` (a button on night), `shadow-lift` (a small
  card or image), `shadow-none` (a pressed button).
- Rhythm: `py-section`, `mt-block`, `max-w-content`, `max-w-wide`.
- Compositions: hero = one heavy block (strip, h1 to the edge, lede and
  actions, giant word frame); work = stacked strips with an index; process =
  numbered grid on `bg-line`; statement = night band with an accent bar;
  contact = ticket with a dashed stub.

Before a new page or a redesign: read `.claude/skills/design/SKILL.md` and
`.claude/skills/writing/SKILL.md`, write the brief and the voice card
(`brand/voice.md`), explore three directions, pick one, fill the Identity
block above, then build. After: `npm run check`, render at 390px and
1280px, and run the review gate in the design skill.

## Updating from the brand

`brand/` holds the brand as markdown notes (`BRAND.md`): the starter set,
or a Company Brain's cited notes mirrored in. When those notes change, or
on the first real build, set the site from them in this order and say what
changed:

1. Read `brand/visual-identity.md`, `positioning.md`, `voice.md`,
   `audience.md`, `do-and-dont.md`, and anything else in the folder.
2. `styles/theme.css`: copy the colours into the brand block as hex, name
   the font families, then assign roles. In this style the brand's dark
   becomes `--color-night`, `--color-ink`, and both line tokens at once
   (the ink and the lines are the same black; if the brand's dark is not
   near-black, keep #0a0a0a for the lines and the ink and use the brand's
   dark for night only). The brand's light becomes `--color-canvas` if it is
   off-white, otherwise the canvas stays #fafaf7 and the brand's light is
   `--color-panel`. The brand's primary becomes `--color-accent` if it
   reaches 4.5:1 on the canvas and under white or black `accent-ink`;
   otherwise a darker shade of it does, and if the primary is purple or
   neon green the accent is the brutalist blue or orange instead, and the
   brand colour goes on the night band's bar only. A brand with a heavy
   sans of its own uses it as `--font-display`; the mono face stays unless
   the brand names one. Run `npm run check`; a pair under 4.5:1 means the
   role gets a different value, not a squint.
3. `src/site.ts`: name, tagline, description, locale, contact, social, the
   logo file in `brand/logo/`, the fonts' Google Fonts URL.
4. This file: the palette table values, the type families, the Identity
   block from the brief, and any rule the do-and-don't adds or removes.
5. The pages, through the `design` and `writing` skills, with `voice.md`
   as the voice card. Render at 390px and 1280px.

When `brand/_mirror.md` exists the notes belong to the Company Brain: a
brand fact is changed there, then re-applied here with the same steps.
