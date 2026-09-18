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

Name: luxury
Thesis: Restraint and space: a high-contrast Didone display at large sizes, wide-tracked small labels, long silences of white space, hairline rules, an ivory ground, and one deep colour for the few actions.
Best for: Makers and studios whose work is the proof: joiners, architects, jewellers, small hotels, restaurants, galleries, tailors, skincare, wine, anyone selling one thing done carefully at a price that does not need defending.
Not for: Pages that must carry many products, prices, or comparisons (the silence runs out), discount and volume retail, software with a feature list, or any business whose customers arrive in a hurry on a phone and need a button in the first second.
Signature: The silence: the hero's empty ground, and the h1's first word set in italic on a hairline baseline rule, with the lede pushed narrow to the right on a lower line.
References: Aesop, The Row, Cereal magazine.
Fonts: Bodoni Moda for headings, Figtree for reading

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

An ivory page that says very little and says it large. The ground is a
warm ivory, never white; the text is a near-black; one deep green does the
few actions there are. Headings are set in a Didone with real contrast
between thick and thin, at the largest size the measure allows, in the
regular weight, with the first word of the h1 in italic. Small labels are
upper-case and tracked wide. Rules are hairlines. Corners are square.
Nothing casts a shadow. Sections are separated by more empty space than
feels necessary at first, and that space is the style: the page reads as
a sequence of quiet rooms with one object in each.

One gilt hairline is allowed per page, as a rule or a small mark. It is
never text and never an action. Colour beyond the palette belongs to the
photographs, which should be few, large, and real.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep
the principles unless the brief says otherwise: ivory ground, one deep
accent, a regular-weight Didone at large sizes, wide-tracked labels,
hairlines, square corners, no shadows, long silences.

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
| `--color-canvas` | brand light, #f9f7f2 | The page ground: ivory. Most sections sit on it. |
| `--color-surface` | #fffefb | A framed visual or photo slot on the canvas or the panel. Never a card around text. |
| `--color-panel` | #efeae0 | One step down: a tinted band for the work. At most two per page, never adjacent. |
| `--color-night` | brand dark, #1a1a1a | The dark ground: the footer, and at most one statement band. Never a card. |
| `--color-ink` | #1a1a1a | Headings and body on light grounds (16.3:1 on canvas). |
| `--color-ink-2` | brand neutral, #4d4a44 | Secondary text on light grounds; must reach 4.5:1 on canvas and panel (8.3:1 and 7.4:1). |
| `--color-ink-3` | #66625a | Tracked labels, captions, roman numerals, metadata on light grounds (5.7:1 on canvas, 5.1:1 on panel). Never a border. |
| `--color-night-ink` | brand light, #f9f7f2 | Text on night; must reach 4.5:1 on night (16.3:1). |
| `--color-night-ink-2` | #b5afa4 | Secondary text on night (8.0:1). |
| `--color-accent` | brand primary, #1b4332 | The one action colour, a deep green: the primary button, text-link actions, links in body copy, the focus ring. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (10.4:1 and 10.4:1). |
| `--color-accent-ink` | #f9f7f2 | Ivory text on the accent. |
| `--color-accent-hover` | #245640 | The accent a touch lighter, for hover and active (7.9:1 under `accent-ink`). |
| `--color-gilt` | #b08d57 | Ornament only: one hairline rule or one small mark per page. 2.9:1 on canvas, so never text, never an action, never a ground. |
| `--color-line` | ink at 14% | Every hairline on light grounds: rules, frames, the h1's baseline, row dividers. |
| `--color-line-strong` | ink at 34% | Input edges, table frames, the secondary button's edge. |
| `--color-line-on-night` | night-ink at 18% | Hairlines inside a night surface. |

Rules:

- The accent appears on actions and on nothing else. Not on headings, not on
  numerals, not on rules, not as a section ground. The accent is a deep
  green against an ivory ground: a deliberate high-contrast pair (the two
  differ in lightness far more than in hue), and it stays at least 60
  degrees of hue away from any warm brand colour that replaces the ivory.
