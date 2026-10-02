# The design library

Fourteen design systems, each a different answer to the same question:
fourteen studios, not fourteen colourways. Use them as references, never as
templates: look at the previews, take ideas from the one or two closest to
what the business needs, and make this site its own system. A preview is the top of the
system's reference page, built blind from its record on a real business with
the business swapped for a made-up one; `library/<id>.webp` beside this file.

**Proven** means two blind builds from the system's record came out as the
same design, so the record alone reproduces the look.

| id | family | the look in one line | suits |
|---|---|---|---|
| `tally` (proven) | lead generation | checked one-line claims, photographs of the work, ratings and certifications each with its source's mark, a card beside the headline, one dark close | trades, home services, local services, landing pages sold on trust to someone on a phone |
| `quiet` (proven) | minimal | monochrome, one weight change, vast whitespace, nearly no rules; the product photograph does everything | hardware, furniture, cosmetics, anything beautiful on its own (needs large, sharp photographs) |
| `plinth` (proven) | neo-classical | ivory ground, a refined serif, hairline gold rules, symmetry; restraint as the whole message | jewellery, fine goods, galleries, heritage brands, a heritage restaurant |
| `claret` (proven) | dark colour-field | a deep claret room alternating with white bands, cream type on dark and claret on white, one blush band, food shown as round plates crossing band edges | restaurants, wine bars, supper clubs, evening hospitality |
| `vesper` | after dark | the shop's own low-lit photograph under a midnight wash, a centred serif, one frosted booking bar, gold for the action | barbershops, grooming, tattoo studios, cocktail bars |
| `folio` | editorial | a publication's front page: nameplate over a ruled dateline, the lead story under its photograph, columns split by thin rules, red kickers | magazines, newspapers, newsletters, any brand whose front page is a list of dated stories |
| `terminal` | dark developer | unlit green-grey glass with lit panels, the product's own screen recording in the head, mono for every number, the accent as phosphor | developer tools, CLIs, infrastructure, APIs |
| `velocity` | kinetic | ultramarine flooding whole bands, condensed italic headlines and huge numerals, an action photograph cut by a diagonal, a ticker | gyms, boxing, martial arts, sports, events |
| `open` | invitation | a full-screen landscape video with a short headline, then a white band that is the ask, then dated events in big numerals | parks, venues, events, festivals, launches, communities |
| `bloom` | soft light | the studio's own class under a blush gradient with deep plum words, a white class card beside it, a soft italic serif | yoga, pilates, barre, spas, wellness |
| `vow` | album cover | one portrait photograph like an album cover, the names split above and below it in a large italic serif, sage and white bands | wedding photographers, venues, planners, florists |
| `civic` | institutional | a navy header bar, a wide photograph of the place with a service counter over it listing the top tasks, dated rows for news and meetings | cities, counties, school districts, libraries, utilities |
| `keystone` | keynote | a split stage head, rounded photo tiles ending in "Learn more ›" links, one graphite band of huge figures, one blue | manufacturers, industrial technology, B2B, public companies |
| `crest` | cinematic service | the work at full width (a landscape video or the widest photograph) under a dark fade with white words and a quote card; graphite bands broken by light ones | premium services whose best media is wide: tree care, roofing, landscaping, pools, remodelling |

## Showing them

When the owner wants to see directions, pick the few that fit the business
(by what it sells, who buys and what material it has: a business with no
wide photographs is not `crest` or `open`) and show those previews as one
group, one line each:

```python
from tools.taskandtool import create_deliverables
create_deliverables(
    [{"path": ".claude/skills/design/references/library/tally.webp", "title": "Tally: checked claims and proof, for trust on a phone", "status": "info"},
     {"path": ".claude/skills/design/references/library/crest.webp", "title": "Crest: the work at full width under a dark fade", "status": "info"}],
    "Starting points from the design library: tell me what you like in each")
```

The photographs in the previews are from Pexels and its photographers.
