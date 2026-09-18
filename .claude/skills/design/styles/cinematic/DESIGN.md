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

Name: cinematic
Thesis: A near-black page, warm light type, one oversized wide heading, one wide frame for the photo, and one amber for every action, so the page reads like a title card and the work reads like the film.
Best for: businesses whose photography or product is the point: joiners, architects, photographers, studios, restaurants, venues, film and audio work, a single launch page.
Not for: dense information sites, shops with long lists, anything read for hours (a dark ground tires the eye), or a business with no real photos yet and no plan to get them (the frames stay empty).
Signature: On load the hero's lines rise 24px and fade in over 800ms, one after another, 60ms apart. Nothing else on the page moves.
References: A24's film pages, ElevenLabs' product pages, Runway's research pages.
Fonts: Syne for headings, Manrope for reading

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

A dark room with one light on. The ground is near-black with a little cool
in it, never pure black except the footer and one band, which go darker
still. The type is warm light, like paper under a lamp, and the headings
are set in a wide, heavy face at a size that fills the width. One amber
does every action and appears nowhere else, so it is always the brightest
thing in view. Photographs carry the colour; the frames that hold them are
a shade lighter than the page, so an empty frame still reads as a window.
Sections change shape every time: a stacked hero over a wide frame, a
filmstrip, a numbered list, a statement, a split. The page is still. The
only motion is the hero's text arriving on load.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep
the principles unless the brief says otherwise: a dark canvas with a warm
light ink, one amber-class accent, one enormous heading per page, real
photos in wide frames, and one reveal.

## Color Palette & Roles

Two layers in `styles/theme.css`. **Brand colours** (`--brand-primary`,
`--brand-dark`, `--brand-light`, `--brand-neutral`, plus any named extras)
are what the business owns, copied from `brand/visual-identity.md`. **Role
tokens** say what each is *for*, and are the only colours markup may use
(as `bg-*`, `text-*`, `border-*`, `divide-*`). The Tailwind default palette
is switched off, so `bg-blue-500` does not exist here; add a brand colour
and give it a role instead. Contrast is measured against the ground named.

This style is dark-first, so the roles invert while the names stay: the
canvas is dark, the ink is light, surface and panel are lighter steps up
from the canvas (not darker steps down), and night is a second dark that
is darker than the canvas.

| Token | Value | Role |
|---|---|---|
| `--color-canvas` | brand dark, #0e0e10 | The page ground: near-black with a little cool. Most sections sit on it. |
| `--color-surface` | #17171a | A raised panel or a photo frame on the canvas, one step lighter. On the panel ground it sits a step darker, which is right for a frame. |
| `--color-panel` | #1d1d21 | A tinted band, one step lighter than the canvas. At most two per page, never adjacent. |
| `--color-night` | #050506 | The deepest ground: the footer, and at most one statement band. Never a card. |
| `--color-ink` | brand light, #f3efe6 | Headings and body on canvas, surface, and panel (16.8:1 on canvas, 14.6:1 on panel). Warm, not white. |
| `--color-ink-2` | brand neutral, #c9c3b6 | Secondary text and captions; must reach 4.5:1 on canvas and panel (11.0:1 and 9.6:1). |
| `--color-ink-3` | #a9a396 | Labels, metadata, the big numerals (7.7:1 on canvas, 6.7:1 on panel, 7.1:1 on surface). Never a border. |
| `--color-night-ink` | brand light, #f3efe6 | Text on night; must reach 4.5:1 on night (17.8:1). |
| `--color-night-ink-2` | #bdb7aa | Secondary text on night (10.2:1). |
| `--color-accent` | brand primary, #f5b942 | The one action colour: primary buttons, links in body copy, the focus ring. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (10.9:1 and 10.4:1). |
| `--color-accent-ink` | #141414 | Text on the accent: dark, because the accent is light. |
| `--color-accent-hover` | accent mixed 20% toward white | The accent's hover and active state: lighter, not darker, on a dark page. |
| `--color-line` | light ink at 14% | Every hairline: rules, frame edges, the filmstrip's rails. |
| `--color-line-strong` | light ink at 32% | Input edges, table frames, a secondary button's edge. |
| `--color-line-on-night` | night-ink at 16% | Hairlines inside a night surface. |

Rules:

- The accent appears on actions and on nothing else. Not on headings, not
  on numerals, not on icons, not as a glow, not as a section ground. It is
  the one bright thing in any viewport; if two things are bright, one of
  them is wrong.
