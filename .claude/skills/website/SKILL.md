---
description: "Build and run this business website: the Hono app in this repo, its pages, brand tokens, components, the dev loop on the machine, checks, and how to add pages, images, and forms. Use for any change to the site and when the owner says 'build my website', 'add a page', 'change the look'."
---

# Website

This app is a website on Hono: server-rendered JSX, Tailwind v4, no client
framework. **Dev** is this machine: the `web` service at the team's
Development link, every edit there on refresh. **Production** is the site
deployed to Cloudflare (the `ship` skill): every page pre-rendered to HTML,
with a small Worker behind it for anything dynamic. The owner's
CLAUDE.md in the app root says where things are; `DESIGN.md` and `brand/`
say how it should look and sound.

Before a substantial new page or a redesign, work through the `design` and
`writing` skills first: the brief, the voice card (`brand/voice.md`), three
directions, the content inventory. Build from real words and real material.
When the owner has a current site, or points at one they admire, the
`migrate-site` skill comes first. This skill is the mechanics.

## The loop on this machine

`npm run dev` is what the `web` service runs: Tailwind rebuilds
`static/site.css` and the server restarts on every change, so an edit shows
on the next refresh of dev. Check it is running before
starting work:

```bash
sprite-env services get web        # definition, status, restart_count
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/
```

If the service does not exist (the setup could not register it, or the app
was created another way), register it once; `/serving` has the mechanics:

```bash
sprite-env services create web \
  --cmd bash --args "-c,set -a; . /home/sprite/.env; set +a; exec npm run dev" \
  --dir /home/sprite/app --env "PORT=3000" --http-port 3000
```

Setup left the dependencies installed and the CSS built. If either is
missing (a fresh clone, a replaced machine), re-run it; it is idempotent:

```bash
bash ~/app/.taskandtool/setup.sh
```

Before showing work: `npm run check` (the brand notes present, DESIGN.md and
the theme in step, contrast of the brand pairs, site-map.md against the
pages and redirects, page paths, the Cloudflare rule, and the refuse list: no hex or
default Tailwind colours, gradients, blur, tracking or leading overrides,
weights above 700, `animate-*`), `npm run typecheck`, and, once the pages
exist, `npm run audit` (the crawler against the working copy: broken links,
heading order, alt text, form labels, link text, title and description
lengths, page weight, the sitemap). Then look at the page yourself at
1280px and 390px (the `design` skill's review gate says how: Obscura
screenshots into `uploads/`) and show the screenshots in your reply with
`create_deliverables` from `tools/taskandtool.py`, each as `"status":
"info"` (something to look at, nothing to decide), so the owner sees the
page in the chat and can click to enlarge, rather than a description of it.

## The shape

```
brand/            the brand as markdown notes (BRAND.md): positioning · voice · audience · visual-identity · do-and-dont · logo/
public/           the fact notes with typed frontmatter (FACTS.md): business · services · faq · team · policies · proof
posts/ legal/     the blog collection (posts.md) and the verbatim legal pages; npm run content turns all three into src/generated/content.json
site-map.md       the page plan and the migration ledger (migrate-site skill); src/redirects.ts is its 301 table
raw/              a crawled site (tt-crawl, migrate-site skill): raw/site/<host> with pages, images, docs, structured, the _index inventory; raw/audit the audits
styles/theme.css  the design tokens: the brand's colours and fonts, their roles, type scale, edges, rhythm
DESIGN.md         the identity block, the rules the tokens serve, and "Updating from the brand"; read before designing
src/site.ts       the site's facts (name, tagline, contact, social, logo, fonts URL), the nav, the Page type
src/layout.tsx    the document: head (title, description, fonts), header, footer, render()
src/components/   Section, Eyebrow, Button; add shared pieces here
src/pages/*.tsx   one module per page: `page` (path, title, description) + `Body`
src/pages/index.ts  the list of pages, in nav order — a page exists once it is listed here
src/app.tsx       the Hono app: the redirect table, a GET per route (pages, posts, legal), dynamic routes, the 404
src/content.ts    the generated content and the JSON-LD builders (LocalBusiness, FAQPage, Service, BlogPosting)
src/db.ts         sql(env) on DATABASE_URL (Neon HTTP driver), only when the app has a database
src/server.ts     the machine entry (Node); src/worker.ts the production (Cloudflare) entry
styles/input.css  the stylesheet source → static/site.css
static/           static files, served as-is: images, favicon (robots.txt and sitemap.xml are generated)
scripts/          dev.mjs · build.ts · check.mjs · deploy.py
```

