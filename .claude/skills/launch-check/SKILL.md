---
description: "Check a rebuilt site against the old one, before and after launch: every old URL answers, redirects land, titles and descriptions exist, the sitemap matches, the cutover keeps email working — then keep the live site audited weekly. Use before publishing a migrated site, after the cutover, and on an audit alert."
---

# Launch check

Deterministic first, judgment second. The old site's inventory
(`raw/site/<host>/_index/inventory.json`, from the crawl) is the ledger; the check
crawls the new site against it.

## Before publishing (on the working copy)

```bash
npm run check && npm run build
tt-crawl check http://localhost:3000    # the inventory is the one raw/site/<host>; the report goes to raw/audit/<host>/launch-<date>.md
```

Every old URL must answer 200, or 301 to a page that answers 200, on the
new site; a `missing` row is a page the map forgot or a redirect not
written; a `chain` row is a redirect pointing at a redirect (point it at
the end). Every kept page has a title, one h1, and a description; the
sitemap lists every route and nothing else; the home page's JSON-LD
parses. Fix, rebuild, re-run until the report is clean, then show the
owner the report as a table.

## Publishing and the cutover

1. `site.url` in `src/site.ts` is the real domain (canonical tags and the
   sitemap depend on it). Tracking IDs are in `src/site.ts`.
2. `npm run deploy` publishes to production (the `website` skill). The site is now at its
   production address, open to the team; making it public is the owner's
   switch on the app's dashboard.
3. The owner points the domain at the platform (a custom domain in the
   app's Settings: a CNAME with an automatic certificate). Say plainly: this changes where
   the website is served from and nothing else; mail records (MX) are
   untouched and email keeps working. Ask them to keep the old site up
   until the check below passes.
4. After the cutover: run the check against the real domain.

```bash
tt-crawl check https://theirdomain.com
```

5. Set the weekly audit up as a **scheduled job** (`schedule_job` from
   `tools/taskandtool.py`). Asked for in the owner's own chat it starts
   running; called with nobody there it arrives paused, and the reply's `note`
   says which happened — read it and say the right thing. Either way tell them
   what it checks, that it is weekly, and that the Jobs tab is where they
   pause or remove it. The command runs on this machine from the app root every
   Monday morning and exits non-zero when it finds anything, which is what
   alerts the owner; the report lands in `raw/audit/<host>/<date>.md`,
   `raw/audit/_latest.json` points at it, and the chat then offers "Fix the site audit findings":

   ```python
   from tools.taskandtool import schedule_job
   schedule_job("weekly-site-audit", "0 7 * * 1",
                command="tt-crawl audit https://theirdomain.com")
   ```

   `tt-crawl audit` crawls the production site and reports broken internal links
   and images, broken external links, redirect chains, pages missing a
   title, description, or single h1, duplicate titles, images without alt
   text, canonical tags pointing elsewhere, noindex pages, sitemap drift,
   JSON-LD that does not parse, and oversized pages. Run it by hand any
   time (`tt-crawl audit URL`, with `--no-register` for a local run so it
   does not become the site's latest); for the two weeks after launch run
   it with `--inventory raw/site/<host>/_index/inventory.json` too, which
   adds the old URLs the way `check` does.

## What the report means

Tell the owner in plain words: how many old addresses still work, how
many redirect, anything missing and what you did about it, and that
rankings usually settle within two to four weeks after a clean migration.
When the weekly audit alerts them, read the report `raw/audit/_latest.json` names, fix what is
in the site's control (a broken internal link, a missing description, a
page that lost its h1), tell the owner about what is not (a partner's
site that went away), rebuild, and deploy.
