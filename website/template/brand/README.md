# brand/

The brand, as files the site reads and the AI writes from.

| File | What it is | Who reads it |
|---|---|---|
| `brand.json` | Facts: the name, tagline, description, contact details, social links, logo file, fonts to load | `src/site.ts` (layout, meta tags, footer) |
| `tokens.css` | The design tokens: grounds, text, the accent, lines, type scale, radii, rhythm | Tailwind, through `styles/input.css`; every class on every page |
| `voice.md` | The voice card and example sentences | the `writing` skill, before any copy is drafted |
| `../DESIGN.md` | The rules the tokens serve: roles, hierarchy, components, do and don't | the `design` skill, before any layout |

Logo and image files are served, so they live in `public/brand/` (for
example `public/brand/logo.svg`) and `brand.json` points at them.

## Filling it in

Three sources, in order of trust:

1. **The owner, in chat.** What they say about their business is the brand.
2. **A Company Brain in this project.** If the owner mirrored `brain/brand`
   into this app, a folder named `brain-brand` (or similar, holding a
   `_mirror.md`) is a read-only copy of the brain's brand notes. Derive
   `brand.json`, `voice.md`, and the tokens from it; never edit the mirror.
3. **A captured site.** The `clone-site` skill's `site_capture.py` records
   the fonts, colours, logo candidates, and copy of an existing site under
   `.site-capture/<host>/`. Use it to seed the tokens and facts, then confirm
   with the owner.

Change a token in `tokens.css`, rebuild the CSS (`npm run css`, or let the
`dev` service's watcher do it), refresh. Update the matching row in
`DESIGN.md` so the rules stay true.

Nothing here is secret. API keys and credentials never belong in this folder
or anywhere else in the repo.
