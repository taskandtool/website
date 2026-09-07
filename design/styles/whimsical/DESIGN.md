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

Name: whimsical
Thesis: Playful, rounded and coloured, but grown-up and readable: pill buttons, big rounded frames, a few content tints on shapes and stickers only, one tilted sticker, generous air, and a hand-drawn underline under the headline.
Best for: food and drink, children's and family services, pet businesses, craft and makers, small friendly shops, a studio or workshop that wants to feel warm, a product with personality.
Not for: law, finance, medicine, engineering or anything where the visitor needs gravity first; luxury brands (the tints read as cheerful, not rare); dense catalogues where the frames and air would push content too far down.
Signature: a hand-drawn squiggle underline under one or two words of the h1, and one tilted white sticker label on the hero frame.
References: Mailchimp's 2018 rebrand, Oatly's packaging and site, Duolingo's marketing site.
Fonts: Fredoka for headings, Nunito Sans for reading

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

A warm, cheerful page that stays easy to read. The ground is warm milk, the
text is dark cocoa, and one deep teal does every action. Colour lives in
four content tints (sun, sky, mint, rose) that appear only on shapes: a big
rounded frame, a numbered chip, a corner circle, a sticker. They never touch
text or buttons, so the page reads as friendly rather than loud. Everything
that can be rounded is rounded: buttons are pills, frames have 2rem corners,
captions sit on white pills. Type is Fredoka, a rounded display face, over
Nunito Sans, which is soft but built for reading at 18px. Space is generous;
the page breathes between sections, and each section has its own shape.

Grown-up is the word to hold on to. The tints and the sticker are the smile;
the measure, the contrast, the plain copy and the honest photo slots are the
handshake. When in doubt, take a tint away rather than add one.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep
the principles unless the brief says otherwise: warm light ground, dark cocoa
ink, one teal-family accent, tints on shapes only, pills and big radii, one
tilted thing per page.

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
| `--color-canvas` | brand light, #fff8ee | The page ground: warm milk. Most sections sit on it. |
| `--color-surface` | #ffffff | A raised card, a caption pill, the sticker, a framed visual on the canvas. |
| `--color-panel` | #ffeedd | One step down: a pale apricot band or a wide rounded panel. At most two per page, never adjacent. |
| `--color-night` | brand dark, #2a1f1a | The dark ground: the footer, and at most one statement band. Never a card. |
| `--color-ink` | #2a1f1a | Headings and body on light grounds (15.2:1 on canvas). The only text colour allowed on a pop tint. |
| `--color-ink-2` | brand neutral, #5b4a42 | Secondary text on light grounds; must reach 4.5:1 on canvas and panel (8.0:1 and 7.4:1). |
| `--color-ink-3` | #6d5c54 | Captions, labels, metadata on light grounds (6.0:1 on canvas, 5.6:1 on panel). Never on a pop tint, never a border. |
| `--color-night-ink` | brand light, #fff8ee | Text on night; must reach 4.5:1 on night (15.2:1). |
| `--color-night-ink-2` | #d9c9bf | Secondary text on night (10.0:1). |
| `--color-accent` | brand primary, #0f766e | The one action colour: primary buttons, links in body copy, the focus ring. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (5.2:1 and 5.5:1). Deep teal: 145 degrees of hue from the warm milk and cocoa, so it is the cool thing on a warm page. |
| `--color-accent-ink` | #ffffff | Text on the accent (5.5:1). |
| `--color-accent-hover` | accent mixed 15% toward black | The accent's hover and active state. |
| `--color-pop-sun` | #ffd166 | Content tint, sun yellow: the hero frame, a chip. Shapes only; `text-ink` on it (11.1:1). |
| `--color-pop-sky` | #8ecae6 | Content tint, sky blue: a photo slot, a chip. Shapes only; `text-ink` on it (9.0:1). |
| `--color-pop-mint` | #b7e4c7 | Content tint, mint: a photo slot, a chip. Shapes only; `text-ink` on it (11.4:1). |
| `--color-pop-rose` | #ffb4a2 | Content tint, rose: a photo slot, a chip, a corner circle. Shapes only; `text-ink` on it (9.4:1). |
| `--color-line` | ink at 14% | Every hairline on light grounds: rules, card edges, dividers. |
| `--color-line-strong` | ink at 32% | Input edges, a secondary button's edge. |
| `--color-line-on-night` | night-ink at 16% | Hairlines inside a night surface. |

Rules:

- The accent appears on actions and on nothing else. Not on headings, not on
  the squiggle, not on chips, not as a section ground.