- The accent is a deliberate high-contrast pair with the brand's dark
  (amber on near-black), not a hue relation: the dominant brand colour here
  is a neutral, so the accent's job is to be the only saturated colour on
  the page. Never purple, indigo, or violet.
- Text meets 4.5:1 against its ground; focus rings and input edges meet
  3:1. `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. The common dark-page failure is grey body text:
  `ink-2` and `ink-3` are warm and light for that reason. A brand's primary
  that fails as text on the canvas is lightened until it passes, not used
  dark; a brand's neutral that is too dark for `ink-2` gets a lighter role
  value. The brand's colours stay what they are; the roles bend.
- Photographs, product shots, and the brand's own artwork carry colour. The
  interface around them stays in the palette above. Text never sits over a
  photo without a checked scrim of the canvas at 70% or more.
- Lines are the light ink at an opacity, never a solid grey, so a rule on
  the panel and a rule on the canvas look the same.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

Two families: a display face for headings and a text face for reading,
named in `styles/theme.css` (`--font-display`, `--font-body`) from
`brand/visual-identity.md`, and loaded by the URL in `src/site.ts`
(`fonts.googleFontsUrl`) or self-hosted in `static/fonts/`. Here the
display face is Syne (700 and 800), wide and heavy, used at a few large
sizes and nowhere small; the body face is Manrope (400 and 600). There is
no mono face: labels are Manrope 600, upper-case, tracked wide.

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 48 to 120px, fluid | 0.92 | -0.02em | 800 | The h1 of the home page or a landing page, and the statement band's one sentence. 12 to 16 characters per line. The only place weight 800 appears. |
| `text-section` | 36 to 60px, fluid | 1.0 | -0.015em | 700 | Every other h2, wrapped at `max-w-[12ch]`. |
| `text-title` | 24 to 32px, fluid | 1.1 | -0.01em | 700 | The h3 of a row or a panel; the frame number inside a photo slot. |
| `text-lede` | 18 to 22px, fluid | 1.5 | 0 | 400 | The supporting thought under a heading, `max-w-xl`, in `text-ink-2`; the hours in the contact panel, in `text-ink`. |
| `text-copy` | 18px | 1.6 | 0 | 400 | Body copy (the body default). Measure under 70 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 600 | Interface text: nav, buttons, captions under images. |
| `text-label` | 13px | 1.4 | +0.12em | 600 | The one small label style, upper-case, for an eyebrow, a photo slot's label, or metadata. Nothing renders smaller. |
| `text-specimen` | 96 to 176px, fluid | 1.0 | -0.02em | 800 | One giant glyph or word inside a visual (`role="img"`). Never for a heading. |

Rules:

- Headings use `font-display`; everything else uses the body face (the
  default). Weight 800 belongs to `text-display` alone; other headings are
  700; body copy is always 400; controls and labels are 600. Never
  `font-bold` in markup: the size token carries the weight.
- Syne is wide. Set the measure short: `max-w-[14ch]` on the h1,
  `max-w-[12ch]` on an h2, `max-w-[18ch]` on the band's sentence, and let
  the words wrap. Long words wrap; nothing truncates.
- Big numerals (a numbered list) are `font-display text-display text-ink-3`:
  huge, quiet, never in the accent.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them)
  even when the band's h2 is set larger than the section h2s.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both.

## Component Stylings

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-5`,
`rounded-control` (4px, near-square), 16px semibold. Primary is
`bg-accent text-accent-ink`, hover `bg-accent-hover` (lighter). Secondary is
a `border-line-strong` outline with a `bg-panel` hover. One primary per
section, and the primary is the only amber in that section. The label says
what happens next: "Book a workshop visit", "Ask us about yours", never
"Learn more".

**Links in copy**: underlined, 1px, offset; inherit the text colour; on
hover the underline stays. Nav links are `text-ink-2`, not underlined,
`text-ink` on hover, with `aria-current="page"` on the current page.

**Photo frames**: the style's main object. `bg-surface border border-line`,
`rounded-frame` for the hero's wide frame (`aspect-[21/9]` from `sm`,
`aspect-[4/3]` below) and `rounded-card` for the filmstrip's frames
(`aspect-video`). A real photo goes in with `object-cover`; until then the
frame holds a `text-label` saying what the photo will be, bottom-left, and
a `text-title` frame number top-left. The hero frame carries `shadow-lift`;
frames in a strip do not.

**Filmstrip**: a `ul` ruled above and below (`border-y border-line`), three
frames in a row from `sm` (`grid grid-cols-3 gap-6`), a horizontal
scroll-snap strip below it (`flex overflow-x-auto`, each frame `w-[78vw]`
so the next one shows at the edge). Captions sit under each frame in
`text-ink-2`, 16px, no card around them.

