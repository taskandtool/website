# SEO, per page

## Generated (do not hand-write)

- `sitemap.xml` and `robots.txt` from the route list, with `site.url` as
  the origin. Set `site.url` to the real domain before launch.
- The canonical tag on every page, pointing at `site.url` + path. While
  the site serves on the platform subdomain and the old site is still on
  the real domain, the canonical tag keeps the two from competing.
- JSON-LD from the notes, by the builders in `src/content.ts`: the home
  page carries `LocalBusiness` and `FAQPage`, each post `BlogPosting`. A
  service or location page adds `serviceJsonLd` or `localBusinessJsonLd` to
  its `page.jsonLd`. Facts change in the note, never in code.
- 301s from `src/redirects.ts`, validated at build (no loops, every
  target a page, a redirect, or an external URL).
- Tracking IDs from `src/site.ts` (`tracking`): copy them from the
  inventory's `tracking` field so analytics continue across the cutover.

## By hand, on every page

`npm run check:seo` fails a page without a title, a description, exactly
one `h1` or an image's `alt`, and a link that goes nowhere. What it cannot
judge is yours:

- `title` (in `page.title`): the page's job first. The layout appends ` · `
  and the business name (the homepage's title: the service and the town,
  then the name). `description` a real sentence that would make sense as
  the snippet. Keep the intent of the old page's title and
  description when migrating; rewrite the words only when they were bad.
- Link in body copy to the pages in `site-map.md`.
- URLs: keep them when migrating; changing one later means a redirect row.

## Ranking for a search

A local business ranks on three things: its Google profile and its reviews
(right name, address, phone, categories, hours, photos; reviews answered);
pages that answer the search, one per service and per place it truly serves
(a brief's `query`; `location.md`'s rule against doorway pages); and the same
name, address and phone everywhere. The profile and reviews are the owner's
to tend: say so plainly. Then build or improve those pages.

## Search Console

Once the site has a Search Console connection, check its key pages with
the URL Inspection API (the Page indexing report is not in the API: ask the
owner to read it) and fix any page left out of the index for a reason
the site controls: not found, a redirect error, or blocked by `robots.txt`
or `noindex`.