- Text meets 4.5:1 against its ground; focus rings and input edges meet 3:1.
  `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. A brand's primary that fails as text on the
  canvas becomes a ground with its own ink token instead; a brand's
  neutral that is too light gets a darker role value. The brand's colours
  stay what they are; the roles bend.
- Gilt is a tint for one hairline or one small mark per page. It fails
  contrast as text on every ground here and is never used as text, a
  button, a link, or a fill.
- Photographs carry colour. The interface around them stays in the palette
  above, and the palette is mostly ivory and near-black.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

Two families: a display face for headings and a text face for reading,
named in `styles/theme.css` (`--font-display`, `--font-body`) from
`brand/visual-identity.md`, and loaded by the URL in `src/site.ts`
(`fonts.googleFontsUrl`) or self-hosted in `static/fonts/`. The display
face is Bodoni Moda, a Didone with an optical-size axis, loaded at weights
400 and 500 and italic 400; the browser picks the optical size from the
rendered size, so large headings get fine hairlines and small ones stay
sturdy. The body face is Figtree at 400 and 500. There is no mono face.

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 56 to 120px, fluid | 1.0 | -0.01em | 400 | The h1 of the home page or a landing page. One per page, first word in italic, on a hairline baseline rule. 10 to 12 characters per line. |
| `text-section` | 40 to 64px, fluid | 1.05 | -0.005em | 400 | Every h2, and the statement band's sentence in italic. Wrap at `max-w-[12ch]` to `max-w-[16ch]`. |
| `text-title` | 24 to 32px, fluid | 1.15 | 0 | 400 | The h3 of a row, a roman numeral, the footer's name. |
| `text-lede` | 18 to 22px, fluid | 1.6 | 0 | 400 | The supporting thought under a heading, `max-w-xl`, in `text-ink-2`. |
| `text-copy` | 18px | 1.7 | 0 | 400 | Body copy (the body default). Measure under 65 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 500 | Interface text: nav, buttons, text-link actions. |
| `text-label` | 13px | 1.4 | +0.18em | 500 | The one small label style, upper-case and tracked wide, for an eyebrow, a caption inside a frame, or metadata. Nothing renders smaller. |
| `text-specimen` | 96 to 192px, fluid | 1.0 | -0.01em | 400 | One giant glyph or word inside a visual (`role="img"`). Never for a heading. |

Rules:

- Headings use `font-display`; everything else uses the body face (the
  default). Headings are weight 400; 500 is the most a heading or a button
  goes. Body copy is always 400. Nothing on the page is bold.
- Italic is a display device: the first word of the h1, the sentence in the
  statement band. Use `<em class="italic font-normal">` for the h1's first
  word so it keeps the regular weight. Never italicise body copy for
  emphasis; rewrite the sentence.
- Labels are upper-case and tracked wide through the `text-label` token.
  Never track a heading or body copy; a Didone loses its shape when spaced.
- Set measure with `max-w-[Nch]` on headings and `max-w-prose` or `max-w-xl`
  on paragraphs. Long words wrap; nothing truncates.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them)
  even when the visual scale breaks convention.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both.

## Component Stylings

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-5`,
`rounded-control` (which is 0: square corners), 16px medium. Primary is
`bg-accent text-accent-ink`, hover `bg-accent-hover`. Secondary is a
`border-line-strong` outline on the canvas with a `bg-panel` hover. One
primary per section. The label says what happens next: "Book a workshop
visit", "See recent kitchens", never "Learn more".

**Text-link actions**: the second action beside a primary button is not a
second button. It is an underlined link in `text-accent`, 16px medium,
`inline-flex min-h-12 items-center` so the target is 44px or more, hover
`text-accent-hover`. On night the same link is `text-night-ink` with a
`text-night-ink-2` hover.

**Links in copy**: underlined, 1px, offset; inherit the text colour; on hover
the underline stays. Nav links are `text-ink-2`, not underlined, `text-ink`
on hover, with `aria-current="page"` on the current page.

**Frames and photo slots**: `rounded-frame` (0), `border-line`,
`bg-surface`, on the canvas or the panel. The caption sits inside the
frame at the bottom left as a `text-label uppercase text-ink-3`, so an
honest empty slot still reads as an object. A real photograph replaces the
surface, keeps the border, and moves the caption below the frame.

**Cards**: avoided. Comparable objects are rows or frames. The only card
shape on the page is a frame around a visual; never a card around a
paragraph, and never three cards in a grid.

**Rules**: `border-line` hairlines do the separating work: under the h1,
above and between process rows, at the header. One `border-gilt` rule per
page, placed where the work begins. No other rule is coloured.

**Inputs**: 48px tall, `rounded-control` (0), `border-line-strong`, the
canvas as ground, label above in 13px tracked upper-case (`text-label`),
help text in `text-ink-3`. Error text is a diagnosis plus a recovery in
`text-ink`, next to the field.

**Sections** (`Section`): `py-section` vertical padding (96 to 192px);
`max-w-content` (72rem) for reading sections, `max-w-wide` (80rem) for the
hero, the work, and the band; horizontal padding `px-5 sm:px-8`. Grounds:
canvas, panel, night. Inside a section the eyebrow sits at the left of a
12-column grid and the h2 starts at column 5, so every heading is offset
and the left column stays mostly empty.

