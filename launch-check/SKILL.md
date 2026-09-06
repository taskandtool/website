---
description: "Check a rebuilt site against the old one before and after launch: every old URL answers, redirects land, titles and descriptions exist, the sitemap matches, the JSON-LD parses, and the cutover keeps email working. Use before publishing a migrated site, after the domain cutover, and on the monthly reminder."
---

# Launch check

Deterministic first, judgment second. The old site's inventory
(`raw/web/_inventory.json`, from the crawl) is the ledger; the check
crawls the new site against it.

## Before publishing (on the working copy)

```bash
npm run check && npm run build
tt-crawl check http://localhost:3000 --inventory raw/web/_inventory.json --out raw/web/_launch-check.md
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
2. The `ship` skill publishes to the edge. The site is now live on the
   platform URL; whether it is on the web at all is the owner's dashboard
   setting.
3. The owner points the domain at the platform (the Domains add-on: a
   CNAME with an automatic certificate). Say plainly: this changes where
   the website is served from and nothing else; mail records (MX) are
   untouched and email keeps working. Ask them to keep the old site up
   until the check below passes.
4. After the cutover: run the check against the real domain.

```bash
tt-crawl check https://theirdomain.com --inventory raw/web/_inventory.json --out raw/web/_launch-check.md
```

5. Schedule the follow-ups with `schedule_reminder` from
   `tools/taskandtool.py`: one in two weeks ("re-run the launch check
   and report; read the Search Console coverage report if that
   connection exists") and one monthly ("run tt-crawl check against the
   live site; report broken links and any fact on a page that differs
   from public/"). If the owner never publishes, the reminder says so
   once and asks whether to keep it.

## What the report means

Tell the owner in plain words: how many old addresses still work, how
many redirect, anything missing and what you did about it, and that
rankings usually settle within two to four weeks after a clean migration.
