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

Name: editorial
Thesis: A magazine front page, not a brochure: a serif with real italics, a strict column grid, hairline rules that carry the structure, numbered sections, and one oxblood accent, so the page reads like a well set broadsheet and the work reads like reporting.
Best for: makers, studios, architects, consultancies, galleries, restaurants, publications, and any business whose credibility comes from what it has done rather than what it promises; long pages with real photographs and real writing.
Not for: software products that need screenshots and feature grids, shops with many small items, anything that wants to feel fast, playful, or loud; the grid and the serif slow the eye on purpose, and a busy catalogue fights them.
Signature: One italic word in the headline, set in the serif, under a hairline masthead grid: a 2px rule, a row of small labels, a 1px rule, then the headline across eight columns with the lede in the narrow column beside it.
References: Monocle, The Gentlewoman, the front page of a broadsheet newspaper.
Fonts: Newsreader for headings, Public Sans for reading

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

A front page, set with care. The ground is cool paper, a grey-white with no
cream or yellow in it; the text is a plain near-black with no brown; the
rules are the structure, and there are no shadows anywhere on the page. A
serif with a true italic and an optical-size axis carries every heading, and
a plain sans carries every sentence you read. One word in the headline is
italic, and that is the only flourish the type is allowed.

Hierarchy comes from the grid and from size, not from weight, colour, or
decoration. Everything sits on twelve columns; headings span most of them,
ledes and actions sit in a narrow column beside them, and a hairline
between the two columns says which is which. Sections are numbered where
they are sequences and ruled where they are lists. The one accent, an
oxblood red, appears only on actions. Colour and life belong to the
photographs; the chrome around them is paper, ink, and rules.

This is the starting point, not a brand. When the business has its own
palette and type, replace the tokens and rewrite this file to match. Keep
the principles unless the brief says otherwise: cool paper, ink without
brown, one accent on actions only, a serif for headings and a sans for
reading, rules instead of boxes, numbers instead of icons, no shadows.

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
| `--color-canvas` | brand light, #f5f4f0 | The page ground: cool paper. The front page and most sections sit on it. |
| `--color-surface` | #fbfaf8 | A whiter step up: the photo slot inside a frame, a column that needs to read as a sheet. Never a card with a shadow. |
| `--color-panel` | #eae8e2 | One step down: grey paper for a contact sheet or a colophon band. At most two per page, never adjacent. |
| `--color-night` | brand dark, #141414 | The dark ground: the footer, and at most one statement band. Never a card. |
| `--color-ink` | #141414 | Headings and body on light grounds (16.7:1 on canvas). Also the 2px masthead rule. |
| `--color-ink-2` | brand neutral, #4a4a46 | Secondary text on light grounds: ledes, sentences in a list; must reach 4.5:1 on canvas and panel (8.1:1 and 7.3:1). |
| `--color-ink-3` | #63625c | Captions, folios, small labels, contact-sheet numbers on light grounds (5.6:1 on canvas, 5.0:1 on panel, 5.9:1 on surface). Never a border. |
| `--color-night-ink` | brand light, #f5f4f0 | Text on night; must reach 4.5:1 on night (16.7:1). Also the outline of an action on night. |
| `--color-night-ink-2` | #b5b3ad | Secondary text on night (8.8:1). |
| `--color-accent` | brand primary, #8a1c2b | The one action colour, oxblood: primary buttons, links in body copy, the focus ring. Must reach 4.5:1 on canvas as link text and 4.5:1 under `accent-ink` as a button (8.4:1 and 9.2:1). 7.5:1 on panel. |
| `--color-accent-ink` | #ffffff | Text on the accent (9.2:1). |
| `--color-accent-hover` | accent mixed 15% toward black | The accent's hover and active state. |
| `--color-line` | ink at 18% | Every hairline on light grounds: the column rule, the row rules, the second masthead rule, frame edges inside a panel. |
| `--color-line-strong` | ink at 40% | Input edges, a secondary button's edge, the frame of a photo slot. |
| `--color-line-on-night` | night-ink at 20% | Hairlines inside a night surface. |