- The four pop tints are for shapes: frames, chips, stickers, circles, photo
  slots. Never text, never a button, never a link, never a section ground,
  never a border. A caption that sits on a tint is `text-ink` (the ratios in
  the table); `text-ink-2` and `text-ink-3` do not reach 4.5:1 on sky or
  rose, so they stay off tints. Use at most three tints in one section and
  give neighbouring shapes different tints.
- Text meets 4.5:1 against its ground; focus rings and input edges meet 3:1.
  `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. A brand's primary that fails as text on the
  canvas becomes a ground with its own ink token instead; a brand's
  neutral that is too light gets a darker role value. The brand's colours
  stay what they are; the roles bend.
- Photographs, product shots, and the brand's own artwork carry colour. A
  photo replaces a tinted slot; it does not sit on one.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

Two families: Fredoka (500 and 600) for headings, chips and the sticker, and
Nunito Sans (400 and 600, the optical size axis) for reading, named in
`styles/theme.css` (`--font-display`, `--font-body`) and loaded by the URL
in `src/site.ts` (`fonts.googleFontsUrl`) or self-hosted in `static/fonts/`.
Fredoka is round and wide, so headings run slightly smaller than in a
grotesque system and the tracking stays near zero; tightening it makes the
round letters collide.

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 44 to 88px, fluid | 1.0 | -0.01em | 600 | The h1 of the home page or a landing page. One per page. 10 to 12 characters per line. Carries the squiggle on one or two words. |
| `text-section` | 32 to 52px, fluid | 1.05 | -0.01em | 600 | Every h2, and the one-sentence statement in the night band. Beside a visual, wrap at `max-w-[10ch]` to `max-w-[14ch]`. |
| `text-title` | 22 to 28px, fluid | 1.15 | 0 | 500 | The h3 of a row, the numeral in a chip, the sticker label. |
| `text-lede` | 18 to 22px, fluid | 1.55 | 0 | 400 | The supporting thought under a heading, `max-w-xl`, in `text-ink-2`. |
| `text-copy` | 18px | 1.65 | 0 | 400 | Body copy (the body default). Measure under 70 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 600 | Interface text: nav, buttons, captions on pills. |
| `text-label` | 13px | 1.4 | +0.06em | 600 | The one small label style, upper-case, for an eyebrow or metadata. Nothing renders smaller. |
| `text-specimen` | 96 to 176px, fluid | 1.0 | -0.02em | 600 | One giant glyph or word inside a tinted frame (`role="img"`). Never for a heading. |

Rules:

- Headings use `font-display`; everything else uses the body face (the
  default). A heading never goes above weight 600 and body copy is always
  400. Fredoka 500 is for titles and chips, 600 for the h1 and h2s.
- Set measure with `max-w-[Nch]` on headings and `max-w-prose` or `max-w-xl`
  on paragraphs. Long words wrap; nothing truncates.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them) even
  when the visual scale breaks convention. The sticker and the chip numerals
  are decoration (`aria-hidden`), not headings.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both.
- Copy stays plain and adult. The style is playful; the sentences are not.

## Component Stylings

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-5`,
`rounded-control` (a pill), 16px semibold. Primary is `bg-accent
text-accent-ink`, hover `bg-accent-hover`, and the button lifts 2px on hover
(`transform: translateY(-2px)`, 150ms, `ease-soft`). Secondary is a
`border-line-strong` pill on the canvas with a `bg-panel` hover and the same
lift. One primary per section. The label says what happens next: "Book a
workshop visit", "See recent kitchens", never "Learn more".

**Links in copy**: underlined, 1px, offset; inherit the text colour; on hover
the underline stays. Nav links are `text-ink-2`, not underlined, `text-ink`
on hover, with `aria-current="page"` on the current page.

**Frames**: the style's main object. `rounded-frame` (2rem), a pop tint as
ground, `p-8 sm:p-10`, `overflow-hidden`. A frame holds a huge glyph
(`text-specimen`), a photo, or a photo slot with its caption on a white pill
(`absolute bottom-5 left-5 rounded-control bg-surface px-4 py-2
text-base font-semibold text-ink`). A corner circle
(`absolute -right-8 -bottom-8 h-32 w-32 rounded-control bg-pop-rose`) may
peek in from one corner of one frame per page.

**Stickers**: one per page. A white pill (`rounded-control bg-surface px-5
py-2 font-display text-title text-ink shadow-lift`), tilted `-rotate-4`,
placed on the edge of a frame with `absolute -top-5 right-6`. It is
`aria-hidden` and says one word. No second rotated element in the same
section; no rotated text anywhere else.

