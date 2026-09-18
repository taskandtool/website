# Site map

The plan for this site, and the ledger of a migration when there was an
old site. The AI fills it with the owner (the `migrate-site` skill); the
build reads nothing from it, but `npm run check` holds the pages and the
redirect table to it.

## Decisions

- **Existing site:** to fill (none, or the URL)
- **Keep the URLs:** to fill (yes by default; no, because …)
- **Faithful rebuild or redesign:** to fill (faithful, or redesign because …)

## Architecture

The header nav, in order (at most four; more go in a menu), and the
footer groups, mapped from the old site's `_furniture.json` when there
was one.

- Nav: to fill
- Footer: to fill

## Pages

One row per old URL (from `raw/web/_inventory.json`) and per new page.
`action` is keep | merge | drop | new; `target` is the new path (for merge
and drop, the page a redirect sends to, or `-` to answer 404); `notes` are
the notes in `public/` and `brand/` the page draws on; `status` is
planned | built | reviewed.

| old URL | action | target | job | notes | status |
|---|---|---|---|---|---|
| / | new | / | the front door | brand/positioning, public/business | built |

## Out of scope

Sections that stay where they are (a store, a member area, a booking
system) with the link the new site points at.
