# SEO, per page

The rules the build enforces or generates, and the ones you apply by hand.
Nothing here is a trick; it is the site telling search engines the truth
about itself, once, consistently.

## Generated (do not hand-write)

- `sitemap.xml` and `robots.txt` from the route list, with `site.url` as
  the origin. Set `site.url` to the real domain before launch.
- The canonical tag on every page, pointing at `site.url` + path. While
  the site serves on the platform subdomain and the old site is still on
  the real domain, this is what keeps the two from competing.
- JSON-LD: `LocalBusiness` from `public/business.md` (home page),
  `FAQPage` from `public/faq.md`, `Service` from offerings, `BlogPosting`
  per post (`src/content.ts`). Facts change in the note, never in code.
- 301s from `src/redirects.ts`, validated at build (no loops, every
  target a page, a redirect, or an external URL).
- Tracking IDs from `src/site.ts` (`tracking`): copy them from the
  inventory's `tracking` field so analytics continue across the cutover.

## By hand, on every page

- One `h1`, in the display face, saying what the page is for; `h2`s for
  sections in order. Never skip a level for looks.
- `title` (in `page.title`) under 60 characters, the page's job first,
  the business name appended by the layout. `description` a real
  sentence, 70 to 155 characters, that would make sense as the snippet.
  Keep the intent of the old page's title and description when migrating;
  rewrite the words only when they were bad.
- Internal links in body copy to the pages in `site-map.md`, with
  descriptive link text ("our roofing services", not "click here"). Every
  page reachable from the nav or another page; the launch check flags
  orphans.
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

## Before launch

`npm run check`, `npm run build`, then the `launch-check` skill: every old
URL 200 or 301 to a 200, titles and descriptions present, the sitemap
matching the routes, the JSON-LD parsing. After launch, two weeks of
watching (the reminder job the skill schedules) and, once a Search Console
connection exists, its coverage report.
