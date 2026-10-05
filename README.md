# Website

A Task & Tool **Starter App**: the business's public website, working from
the first minute. A Hono site with a brand folder, a design system file, and
one command that deploys it to production on Cloudflare. The AI builds it from the brand,
from the owner's current site, or from a site they like, and ships it when
the owner says so.

The repository *is* the app: what you clone is what runs. Installed with one
click on Task & Tool, or cloned into a project of your own (below). MIT
licensed.

It runs in dev on the machine while it is being built, and is pre-rendered
to production on Cloudflare when the owner deploys. It needs nothing to start; managed Postgres
once a form stores submissions, and depends on nothing else.

## What is in the box

```
src/             app.tsx (Hono) · layout.tsx · components/ · pages/ · site.ts · content.ts (JSON-LD) · redirects.ts · server.ts · worker.ts
brand/           the brand as markdown notes: positioning · voice · audience · visual-identity · do-and-dont · logo/
public/          the fact notes with typed frontmatter (FACTS.md); posts/ and legal/ are the collections
site-map.md      the page plan and migration ledger; src/redirects.ts the 301 table it implies
BRAND.md         what the notes hold, who owns the folder, and how the site is set from them
design/          system.yaml, the design system as one record; the page briefs
styles/          theme.css (the tokens, compiled from the record) and input.css → static/site.css (Tailwind v4)
DESIGN.md        the design system to read, compiled from the record: identity, the role of every token,
                 composition, do and don't
static/          static files, served as-is
scripts/         dev.mjs (the machine loop) · content.mjs (notes → data) · build.ts (pre-render, sitemap, redirects, bundle)
                 · system.mjs (the record → theme.css, DESIGN.md, src/fonts.ts) · check.mjs · lint.mjs · test.mjs
                 · proof.mjs (all the proof on the homepage) · verify.mjs (all of them) · from-site.mjs
                 · parts.mjs · images.mjs · shots.mjs · show.mjs
wrangler.jsonc   deploy to your own Cloudflare account, off the platform
AGENTS.md        what the AI reads first; CLAUDE.md imports it
```

Beside the site, the two conventions Task & Tool reads:

```
.claude/skills/
  new-site/      the agency flow: a striking homepage first, then the system, the pages, the launch
  pages/         the page plan, a brief per page, the 18 page-type guides, search fields
  website/       the mechanics: the dev loop, checks, screenshots, pages, deploy; seo.md, posts.md
  forms/ admin/ booking/ reports/ data/
                 business skills from github.com/taskandtool/skills: forms, the private
                 /admin, a booking page, reports, and the database handle they share
  design/        the look: the homepage first, the first screen, the system record as the site
                 grows, the review gate; the design library's 14 systems as references
  writing/       the words in the owner's voice, the editing passes, the cold read
  tropes/        the tells of generated copy, checked by lint (shared from the skills repo)
  migrate-site/  replace an existing site page for page: inventory, facts, brand, look, page map, redirects, launch
  brand/         the brand and fact notes in brand/ and public/, from any source; the same skill
                 in every Starter App that carries it
  launch-check/  the old URLs against the new site, before deploying and after the cutover
.agents/skills/  thin Codex adapters: the same descriptions, pointing at the bodies above
.taskandtool/setup.sh  npm install, the CSS, tt-crawl, the Obscura browser, the `web` service
starter-app.json       the manifest: what the app needs, what "ready" means, and the suggestions an
                       empty chat offers
```

## Dev and production

- **Dev, on the machine:** `npm run dev`, registered as the `web` service
  by setup. Tailwind rebuilds and the server restarts on every change; an
  edit is there on refresh.
- **Production, on Cloudflare:** `npm run build` pre-renders every route (pages, posts,
  legal) to `dist/*.html` beside the static files, generates
  `sitemap.xml` and `robots.txt`, validates the redirect table, and
  bundles the app to `build/worker.mjs`. `npm run deploy` builds and hands
  both to the platform. Static paths are served as
  assets, free and always on; paths that match no file (a redirect, a
  form post, a dynamic route, the 404) reach the Worker. Only `src/server.ts` may touch Node; the
  rest of `src/` must run on Cloudflare, and `npm run check` enforces it.
- **Who can open production** is the owner's setting in the dashboard:
  the first deploy opens it to the team, and only the owner makes it
  public.

## Install

**On Task & Tool.** Pick Website when you create an app. The machine clones
this repository into the app from its main branch and runs
`.taskandtool/setup.sh` (`npm install`, the CSS, the Obscura browser, the
`web` service). Nothing is sent into your chat: the manifest's suggestions are
what an empty chat offers. On machine replacement the clone and the setup
happen again, and your own work comes back from your repository or a backup.

**Anywhere else.** Clone it and start working in it:

```
git clone https://github.com/taskandtool/website my-site
cd my-site
bash .taskandtool/setup.sh
npm run dev                               # http://localhost:3000
```

Off the platform, `npm run build` then `npx wrangler deploy` with
`wrangler.jsonc` deploys to your own Cloudflare account: no Task & Tool
dependency, which is the point.

## Taking over an existing site

`migrate-site` is the sequence: two questions (keep the URLs? faithful or
redesign?), one crawl with the shared crawler
(<https://github.com/taskandtool/crawler>: pages, an inventory per URL,
the header and footer as structure, media, styles, screenshots, linked
documents, the site's own structured data), the facts and brand as notes
(the `brand` skill), a page map against the old URLs in `site-map.md`, pages one
per turn, generated redirects and structured data, and `launch-check`
before deploying and after the domain cutover, then `tt-crawl audit` as a
weekly scheduled job that alerts the owner when the live site has broken
links or SEO problems. The chat suggests the next step from the folder
state (`starter-app.json`'s `when` conditions).

## Third-party tools it installs

- The shared crawler, `tt-crawl`, installed by `.taskandtool/setup.sh` with
  pip from its public repo's main branch, and the two browsers it drives:
  Chrome (chrome-headless-shell from Google's Chrome for Testing, the
  default for reading pages and screenshots) and
  [Obscura](https://github.com/h4ckf0r0day/obscura) (Apache-2.0, a small
  Rust headless browser, the fallback).
- npm packages, MIT: `hono`, `@hono/node-server`, `@neondatabase/serverless`,
  `marked`, `yaml`, `tailwindcss` + `@tailwindcss/cli`, `esbuild`, `tsx`,
  `typescript`, `node-html-parser`, `pg`.

## Developing this Starter App

- **Tests:** the crawler's live in its own repo. Here:
  `npm install && npm run verify`.
  `node_modules/`, `dist/`, `build/` and `static/site.css` are ignored and
  never committed.
- **Try the skills:** clone it as above and drive Claude Code in the clone.
- **On the platform:** Task & Tool's own repo keeps a working clone under
  `starter_apps/` and runs it through the real install path, locally and on a
  real machine (`dev/live_website.exs`), before a release is pinned.
  Contributions welcome as pull requests.

A pre-push secret scan guards this repository. It holds no credentials by
design: anything the site needs at runtime arrives through the platform's
Connections and Secrets, never through this repo.

## License

MIT. See `LICENSE`.
