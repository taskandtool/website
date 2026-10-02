# BRAND.md

What `brand/` holds and how it becomes the site. `brand/` is **notes in
markdown**, nothing else, in the shape the `brand` skill writes. The
website ships a starter set with lines still "to fill"; the AI fills them
with the `brand` skill, then reads the notes and sets the site from them.

## The folder

```
brand/
  positioning.md       what the business does, for whom, what makes it different;
                       the name as it should appear, the tagline, a description;
                       contact details and social links
  voice.md             the voice card, three example sentences, and the fingerprint: signatures
                       with quoted evidence, the never-list, rewrite pairs, the lexicon, how the
                       sentences run, tone by surface (website, ad, post, email), sources
  audience.md          the actual people who arrive and what convinces them
  visual-identity.md   colours as 6-digit hex with their roles, the display and
                       body fonts, the logo files, the photography style
  do-and-dont.md       observable rules; words used and never used
  logo/                the logo files (svg preferred), served at /brand/logo/<file>
  images/  images.md   the business's best real photos, each described, with permission for ads
  <anything>.md        further notes are welcome and read as context
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

## Filling the folder

The `brand` skill fills `brand/` from whatever the owner gives you (a
crawl of their site with `migrate-site`, a chat, a document, a social
profile), citing each line. Then set the site from it as above.

Nothing in `brand/` is secret. Credentials never belong here.
