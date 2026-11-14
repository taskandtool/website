---
name: website
description: "Runs, changes, deploys and launches this business website: the Hono app, the dev loop, the checks, blog posts, SEO, the pre-deploy checklist, going live on their domain and the site audit. Use for a small edit, a code change, a deploy or an audit alert. Not for a new site (new-site), a page (pages) or the look (design)."
---

# Website

This app is a website on Hono: server-rendered JSX, Tailwind v4, no client
framework. **Dev** is this machine's `web` service; edits show on refresh.
**Production** is the site deployed to Cloudflare. Every page there is
pre-rendered to HTML, and a small Worker handles anything dynamic.

In `references/`, read when the request needs it:

- `seo.md`: what the build generates, the per-page search rules, ranking
  for a search, and Search Console.
- `posts.md`: the blog collection.
- `media-data-and-hosting.md`: turning an HTML page into a page here, images and
  video, interactivity, forms and data, off the platform.
- `launch.md`: going live on their domain: the cutover, email, the old
  site's addresses, the site audit and its alerts.

## The facts

`npm run content` compiles `public/`, `posts/` and `legal/` into
`src/generated/content.json`. It runs on every build, and in the dev loop
when a note changes. The pages, the footer and the JSON-LD read that file.
In `site-map.md`, the notes column lists the pages that show each note:
after changing a note, look at those pages. The sections in
`src/components/facts.tsx` (`npm run list-parts` lists them) render from
the notes, and render nothing while their note is empty. Build around them
instead of retyping a fact.

## Before each deploy

1. **The checks pass:** `npm run check`, with what it lists fixed.
2. **You looked at it:** `tt-crawl shoot <each changed page>`, and new
   copy has had the `writing` skill's cold read.
3. **Going live on their domain:** `references/launch.md`.

Then `npm run deploy` (it sets up the tables, builds, then deploys); read
what the build prints. For what production is and when to deploy, see the
platform's `deploy` skill.
