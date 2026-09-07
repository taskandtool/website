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

Name: swiss
Thesis: The grid is the design: a visible twelve-column grid, everything flush left, one grotesk in two weights, black on light grey, hairline rules, tabular numbers, and one signal red for the actions.
Best for: makers, architects, engineers, studios, transport and civic services, any business whose proof is the work itself and whose pages carry real numbers, times, prices, or plans.
Not for: warm or playful brands, hospitality that sells atmosphere, anything that needs colour to carry the mood; the style gives colour to nothing but the actions, so a business whose appeal is softness will read as cold.
Signature: The exposed grid: every section starts with a rule and a running head (the section number and title in the label style), and the hero shows its twelve column hairlines behind the composition.
References: Josef Müller-Brockmann's concert posters, the Vitra website, Swiss railway (SBB) signage.
Fonts: Schibsted Grotesk for headings, Schibsted Grotesk for reading

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

A page set like a poster from the International Typographic Style. The
ground is a light grey, not white; the type is black; the only colour is
one signal red, and it appears on actions and nowhere else. Everything
sits on a twelve-column grid and everything is flush left: headings, ledes,
actions, captions, tables. Hierarchy comes from scale (the display size is
at least three times the body size) and from position on the grid, never
from weight changes, colour, or decoration. Rules do the separating:
hairlines at 20% between things, a stronger rule at 60% at the top of every
section, with the section number and title beside it in the label style.
Numbers are tabular so columns of times, prices, and steps line up. Corners
are square. Nothing casts a shadow. Nothing moves except a hover.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep
the principles unless the brief says otherwise: grey ground, black type, one
red, the grid shown, rules not boxes, flush left, tabular numbers.

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
| `--color-canvas` | brand light, #f2f2ef | The page ground: a light grey. Most sections sit on it. |
| `--color-surface` | #fafaf8 | The lightest ground: a photo frame, a table cell, one section between two canvas sections. |
| `--color-panel` | #e6e6e1 | One step down: a tinted band, the ground of an honest photo slot. At most two per page, never adjacent. |
| `--color-night` | brand dark, #111111 | The dark ground: the footer, and at most one statement band. Never a card. |
| `--color-ink` | #111111 | Headings and body on light grounds (16.8:1 on canvas). |
| `--color-ink-2` | brand neutral, #454542 | Secondary text on light grounds; must reach 4.5:1 on canvas and panel (8.6:1 and 7.7:1). |
| `--color-ink-3` | #5c5c58 | Captions, running heads, index numbers on light grounds (6.0:1 on canvas, 5.4:1 on panel). Never a border. |
| `--color-night-ink` | brand light, #f2f2ef | Text on night; must reach 4.5:1 on night (16.8:1). |
| `--color-night-ink-2` | #b3b3ae | Secondary text and running heads on night (9.0:1). |
| `--color-accent` | brand primary, #c81b22 | The one action colour: primary buttons, links in body copy, the focus ring. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (5.2:1 and 5.8:1; 4.6:1 on panel). |
| `--color-accent-ink` | #ffffff | Text on the accent. |
| `--color-accent-hover` | #9e151a | The accent's hover and active state (white on it 8.1:1). |
| `--color-line` | ink at 20% | Every hairline on light grounds: column edges, dividers, photo frames, table rows. |
| `--color-line-strong` | ink at 60% | The rule at the top of a section, table frames, input edges, a secondary button's edge. |
| `--color-line-on-night` | night-ink at 20% | Hairlines inside a night surface. |

Rules:

- The accent appears on actions and on nothing else. Not on headings, not
  on rules, not on numbers, not as a ground. One red element per section:
  the primary button, or a link, not both in the same view.
- The red is a signal against grey and black, not a brand hue that the
  grounds echo. The grounds stay neutral; a brand whose primary is red or
  orange keeps it as the accent, a brand whose primary is cool takes a
  signal red or the brand's own high-contrast pair (say which in step 2 of
  "Updating from the brand").