**Lists of rows**: `divide-y divide-line border-y border-line` with `py-12
lg:py-16`; a roman numeral (I, II, III, IV) in `font-display text-title
text-ink-3` on the left, an h3 in the display face at column 5, and one
sentence in `text-ink-2` at column 8. Rows, never cards, for a sequence.

**Images**: `rounded-frame` (0), `border-line`, real alt text,
`object-cover`, sized by the grid, never stretched. A hero image is either
full-bleed or in a hairline frame; never with a shadow.

## Layout Principles

- The base unit is 4px. Section padding is `py-section` (96 to 192px), more
  than most sites use; that is deliberate. Heading group to what it
  introduces is `mt-block` (48 to 72px). Inside a heading group: eyebrow to
  heading `mt-8`, heading to lede `mt-8`, lede to actions `mt-10`. In the
  hero, eyebrow to h1 is `mt-16 sm:mt-24`.
- The hero is asymmetric: eyebrow, then the h1 at `max-w-[12ch]` with
  `border-b border-line pb-6` as its baseline, then a 12-column grid with
  the lede and the actions in columns 8 to 12. The left of that lower row is
  empty on purpose.
- The work is one wide frame over two small frames on the panel ground,
  under the page's single gilt rule.
- The process is ruled rows with roman numerals and wide vertical room.
- The statement band is night, the sentence in Bodoni italic at
  `text-section`, its one action a text link at the right.
- The contact block is the only centred section on the page: eyebrow, h2,
  the hours on two lines, one primary button, all in `max-w-xl text-center`.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground: canvas, panel, canvas, night, canvas, then the
  night footer.
- One section is the peak: the hero, by its emptiness, not its content.
  Everything else is quieter still.
- Prefer document flow. Absolute positioning is for one deliberate layer,
  never the skeleton.

## Depth & Elevation

Two levels in practice, three at most:

1. Flat: sections, rows, text, frames. Nearly all of the page. A frame is a
   hairline (`border-line`) on a ground, with no shadow.
2. Lifted: not used in this style. A framed visual is flat with a hairline;
   the lift comes from the space around it.
3. Overlay: a menu or dialog, `bg-surface`, `border-line`, `shadow-lift`,
   which here is a 1px rule-like shadow (`0 1px 0` at 12%), and
   `rounded-card` (0).

No inner shadows, no soft shadows, no glass or blur, no gradients anywhere.

## Motion

Nothing moves except on hover and focus. Transitions are 200ms with
`ease-soft` (`cubic-bezier(0.2, 0, 0, 1)`) on colour only: a button's
ground, a link's colour, a nav link's colour. Nothing animates on load,
nothing fades up on scroll, nothing follows the pointer, and the finished
composition is always visible without motion. `prefers-reduced-motion`
turns every transition and animation off (already in `styles/input.css`).

## Responsive Behavior

Mobile and desktop are two compositions of the same content, not one page
that collapses. Type sizes are fluid, so headings need no mobile overrides;
the display size floors at 56px so the italic first word still reads as a
device on a phone.

- Below `lg` (1024px) the hero's 12-column lower row becomes a stack: the
  lede, then the actions, both at the left. The h1's baseline rule stays.
- The work stays one wide frame over two small frames from `sm` up; below
  `sm` (640px) it is three frames in one column, the wide one first.
- Process rows keep numeral, name, and sentence on one line from `sm` up;
  below `sm` they stack in that order with `gap-4`.
- The band's sentence and its link stack below `lg`, link under sentence,
  left aligned.
- The contact block stays centred at every width.
- Section padding scales with the viewport (`py-section` is 96px on a
  phone, 192px at desktop widths). Do not reduce it further on mobile; the
  silence is part of the style.
- Touch targets are at least 44px; buttons are 48px; text-link actions are
  `min-h-12`.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word in the h1 and a long caption in a frame.

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the accent ring, 2px
with a 3px offset), useful alt text, and no information carried by colour
alone. Roman numerals are `aria-hidden`; the list is an `ol` so the order
is read anyway.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page: here, on the emptiness of the hero.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body, measure under 65 characters,
  contrast as in the table above.
- Say less. A heading of four words at 120px does more than a paragraph.
- Let photographs be few, large, and real, with a hairline around them.

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
- Gold or gilt as text, as a button, or as a fill; it is one hairline or one
  small mark, once.
- More than one gilt element on a page.
- Script, calligraphic, or swash fonts anywhere.
- Everything centred: the contact block is the one centred section.
- The words "luxury", "premium", "bespoke", or "exquisite" in copy; the
  page shows it or it is not true.
