# Website

A Task & Tool **Starter App**: the business's public website, working from
the first minute. A Hono site with a brand folder, a design system file, and
one command that publishes it to the edge. The AI builds it from the brand,
from the owner's current site, or from a site they like, and ships it when
the owner says so.

The repository *is* the app: what you clone is what runs. Installed with one
click on Task & Tool, or cloned into a project of your own (below). MIT
licensed.

It serves from the machine while it is being built and pre-renders to the
edge when the owner publishes. It needs nothing to start; managed Postgres
once a form stores submissions. It reads a Company Brain's mirrored brand and
facts when the project has one, and depends on nothing else.

## What is in the box

```
src/             app.tsx (Hono) · layout.tsx · components/ · pages/ · site.ts · content.ts (JSON-LD) · redirects.ts · db.ts · server.ts · worker.ts
brand/           the brand as markdown notes: positioning · voice · audience · visual-identity · do-and-dont · logo/
public/          the fact notes with typed frontmatter (FACTS.md); posts/ and legal/ are the collections
site-map.md      the page plan and migration ledger; src/redirects.ts the 301 table it implies
BRAND.md         what the notes hold, who owns the folder, and how the site is set from them
styles/          theme.css (the design tokens) and input.css → static/site.css (Tailwind v4)
DESIGN.md        the design system: an identity block, the role of every token, composition, do and don't,
                 and the procedure for updating it from the brand
static/          static files, served as-is
scripts/         dev.mjs (the machine loop) · content.mjs (notes → data) · build.ts (pre-render, sitemap, redirects, bundle) · check.mjs · deploy.py
wrangler.jsonc   deploy to your own Cloudflare account, off the platform
AGENTS.md        what the AI reads first; CLAUDE.md imports it
```

Beside the site, the two conventions Task & Tool reads:

```
.claude/skills/
  website/       building and running the site, plus forms.md, seo.md, posts.md
  design/        creative direction: the brief, three directions, the design contract, the review gate;
                 styles/ holds six style presets (DESIGN.md + theme.css + fonts + specimen + previews),
                 applied with `npm run style -- <name>`
  writing/       voice as behaviour, the copy inventory, the editing passes, slop to refuse
  migrate-site/  take over an existing site: inventory, facts, brand, page map, pages, redirects, launch
  site-facts/    the fact notes from a crawled site, when the project has no Company Brain
  launch-check/  the old URLs against the new site, before publishing and after the cutover
  ship/          publish to the edge and keep the published copy current
.taskandtool/setup.sh  npm install, the CSS, tt-crawl, the Obscura browser, the `web` service
starter-app.json       the manifest: what the app needs, what "ready" means, and the suggestions an
                       empty chat offers
```

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

**On Task & Tool.** Pick Website when you create an app. The machine clones
this repository into the app, pinned to a reviewed commit, and runs
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

- The shared crawler, `tt-crawl`, installed by `.taskandtool/setup.sh` with
  pip from its public repo at a pinned tag.
- [Obscura](https://github.com/h4ckf0r0day/obscura), Apache-2.0, a Rust
  headless browser in one static binary (Linux builds). `tt-crawl` renders
  pages and takes screenshots through it. Shared with the Company
  Brain's install: same binary, same version stamp.
- npm packages, MIT: `hono`, `@hono/node-server`, `@neondatabase/serverless`,
  `tailwindcss` + `@tailwindcss/cli`, `esbuild`, `tsx`, `typescript`.

## Developing this Starter App

- **Tests:** the crawler's live in its own repo. Here:
  `npm install && npm run check && npm run typecheck && npm run build`.
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
