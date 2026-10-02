---
description: "Deploy this website to Task & Tool's edge and keep the deployed copy current: build, deploy, verify, redeploy after changes, and what 'on the web' and a custom domain mean. Use when the owner says deploy, publish, go live, put it on the edge or on Cloudflare, push the changes, or asks why visitors see an old version."
---

# Ship

The site is built here and served from the edge: every page pre-rendered to
HTML plus a small Worker for dynamic routes, always on, nothing to keep
awake. The edge is Task & Tool's, on Cloudflare: "publish to Cloudflare"
means this skill, not wrangler. This machine never holds a Cloudflare
credential and never asks for one; the platform deploys on the app's behalf (`deploy_site` in `tools/taskandtool.py`, which
`scripts/deploy.py` wraps). The generic `static-hosting` skill, when it is
present, describes the same mechanism for any app; this is the recipe for
this one.

## Three things, kept apart

1. **This machine's web service.** `setup.sh` registers the site as the
   `web` service (the `serving` skill covers it). It is what the app's
   **Development** address shows: the working copy, edits included, to the
   team only. It is private, so there is nothing to ask or publish; keep it
   running.
2. **What Cloudflare serves at the Live address.** Every request to the
   Live address (`<project>-<app>`, or the owner's custom domain) goes
   through Task & Tool's edge on Cloudflare. Cloudflare either serves the
   deployed copy itself (`runtime_target: worker`) or forwards the request
   to this machine's web service (`sprite`). A deploy switches it to the
   deployed copy; `serve_from_machine()` switches it back to forwarding.
   Deploy when the owner asks, not on your own after an edit.
3. **Who can open Live**: nobody (`none`), the team (`org`, signed in,
   clients placed on the app included), or anyone (`public`). A deploy
   publishes an unpublished site to the team; public is only ever the
   owner's switch on the dashboard. The dashboard's **Publish changes**
   button is the owner asking you to deploy again.

While Live is on the edge, Live shows the last deploy and Development shows
the working copy.

Always check before touching a served site:

```python
from tools.taskandtool import serving_status
print(serving_status())
# runtime_target: "sprite" | "worker"; serving_state: "none" | "org" | "public";
# public_url; edge_enabled; live_deployment; note
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
2. Deploy. It builds first (`dist/` with every page as HTML and every
   static file; `build/worker.mjs` for dynamic routes), then uploads only
   what changed:

   ```bash
   npm run deploy          # = python3 scripts/deploy.py
   ```

   The script prints the public URL. A refusal names the reason
   (`static_hosting_unavailable`: the platform has no edge set up;
   `unsupported_compatibility_flag`: the bundle needs a runtime flag the
   platform does not allow, which means a Node dependency slipped into a
   request path).
3. Verify: fetch the URL (and a dynamic path, if there is one) and look at
   the pages once more. Then tell the owner what is live and remind them
   that whether the site is on the web is their dashboard setting.
4. Commit. The deploy is not a commit; the repo is the record.
5. Once the site is on its real domain, make sure the weekly audit job
   exists (`launch-check` skill: `tt-crawl audit` on a schedule); a site
   nobody checks rots quietly.

After later changes: `npm run deploy` again. Only changed assets are
uploaded; the Worker is replaced whole.

## Custom domain and access

- A custom domain is the owner's action in the app's Settings (Publishing:
  a CNAME and an automatic certificate). Once active,
  `serving_status()['public_url']` is that domain. Nothing changes in the
  site.
- The edge serves the pre-rendered pages and static files itself; no
  caching configuration is needed for them. Dynamic routes run in the
  Worker per request.
- Who can open the Live address (nobody, the team, or anyone) is the
  owner's, in the app's Settings (Publishing), and the team gate keeps
  working in front of the edge copy. Never build access control into the
  Worker.

## Rolling back and going back to the machine

- To revert a bad deploy: check out the last good commit, `npm run deploy`.
- To serve Live from this machine again (the site needs a server the edge
  cannot run, or edits should reach Live at once): check the `web` service
  is running (`sprite-env services get web`), then:

  ```python
  from tools.taskandtool import serve_from_machine
  print(serve_from_machine())
  ```

  Within a minute or two Cloudflare forwards Live to this machine instead
  of serving the deployed copy, which is then deleted. Who can open Live
  does not change. Live is then slower to first byte, and the machine
  wakes for visitors.

## What does not fit the edge

A route that needs the filesystem, a long-lived process, a TCP database
driver, or a Node built-in in the request path. The rule for this app is
to keep those at build time. If a feature truly needs a server, say so
plainly and keep the site on the machine (above) rather than forcing it.
