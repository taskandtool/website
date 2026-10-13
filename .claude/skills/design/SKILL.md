---
name: design
description: "Designs this website's look: the first screen, the design system record and how it grows, type, colour, imagery, layout and the review gate. Use for change the look, it looks generic, new colours or fonts, or a site growing past its homepage. Not for starting a site (new-site) or its words (writing)."
---

# Design

The look is one record, `design/system.yaml`, compiled by `npm run system`
into `styles/theme.css` and `DESIGN.md` (never edit those two by hand); the
compile refuses a broken record. The starter's record is a working default:
read `DESIGN.md`, then make it this business's.

## Making it theirs

- **Tokens** from their brand (`brand/`, the colours and fonts `from-site`
  read), or from a site the owner likes or a library record.
- **Components and the skeleton** (`src/components`, the header and footer
  in `src/layout.tsx`): restyle or replace them to match, and add sections
  the material calls for (a gallery, the team, the process, the area).
- **A site the owner mentioned** liking or wanting to use: take its shape
  (`tt-crawl reference <url>` captures its look), never its words, pictures
  or logo. Otherwise borrow from the library record that suits them:

| Suits | Preview | Record |
|---|---|---|
| trades, home services, local services, landing pages sold on trust to someone on a phone | [tally](references/library/tally.webp) | [`tally.yaml`](references/records/tally.yaml) |
| hardware, furniture, cosmetics, anything beautiful on its own (needs large, sharp photographs) | [quiet](references/library/quiet.webp) | [`quiet.yaml`](references/records/quiet.yaml) |
| jewellery, fine goods, galleries, heritage brands, a heritage restaurant | [plinth](references/library/plinth.webp) | [`plinth.yaml`](references/records/plinth.yaml) |
| restaurants, wine bars, supper clubs, evening hospitality | [claret](references/library/claret.webp) | [`claret.yaml`](references/records/claret.yaml) |
| barbershops, grooming, tattoo studios, cocktail bars | [vesper](references/library/vesper.webp) | [`vesper.yaml`](references/records/vesper.yaml) |
| magazines, newspapers, newsletters, any brand whose front page is a list of dated stories | [folio](references/library/folio.webp) | [`folio.yaml`](references/records/folio.yaml) |
| developer tools, CLIs, infrastructure, APIs | [terminal](references/library/terminal.webp) | [`terminal.yaml`](references/records/terminal.yaml) |
| gyms, boxing, martial arts, sports, events | [velocity](references/library/velocity.webp) | [`velocity.yaml`](references/records/velocity.yaml) |
| parks, venues, events, festivals, launches, communities | [open](references/library/open.webp) | [`open.yaml`](references/records/open.yaml) |
| yoga, pilates, barre, spas, wellness | [bloom](references/library/bloom.webp) | [`bloom.yaml`](references/records/bloom.yaml) |
| wedding photographers, venues, planners, florists | [vow](references/library/vow.webp) | [`vow.yaml`](references/records/vow.yaml) |
| cities, counties, school districts, libraries, utilities | [civic](references/library/civic.webp) | [`civic.yaml`](references/records/civic.yaml) |
| manufacturers, industrial technology, B2B, public companies | [keystone](references/library/keystone.webp) | [`keystone.yaml`](references/records/keystone.yaml) |
| premium services whose best media is wide: tree care, roofing, landscaping, pools, remodelling | [crest](references/library/crest.webp) | [`crest.yaml`](references/records/crest.yaml) |


`references/library.md` has each look in a line and how to show the owner
a few directions.

Done when the first screen is their best photograph at full width with the
promise and one action (`Hero`), all their proof is on the page (`npm run
proof`), a stranger could tell whose site it is, and the review gate below
finds nothing left to fix. When the owner asks for a copy of an existing
design, copy it.

## When the site grows

When the owner wants more than the homepage: `references/growing.md`.

## Review gate

Look at the rendered page, never the code: `npm run shots` writes, per
width (1280, 390), `uploads/home-<width>/overview.png` (the whole page) and
the strips `01.png`, `02.png` … at full size. Check the page's shape, then
each section, then the phone; set it beside the page it replaces
(`raw/site/<host>/shots/`) or the one the owner pointed at: is it clearly
better, and would the owner send it to someone? Write every problem in one
list, fix them in one pass, then `npm run verify` and `npm run shots` once
more.