Rules:

- The accent appears on actions and on nothing else. Not on headings, not on
  the italic word, not on rules, not on numerals, not as a section ground.
  The oxblood is the deliberate high-contrast pair to the near-black ink and
  the grey paper; a brand whose primary is itself a red keeps it as the
  accent if it reaches 4.5:1 on the canvas, otherwise a darker cut of it
  does.
- Text meets 4.5:1 against its ground; focus rings and input edges meet 3:1.
  `npm run check` computes the brand-dependent pairs (accent on canvas,
  accent-ink on accent, ink-2 on canvas and panel, night-ink on night) and
  fails when one is short. A brand's primary that fails as text on the
  canvas becomes a ground with its own ink token instead; a brand's
  neutral that is too light gets a darker role value. The brand's colours
  stay what they are; the roles bend.
- The grounds stay cool. A brand's off-white becomes the canvas only if it
  has no yellow in it; a warm cream under a serif is the look this style
  refuses, so a warm brand light becomes `surface` for the photo slots and
  the canvas stays grey-white.
- Ink has no brown. `ink`, `ink-2`, `ink-3` are neutral greys; a brand's
  warm dark becomes `night` for the footer, not the text.
- Photographs and the brand's own artwork carry colour. The interface around
  them stays in the palette above.
- A new colour needs a brand entry, a role token, and a row here. No hex
  values in markup (`npm run check` refuses them).

## Typography Rules

Two families: a display serif for headings and a text sans for reading,
named in `styles/theme.css` (`--font-display`, `--font-body`) from
`brand/visual-identity.md`, and loaded by the URL in `src/site.ts`
(`fonts.googleFontsUrl`) or self-hosted in `static/fonts/`. Newsreader is
loaded with its optical-size axis and its italic at weights 500 and 600;
the browser sets the optical size from the font size, so a headline gets
the high-contrast cut and a numeral in a row gets the sturdier one. Public
Sans is loaded at 400 and 600. There is no mono face.

| Class | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 52 to 108px, fluid | 0.98 | -0.02em | 500 | The h1 of the front page. One per page, across eight of twelve columns, with one italic word. |
| `text-section` | 36 to 56px, fluid | 1.05 | -0.015em | 500 | Every h2, and the sentence in the statement band (italic there). Wrap at `max-w-[12ch]` to `max-w-[16ch]`. |
| `text-title` | 24 to 30px, fluid | 1.15 | -0.01em | 500 | The h3 of a row, and the number in a contact-sheet caption bar. |
| `text-lede` | 18 to 22px, fluid | 1.5 | 0 | 400 | The supporting thought in the narrow column, `max-w-xl`, in `text-ink-2`. Body face. |
| `text-copy` | 18px | 1.6 | 0 | 400 | Body copy (the body default). Body face. Measure under 70 characters. |
| `text-base` | 16px | 1.5 | 0 | 400 or 600 | Interface text: nav, buttons, captions in a caption bar. |
| `text-label` | 13px | 1.4 | +0.08em | 600 | The one small label style, upper-case, for a masthead label, a section number, a folio. Nothing renders smaller. |
| `text-numeral` | 48 to 72px, fluid | 1.0 | -0.02em | 500 | The big serif numeral at the left of a numbered row, with a full stop after it. Never a heading. |
| `text-specimen` | 96 to 192px, fluid | 1.0 | -0.02em | 500 | One giant glyph or word inside a visual (`role="img"`). Never for a heading. |

Rules:

- Headings, numerals, and the statement sentence use `font-display`;
  everything you read uses the body face (the default). The serif is never
  used below `text-title` size: no serif captions, no serif body copy.
- One italic word per heading at most, marked with `<em class="italic">`, on
  the word that carries the meaning. Never a whole heading in italic except
  the statement band's single sentence. No drop caps.
- Headings are left-aligned on the grid. Nothing is centred, including on
  mobile.
- Heading weight is 500; 600 is for buttons, labels, and the wordmark. Body
  copy is always 400.