**Cards**: only for discrete, comparable objects (a service, a person, a
plan) and the contact panel. `rounded-card`, `border-line`, `bg-surface`;
on night, `border-line-on-night` with no fill. Never a card around a single
paragraph of body copy.

**Inputs**: 48px tall, `rounded-control`, `border-line-strong`, the canvas
as ground, label above in 16px semibold, help text in `text-ink-3`. Error
text is a diagnosis plus a recovery in `text-ink`, next to the field.

**Sections** (`Section`): `py-section` vertical padding; `max-w-content`
(72rem) for reading sections, `max-w-wide` (84rem) for the hero, the
filmstrip, and the band; horizontal padding `px-5 sm:px-8`. Grounds:
canvas, panel, night.

**Lists of rows**: `divide-y divide-line border-y border-line`, `py-10`; a
huge numeral on the left (`text-display text-ink-3`), a title and one
sentence on the right, both bottom-aligned to the numeral from `sm`.
Prefer rows over three-cards-in-a-grid.

**Images**: `rounded-card` or `rounded-frame`, real alt text, `object-cover`,
sized by the grid, never stretched. A hero image is either full-bleed or in
the wide frame, not both.

## Layout Principles

- The base unit is 4px. Section padding is `py-section` (96 to 160px), more
  than a light page needs, so the one bright thing has dark around it. The
  statement band takes more still (`lg:py-48`). Heading group to what it
  introduces is `mt-block` (40 to 56px). Inside a heading group: heading to
  lede `mt-8`, lede to actions `mt-10`.
- The hero is the peak and it is stacked, not split: eyebrow, the h1 at
  full width, the wide frame, then the lede and actions in the right-hand
  half of a two-column grid (`lg:col-start-2`) so the text sits under the
  frame like a caption, not beside it.
- Compose from the content, and give each job its own shape: work as a
  filmstrip, a process as a numbered list, a belief as a statement band, a
  visit as a split with the practical facts in a panel.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground. The page runs canvas, panel, canvas, night,
  canvas, then the night footer.
- Prefer document flow. Absolute positioning is for one deliberate layer,
  never the skeleton.

## Depth & Elevation

Three levels and no more, and on a dark page depth is a step in lightness
before it is a shadow:

1. Flat: sections, rows, text, filmstrip frames. Most of the page.
2. Lifted: the hero frame and the contact panel, `bg-surface border-line`
   plus `shadow-lift`, which is a 1px rim of the light ink at 8% and a deep
   black drop (`0 32px 64px -32px rgb(0 0 0 / 0.9)`). Two per page at most.
3. Overlay: a menu or dialog, `bg-surface`, `shadow-lift`, `rounded-card`.

No inner shadows, no coloured shadows, no glow, no glass or blur, no
gradients on interface elements. Radii are small (4, 6, 8px): a frame, not
a pebble.

## Motion

One choreographed reveal on load and nothing else. The hero's lines
(eyebrow, h1, lede, actions) start 24px lower and transparent and rise into
place over 800ms with `cubic-bezier(0.2, 0, 0, 1)` (`--ease-soft`),
staggered 60ms per line, written as plain CSS in the page's `<style>` with
`animation-fill-mode: both`. The frame between them stays still. Hover and
focus transitions are 150ms with `ease-soft`. Nothing follows the scroll,
nothing loops, and the finished composition is the CSS default, so a page
without the animation looks the same as one after it. `prefers-reduced-
motion: reduce` turns the reveal off entirely (the page's own rule and the
global one in `styles/input.css`): the hero is simply there.

## Responsive Behavior

Mobile and desktop are two compositions of the same content, not one page
that collapses. Type sizes are fluid, so headings need no mobile overrides.

- The hero stays stacked at every width; the frame changes shape
  (`aspect-[4/3]` below `sm`, `aspect-[21/9]` from it) so it is never a
  thin sliver on a phone.
- The filmstrip is a three-across grid from `sm` and a horizontal
  scroll-snap strip below it, with the next frame showing at the edge.
- Below `lg` (1024px) a split becomes a stack with the text first.
- Rows stay rows; the numeral goes above the title below `sm`.
- Touch targets are at least 44px; buttons are 48px.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word in the h1: Syne is wide and a 16-letter word
  at 120px needs the full container.

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the amber ring, 2px,
offset 3px, visible on every ground), useful alt text, and no information
carried by colour alone.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page: the h1 and its frame.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body, measure under 70 characters,
  contrast as in the table above.
