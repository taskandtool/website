# Writing the site's system record

`design/system.yaml` is the site's design system as one record, in the
design library's shape. `npm run system` compiles it into `styles/theme.css`
and `DESIGN.md`; nothing else holds a design value. Two proven library
records sit beside this file as worked examples: `records/tally.yaml` (light,
lead generation) and `records/claret.yaml` (a dark colour-field room). Read
one whole before writing; they show the level of detail that lets a page be
rebuilt from the record alone.

## What the site's record holds

```
id, title, summary          the system's name and one sentence of what it is
identity                    subject, audience, one_job, direction, source, signature,
                            rejection, photography: from the brief and the homepage
tokens                      colors, typography, rounded, shadows, spacing, containers, easing
sections                    overview, colors, typography, components, layout,
                            elevation_and_depth, motion, responsive_behavior,
                            dos_and_donts (do/dont, each {rule, why}), known_gaps
x_invariants                the non-negotiables, split into style and accessible
x_declares                  the lint hints this site uses on purpose
x_declares_reasons          one paragraph per declared name
x_imagery                   role, density, treatment, aspect ratios, captions, forbidden,
                            what happens with no photographs
x_emphasis                  how the one figure a page leads on is set
x_motion                    one entrance and one signature gesture, or "still: <why>"
x_layout                    how any band of any page is laid out (below)
```

The library's `facets`, `provenance`, `x_brand`, `x_reference` and
`x_status` describe a library entry, not a site; leave them out.

## Tokens: the site's roles

The library names colours per system (`claret`, `cloth`, `wine`). The site
names them by role, because the layout, the components and
`styles/input.css` use these classes on every page. The record must define
each; `npm run system` says which is missing.

| Role | What it is | Claret would map |
|---|---|---|
| `canvas` | the page ground | `cloth` |
| `surface` | a raised card or framed visual | `cloth` |
| `panel` | the alternate band ground | `primary` (blush) |
| `night` | the dark ground: footer, statement bands | `claret` |
| `ink`, `ink-2`, `ink-3` | text on light grounds, three steps | `claret`, then by size |
| `night-ink`, `night-ink-2` | text on night | `cream` |
| `accent`, `accent-ink`, `accent-hover` | the action fill, its text, its hover | `primary`, `claret`, `primary-deep` |
| `line`, `line-strong`, `line-on-night` | hairlines | `line` |

A system's own extra colours (a star yellow, a second dark) are added under
their own names, and get a sentence in `sections.colors`. Typography needs
`display`, `section`, `title`, `lede`, `copy` and `label`; the family of
`display` becomes `font-display` and of `copy` `font-body`. Spacing needs
`section` and `block`, containers `content` and `wide`, rounded `control`
and `card`. A role the system has no use for still gets the nearest value,
because the footer and the shared components use it.

## The bar

1. **Every value comes from the homepage the owner liked.** Read
   `src/pages/home.tsx` and the record's tokens: the colours, sizes, radii
   and spacings the page actually uses stay; a token it never uses goes.
2. **Every rule carries its reason.** At least four dos and four don'ts, one
   rule per reason. "Don't use shadows" is a preference; "Don't use shadows:
   depth here is the two paper tones, and a shadow reads as a third surface
   the system does not have" lets the next page apply it to a case you did
   not foresee.
3. **Colour has relief, and text is neutral.** A dark or saturated ground
   runs about half the bands at most; at least one band sits on the opposite
   value. Text on a coloured ground is the neutral, or a deep shade of the
   ground's hue at 7:1 that reads as ink, never a mid tint of the same
   family. The accent is a fill on a dark or coloured ground, never text
   there. `npm run lint` hints at all three.
4. **The head is a shot list.** `x_layout.head.statement` says the media it
   needs (subject, orientation, where the subject sits, room left for the
   words), where the words go and how they stay readable, and the fallback
   when there is no such picture.
5. **Imagery and motion are never silent.** `x_imagery` says what role
   pictures play and what happens with none; `x_motion` is one entrance and
   one gesture, or `principle: "still: <why>"` and `reduced`.
6. **Type has floors.** Body text at least 18px; section heads at least
   2.5 times the body.
7. **Every reference is written `{group.name}`** (`{colors.night}`,
   `{typography.title}`, `{spacing.section}`); `npm run system` rejects one
   that does not resolve.

## x_layout: look, never content

`x_layout` says how a band of a given shape and count looks in this system.
It never names a page type and never says what goes where; the page's brief
does that.

```yaml
x_layout:
  measure: { reading: "<ch, type token>", caption: "<ch>" }
  grid: { columns: 12, container: "", gutter: "", text_columns: "", media_columns: "" }
  rhythm: { section: "", group: "", item: "", element: "", separator: "space | rule | surface: how" }
  registers:   # by page mode
    persuasion: { head: statement, type: "", rhythm: "" }
    retrieval:  { head: plain, type: "", rhythm: "one step denser" }
    reading:    { head: plain, type: "", rhythm: "one column at measure.reading" }
  head: { statement: "", plain: "" }
  close: "the band that makes the page's last ask"
  shapes:      # each: as · look · counts (the arrangement for each number of items)
    items: {}  table: {}  facts: {}  qa: {}  people: {}  sequence: {}
    media_text: {}  gallery: {}  quote: {}  prose: {}  form: {}  index: {}
  focal: "what leads each band, and how the rest steps down"
  never: ["<a layout don't: why>"]
```

Counts are the lever: six services, forty menu items and four people must
each come out right, and a count that divides badly (four people in three
columns) says what to do instead. Tally's `shapes` block is the fullest
example.

## When the record is done

A fresh builder, given only `design/briefs/home.md`, the facts and this record,
should produce the homepage again: the blind rebuild in the design
skill's step 4. Where the rebuild differs, the record left something out;
add it to the record, not to the page.