**Chips**: a numbered step or a small category marker. `h-14 w-14
rounded-control` on a pop tint, `font-display text-title text-ink`, centred.
Four steps get four tints in the order sun, sky, mint, rose.

**Cards**: only for discrete, comparable objects (a service, a person, a
plan). `rounded-card` (1.5rem), `border-line`, `bg-surface` on the canvas or
panel; on night, `border-line-on-night` with no fill. Never a card around a
single paragraph, and never a tint as a card ground.

**Inputs**: 48px tall, `rounded-control`, `border-line-strong`, the canvas
as ground, `px-5`, label above in 16px semibold, help text in `text-ink-3`.
Error text is a diagnosis plus a recovery in `text-ink`, next to the field.

**Sections** (`Section`): `py-section` vertical padding; `max-w-content`
(72rem) for reading sections, `max-w-wide` (80rem) for the hero, the frames
and the contact panel; horizontal padding `px-5 sm:px-8`. Grounds: canvas,
panel, night.

**Lists of rows**: `divide-y divide-line border-y border-line` with `py-8`;
a chip on the left (`sm:grid-cols-[4.5rem_1fr]`), a title and one sentence
on the right. Rows, not cards, for a process or a list of services.

**Contact panel**: a wide `rounded-frame bg-panel` block inside a canvas
section, `px-8 py-12 sm:px-12 lg:px-16 lg:py-16`, the h2 on the left and the
text plus one primary button on the right (`lg:grid-cols-2`).

**Images**: `rounded-frame` in a tinted frame or `rounded-card` alone, real
alt text, `object-cover`, sized by the grid, never stretched. A photo takes
the place of the tint; it never sits on top of one.

## Layout Principles

- The base unit is 4px. Section padding is `py-section` (88 to 144px, more
  air than the template). Heading group to what it introduces is `mt-block`
  (48 to 64px). Inside a heading group: heading to lede `mt-8`, lede to
  actions `mt-10`.
- The hero is left-aligned: eyebrow, h1 with the squiggle, lede, two pill
  buttons on the left; a tinted frame with the sticker on the right
  (`lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`). Never centred, never
  a badge above the h1.
- Compose from the content, and give each job its own shape: a set of
  comparable things is a big-one-plus-two of frames
  (`lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]`, the first spanning two
  rows); a sequence is chip rows beside a sticky h2; a change of thought is
  the night band with one sentence and one pill; contact is the wide
  rounded panel.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground. Canvas, panel, canvas, night, canvas is the
  default run.
- One section is the peak: the hero frame with the sticker. Everything else
  is quieter; the frames in the work section are bigger but flatter.
- Prefer document flow. Absolute positioning is for the sticker, the
  caption pill, and the corner circle, never the skeleton.

## Depth & Elevation

Three levels and no more:

1. Flat: sections, rows, tinted frames, chips, the contact panel. Most of
   the page. Tints give shapes presence without any shadow.
2. Lifted: the sticker, and a card or framed visual that should feel like
   an object: `shadow-lift` (a soft, warm, slightly brown shadow with a
   2px solid base so it reads as a paper cut-out, not a glow). At most two
   lifted things in view at once.
3. Overlay: a menu or dialog, `bg-surface`, `shadow-lift`, `rounded-card`.

No inner shadows, no hard offset shadows, no glass or blur, no gradients on
interface elements, no coloured glows.

## Motion

Buttons lift 2px on hover and return on leave: `transform` and
`background-color`, 150ms, `ease-soft`. Focus shows the accent ring with no
motion. Nothing animates on load, nothing follows the scroll, the sticker
does not wobble, and the finished composition is always visible without
motion. `prefers-reduced-motion` turns every transition and animation off
(already in `styles/input.css`; any page-level `<style>` repeats the rule).

## Responsive Behavior

Mobile and desktop are two compositions of the same content, not one page
that collapses. Type sizes are fluid, so headings need no mobile overrides.

- Below `lg` (1024px) the hero stacks with the text first and the frame
  under it; the sticker stays on the frame's top edge. The big-one-plus-two
  becomes a single column of frames at `aspect-4/3` and `aspect-3/2`.
- Chip rows stay rows: below `sm` the chip sits above the title.
- The night band stacks the sentence over the pill; the contact panel
  stacks the h2 over the text and button, with `px-8 py-12`.
- Touch targets are at least 44px; buttons and chips are 48px and 56px.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word under the squiggle and a long caption on a
  pill (the pill wraps; it does not overflow the frame).

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the accent ring),
useful alt text, decoration (`aria-hidden`) on the squiggle, the sticker,
the circle and the chip numerals, and no information carried by colour
alone.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page: the squiggle and the sticker.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body, measure under 70 characters,
  contrast as in the table above.