- Set measure with `max-w-[Nch]` on headings and `max-w-prose` or `max-w-xl`
  on paragraphs. Long words wrap; nothing truncates.
- Keep heading order semantic (h1, then h2 for sections, h3 inside them) even
  when the visual scale breaks convention.
- No `tracking-*` or `leading-*` classes on text that has a size token; the
  token carries both.

## Component Stylings

**Buttons** (`Button` in `src/components`): 48px minimum height, `px-5`,
`rounded-control` (2px), 16px semibold in the body face. Primary is
`bg-accent text-accent-ink`, hover `bg-accent-hover`. Secondary is a
`border-line-strong` outline on the ground with a `bg-panel` hover. On
night, an action is an outline in `border-night-ink text-night-ink` that
fills to `bg-night-ink text-night` on hover; the oxblood does not sit on
black. One primary per section. Actions stack in a column in the narrow
column of the front page rather than sitting side by side. The label says
what happens next: "Book a workshop visit", "See recent kitchens", never
"Learn more".

**Links in copy**: underlined, 1px, offset; inherit the text colour; on hover
the underline stays. Nav links are `text-ink-2`, not underlined, `text-ink`
on hover, with `aria-current="page"` on the current page.

**Masthead**: the top of the front page. `border-t-2 border-ink`, a row of
`text-label` labels (the eyebrow left, place or date right) with `pt-3
pb-3`, then `border-t border-line` under it. It appears once per page, at
the top of the hero. The colophon at the foot of a page may repeat the 2px
rule alone.

**Frames** (a photo slot, a contact-sheet item): `border border-line-strong
bg-surface`, radius 0, no shadow, a fixed aspect (`aspect-[4/5]` in a strip,
`aspect-[3/2]` alone). The caption sits inside the frame in a caption bar
under the image area: `border-t border-line-strong px-4 py-4`, a serif
number in `text-title text-ink-3` on the left and the caption in
`text-base text-ink` on the right. When the photograph does not exist yet,
the image area is empty except for the label "Photograph to follow".

**Cards**: this style has none. Comparable objects go in a frame strip or a
ruled list. Never a bordered box around a paragraph, never a shadow.

**Inputs**: 48px tall, `rounded-control`, `border-line-strong`, the canvas
as ground, label above in 16px semibold, help text in `text-ink-3`. Error
text is a diagnosis plus a recovery in `text-ink`, next to the field.

**Sections** (`Section`): `py-section` vertical padding; `max-w-content`
(72rem) for reading sections, `max-w-wide` (80rem) for the front page, a
frame strip, and the statement band; horizontal padding `px-5 sm:px-8`.
Grounds: canvas, panel, night. A section heading sits in a ruled header
row (`border-b border-line pb-6`) with a small label or folio beside it.

**Ruled numbered lists**: `divide-y divide-line`, `py-8` per row, on the
twelve-column grid: the numeral in `font-display text-numeral` across three
columns, the h3 across three, the sentence across six. The numeral is
`aria-hidden` and the h3 carries a visually hidden "Step n" for readers.

**Contact-sheet strip**: three or four equal frames in a row (`sm:grid-cols-3`,
`gap-6` to `gap-10`), numbered 01, 02, 03 in the caption bars, with the
heading row ruled above. Allowed only for objects that are truly
comparable (three kitchens, four chairs); a strip of services or benefits
is a ruled list instead.

**Statement band**: `bg-night`, the sentence in `font-display text-section
italic` across nine columns, the action in the last three behind a
`border-l border-line-on-night` column rule.

**Colophon**: the contact block, on panel, under a 2px ink rule: the heading
in the left six columns, the details and the action in the right six behind
a column rule, in `text-lede text-ink-2`.

**Images**: radius 0, real alt text, `object-cover`, sized by the grid, never
stretched. A hero image sits inside a frame, never bleeds and never carries
a shadow.

## Layout Principles

- The grid is twelve columns at `lg` and above (`lg:grid-cols-12
  lg:gap-x-10`); every composition names its spans. The headline takes
  eight, the narrow column four; a list row takes three, three, six; a
  colophon takes six and six.
