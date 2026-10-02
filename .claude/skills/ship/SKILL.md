---
description: "Publish this website to production on Cloudflare and keep production current: checks, build, npm run deploy, verify, redeploy after changes, custom domains. Use when the owner says publish, deploy, ship, go live, put it on Cloudflare, push the changes, or asks why production shows an old version."
---

# Ship

The site lives in two places:

- **Dev** is this machine: the `web` service (`npm run dev`) at the app's
  **Development** link, private to the team, every edit there on refresh.
  `setup.sh` registers it; the `website` skill covers the loop.
- **Production** is the site deployed to Cloudflare: every page
  pre-rendered to HTML plus a small Worker for dynamic routes, always on,
  nothing to keep awake. It changes only when you run `npm run deploy`.

Cloudflare here is Task & Tool's: `npm run deploy` wraps `deploy_site` from
`tools/taskandtool.py`, and the platform deploys on the app's behalf. This
machine never holds a Cloudflare credential and never asks for one.

Deploy when the owner asks, not on your own after an edit. After an edit to
a site that is already in production, say it is in dev only until the next
deploy. Where production stands:

```python
from tools.taskandtool import serving_status
print(serving_status())
# production_url; deployed_at (None until the first deploy);
# visible_to: "nobody" | "team" | "anyone"; can_deploy; note
```

## Publishing to production

1. Finish the work: `npm run check`, `npm run typecheck`, `npm run build && npm run lint`, `npm run audit`
   (the crawler's audit against dev: broken links, headings, alt text,
   labels, link text, title and description lengths, page weight,
   sitemap), and a look at the pages in the browser. Fix what the audit
   lists before going on. Set `site.url` in `src/site.ts` to the real
   domain: the canonical tags and the sitemap depend on it. For a migrated
   site, the `launch-check` skill first.
2. Deploy. It builds first (`dist/` with every page as HTML and every
   static file; `build/worker.mjs` for dynamic routes), then uploads only
   what changed:

   ```bash
   npm run deploy          # = python3 scripts/deploy.py
   ```

   The script prints production's address. A refusal names the reason
   (`production_unavailable`: this platform cannot deploy, so the site
   stays in dev; `unsupported_compatibility_flag`: the bundle needs a
   runtime flag the platform does not allow, which means a Node dependency
   slipped into a request path).
3. Verify: open production's address (and a dynamic path, if there is
   one) and look at the pages once more. Tell the owner what changed in
   production. The first deploy opens it to the team; making it public is
   the owner's switch on the dashboard, never yours.
4. Commit. The deploy is not a commit; the repo is the record.
5. Once the site is on its real domain, make sure the weekly audit job
   exists (`launch-check` skill: `tt-crawl audit` on a schedule); a site
   nobody checks rots quietly.

After later changes: `npm run deploy` again. Only changed assets are
uploaded; the Worker is replaced whole. The dashboard's **Publish
changes** button is the owner asking for exactly that. To roll back, check
out the last good commit and deploy it.

## Custom domain and access

- A custom domain is the owner's action in the app's Settings (Publishing:
  a CNAME and an automatic certificate). Once active,
  `serving_status()["production_url"]` is that domain. Nothing changes in
  the site.
- Cloudflare serves the pre-rendered pages and static files itself; no
  caching configuration is needed. Dynamic routes run in the Worker per
  request.
- Who can open production (nobody, the team, or anyone) is the owner's, in
  the app's Settings, and the team sign-in keeps working in front of it.
  Never build access control into the Worker.

## What does not run on Cloudflare

A route that needs the filesystem, a long-lived process, or a Node
built-in in the request path. The rule for this app is to keep those at
build time. If a feature truly needs a server, say so plainly: it can run
in dev, but production cannot have it.
