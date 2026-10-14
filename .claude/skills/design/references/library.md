# The design library

Fourteen design systems, each built from a different idea of a site. A preview
(`library/<id>.webp` beside this file) is the top of the system's reference
page, built blind from its record on a real business, with the business
swapped for a made-up one.
Each id links to the system's record, `records/<id>.yaml`, in the shape of
`design/system.yaml` (`authoring.md`): its own colour names plus the
website's roles, its components, layout and rules. Read the record of a
system you borrow from before writing the site's.

**Proven** means two blind builds from the system's record came out as the
same design, so the record alone reproduces the look.

| id | family | suits | the look in one line | preview |
|---|---|---|---|---|
| [`tally`](records/tally.yaml) (proven) | lead generation | trades, home services, local services, landing pages sold on trust to someone on a phone | checked one-line claims, photographs of the work, ratings and certifications each with its source's mark, a card beside the headline, one dark close | [tally](library/tally.webp) |
| [`quiet`](records/quiet.yaml) (proven) | minimal | hardware, furniture, cosmetics, anything beautiful on its own (needs large, sharp photographs) | monochrome, one weight change, vast whitespace, nearly no rules; the product photograph does everything | [quiet](library/quiet.webp) |
| [`plinth`](records/plinth.yaml) (proven) | neo-classical | jewellery, fine goods, galleries, heritage brands, a heritage restaurant | ivory ground, a refined serif, hairline gold rules, symmetry; restraint as the whole message | [plinth](library/plinth.webp) |
| [`claret`](records/claret.yaml) (proven) | dark colour-field | restaurants, wine bars, supper clubs, evening hospitality | a deep claret room alternating with white bands, cream type on dark and claret on white, one blush band, food shown as round plates crossing band edges | [claret](library/claret.webp) |
| [`vesper`](records/vesper.yaml) | after dark | barbershops, grooming, tattoo studios, cocktail bars | the shop's own low-lit photograph under a midnight wash, a centred serif, one frosted booking bar, gold for the action | [vesper](library/vesper.webp) |
| [`folio`](records/folio.yaml) | editorial | magazines, newspapers, newsletters, any brand whose front page is a list of dated stories | a publication's front page: nameplate over a ruled dateline, the lead story under its photograph, columns split by thin rules, red kickers | [folio](library/folio.webp) |
| [`terminal`](records/terminal.yaml) | dark developer | developer tools, CLIs, infrastructure, APIs | unlit green-grey glass with lit panels, the product's own screen recording in the head, mono for every number, the accent as phosphor | [terminal](library/terminal.webp) |
| [`velocity`](records/velocity.yaml) | kinetic | gyms, boxing, martial arts, sports, events | ultramarine flooding whole bands, condensed italic headlines and huge numerals, an action photograph cut by a diagonal, a ticker | [velocity](library/velocity.webp) |
| [`open`](records/open.yaml) | invitation | parks, venues, events, festivals, launches, communities | a full-screen landscape video with a short headline, then a white band that is the ask, then dated events in big numerals | [open](library/open.webp) |
| [`bloom`](records/bloom.yaml) | soft light | yoga, pilates, barre, spas, wellness | the studio's own class under a blush gradient with deep plum words, a white class card beside it, a soft italic serif | [bloom](library/bloom.webp) |
| [`vow`](records/vow.yaml) | album cover | wedding photographers, venues, planners, florists | one portrait photograph like an album cover, the names split above and below it in a large italic serif, sage and white bands | [vow](library/vow.webp) |
| [`civic`](records/civic.yaml) | institutional | cities, counties, school districts, libraries, utilities | a navy header bar, a wide photograph of the place with a service counter over it listing the top tasks, dated rows for news and meetings | [civic](library/civic.webp) |
| [`keystone`](records/keystone.yaml) | keynote | manufacturers, industrial technology, B2B, public companies | a split stage head, rounded photo tiles ending in "Learn more ›" links, one graphite band of huge figures, one blue | [keystone](library/keystone.webp) |
| [`crest`](records/crest.yaml) | cinematic service | premium services whose best media is wide: tree care, roofing, landscaping, pools, remodelling | the work at full width (a landscape video or the widest photograph) under a dark fade with white words and a quote card; graphite bands broken by light ones | [crest](library/crest.webp) |

## Showing them

When the owner wants to see directions, pick the few that fit the business
(by what it sells, who buys and what material it has: a business with no
wide photographs is not `crest` or `open`) and show those previews as one
group, one line each:

```bash
python3 ~/tools/taskandtool.py create-deliverables --file - \
  --message "Starting points from the design library: tell me what you like in each" <<'EOF'
[{"path": ".claude/skills/design/references/library/tally.webp", "title": "Tally: checked claims and proof, for trust on a phone", "status": "info"},
 {"path": ".claude/skills/design/references/library/crest.webp", "title": "Crest: the work at full width under a dark fade", "status": "info"}]
EOF
```

The photographs in the previews are from Pexels and its photographers.