- Rules carry structure. A rule appears where two things meet: between the
  headline and the lede column (`lg:border-l border-line`), under a section
  heading row, between list rows, around a frame. A rule that separates
  nothing is removed.
- The base unit is 4px. Section padding is `py-section` (64 to 112px), a
  little tighter than usual because the rules already separate sections.
  Heading group to what it introduces is `mt-block` (32 to 48px). Inside a
  heading group: heading to lede `mt-8`, lede to actions `mt-10`.
- Compose from the content. A front page for the hero, a contact-sheet
  strip for comparable objects, a ruled numbered list for a sequence, a
  statement band for one sentence, a colophon for contact.
- No two adjacent sections share a composition, and no two adjacent
  sections share a ground. Canvas, panel, canvas, night, panel is a good
  run.
- The front page is the peak: the biggest type, the masthead, the most
  room. Everything after it is quieter and more evenly set.
- Prefer document flow. Absolute positioning is for one deliberate layer,
  never the skeleton. Nothing is sticky.

## Depth & Elevation

Two levels, and the second is rare:

1. Flat: everything on the page. Sections, frames, rows, text, buttons.
   Depth is shown with a rule or a ground step (canvas to surface, canvas
   to panel), never a shadow.
2. Overlay: a menu or dialog, `bg-surface`, `border-line-strong`,
   `shadow-lift`, `rounded-control`. This is the only place `shadow-lift`
   is allowed.

No lifted cards, no inner shadows, no glass or blur, no gradients anywhere.

## Motion

Nothing moves except on hover and focus. Transitions are 150ms with
`ease-soft` on colour and background only (a button's fill, a nav link's
ink, the night outline filling). Nothing animates on load, nothing follows
the scroll, nothing fades up, and the finished composition is always visible
without motion. `prefers-reduced-motion` turns every transition off
(already in `styles/input.css`).

## Responsive Behavior

Mobile and desktop are two settings of the same page, not one page that
collapses. Type sizes are fluid, so headings need no mobile overrides. The
twelve-column grid exists at `lg` (1024px) and above; below it, columns
become a stack and the column rule becomes a row rule.

- The front page below `lg`: the masthead, the headline, then a rule and
  the lede and actions under it. The headline stays left-aligned.
- A contact-sheet strip goes to one column below `sm` (640px) with the same
  frames and caption bars.
- A ruled numbered list keeps its rows at every width; below `lg` the
  numeral sits in a 5rem column on the left and the title and sentence
  stack on the right; below `sm` the numeral sits above them.
- The statement band and the colophon stack their two columns with a rule
  between.
- Touch targets are at least 44px; buttons are 48px.
- The header is a single row at every width; when the nav has more than
  four links, move the rest into a menu.
- Check 390px and 1280px, plus one width between, before calling a page
  done, and check a long word and a long label.

Accessibility is part of responsive: semantic landmarks (`header`, `main`,
`footer`, `nav` with a label), one h1, visible focus (the oxblood ring at
3px offset), useful alt text, and no information carried by colour alone.

## Do's and Don'ts

Do:

- Start from the brief and the real content (the `design` and `writing`
  skills); lock the words before the layout.
- Spend boldness in one place per page: the front page with its italic
  word.
- Use the tokens; add a token when one is missing.
- Keep the real copy readable: 18px body in the sans, measure under 70
  characters, contrast as in the table above.
- Number what is a sequence and rule what is a list.

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
- Terracotta, warm cream, or any yellowed ground under the serif.
- Drop caps.
- The serif for body copy, captions, or anything under `text-title` size.
- A centred headline, on any width.
- A decorative rule that separates nothing.
- More than one italic word in a heading.
- Shadows on anything but an overlay.
- Purple, indigo, or violet accents; blue-to-purple gradients; gradient
  text; coloured glows; glass and backdrop blur; glow blobs behind a hero.
- A palette that is only tints of one hue with no accent.
- Inter, Roboto, Arial, Poppins, Space Grotesk, Instrument Serif, Geist,
  DM Serif, or Playfair as reflex choices (a brand that owns one may keep it).
