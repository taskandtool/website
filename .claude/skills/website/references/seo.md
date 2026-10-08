# SEO, per page

The rules the build enforces or generates, and the ones you apply by hand.
Nothing here is a trick; it is the site telling search engines the truth
about itself, once, consistently.

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

- One `h1`, in the display face, saying what the page is for; `h2`s for
  sections in order. Never skip a level for looks.
- `title` (in `page.title`): the page's job first. The layout appends ` · `
  and the business name, and the whole title stays under 60 characters, so
  `page.title` gets what is left (the homepage's title is the business name
  alone). `description` a real sentence, 70 to 155 characters, that would
  make sense as the snippet. Keep the intent of the old page's title and
  description when migrating; rewrite the words only when they were bad.
- Internal links in body copy to the pages in `site-map.md`, with
  descriptive link text ("our roofing services", not "click here"). Every
  page reachable from the nav or another page.
- Images: real `alt` text (what is in the picture, for someone who cannot
  see it; empty alt only for pure decoration), sized for the web, in
  `static/images/`.
- URLs: keep them when migrating. A new URL is lowercase, hyphenated,
  short, and stable; changing one later means a redirect row.
- One topic per page. Two thin pages about the same service become one
  page and a redirect.
- Do not: keyword-stuff, hide text, invent reviews or counts, add pages
  for search engines rather than people, or change a URL without a
  redirect.

## Ranking for a search

A local business ranks on three things: its Google profile and its reviews
(right name, address, phone, categories, hours, photos; reviews answered);
pages that answer the search, one per service and per place it truly serves
(a brief's `query`; `location.md`'s rule against doorway pages); and the same
name, address and phone everywhere. The profile and reviews are the owner's
to tend: say so plainly. Then build or improve those pages.

## Before launch

`npm run verify`; a site that replaces an old one then passes the
`launch-check` skill, which also schedules the weekly audit. Once the site
has a Search Console connection, check its key pages with the URL Inspection
API (the Page indexing report, once called Coverage, is not in the API: ask
the owner to read it) and fix any page left out of the index for a reason
the site controls: not found, a redirect error, or blocked by `robots.txt`
or `noindex`.
