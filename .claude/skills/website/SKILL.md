---
name: website
description: "Runs, changes, deploys and launches this business website: the Hono app, the dev loop, the checks, screenshots, search basics, the pre-deploy checklist, and going live on their domain with a weekly audit. Use for a small edit, the site's code, deploying, going live, or an audit alert. A new homepage or site is new-site; a page is pages; the look is design."
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
- `launch.md`: going live on their domain: the cutover, email, the old
  site's addresses, the weekly audit and its alerts.

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

1. **The checks pass.** `npm run check`. Fix what it lists.
2. **The voice holds.** The copy on a changed page reads in
   `brand/voice.md`'s voice (the `writing` skill's pass).
3. **You looked at it.** The changed pages in dev, at desktop and phone
   width.
4. **Going live on their domain** follows `references/launch.md`: the
   cutover, email, the old addresses, the weekly audit.

Then `npm run deploy` (it builds, then deploys); read what the build prints.
What production is, and when: the platform's `deploy` skill.
