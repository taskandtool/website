# Website

A Task & Tool **Starter App**: the business's public website, working from
the first minute. A Hono site with a brand folder, a design system file, and
one command that publishes it to the edge. The AI builds it from the brand,
from the owner's current site, or from a site they like, and ships it when
the owner says so.

Built for Claude Code. Installed with one click on Task & Tool, or dropped
into any project by hand (below). MIT licensed.

```
Purpose      — the business's public website: the wedge, and usually the first thing built
Shape        — server (Hono JSX, pre-rendered to static HTML at publish; a Worker for dynamic routes)
Audience     — public
Data         — owns: its content (files) · writes: leads (a contact form, when it has one) · feed: reads a brain mirror
Auth         — none (the platform's edge gate when the owner keeps the site private)
Needs        — nothing. Managed Postgres once a form stores submissions.
Libraries    — Hono, Tailwind v4, the Neon HTTP driver; Alpine/htmx by CDN when a page needs them
Build        — thin: the site is AI-built on the skeleton; the skeleton is the committed code
Skills       — website (build and run), design, writing, clone-site, ship
Depends on   — nothing; reads brain/brand and brain/public when a Company Brain mirrors them in
Serving      — the machine while building; promote to the edge at launch (npm run deploy)
Shaping      — brand facts, tokens, voice, pages; from the owner, the brain, or a captured site
Add / remove — install seeds the app, installs deps, registers the web service; removal leaves the site
```

## What is in the box

```
website/         the skill that builds and runs the site, its setup.sh, forms.md, seo.md, posts.md,
                 and template/ (the Hono app that is copied into the app on install)
design/          creative direction: the brief, three directions, the design contract, the review gate
writing/         voice as behaviour, the copy inventory, the editing passes, slop to refuse
migrate-site/    take over an existing site: inventory, facts, brand, page map, pages, redirects, launch
site-facts/      the fact notes from a crawled site, when the project has no Company Brain
launch-check/    the old URLs against the new site, before publishing and after the cutover
ship/            publish to the edge and keep the published copy current
starter-app.json the manifest Task & Tool reads: name, blurb, install directive, chat suggestions
```

The template:

```
brand/           the brand as markdown notes: positioning · voice · audience · visual-identity · do-and-dont · logo/
public/          the fact notes with typed frontmatter (FACTS.md); posts/ and legal/ are the collections
site-map.md      the page plan and migration ledger; src/redirects.ts the 301 table it implies
BRAND.md         what the notes hold, who owns the folder, and how the site is set from them
styles/theme.css the design tokens: the brand's colours and fonts, their roles, type scale, edges, rhythm
DESIGN.md        the design system: an identity block, the role of every token, composition, do and don't,
                 and the procedure for updating it from the brand
src/             app.tsx (Hono) · layout.tsx · components/ · pages/ · site.ts · content.ts (JSON-LD) · redirects.ts · db.ts · server.ts · worker.ts
styles/          input.css → static/site.css (Tailwind v4)
static/          static files, served as-is
scripts/         dev.mjs (the machine loop) · content.mjs (notes → data) · build.ts (pre-render, sitemap, redirects, bundle) · check.mjs · deploy.py
wrangler.jsonc   deploy to your own Cloudflare account, off the platform
```

**The brand is notes; the theme is generated from them by the AI.** `brand/`
holds markdown in the same shape a Company Brain writes into its own
`brain/brand` folder. With a brain in the project, the owner mirrors that
folder onto this app's `brand` folder and the brain's cited notes replace
the starter ones. Either way the AI, prompted ("Apply my brand"), reads the
notes and sets `styles/theme.css` (colours, fonts, roles), `src/site.ts`
(name, contact, logo), and `DESIGN.md` from them, then builds the pages.
The Tailwind default palette, shadows, radii, blurs, and animations are
switched off, and `npm run check` refuses hex values, default colours,
gradients, blur, and tracking or leading overrides in markup and measures
contrast on the brand pairs, so `DESIGN.md` is enforced rather than advisory.

## How it serves