- Tiny grey body text: body is 18px `text-ink`, secondary is `text-ink-2`.
- Stock lifestyle imagery: a smiling model, a styled flat-lay, a rented
  interior. An honest empty frame beats a borrowed photograph.
- Rounded corners or soft shadows anywhere; every radius token is 0.
- Bold headings, or tracked headings; the Didone carries the weight at 400.
- Purple, indigo, or violet accents; blue-to-purple gradients; gradient
  text; coloured glows; glass and backdrop blur; glow blobs behind a hero.
- A palette that is only tints of one hue with no accent.
- Inter, Roboto, Arial, Poppins, Space Grotesk, Instrument Serif, Geist, DM
  Serif, or Playfair as reflex choices (a brand that owns one may keep it).
- A centred hero with a badge above the h1 and a "Get Started" button;
  three equal cards with an icon on top; a bento grid; icons in coloured
  circles; emoji as bullets; a "Trusted by" logo strip with no real logos;
  stat rows of unverifiable numbers; testimonial grids with generated faces;
  a terminal mockup with three dots; a fake dashboard.
- The same padding on every section; every heading centred; fade-up on
  every section; "Built with ❤️".
- Text under 4.5:1; text over an image without a checked scrim; stripped
  focus rings; a placeholder as the only label; skipped heading levels;
  "Learn more" or "Click here" links; targets under 44px; animation without
  a reduced-motion state.

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page, ivory), `bg-surface` (a frame or photo slot),
  `bg-panel` (the work band), `bg-night` (the statement band and footer).
- Text: `text-ink`, `text-ink-2`, `text-ink-3`; on night `text-night-ink`,
  `text-night-ink-2`.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover`, or the
  `Button` component; a second action is a text link, `text-accent
  underline min-h-12 inline-flex items-center hover:text-accent-hover`.
- Ornament: `border-gilt`, once per page, as a hairline. Never `text-gilt`
  or `bg-gilt`.
- Sizes: `text-display` (h1, first word in `<em class="italic
  font-normal">`), `text-section` (h2; add `italic` for the band's
  sentence), `text-title` (h3 and roman numerals, with `font-display`),
  `text-lede`, `text-label` (upper-case, tracked by the token); body needs
  no class.
- Edges: `rounded-control`, `rounded-card`, `rounded-frame` are all 0;
  `border-line`, `border-line-strong`, on night `border-line-on-night`;
  `shadow-lift` on an overlay only.
- Rhythm: `py-section`, `mt-block`, `max-w-content`, `max-w-wide`; the
  12-column offset (`lg:grid-cols-12`, eyebrow at column 1, h2 at
  `lg:col-start-5`, lede at `lg:col-start-8`).
- Composition cues: the hero is quiet and asymmetric with the h1 on a
  `border-b border-line` baseline and the lede narrow to the right; the
  work is one wide frame over two small frames with captions inside; a
  process is ruled rows with roman numerals; the band is night with the
  sentence in Bodoni italic; the contact block is the only centred section,
  hours on two lines.

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
   light (if it has one, and it is close to ivory) becomes `--color-canvas`,
   with `--color-surface` one step lighter and `--color-panel` one step
   warmer and darker; a brand with no light keeps the ivory. The brand's
   dark becomes `--color-night` and, when it is near-black, `--color-ink`
   too; a coloured dark stays night only and ink stays #1a1a1a. The brand's
   primary becomes `--color-accent` if it reaches 4.5:1 on the canvas and
   4.5:1 under an ivory or white `--color-accent-ink`; otherwise a darker
   shade of it does, and `--color-accent-hover` is that shade a touch
   lighter. The accent stays deep and single: one hue, no second accent. A
   brand gold or metallic, if it has one, becomes `--color-gilt` and keeps
   the gilt rule (one hairline or mark, never text). The brand's neutral
   becomes `--color-ink-2` if it reaches 4.5:1 on canvas and panel; a lighter
   neutral is darkened until it does. Run `npm run check`; a pair under
   4.5:1 means the role gets a different value, not a squint.
3. `src/site.ts`: name, tagline, description, locale, contact, social, the
   logo file in `brand/logo/`, the fonts' Google Fonts URL.
4. This file: the palette table values, the type families, the Identity
   block from the brief, and any rule the do-and-don't adds or removes.
5. The pages, through the `design` and `writing` skills, with `voice.md`
   as the voice card. Render at 390px and 1280px.

When `brand/_mirror.md` exists the notes belong to the Company Brain: a
brand fact is changed there, then re-applied here with the same steps.
