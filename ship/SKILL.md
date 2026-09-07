---
description: "Publish this website to Task & Tool's edge and keep the published copy current: build, deploy, verify, redeploy after changes, and what 'on the web' and a custom domain mean. Use when the owner says publish, go live, deploy, put it on the edge, push the changes, or asks why visitors see an old version."
---

# Ship

The site is built here and served from the edge: every page pre-rendered to
HTML plus a small Worker for dynamic routes, always on, nothing to keep
awake. This machine never holds a Cloudflare credential; the platform
deploys on the app's behalf (`deploy_site` in `tools/taskandtool.py`, which
`scripts/deploy.py` wraps). The generic `static-hosting` skill, when it is
present, describes the same mechanism for any app; this is the recipe for
this one.

## Two separate switches

1. **Where the app serves from**: this machine (`runtime_target: sprite`)
   or the edge copy (`worker`). This skill flips it, by deploying.
2. **Whether it is on the web at all**: `none`, `org` (workspace members
   only), or `public`. That is the owner's publish setting in the Task &
   Tool dashboard, never something done from here. Deploying to the edge
   does not make a private site public, and the org gate keeps working in
   front of the edge copy.

Always check before touching a served site:

```python
from tools.taskandtool import serving_status
print(serving_status())
# runtime_target: "sprite" | "worker"; serving_state; public_url; edge_enabled
```

When `runtime_target` is `worker`, an edit here changes nothing visitors
see until the site is deployed again. Say so, then deploy.

## Publishing

1. Finish the work: `npm run check`, `npm run typecheck`, `npm run audit`
   (the crawler's audit against the working copy on this machine: broken
   links, headings, alt text, labels, link text, title and description
   lengths, page weight, sitemap), and a look at the pages in the browser.
   Fix what the audit lists before going on. Set `site.url` in
   `src/site.ts` to the real domain: the canonical tags and the sitemap
   depend on it. For a migrated site, the `launch-check` skill first.
2. Edge serving must be enabled for this app (`edge_enabled: true`). If
   not, ask the owner to enable it in the app's Settings, or send them the
   link: `request_capability("edge", "publish the website to the edge")`.
3. Deploy. It builds first (`dist/` with every page as HTML and every
   static file; `build/worker.mjs` for dynamic routes), then uploads only
   what changed:

   ```bash
   npm run deploy          # = python3 scripts/deploy.py
   ```

   The script prints the public URL. A refusal names the reason
   (`static_hosting_unavailable`: edge serving is not enabled;
   `unsupported_compatibility_flag`: the bundle needs a runtime flag the
   platform does not allow, which means a Node dependency slipped into a
   request path).
4. Verify: fetch the URL (and a dynamic path, if there is one) and look at
   the pages once more. Then tell the owner what is live and remind them
   that whether the site is on the web is their dashboard setting.
5. Commit. The deploy is not a commit; the repo is the record.
6. Once the site is on its real domain, make sure the weekly audit job
   exists (`launch-check` skill: `tt-crawl audit` on a schedule); a site
   nobody checks rots quietly.

After every later change: `npm run deploy` again. Only changed assets are
uploaded; the Worker is replaced whole.

## Custom domain, caching, and access

- A custom domain is the owner's action in the project's settings (Domains
  add-on: a CNAME and an automatic certificate). Once set,
  `serving_status()['public_url']` is that domain. Nothing changes in the
  site.
- The edge serves the pre-rendered pages and static files itself; no
  caching configuration is needed for them. Dynamic routes run in the
  Worker per request.
- Putting paths behind workspace login (an intranet page, a staging area)
  is the owner's edge-auth setting in the dashboard, not code here.

## Rolling back and going back to the machine

- To revert a bad deploy: check out the last good commit, `npm run deploy`.
- To serve from this machine again (an app that outgrew the edge): there
  is no switch for that in the dashboard yet. Say so plainly, keep the
  working copy here current, and tell the owner that Task & Tool can point
  visitors back at the machine on request; the machine must then be awake
  to serve, and the site is slower to first byte.

## What does not fit the edge

A route that needs the filesystem, a long-lived process, a TCP database
driver, or a Node built-in in the request path. The rule for this app is
to keep those at build time. If a feature truly needs a server, say so
plainly and keep the site on the machine rather than forcing it; the
platform's caching add-on makes a machine-served site fast.