- Fill the frames with real photographs as soon as they exist; the empty
  frame is honest, not decorative.

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
- Purple or blue glows behind anything; a coloured box shadow of any kind.
- Gradient text, glass, or backdrop blur: a dark page invites them and this
  style refuses them.
- Grey body text under 4.5:1, the most common dark-mode failure: `ink-2` is
  the darkest text allowed for a sentence.
- A second bright colour anywhere: the accent is alone.
- Motion on scroll, motion on every section, or a second animation on load.
- Text over a photo without a scrim checked at 4.5:1.
- Purple, indigo, or violet accents; blue-to-purple gradients; glow blobs
  behind a hero.
- A palette that is only tints of one hue with no accent.
- Inter, Roboto, Arial, Poppins, Space Grotesk, Instrument Serif, Geist,
  DM Serif, or Playfair as reflex choices (a brand that owns one may keep
  it).
- A centred hero with a badge above the h1 and a "Get Started" button;
  three equal cards with an icon on top; a bento grid; emoji as bullets; a
  "Trusted by" strip with no real logos; stat rows of unverifiable numbers;
  testimonial grids with generated faces; a terminal mockup with three
  dots; a fake dashboard.
- The same padding on every section; every heading centred; fade-up on
  every section; "Built with love" in the footer.
- Stripped focus rings; a placeholder as the only label; skipped heading
  levels; "Learn more" or "Click here" links; targets under 44px; an
  animation without a reduced-motion state.

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page, dark), `bg-surface` (frame or panel, a step
  lighter), `bg-panel` (band, lighter still), `bg-night` (darkest: the
  statement band and footer).
- Text: `text-ink`, `text-ink-2`, `text-ink-3`; on night `text-night-ink`,
  `text-night-ink-2`. All warm light; none under 4.5:1 on any ground.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover`; or the
  `Button` component. The accent is the only amber on the page.
- Sizes: `text-display` (h1 and the band's sentence, weight 800),
  `text-section` (h2), `text-title` (h3, frame numbers), `text-lede`,
  `text-label` (upper-case, wide tracked); body needs no class.
- Edges: `rounded-control` (buttons, inputs), `rounded-card` (strip
  frames, panels), `rounded-frame` (the hero frame); `border-line`,
  `border-line-strong`, on night `border-line-on-night`; `shadow-lift` on
  the hero frame and the contact panel only.
- Rhythm: `py-section`, `mt-block`, `max-w-content`, `max-w-wide`.
- Compositions: hero = eyebrow, h1 at `max-w-[14ch]`, wide frame, lede and
  actions in the right column; work = a ruled filmstrip with captions
  beneath; process = a ruled list with `text-display text-ink-3` numerals;
  belief = a night band with the sentence in `text-display`; contact = a
  split with the facts in a `bg-surface` panel.
- The reveal: `.rise` classes with the `@keyframes rise` block in the
  page's `<style>`, on the hero's lines only, with the reduced-motion rule.

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
   the two font families, then assign roles the cinematic way. The brand's
   dark becomes `--color-canvas` if it is dark enough for the light ink to
   reach 12:1 on it (a navy or a deep green works; a mid grey does not, and
   the canvas stays near-black instead); `--color-night` is a darker mix of
   the same hue; `--color-surface` and `--color-panel` are the canvas mixed
   6% and 10% toward the light. The brand's light becomes `--color-ink` and
   `--color-night-ink` if it is light enough (12:1 on canvas), otherwise the
   warm off-white stays. The brand's primary becomes `--color-accent` if it
   reaches 4.5:1 on the canvas as text and is not purple, indigo, or violet;
   otherwise a lighter tint of it does, with `--color-accent-ink` switching
   to the light ink when the accent goes dark enough for that to pass. The
   brand's neutral becomes `--color-ink-2` only if it reaches 4.5:1 on the
   canvas and the panel, otherwise a lighter tint of it does. Run
   `npm run check`; a pair under 4.5:1 means the role gets a different
   value, not a squint.
3. `src/site.ts`: name, tagline, description, locale, contact, social, the
   logo file in `brand/logo/`, the fonts' Google Fonts URL.
4. This file: the palette table values, the type families, the Identity
   block from the brief, and any rule the do-and-don't adds or removes.
5. The pages, through the `design` and `writing` skills, with `voice.md`
   as the voice card. Render at 390px and 1280px.

When `brand/_mirror.md` exists the notes belong to the Company Brain: a
brand fact is changed there, then re-applied here with the same steps.
