---
name: website
description: "Runs, changes and deploys this business website: the Hono app, its components, the dev loop, the checks, screenshots, images, search basics and the checklist before each deploy. Use for a small edit, a change to the site's code, or deploying. A new homepage or site is new-site; a page is pages; the look is design."
---

# Website

This app is a website on Hono: server-rendered JSX, Tailwind v4, no client
framework. **Dev** is this machine: the `web` service at the team's
Development link, every edit there on refresh. **Production** is the site
deployed to Cloudflare (below, and the platform's `deploy` skill): every
page pre-rendered to HTML, with a small Worker behind it for anything
dynamic. `AGENTS.md` in the app root lists the commands and where things
are; `DESIGN.md` and `brand/` say how it should look and sound.

This skill is the mechanics. A new homepage or site is the `new-site`
skill, the look is `design`, what pages a site needs, what each says and
its code is `pages`, and a site to replace page for page is `migrate-site`.
In `references/`, read when the request needs it:

- `seo.md`: what the build generates, the per-page search rules, ranking
  for a search, and launch.
- `posts.md`: the blog collection.
- `media-data-and-hosting.md`: an HTML page made a page here, images and
  video, interactivity, forms and data, after launch, off the platform.

## The facts

The notes in `public/` carry typed frontmatter (`FACTS.md`); `npm run
content` (run by every build, and by the dev loop when a note changes)
turns them, `posts/` and `legal/` into `src/generated/content.json`, which
the pages, the footer and the JSON-LD read. A fact lives in a note, once; a
page that shows it is listed in `site-map.md`'s notes column so a change
points at the pages.

Sections that render from the notes are ready in `src/components/facts.tsx`:
`ServicesSection`, `FaqSection`, `ContactSection`, and for the proof
`RatingLine`, `ReviewsSection`, `LogosSection`, `PeopleSection`,
`NumbersSection`. Each
renders nothing while its note is empty, so a page can include them before
the facts exist. Compose around them; do not retype a fact into markup.
`npm run parts` prints the components, their props and the facts there are.

Colours and fonts are set from `brand/` into `design/system.yaml` by role
("What the AI sets from them" in `BRAND.md`), then `npm run system`
compiles the theme, `DESIGN.md` and the font link; the name, tagline and
logo go in `src/site.ts`.

## Before each deploy

The platform's `deploy` skill says what production is and when to deploy;
this is the site's part, every time:

1. **The checks pass.** `npm run verify`, then `npm run audit` (broken
   links, headings, alt text, labels, link text, titles and descriptions,
   page weight, the sitemap). Fix what they list.
2. **The voice holds.** The copy on a changed page reads in
   `brand/voice.md`'s voice (the `writing` skill's pass).
3. **You looked at it.** The changed pages in dev, at desktop and phone
   width.
4. **A migrated site** has passed the `launch-check` skill.

Then `npm run deploy`: it builds the site (every page pre-rendered, a small
Worker for dynamic routes) and deploys it. Read what the build prints
before it deploys.