- Text meets 4.5:1 against its ground; focus rings and input edges meet 3:1.
  `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. A brand's primary that fails as text on the
  canvas becomes a ground with its own ink token instead; a brand's
  neutral that is too light gets a darker role value. The brand's colours
  stay what they are; the roles bend.
- Photographs and the work carry colour. The interface around them is grey,
  black, and one red.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

One family in two weights: Schibsted Grotesk at 700 for headings and at
400 and 500 for everything else, named in `styles/theme.css`
(`--font-display`, `--font-body`, the same family in both) and loaded by the
URL in `src/site.ts` (`fonts.googleFontsUrl`) or self-hosted in
`static/fonts/`. There is no mono face; numbers are set with the
`tabular-nums` utility wherever they line up (tables, indexes, steps).

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 56 to 112px, fluid | 0.9 | -0.04em | 700 | The h1 of the home page or a landing page. One per page. Across eight of twelve columns, 10 to 14 characters per line. At least three times the body size at every width. |
| `text-section` | 36 to 60px, fluid | 0.95 | -0.03em | 700 | Every h2, the sentence of a statement band, and the step number at the top of a process column. Wrap at `max-w-[12ch]` to `max-w-[18ch]`. |
| `text-title` | 22 to 28px, fluid | 1.1 | -0.01em | 500 | The h3 of a row or a column. Medium weight, not bold: the size does the work. |
| `text-lede` | 18 to 22px, fluid | 1.4 | 0 | 400 | The supporting thought under a heading, across six columns, in `text-ink-2`. |
| `text-copy` | 18px | 1.5 | 0 | 400 | Body copy (the body default). Measure under 70 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 500 | Interface text: nav, buttons, captions, table cells. |
| `text-label` | 13px | 1.3 | +0.06em | 500 | The one small style, upper-case: running heads, index numbers, the label on a photo slot. Nothing renders smaller. |
| `text-specimen` | 96 to 224px, fluid | 0.85 | -0.05em | 700 | One giant numeral or word inside a visual (`role="img"`). Never for a heading. |

Rules:

- Headings use `font-display` at 700; body and interface text use 400, with
  500 for a title, a button, a table's row header, or a nav link. Nothing
  else changes weight, and nothing is italic.
- Set measure with `max-w-[Nch]` on headings and `max-w-prose` or `max-w-xl`
  on paragraphs. Long words wrap; nothing truncates.
- Everything is flush left. No centred text, no justified text, no
  right-aligned text except a number column in a table.
- Numbers that sit in a column get `tabular-nums`; a lone number in a
  sentence does not need it.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them)
  even when the visual scale breaks convention.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both.

## Component Stylings

**Running head** (the signature, on every section): a `border-t
border-line-strong` rule at the top of the section container with `pt-6`
above it, then a twelve-column row: the section number (`00`, `01`, `02`)
in `text-label uppercase tabular-nums text-ink-3` in column one, the
section title in the same style from column two. On night use
`border-night-ink` and `text-night-ink-2`. The hero's running head carries
the eyebrow instead of a title. The h2 sits `mt-10` below it.

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-5`,
`rounded-control` (0), 16px semibold. Primary is `bg-accent text-accent-ink`,
hover `bg-accent-hover`. Secondary is a `border-line-strong` outline on the
ground with a `bg-panel` hover. One primary per section, flush left, the
first item in its row. The label says what happens next: "Book a workshop
visit", "See recent kitchens", never "Learn more".

**Links in copy**: underlined, 1px, offset; inherit the text colour; on
hover the underline stays. Nav and index links are not underlined, `text-ink`
or `text-ink-2`, `hover:text-accent`, with `aria-current="page"` on the
current page. A link is the one place the red may appear as text.