- Put tints on shapes and keep text cocoa.

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
- Emoji anywhere: not in headings, not as bullets, not in buttons.
- Clip art or undraw-style illustration; a real photo or an honest tinted
  slot instead.
- Rainbow gradients, or more than three tints in one section.
- A pop tint as text, as a link, as a button, or as a section ground.
- Body type below 18px, or a label below 13px.
- More than one rotated element per section, or rotated body text.
- Childish copy: no exclamation marks in headings, no puns in buttons, no
  "yay".
- Purple, indigo or violet accents; blue-to-purple gradients; gradient
  text; coloured glows; glass and backdrop blur; glow blobs behind a hero.
- A palette that is only tints of one hue with no accent.
- Inter, Roboto, Arial, Poppins, Space Grotesk, Instrument Serif, Geist, DM
  Serif or Playfair as reflex choices (a brand that owns one may keep it).
- A centred hero with a badge above the h1 and a "Get Started" button;
  three equal cards with an icon on top; a bento grid; icons in coloured
  circles; emoji as bullets; a "Trusted by" logo strip with no real logos;
  stat rows of unverifiable numbers; testimonial grids with generated faces;
  a terminal mockup with three dots; a fake dashboard.
- The same padding on every section; every heading centred; fade-up on
  every section; "Built with" and a heart.
- Text under 4.5:1; text over an image without a checked scrim; stripped
  focus rings; a placeholder as the only label; skipped heading levels;
  "Learn more" or "Click here" links; targets under 44px; animation without
  a reduced-motion state.

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page), `bg-surface` (card, pill, sticker),
  `bg-panel` (band, contact panel), `bg-night` (dark band and footer).
- Tints, shapes only: `bg-pop-sun`, `bg-pop-sky`, `bg-pop-mint`,
  `bg-pop-rose`; text on them is always `text-ink`.
- Text: `text-ink`, `text-ink-2`, `text-ink-3`; on night `text-night-ink`,
  `text-night-ink-2`.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover`; or the
  `Button` component (a pill that lifts 2px on hover).
- Sizes: `text-display` (h1), `text-section` (h2), `text-title` (h3, chips,
  sticker), `text-lede`, `text-label`; body needs no class.
- Edges: `rounded-control` (pills: buttons, inputs, chips, captions,
  stickers), `rounded-card` (1.5rem), `rounded-frame` (2rem);
  `border-line`, `border-line-strong`, on night `border-line-on-night`;
  `shadow-lift` on the sticker and one object.
- Rhythm: `py-section`, `mt-block`, `max-w-content`, `max-w-wide`.
- Composition cues: hero left-aligned with the squiggle under one or two
  words of the h1 and a tinted frame plus one `-rotate-4` sticker on the
  right; comparable things as a big-one-plus-two of tinted frames with
  captions on white pills; a process as chip rows beside a sticky h2; one
  night band with one sentence and one pill; contact as a wide
  `rounded-frame bg-panel`.

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
   the two font families, then assign roles. In this style the brand's
   light (or a warm near-white made from it) becomes `--color-canvas` and
   `--color-night-ink`; the brand's dark becomes `--color-night` and, if it
   reaches 15:1 on the canvas, `--color-ink` too; the brand's neutral
   becomes `--color-ink-2` if it reaches 4.5:1 on canvas and panel,
   otherwise a darker mix of it does. The brand's primary becomes
   `--color-accent` if it reaches 4.5:1 on the canvas and under white,
   and is at least 60 degrees of hue from the canvas and ink; a primary
   that fails becomes a pop tint (`--color-pop-*`, shapes only) and a
   darker cousin of it takes the accent. Any further brand colours become
   pop tints, replacing sun, sky, mint and rose in that order, each checked
   at 4.5:1 under `text-ink`. `--color-panel` is the canvas nudged toward
   the first pop tint. Run `npm run check`; a pair under 4.5:1 means the
   role gets a different value, not a squint.
3. `src/site.ts`: name, tagline, description, locale, contact, social, the
   logo file in `brand/logo/`, the fonts' Google Fonts URL.
4. This file: the palette table values, the type families, the Identity
   block from the brief, and any rule the do-and-don't adds or removes.
5. The pages, through the `design` and `writing` skills, with `voice.md`
   as the voice card. Render at 390px and 1280px.

When `brand/_mirror.md` exists the notes belong to the Company Brain: a
brand fact is changed there, then re-applied here with the same steps.
