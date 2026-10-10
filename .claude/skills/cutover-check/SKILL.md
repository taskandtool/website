---
name: cutover-check
description: "Checks a rebuilt site against the old one, before and after launch: every old URL answers, redirects land, titles and descriptions exist, the sitemap matches, email survives the cutover; then a weekly audit of the live site. Use before deploying a migrated site, after the cutover, and on an audit alert."
---

# Cutover check

Deterministic first, judgment second. The old site's inventory
(`raw/site/<host>/_index/inventory.json`, from the crawl) is the ledger; the check
crawls the new site against it.

## Before deploying (in dev)

```bash
npm run verify
tt-crawl check http://localhost:3000    # the inventory is the one raw/site/<host>; the report goes to raw/audit/<host>/launch-<date>.md
```

Every old URL must answer 200, or 301 to a page that answers 200, on the
new site; a `missing` row is a page the map forgot or a redirect not
written; a `chain` row is a redirect pointing at a redirect (point it at
the end). Every kept page has a title, one h1, and a description; the
sitemap lists every route and nothing else; the home page's JSON-LD
parses. Fix, rebuild, re-run until the report is clean, then show the
owner the report as a table.

## Deploying and the cutover

1. `npm run build` warns of nothing left to set before launch, and the
   tracking IDs are in `src/site.ts`.
2. `npm run deploy` (the `website` skill). Ask the owner to make production
   public when they are ready for visitors.
3. The owner points the domain at the platform (a custom domain in the
   app's Settings: a CNAME with an automatic certificate). Say plainly: this changes where
   the website is served from and nothing else; mail records (MX) are
   untouched and email keeps working. Ask them to keep the old site up
   until the check below passes.
4. After the cutover: run the check against the real domain.

```bash
tt-crawl check https://theirdomain.com
```

5. Set the weekly audit up as a **scheduled job**, kept for the team. Tell the owner what it
   checks, that it runs weekly, and that they can see or remove it on the
   app's Jobs tab. The command runs on this machine from the app root every
   Monday morning and exits non-zero when it finds anything, which is what
   alerts the owner; the report lands in `raw/audit/<host>/<date>.md`,
   `raw/audit/_latest.json` points at it, and the chat then offers "Fix the site audit issues":

   ```bash
   python3 ~/tools/taskandtool.py schedule-job weekly-site-audit --when "0 7 * * 1" \
     --command "tt-crawl audit https://theirdomain.com" --team-only
   ```

   `tt-crawl audit` crawls production for broken links, missing titles and
   h1s, redirect chains, sitemap drift and the like. Run it by hand any time
   (`--no-register` for a local run); for two weeks after launch add
   `--inventory raw/site/<host>/_index/inventory.json` to cover the old URLs.

## What the report means

Tell the owner in plain words: how many old addresses still work, how
many redirect, anything missing and what you did about it, and that
rankings usually settle within two to four weeks after a clean migration.
When the weekly audit alerts them, read the report `raw/audit/_latest.json` names, fix what is
in the site's control (a broken internal link, a missing description, a
page that lost its h1), tell the owner about what is not (a partner's
site that went away), and offer to deploy the fix.