- **On the machine:** `npm run dev`, registered as the `web` service by
  setup. Tailwind rebuilds and the server restarts on every change; an
  edit is live on refresh.
- **At the edge:** `npm run build` pre-renders every route (pages, posts,
  legal) to `dist/*.html` beside the static files, generates
  `sitemap.xml` and `robots.txt`, validates the redirect table, and
  bundles the app to `build/worker.mjs`. `npm run deploy` hands both to
  the platform (`deploy_site` in the bridge). Static paths are served as
  assets, free and always on; paths that match no file (a redirect, a
  form post, a dynamic route, the 404) reach the Worker. Only `src/server.ts` may touch Node; the
  rest of `src/` is edge-safe by rule, and `npm run check` enforces it.
- **Whether the site is on the web** is the owner's publish setting in
  the dashboard, separate from where it serves.

## Install

**On Task & Tool.** Pick Website from the Starter Apps: as the first app of
a new project, as a new app in a project, or into an existing blank app
from its Settings. The platform copies the skill folders into the app, runs
`setup.sh` (seeds the template into an empty app, `git init` and a first
commit, `npm install`, the CSS, the Obscura browser, the `web` service),
and tells the AI what arrived. On machine replacement it runs `setup.sh`
again and nothing else: the files are the owner's from the moment they land.

**Anywhere else.** In any empty folder where Claude Code runs:

```
git clone https://github.com/taskandtool/website /tmp/website
mkdir -p .claude/skills
cp -R /tmp/website/website /tmp/website/design /tmp/website/writing /tmp/website/clone-site /tmp/website/ship .claude/skills/
bash .claude/skills/website/setup.sh      # seeds the app, installs deps, builds the CSS
npm run dev                               # http://localhost:3000
```

Off the platform, `npm run deploy` falls back to `npx wrangler deploy` with
`wrangler.jsonc` and your own Cloudflare account: no Task & Tool
dependency, which is the point.

## Taking over an existing site

`migrate-site` is the sequence: two questions (keep the URLs? faithful or
redesign?), one crawl with the shared crawler
(<https://github.com/taskandtool/crawler>: pages, an inventory per URL,
the header and footer as structure, media, styles, screenshots, linked
documents, the site's own structured data), the facts and brand as notes
(the Company Brain's job when the project has one; `site-facts` here
otherwise), a page map against the old URLs in `site-map.md`, pages one
per turn, generated redirects and structured data, and `launch-check`
before publishing and after the domain cutover, then `tt-crawl audit` as a
weekly scheduled job that alerts the owner when the live site has broken
links or SEO problems. The chat suggests the next step from the folder
state (`starter-app.json`'s `when` conditions).

## Third-party tools it installs

- The shared crawler, `tt-crawl`, installed by `setup.sh` with pip from
  its public repo at a pinned tag.
- [Obscura](https://github.com/h4ckf0r0day/obscura), Apache-2.0, a Rust
  headless browser in one static binary (Linux builds). `site_capture.py`
  renders pages and takes screenshots through it. Shared with the Company
  Brain's install: same binary, same version stamp.
- npm packages, MIT: `hono`, `@hono/node-server`, `@neondatabase/serverless`,
  `tailwindcss` + `@tailwindcss/cli`, `esbuild`, `tsx`, `typescript`.

## Developing this Starter App

- **Tests:** `python3 clone-site/test_site_capture.py`. In the template:
  `npm install && npm run check && npm run typecheck && npm run build`
  (then remove `node_modules/`, `dist/`, `build/`, and `static/site.css`
  before an install through the platform's development path; the repo
  ignores them).
- **Try the skills:** install into a scratch folder as above and drive
  Claude Code there.
- **On the platform:** Task & Tool's own repo clones this one into its
  packs folder and runs it through the real install path locally and on a
  real machine (`dev/live_website.exs`) before a release is pinned.
  Contributions welcome as pull requests.

A pre-push secret scan guards this repository. It holds no credentials by
design: anything the site needs at runtime arrives through the platform's
Connections and Secrets, never through this repo.

## License

MIT. See `LICENSE`.
