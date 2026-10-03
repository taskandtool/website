---
name: website
description: "Runs, changes and deploys this business website: the Hono app, its pages and components, the dev loop, the checks, screenshots, images, forms and the checklist before each deploy. Use for a change to the site's code, editing a page's code, or deploying. A new homepage or site is new-site; the look is design."
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
skill, the look is `design`, what pages a site needs and what each says is
`pages`, and a site to replace page for page is `migrate-site`. Images,
interactivity, forms and data, after launch and off the platform are in
`references/media-data-and-hosting.md`.

## The loop on this machine

`npm run dev` is what the `web` service runs: Tailwind rebuilds
`static/site.css` and the server restarts on every change, so an edit shows
on the next refresh of dev. Check it is running before starting work:

```bash
sprite-env services get web        # definition, status, restart_count
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/
```

If the service does not exist (the setup could not register it, or the app
was created another way), register it once; the platform's `serving` skill
has the mechanics:

```bash
sprite-env services create web \
  --cmd bash --args "-c,set -a; . /home/sprite/.env; set +a; exec npm run dev" \
  --dir /home/sprite/app --env "PORT=3000" --http-port 3000
```

Setup left the dependencies installed and the CSS built. If either is
missing (a fresh clone, a replaced machine), re-run it; it is idempotent:
`bash ~/app/.taskandtool/setup.sh`.

Before showing work:

```bash
npm run verify                   # content, check, typecheck, test, build, lint; stops at the first failure and says what to fix
npm run shots                    # whole page at 1280 and 390 wide: uploads/home-1280/01.png first
                                 # (-- /services for another page, --first-screen, --width N)
npm run show -- --from-shots     # the screenshots you looked at, sent to the chat as one group
```

Look at the screenshots yourself before `show`, so what the owner sees is
what you checked. `npm run audit` (the crawler against dev: links,
headings, alt text, titles) once there are several pages.

## The facts, the collections, and what the build generates

The notes in `public/` carry typed frontmatter (`FACTS.md`); `npm run
content` (run by every build, and by the dev loop when a note changes)
turns them, `posts/`, and `legal/` into `src/generated/content.json`. From
that and the route list the build generates the footer's contact details
(`src/site.ts` reads the business note), the JSON-LD on the home page and
per post, `sitemap.xml`, `robots.txt`, the canonical tags (set `site.url`
to the real domain), and validates `src/redirects.ts`. `seo.md` beside
this file is the per-page ruleset; `posts.md` the collection. A fact lives
in a note, once; a page that shows it is listed in `site-map.md`'s notes
column so a change points at the pages.

Sections that render from the notes are ready in `src/components/facts.tsx`:
`ServicesSection`, `FaqSection`, `ContactSection`, `ProofSection`. Each
renders nothing while its note is empty, so a page can include them before
the facts exist. Compose around them; do not retype a fact into markup.
`npm run parts` prints the components, their props and the facts there are.

Colours and fonts are set from `brand/` into `design/system.yaml` by role
("What the AI sets from them" in `BRAND.md`), then `npm run system`
compiles the theme, `DESIGN.md` and the font link; the name, tagline and
logo go in `src/site.ts`.

## Adding a page

1. Create `src/pages/<name>.tsx` in the shape of `home.tsx`: `export const
   Name = { page, Body }`, where `page.path` starts with `/` and
   `page.description` is a real sentence about the page.
2. Add it to `modules` in `src/pages/index.ts`. That makes it a route here
   and a pre-rendered `dist/<name>.html` when deployed, served at
   `/<name>`. Add its row to `site-map.md`. Nested paths work the same way:
   `/services/roofing` becomes `dist/services/roofing.html`.
3. Put it in the header nav through `site.nav` in `src/site.ts` when it
   belongs there (at most four links; more go in a menu).
4. Build the page from `Section`, the type classes, and the tokens. The
   Tailwind default palette, shadows, radii, blurs, and animations are
   switched off in the theme, so only the site's tokens exist as classes;
   `npm run lint` refuses the rest (`DESIGN.md`: Do's and Don'ts).

### How a page is written

Pages are Hono JSX: mostly markup, written the way the HTML will read, so
the next turn can change them safely.

- `class`, `for` and a plain-string `style` work as in HTML; never
  `className` or `htmlFor`.
- The layout (`src/layout.tsx`) owns the head, header and footer. A page
  returns only what goes inside `<main>`.
- Facts come from `content` and `site` (the notes, compiled), never typed
  into a page.
- Logic stays small: a `.map()` over a list, a condition around a block.
  Anything bigger belongs in `src/content.ts`, typed, where `npm run
  typecheck` checks it.
- JSX escapes text by default. `raw()` is only for markup the site
  generates itself (JSON-LD, a post's rendered markdown).

## Before each deploy

The platform's `deploy` skill says what production is and when to deploy;
this is the site's part, every time:

1. **The checks pass.** `npm run verify`, then `npm run audit` (broken
   links, headings, alt text, labels, link text, titles and descriptions,
   page weight, the sitemap). Fix what they list.
2. **The brand holds.** Every fact on a changed page comes from `public/`:
   no customer, number, price, award or quote that is not in the notes. The
   copy reads in `brand/voice.md`'s voice (the `writing` skill's pass).
   Colours, type and spacing come from the design system, never one-off
   values (`npm run lint` flags them).
3. **You looked at it.** The changed pages in dev, at desktop and phone
   width.
4. **Before the first deploy to a real domain:** `site.url` in
   `src/site.ts` is that domain (the canonical tags and the sitemap use
   it), and a migrated site has passed the `launch-check` skill.

Then `npm run deploy`: it builds the site (every page pre-rendered, a small
Worker for dynamic routes) and deploys it.

## Git

The app is the owner's repository. Commit at milestones with plain
messages; never commit `dist/`, `build/`, `node_modules/`, `static/site.css`,
or any credential. Pushing to GitHub is the owner's call.