## The facts, the collections, and what the build generates

The notes in `public/` carry typed frontmatter (`FACTS.md`); `npm run
content` (run by every build, and by the dev loop when a note changes)
turns them, `posts/`, and `legal/` into `src/generated/content.json`. From
that and the route list the build generates the footer's contact details
(`src/site.ts` reads the business note), the JSON-LD on the home page and
per post, `sitemap.xml`, `robots.txt`, the canonical tags (set `site.url`
to the real domain), and validates `src/redirects.ts`. `seo.md` beside
this file is the per-page ruleset; `posts.md` the collection; `forms.md`
the contact form. A fact lives in a note, once; a page that shows it is
listed in `site-map.md`'s notes column so a change points at the pages.

Sections that render from the notes are ready in `src/components/facts.tsx`:
`ServicesSection`, `FaqSection`, `ContactSection`, `ProofSection`. Each
renders nothing while its note is empty, so a page can include them before
the facts exist. Compose around them; do not retype a fact into markup.

## Adding a page

1. Create `src/pages/<name>.tsx` with the same shape as `home.tsx`: export
   `{ page, Body }`, where `page.path` starts with `/` and `page.description`
   is a real sentence about the page.
2. List it in `src/pages/index.ts`. That makes it a route here and a
   pre-rendered `dist/<name>.html` at publish, served at `/<name>`. Add
   its row to `site-map.md`.
3. Put it in the header nav through `site.nav` in `src/site.ts` when it
   belongs there (at most four links; more go in a menu).
4. Build the page from `Section`, the type classes, and the tokens. The
   Tailwind default palette, shadows, radii, blurs, and animations are
   switched off in the theme, so only the site's tokens exist as classes;
   `npm run check` refuses the rest (`DESIGN.md`: Do's and Don'ts).

Nested paths work the same way: `/services/roofing` becomes
`dist/services/roofing.html`.

### How a page is written

Pages are Hono JSX: mostly markup, written the way the HTML will read. Keep
them that way, because a page that reads like its output is the one the
next turn can change safely.

- `class`, `for` and a plain-string `style` work as in HTML; never
  `className` or `htmlFor`.
- The layout (`src/layout.tsx`) owns the head, header and footer. A page
  returns only what goes inside `<main>`.
- Facts come from `content` and `site` (the notes, compiled), never typed
  into a page: the fact sections in `src/components/facts.tsx` render
  services, FAQ, proof and contact from them.
- Logic stays small: a `.map()` over a list, a condition around a block.
  Anything bigger belongs in `src/content.ts`, typed, where `npm run
  typecheck` checks it.