**Index** (a poster's information block): an `ol` of links, each a row
`min-h-11` with a `border-t border-line` rule, the number in `text-label
tabular-nums text-ink-3` and the label in `text-base font-medium`; the list
closes with `border-b border-line`. In the hero it sits in columns ten to
twelve and lists the page's sections.

**Cards**: there are none. Comparable objects sit in a ruled grid: a
`border-t border-line` rule above the row, an index number top-left in
each column, the object below. A frame is `border border-line` on
`bg-panel` or `bg-surface`, square, no shadow.

**Photo slot** (until the real photo exists): `aspect-4/3`, `border
border-line bg-panel p-4`, the label "Photo to follow" top-left in
`text-label uppercase text-ink-3`, the caption bottom-left in `text-base
font-medium` on two lines (the place, then the description). A real photo
replaces the slot at the same size with the caption below it in the same
style.

**Tables**: `w-full border-y border-line-strong text-base tabular-nums`,
rows divided by `divide-line`, `py-3`, the row header `font-medium
text-left`, the cell `text-ink-2`. Used for hours, prices, sizes, dates:
anything in columns.

**Inputs**: 48px tall, `rounded-control` (0), `border-line-strong`, the
canvas as ground, label above in 16px medium, help text in `text-ink-3`.
Error text is a diagnosis plus a recovery in `text-ink`, next to the field.

**Sections**: `pt-6` above the running head, `pb-section` below the content;
`max-w-wide` (80rem) for every section so the twelve columns line up down
the page; horizontal padding `px-5 sm:px-8`. Grounds: canvas, surface,
panel, night. The `Section` component gives `py-section`; pull the running
head up with `-mt-section pt-6` when using it.

**Lists of rows**: `divide-y divide-line border-y border-line` with `py-6`;
the number in a 3rem column on the left in `text-section tabular-nums
text-ink-3`, the title and sentence on the right. On `lg` a process list
turns into a four-column spread with `lg:divide-x lg:divide-y-0`, the number
at the top of each column and the title `lg:mt-16` below it.

**Images**: square corners (`rounded-frame` is 0), real alt text,
`object-cover`, sized by the grid, never stretched. A hero image sits in
columns of the grid with a `border-line` hairline, never full-bleed and
never with a shadow.

## Layout Principles

- The base unit is 4px. Section padding is `pt-6` above the running head and
  `pb-section` (64 to 112px) below the content. Heading group to what it
  introduces is `mt-block` (32 to 48px). Inside a heading group: heading to
  lede `mt-8`, lede to actions `mt-10`. The rules do the separating, so the
  padding is tighter than a page without them.
- Every section is a `grid grid-cols-12 gap-x-4` inside `max-w-wide`, and
  every element is placed in columns: the h1 in columns one to eight, the
  lede in one to six, the actions in one to eight, an index or an action in
  ten to twelve. Column ten is where the second thing sits.
- Everything is flush left. Space on the right is the composition, not a
  gap to fill.
- The twelve column hairlines are drawn once per page, in the hero, as an
  `aria-hidden` layer with the same `gap-x-4` as the content grid, shown
  from `lg` up. Nowhere else.
- Compose from the content. A sequence is a numbered spread with vertical
  hairlines; a comparison is three columns under one rule with index
  numbers; a change of thought is a night band with the sentence across
  eight columns; facts in columns are a table.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground.
- One section is the peak: the hero, with the biggest type and the exposed
  grid. Everything else is quieter.
- Prefer document flow. Absolute positioning is for the column-hairline
  layer only, never the skeleton.

## Depth & Elevation

Two levels, and the second is a line, not a shadow:

1. Flat: sections, rows, tables, text. Almost all of the page.
2. Framed: a photo slot, an image, a table, `border border-line` or
   `border-y border-line-strong`. `shadow-lift` is defined as a 1px hairline
   ring so the shared components still work; it does not cast.
3. Overlay: a menu or dialog, `bg-surface`, `border border-line-strong`,
   `shadow-overlay` (the only shadow in the system), square corners.

No inner shadows, no glass or blur, no gradients, no rounded corners, no
decorative shapes.

## Motion

Hover and focus only. A colour or underline change of 120 to 150ms with
`ease-soft` (a flat curve) on buttons, links, and index rows; the shared
`Button` uses 150ms. Nothing animates on load, nothing follows the scroll,
nothing slides, fades, or counts up, and the finished composition is always
visible without motion. `prefers-reduced-motion` turns every transition and
animation off (already in `styles/input.css`).

## Responsive Behavior

Mobile and desktop are two compositions of the same content, not one page
that collapses. Type sizes are fluid, so headings need no mobile overrides;
the display size stays at least three times the body size at 390px.

- The twelve-column grid is the layout from `lg` (1024px) up. Below it,
  every placed element spans twelve columns in DOM order: running head, h1,
  lede, actions, then the index. The column hairlines are hidden.
- A four-column spread becomes a ruled list: `divide-y` rows with the number
  in a 3rem column on the left. A three-column strip stays three columns
  from `sm` (640px) and stacks below it.
- A two-column contact block stacks with the text first, the table second.
- Tables keep their columns; a table with more than three columns scrolls
  inside `overflow-x-auto`.
- Touch targets are at least 44px; buttons are 48px; index rows are 44px.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word and a long label.

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the accent ring, 2px,
offset 3px), useful alt text, decorative numbers marked `aria-hidden` with a
`sr-only` step name in the heading, and no information carried by colour
alone.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page: the hero's scale and exposed grid.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body, measure under 70 characters,
  contrast as in the table above.
