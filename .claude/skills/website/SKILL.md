---
name: website
description: "Runs, changes and deploys this business website: the Hono app, its components, the dev loop, the checks, screenshots, images, search basics and the pre-deploy checklist. Use for a small edit, a change to the site's code, or deploying. A new homepage or site is new-site; a page is pages; the look is design."
---

# Website

This app is a website on Hono: server-rendered JSX, Tailwind v4, no client
framework. **Dev** is this machine: the `web` service at dev's address
(the platform instructions name it), where every edit shows on refresh. **Production** is the site
deployed to Cloudflare (below, and the platform's `deploy` skill): every
page pre-rendered to HTML, with a small Worker behind it for anything
dynamic.

In `references/`, read when the request needs it:

- `seo.md`: what the build generates, the per-page search rules, ranking
  for a search, and Search Console.
- `posts.md`: the blog collection.
- `media-data-and-hosting.md`: turning an HTML page into a page here, images and
  video, interactivity, forms and data, off the platform.

## The facts

The notes in `public/` carry typed frontmatter (`FACTS.md`); `npm run
content` (run by every build, and by the dev loop when a note changes)
turns them, `posts/` and `legal/` into `src/generated/content.json`, which
the pages, the footer and the JSON-LD read. Each fact lives once, in a
note. Every page that shows it is listed in `site-map.md`'s notes column,
so a change to the note points at the pages.

Sections that render from the notes are in `src/components/facts.tsx`
(`npm run parts` lists them) and render nothing while their note is empty;
compose around them, never retype a fact.

## Before each deploy

This is the site's part, every time:

1. **The checks pass.** `npm run verify`, then `npm run audit` (broken
   links, headings, alt text, labels, link text, titles and descriptions,
   page weight, the sitemap). Fix what they list.
2. **The voice holds.** The copy on a changed page reads in
   `brand/voice.md`'s voice (the `writing` skill's pass).
3. **You looked at it.** The changed pages in dev, at desktop and phone
   width.
4. **A migrated site** has passed the `cutover-check` skill.

Then `npm run deploy` (it builds, then deploys); read what the build prints.
What production is, and when: the platform's `deploy` skill.
