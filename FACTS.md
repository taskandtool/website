# FACTS.md

What the site reads from the notes, and how. The notes in `public/` are
markdown with typed frontmatter, written with the `brand` skill (its
`references/notes.md` owns the full shape). The website ships a starter set
with lines still "to fill"; the build reads only the fields below.

`npm run content` (also run by every build and at the start of the dev
loop) turns `public/`, `posts/`, and `legal/` into
`src/generated/content.json`, which the pages import. The site never reads
markdown at request time.

## Notes and the fields the build uses

| Note (`type`) | Frontmatter the build reads | Rendered as |
|---|---|---|
| `business` | `name`, `legal_name`, `telephone`, `email`, `address` (street, locality, region, postal_code, country), `geo` (lat, lng), `opening_hours` (schema.org strings), `time_zone` (IANA, the zone the hours, bookings and reports are in), `price_range`, `same_as`, `area_served`, `schema_type` | the footer and contact details (`src/site.ts`), `LocalBusiness` JSON-LD on the home page |
| `location` (one note per site) | the same fields | `LocalBusiness` JSON-LD on its location page (`localBusinessJsonLd` in its `page.jsonLd`) |
| `offering` | `title`, `price`, `currency`, `unit`, `area_served`; the first paragraph of the body | a service section; `Service` JSON-LD on its page (`serviceJsonLd` in its `page.jsonLd`) |
| `faq` | none; `## ` headings and the text beneath | an FAQ section, `FAQPage` JSON-LD |
| `proof` | `items` (quote, who, source, date) | a testimonial strip; never invented |
| `entity`, `policy`, `process`, `concept` | none | read by the AI when writing pages |

A field left empty, `null`, or "to fill" is treated as absent: the site
renders without it and the JSON-LD omits it.

## The other collections

- `posts/*.md`: `title`, `date`, `description`, `author`, `tags`, `path`
  (default `/blog/<file>`), body markdown. Rendered at their paths and
  listed at `/blog`; `BlogPosting` JSON-LD.
- `legal/*.md`: `path`, `title`, `updated`, body markdown rendered
  verbatim.

## What the AI does with the rest

Everything else in the notes is context: the AI reads it to write pages,
cites nothing on the page, and records in `site-map.md` which notes each
page draws on, so a change in a note points at the pages to revisit.