- Put every element in a column and every number in tabular figures.

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
- Helvetica, Inter, or Arial blandness with no scale contrast: the display
  size is at least three times the body size, or the style has no hierarchy.
- Decorative shapes: no circles, blobs, arcs, or stripes; the only marks are
  rules and type.
- Colour on anything but the actions: no red headings, numbers, rules,
  grounds, or icons.
- Centred text, anywhere.
- Rounded corners, on anything.
- Shadows below the overlay level.
- More than one red element per section.
- Purple, indigo, or violet accents; blue-to-purple gradients; gradient
  text; coloured glows; glass and backdrop blur; glow blobs behind a hero.
- A palette that is only tints of one hue with no accent.
- Inter, Roboto, Arial, Poppins, Space Grotesk, Instrument Serif, Geist, DM
  Serif, or Playfair as reflex choices (a brand that owns one may keep it).
- A centred hero with a badge above the h1 and a "Get Started" button; three
  equal cards with an icon on top; a bento grid; icons in coloured circles;
  emoji as bullets; a "Trusted by" logo strip with no real logos; stat rows
  of unverifiable numbers; testimonial grids with generated faces; a
  terminal mockup with three dots; a fake dashboard.
- The same padding on every section; every heading centred; fade-up on
  every section; "Built with ❤️".
- Text under 4.5:1; text over an image without a checked scrim; stripped
  focus rings; placeholder as the only label; heading levels skipped; "Learn
  more" or "Click here" links; targets under 44px; animation without a
  reduced-motion state.

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page, light grey), `bg-surface` (lightest: a frame
  or one section), `bg-panel` (a step down: a band, a photo slot),
  `bg-night` (dark band and footer).
- Text: `text-ink`, `text-ink-2`, `text-ink-3`; on night `text-night-ink`,
  `text-night-ink-2`.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover`; or the
  `Button` component. One red thing per section.
- Sizes: `text-display` (h1), `text-section` (h2, the band's sentence, a
  step number), `text-title` (h3), `text-lede`, `text-label`; body needs no
  class. `tabular-nums` on any number in a column.
- Edges: every radius is 0; `border-line` for hairlines, `border-line-strong`
  for the section rule and table frames, on night `border-line-on-night`
  and `border-night-ink` for the rule; `shadow-lift` is a hairline ring,
  `shadow-overlay` is for menus only.
- Rhythm: `pt-6` then the running head, `pb-section`, `mt-block`,
  `max-w-wide` on every section, `grid grid-cols-12 gap-x-4` inside it.
- Composition cues: the hero on twelve columns with the h1 in one to eight,
  the index in ten to twelve, the lede in one to six, the actions flush
  left; comparable things as three columns under one rule with index
  numbers; a process as a four-column spread with vertical hairlines and
  the number at the top; a statement as a night band with the sentence
  across eight columns and the action in column ten; contact as two columns
  with the hours as a table. Every section opens with its running head.

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
   the font family (one grotesk; a brand with two faces keeps its display
   face at 700 and its text face at 400 and 500), then assign roles. In
   this style the grounds stay neutral: the brand's light becomes the canvas
   only if it is a grey or off-white under 5% saturation, otherwise the
   canvas stays #f2f2ef; the brand's dark becomes `--color-night` and
   `--color-ink` if it is near-black, otherwise ink stays #111111 and the
   brand's dark is the night only. The brand's primary becomes the accent if
   it is warm (red, orange, or a strong yellow with its own dark ink) and
   reaches 4.5:1 on the canvas; a cool or pale primary does not become the
   accent: it may appear in photographs and in the logo, and the accent stays
   the signal red, or becomes the brand's own darker high-contrast partner
   if the notes name one (say which). The brand's neutral becomes
   `--color-ink-2` if it reaches 4.5:1 on canvas and panel, otherwise a
   darker value of it does. Run `npm run check`; a pair under 4.5:1 means
   the role gets a different value, not a squint.
3. `src/site.ts`: name, tagline, description, locale, contact, social, the
   logo file in `brand/logo/`, the fonts' Google Fonts URL.
4. This file: the palette table values, the type families, the Identity
   block from the brief, and any rule the do-and-don't adds or removes.
5. The pages, through the `design` and `writing` skills, with `voice.md`
   as the voice card. Render at 390px and 1280px.

When `brand/_mirror.md` exists the notes belong to the Company Brain: a
brand fact is changed there, then re-applied here with the same steps.
