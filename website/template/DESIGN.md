# DESIGN.md

The design system of this website: what each token is for, how pages are
composed, and what to refuse. The values live in `styles/theme.css` (roles)
and `brand/brand.json` (the brand's own colours and fonts, see `BRAND.md`);
this file explains them. Change a value there, then update its row here.
The AI reads this file before it designs or changes a page, and
`npm run check` enforces the parts that can be checked. Sections follow the
common DESIGN.md order so any tool that reads the format finds what it
expects.

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

A warm, quiet page that lets one thing be loud at a time. The ground is a
warm off-white, not pure white; the text is a near-black with brown in it;
one saturated accent does every action. Headings are large and few, set at
nine to twelve characters per line, so hierarchy comes from size and space
rather than from weight or decoration. Every section is composed differently
from the one before it. Colour and energy belong to the content (photos,
work, the brand's own material), not to the chrome around it.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep the
principles unless the brief says otherwise: warm ground, one accent, big and
few headings, different shapes per section, honest content.

## Color Palette & Roles

Two layers. **Brand colours** are what the business owns and come from
`brand/brand.json` (`colors`): `primary`, `dark`, `light`, `neutral`, plus
any named extras. **Role tokens** in `styles/theme.css` say what each is
*for*, and are the only colours markup may use (as `bg-*`, `text-*`,
`border-*`, `divide-*`). The Tailwind default palette is switched off, so
`bg-blue-500` does not exist here; add a brand colour and give it a role
instead. Contrast is measured against the ground named.

| Token | Value | Role |
|---|---|---|
| `--color-canvas` | #f6f3ec | The page ground. Most sections sit on it. |
| `--color-surface` | #fffdf8 | A raised card, panel, or framed visual on the canvas. |
| `--color-panel` | #ebe5d8 | One step down: a tinted band. At most two per page, never adjacent. |
| `--color-night` | brand `dark` | The dark ground: the footer, and at most one statement band. Never a card. |
| `--color-ink` | #191612 | Headings and body on light grounds (16:1 on canvas). |
| `--color-ink-2` | brand `neutral` | Secondary text on light grounds; must reach 4.5:1 on canvas and panel (the starter's does 7.1:1 and 6.2:1). |
| `--color-ink-3` | #6b5f54 | Captions, labels, metadata on light grounds (5.6:1 on canvas, 4.9:1 on panel). Never a border. |
| `--color-night-ink` | brand `light` | Text on night; must reach 4.5:1 on `dark`. |
| `--color-night-ink-2` | #bfb6aa | Secondary text on night (9.4:1). |
| `--color-accent` | brand `primary` | The one action colour: primary buttons, links in body copy, the focus ring. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (the starter's does 5.0:1 and 5.5:1). |
| `--color-accent-ink` | #ffffff | Text on the accent. |
| `--color-accent-hover` | accent mixed 15% toward black | The accent's hover and active state. |
| `--color-line` | ink at 14% | Every hairline on light grounds: rules, card edges, dividers. |
| `--color-line-strong` | ink at 32% | Input edges, table frames, a secondary button's edge. |
| `--color-line-on-night` | night-ink at 16% | Hairlines inside a night surface. |

Rules:

- The accent appears on actions and on nothing else. Not on headings, not on
  icons for decoration, not as a section ground.
- Text meets 4.5:1 against its ground; focus rings and input edges meet 3:1.
  `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. A brand's primary that fails as text on the
  canvas becomes a ground with its own ink token instead; a brand's
  neutral that is too light gets a darker role token. Remap in
  `styles/theme.css`; never edit a mirrored `brand/`.
- Photographs, product shots, and the brand's own artwork carry colour. The
  interface around them stays in the palette above.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

Two families: a display face for headings and a text face for reading.
Both are named in `brand/brand.json` (`fonts`) and load from the Google
Fonts URL there, with system fallbacks in `styles/theme.css`. Change the
family in `brand.json`; the theme follows.

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 48 to 96px, fluid | 0.95 | -0.03em | 700 | The h1 of the home page or a landing page. One per page. 9 to 12 characters per line. |
| `text-section` | 36 to 60px, fluid | 1.0 | -0.025em | 600 | Every h2. Beside a visual, wrap at `max-w-[10ch]` to `max-w-[16ch]`. |
| `text-title` | 24 to 32px, fluid | 1.1 | -0.015em | 600 | The h3 of a row, a card, or a callout. |
| `text-lede` | 18 to 22px, fluid | 1.5 | 0 | 400 | The supporting thought under a heading, `max-w-xl`, in `text-ink-2`. |
| `text-copy` | 18px | 1.6 | 0 | 400 | Body copy (the body default). Measure under 70 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 600 | Interface text: nav, buttons, captions under images. |
| `text-label` | 13px | 1.4 | +0.04em | 600 | The one small label style, upper-case, for an eyebrow or metadata. Nothing renders smaller. |
| `text-specimen` | 96 to 176px, fluid | 1.0 | -0.03em | 600 | One giant glyph or word inside a visual (`role="img"`). Never for a heading. |

Rules:

- Headings use `font-display`; everything else uses the body face (the
  default). A heading never goes above weight 700 and body copy is always 400.
- Set measure with `max-w-[Nch]` on headings and `max-w-prose` or `max-w-xl`
  on paragraphs. Long words wrap; nothing truncates.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them) even
  when the visual scale breaks convention.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both.

## Component Stylings

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-5`,
`rounded-control`, 16px semibold. Primary is `bg-accent text-accent-ink`,
hover `bg-accent-hover`. Secondary is a `border-line-strong` outline on the
canvas with a `bg-panel` hover. One primary per section. The label says what
happens next: "Book a call", "See the work", never "Learn more".

**Links in copy**: underlined, 1px, offset; inherit the text colour; on hover
the underline stays. Nav links are `text-ink-2`, not underlined, `text-ink`
on hover, with `aria-current="page"` on the current page.

**Cards**: only for discrete, comparable objects (a service, a person, a
plan). `rounded-card`, `border-line`, `bg-surface` on the canvas or panel;
on night, `border-line-on-night` with no fill. Never a card around a single
paragraph.

**Inputs**: 48px tall, `rounded-control`, `border-line-strong`, the canvas
as ground, label above in 16px semibold, help text in `text-ink-3`. Error
text is a diagnosis plus a recovery in `text-ink`, next to the field.

**Sections** (`Section`): `py-section` vertical padding; `max-w-content`
(72rem) for reading sections, `max-w-wide` (80rem) for the hero and a wide
visual; horizontal padding `px-5 sm:px-8`. Grounds: canvas, panel, night.

**Lists of rows**: `divide-y divide-line border-y border-line` with generous
`py-8`; a numeral or a small object on the left, a title and a sentence on
the right. Prefer rows over three-cards-in-a-grid.

**Images**: `rounded-card` or `rounded-frame`, real alt text, `object-cover`,
sized by the grid, never stretched. A hero image is either full-bleed or in
a frame with `shadow-lift`, not both.

## Layout Principles

- The base unit is 4px. Section padding is `py-section` (80 to 136px).
  Heading group to what it introduces is `mt-block` (40 to 56px). Inside a
  heading group: heading to lede `mt-8`, lede to actions `mt-10`.
- Compose from the content. Sequence, comparison, hierarchy, and a change of
  thought should look different: a split, a ruled list, a statement band, a
  grid of comparable things, a framed visual.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground.
- One section is the peak: the tallest visual, the most room. Everything
  else is quieter.
- Prefer document flow. Absolute positioning is for one deliberate layer,
  never the skeleton.

## Depth & Elevation

Three levels and no more:

1. Flat: sections, rows, text. Most of the page.
2. Lifted: a card or framed visual on the canvas, `border-line` plus
   `shadow-lift` (a warm, soft shadow). Used for the one visual that should
   feel like an object.
3. Overlay: a menu or dialog, `bg-surface`, `shadow-lift`, `rounded-card`.

No inner shadows, no glass or blur, no gradients on interface elements.

## Motion

One thing moves per page, and only to explain a state or direct attention.
Transitions are 150ms with `ease-soft` for hover and focus. Nothing animates
on load, nothing follows the scroll, and the finished composition is always
visible without motion. `prefers-reduced-motion` turns every transition and
animation off (already in `styles/input.css`).

## Responsive Behavior

Mobile and desktop are two compositions of the same content, not one page
that collapses. Type sizes are fluid, so headings need no mobile overrides.

- Below `lg` (1024px) a split becomes a stack with the text first, unless
  the visual is the point of the section.
- Grids of rows stay rows; grids of cards go to one column below `sm`.
- Touch targets are at least 44px; buttons are 48px.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word and a long label.

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the accent ring),
useful alt text, and no information carried by colour alone.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body, measure under 70 characters,
  contrast as in the table above.

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

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page), `bg-surface` (card), `bg-panel` (band),
  `bg-night` (dark band and footer).
- Text: `text-ink`, `text-ink-2`, `text-ink-3`; on night `text-night-ink`,
  `text-night-ink-2`.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover`; or the
  `Button` component.
- Sizes: `text-display` (h1), `text-section` (h2), `text-title` (h3),
  `text-lede`, `text-label`; body needs no class.
- Edges: `rounded-control` (buttons, inputs), `rounded-card`,
  `rounded-frame`; `border-line`, `border-line-strong`, on night
  `border-line-on-night`; `shadow-lift`.
- Rhythm: `py-section`, `mt-block`, `max-w-content`, `max-w-wide`.

Before a new page or a redesign: read `.claude/skills/design/SKILL.md` and
`.claude/skills/writing/SKILL.md`, write the brief and the voice card
(`brand/voice.md`), explore three directions, pick one, fill the Identity
block above, then build. After: `npm run check`, render at 390px and
1280px, and run the review gate in the design skill.

Brand facts (name, colours, fonts, contact, voice) live in `brand/` and
follow `BRAND.md`; when `brand/_mirror.md` exists they belong to the
Company Brain and are changed there, not here.
