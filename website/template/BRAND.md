# BRAND.md

What `brand/` holds, who owns it, and how it becomes the site. `brand/` is
**notes in markdown**, nothing else: the same shape a Company Brain writes
into its own `brain/brand` folder. The website ships a starter set with
lines still "to fill"; a brain in the project can replace the whole folder
with cited notes. The AI then reads the notes and sets the site from them.

## The folder

```
brand/
  positioning.md       what the business does, for whom, what makes it different;
                       the name as it should appear, the tagline, a description;
                       contact details and social links
  voice.md             the voice card and three example sentences
  audience.md          the actual people who arrive and what convinces them
  visual-identity.md   colours as 6-digit hex with their roles, the display and
                       body fonts, the logo files, the photography style
  do-and-dont.md       observable rules; words used and never used
  logo/                the logo files (svg preferred), served at /brand/logo/<file>
  <anything>.md        further notes are welcome and read as context
  _mirror.md           present only when the folder is a mirror (read-only here)
```

The site never reads these files at runtime. They are the AI's input.

## What the AI sets from them

Three files, in this order, whenever the brand changes:

1. **`styles/theme.css`**: the brand block (`--brand-primary`, `--brand-dark`,
   `--brand-light`, `--brand-neutral`, and any extras) from
   `visual-identity.md`, the two font families, and then the *roles*: which
   brand colour is the accent, the night ground, the secondary ink. A brand
   colour that fails 4.5:1 as text gets a different role, never a squint.
   `npm run check` measures the pairs.
2. **`src/site.ts`**: the name, tagline, description, locale, contact
   details, social links, logo file, and the fonts' Google Fonts URL (or
   self-hosted fonts in `static/fonts/` with `@font-face` in
   `styles/input.css`), from `positioning.md` and `visual-identity.md`.
3. **`DESIGN.md`**: the palette table's values, the type families, the
   Identity block, and any rule the brand's do-and-don't adds or removes.

Then the pages, through the `design` and `writing` skills, with
`voice.md` as the voice card. The suggested first prompt is in the chat
("Apply my brand"); it names these steps.

## Who owns the folder

- **No Company Brain in the project:** the website owns `brand/`. Fill it
  from the owner or from a crawled site (`migrate-site`), then set the site
  from it.
- **A Company Brain in the project:** the brain is the source of truth. The
  owner mirrors the brain's `brain/brand` folder onto this app's `brand`
  folder (Settings → Mirrored folders, target path exactly `brand`). The
  mirror **replaces** the starter notes and refreshes whenever the brain's
  notes change; `brand/_mirror.md` marks it read-only here. Brand facts are
  then changed in the brain, and re-applied here with the same prompt. The
  theme, the pages, and `DESIGN.md` stay the website's.

Nothing in `brand/` is secret. Credentials never belong here.