- JSX escapes text by default. `raw()` is only for markup the site
  generates itself (JSON-LD, a post's rendered markdown).

### From an HTML page to a page here

A page designed as plain HTML (a homepage variant the owner picked, a page
from the design library) becomes a page here in five mechanical steps:

1. Keep only what sits inside `<main>`; the layout already has the head,
   header and footer. Move anything the page adds to the head into
   `page.jsonLd` or the layout.
2. Self-close void tags: `<br />`, `<img … />`, `<input … />`, `<hr />`.
3. HTML comments become `{/* … */}`; a literal `{` or `}` in text becomes
   `{"{"}` or `{"}"}`.
4. Repeated blocks with facts in them (services, reviews, FAQ) become a
   `.map()` over `content`, or the matching section from
   `src/components/facts.tsx`, so each fact lives once, in its note.
5. Classes stay as they are when they use the site's tokens. Run `npm run
   check` and `npm run typecheck`; a class the theme does not have is the
   check's finding to fix, not something to add a token for silently.

## The brand, the theme, and the site's facts

`brand/` is the brand as markdown notes (`BRAND.md`): positioning, voice,
audience, visual identity, do and don't, and `logo/`. The site never reads
them; you do. Setting the site from them is a fixed procedure, "Updating
from the brand" in `DESIGN.md`: colours and fonts into the brand block of
`styles/theme.css` and roles assigned (accent, night, inks; `npm run check`
measures contrast and fails a bad pair), the facts into `src/site.ts`
(name, tagline, contact, social, logo, fonts URL), then `DESIGN.md`'s
palette, type, and Identity block, then the pages. Do it on the first
real build and whenever the notes change, and say what changed.

The `brand` skill writes the notes, from whatever the owner gives you: the
owner in chat first, then a crawl of their site (`migrate-site`), a
document, a social profile. Keep them current.

Theme values that are not brand (the type scale, radii, rhythm, the
grounds) are yours: change them in `styles/theme.css` with the matching
row in `DESIGN.md`. Self-hosted fonts go in `static/fonts/` with
`@font-face` in `styles/input.css`. The dev service rebuilds the CSS on
every change; on a one-off run `npm run css`.

## Images and media

- Put images in `static/images/`, sized for the web (a hero image under
  300 KB; resize and convert with ffmpeg or Python's Pillow, whichever the
  machine has). Real `alt` text always.
- Video: a few MB, muted h264 mp4 plus webm, compressed here with ffmpeg;
  long-form video embeds from the owner's platform. Keep files over 100 MB
  out of git (`.gitignore`).
- In production, Cloudflare serves the pre-rendered pages and everything
  in `static/` as static files; dev still shows this machine's working
  copy.

## Interactivity, forms, and data

- Small client-side state (a menu, a tab, a toggle): a few lines of plain
  JavaScript in `static/js/`, or Alpine.js from a CDN `<script>` in the
  layout. Server round-trips (a filter, a search) can use htmx the same way.
  No client framework unless a view genuinely needs one.
- A form that stores submissions needs the project's database:
  `src/db.ts` gives `sql(c.env)` on `DATABASE_URL`. `forms.md` beside this
  file is the contact-form recipe (a `leads` table, a POST route, a
  honeypot, the thank-you page). If the app has no database, the owner
  adds managed Postgres in the app's Settings; `request_capability(
  "postgres", why)` from `tools/taskandtool.py` asks them.
- Dynamic routes go in `src/app.tsx` below the page loop. They must run on
  Cloudflare: web-standard `Request`/`Response`, `fetch`, Web Crypto, the
  Neon HTTP driver. No Node built-ins, no filesystem, no SQLite, nothing
  kept between requests. `npm run check` flags Node imports.
- Sending email from a form needs a sender the owner connects (Resend or
  Postmark, through `/connections`); Task & Tool sends none. Without one,
  the route writes the lead to the database and a scheduled job
  (`/schedule-job`) posts activity, or the CRM picks it up. Say which the
  site does.

## After launch

A site nobody checks rots quietly. Once the site is on its real domain,
the `launch-check` skill schedules `tt-crawl audit` as a weekly job
(broken links and images, missing titles or descriptions, h1 problems,
redirect chains, sitemap drift); a failing run alerts the owner and the
chat offers "Fix the site audit findings". `tt-crawl audit URL` runs it by
hand any time.

## Git

The app is the owner's repository. Commit at milestones with plain
messages; never commit `dist/`, `build/`, `node_modules/`, `static/site.css`,
or any credential. Pushing to GitHub is the owner's call (CLAUDE.md: Git
and GitHub).

## Off the platform

This site runs anywhere with Node 20: `npm install`, `npm run dev`. Nothing
in it depends on Task & Tool except `scripts/deploy.py`, which falls back to
`npx wrangler deploy` (`wrangler.jsonc`) only when it is run off the
platform: on the owner's own computer, against their own Cloudflare account.

On this machine that is not a path to take. Production **is** Cloudflare,
Task & Tool's, so "publish", "go live" and "put it on Cloudflare" all mean
`npm run deploy` (the `ship` skill); the platform holds the credential. Never run `wrangler login`, and never ask the owner for a
Cloudflare token. Only if they explicitly want their *own* Cloudflare account
instead, and a Cloudflare connection is granted to this app, is wrangler
right (the `deploy` skill: "A customer's own Cloudflare").
