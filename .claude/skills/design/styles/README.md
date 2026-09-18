# Style presets

Six complete design systems the site can start from. Each folder holds a
`DESIGN.md` (the rules, with a `## Style` block at the top: name, thesis,
what it suits, what it does not, the signature move, references, fonts), a
`theme.css` (the same token names as the site's, with the style's values),
`fonts.json` (the families and the Google Fonts URL), `specimen.tsx` (the
same made-up workshop, Harlow Joinery, composed in that style), and two
screenshots, `preview.png` (1280 wide) and `preview-mobile.png` (390 wide).

The specimen is the same business and the same words in every preset on
purpose: the owner compares styles, not content.

| Preset | Thesis | Suits | Not for |
|---|---|---|---|
| `editorial` | A magazine front page: a serif with real italics, a strict column grid, hairline rules that carry structure, one oxblood accent. | Consultancies, studios, writers, food and drink, anyone with a point of view and real photographs. | Products that need to be shown working; anything that wants to feel fast. |
| `brutalist` | Raw and loud: black borders instead of hairlines, no radius, hard offset shadows, a huge display face, monospace labels, one loud accent. | Trades, makers, gyms, agencies, anything that sells confidence and directness. | Health, legal, finance, and anywhere the reader is anxious. |
| `whimsical` | Playful and rounded but grown-up: pill buttons, big rounded frames, content tints on shapes and stickers, a hand-drawn underline. | Cafés, kids' services, pet businesses, creative shops, community organisations. | Professional services; anywhere a joke would cost trust. |
| `cinematic` | Dark and film-grade with one bright element: near-black ground, warm light type, an oversized wide display face, a full-bleed visual, one amber, one reveal on load. | Photographers, filmmakers, music, events, premium products with strong imagery. | Text-heavy sites, long reading, and any business without good photographs. |
| `luxury` | Restraint and space: a high-contrast Didone at large sizes, wide-tracked labels, long silences of white space, hairline rules, an ivory ground, one deep colour. | Interiors, jewellery, hospitality, skincare, architecture. | Value-led offers, busy catalogues, anything that needs to feel approachable. |
| `swiss` | The grid is the design: a visible twelve-column grid, everything flush left, one grotesk in two weights, black on light grey, one signal red. | Engineering, architecture, logistics, software, public services. | Warmth-led businesses and anything that wants to feel handmade. |

## Using them

```
npm run style                        list the presets with their theses
npm run style -- brutalist           apply one: DESIGN.md, styles/theme.css, and the
                                     fonts in src/site.ts are replaced
npm run style -- brutalist --specimen   also add the specimen page at /specimen
npm run style -- --remove-specimen   take the specimen page out (before publishing)
```

Then run "Updating from the brand" in `DESIGN.md`: the brand's own colours
and fonts replace the preset's defaults, with `npm run check` measuring
every text and ground pair. A preset is a starting point; the Identity
block is still to fill, the words are still the owner's, and the design
skill's review gate still runs.

To show the styles to the owner, attach the previews to your reply so
they appear in the chat as thumbnails the owner clicks through:

```python
from tools.taskandtool import attach_files
attach_files([f".claude/skills/design/styles/{s}/preview.png"
              for s in ["editorial", "brutalist", "whimsical", "cinematic", "luxury", "swiss"]],
             "Six starting points: editorial, brutalist, whimsical, cinematic, luxury, swiss")
```

Off the platform the previews are in this folder, or apply the preset with
`--specimen` and send them to `/specimen` on the working copy. Blends
("brutalist with our green", "editorial but warmer") start from the closer
preset and change the tokens and rules it names, each with its row in
`DESIGN.md`.

## Adding one

Copy the closest folder, change the `## Style` block, the tokens, and the
rules, keep every token name (`theme.css` is a contract the components and
`npm run check` depend on), rewrite the specimen's composition without
changing its words, and render the two previews at 1280 and 390 wide.
Every text and ground pair passes 4.5:1; the accent is at least 60 degrees
of hue from the dominant colour; the shared refuse list in every `DESIGN.md`
stays.