- A centred hero with a badge above the h1 and a "Get Started" button;
  three equal cards with an icon on top; a bento grid; icons in coloured
  circles; emoji as bullets; a "Trusted by" logo strip with no real logos;
  stat rows of unverifiable numbers; testimonial grids with generated
  faces; a terminal mockup with three dots; a fake dashboard.
- The same padding on every section; every heading centred; fade-up on
  every section; "Built with ❤️".
- Text under 4.5:1; text over an image without a checked scrim; stripped
  focus rings; placeholder as the only label; heading levels skipped;
  "Learn more" or "Click here" links; targets under 44px; animation
  without a reduced-motion state.

## Agent Prompt Guide

Quick reference for the AI changing this site:

- Grounds: `bg-canvas` (page, cool paper), `bg-surface` (a photo slot, a
  whiter sheet), `bg-panel` (grey paper band), `bg-night` (dark band and
  footer).
- Text: `text-ink`, `text-ink-2`, `text-ink-3`; on night `text-night-ink`,
  `text-night-ink-2`.
- Action: `bg-accent text-accent-ink hover:bg-accent-hover`; or the
  `Button` component. On night: `border border-night-ink text-night-ink
  hover:bg-night-ink hover:text-night`.
- Sizes: `text-display` (h1), `text-section` (h2), `text-title` (h3, caption
  numbers), `text-numeral` (list numerals), `text-lede`, `text-label`; body
  needs no class. `font-display` on numerals and the band sentence; `italic`
  on one word of a heading.
- Grid: `lg:grid-cols-12 lg:gap-x-10`, spans `lg:col-span-8` and
  `lg:col-span-4` on the front page; `lg:col-span-3` and `lg:col-span-9`
  on a list row.
- Rules: `border-t-2 border-ink` (masthead), `border-line` for every
  hairline, `lg:border-l lg:pl-10` for a column rule, `divide-y divide-line`
  for rows, `border-line-strong` on frames and inputs; on night
  `border-line-on-night`.
- Edges: `rounded-control` (2px) on buttons and inputs; frames and images
  have no radius. `shadow-lift` on an overlay only.
- Rhythm: `py-section`, `mt-block`, `max-w-content`, `max-w-wide`.
- Compositions: front page (masthead, h1 across 8, lede and stacked actions
  in 4 behind a column rule); contact-sheet strip (three framed slots with
  numbered caption bars); ruled numbered list (big serif numeral, title,
  sentence); statement band (night, serif italic sentence, outlined action);
  colophon (2px rule, two columns with a column rule).

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
   primary becomes `--color-accent` if it reaches 4.5:1 on the canvas and
   carries white at 4.5:1, otherwise a darker cut of it does; the brand's
   dark becomes `--color-night` (the footer and the band) and the text ink
   stays a neutral near-black unless the brand's dark is itself neutral;
   the brand's neutral becomes `--color-ink-2` if it reaches 4.5:1 on canvas
   and panel, otherwise it is darkened; the brand's light becomes
   `--color-canvas` only if it is cool (no yellow), otherwise it becomes
   `--color-surface` for the photo slots and the canvas stays grey-white;
   `--color-line` and `--color-line-strong` are the ink at 18% and 40%. A
   brand that owns a serif with an italic keeps it as the display face; a
   brand with only a sans keeps the sans for reading and takes Newsreader
   for headings. Run `npm run check`; a pair under 4.5:1 means the role
   gets a different value, not a squint.
3. `src/site.ts`: name, tagline, description, locale, contact, social, the
   logo file in `brand/logo/`, the fonts' Google Fonts URL.
4. This file: the palette table values, the type families, the Identity
   block from the brief, and any rule the do-and-don't adds or removes.
5. The pages, through the `design` and `writing` skills, with `voice.md`
   as the voice card. Render at 390px and 1280px.

When `brand/_mirror.md` exists the notes belong to the Company Brain: a
brand fact is changed there, then re-applied here with the same steps.
