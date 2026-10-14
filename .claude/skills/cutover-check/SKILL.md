---
name: cutover-check
description: "Checks a rebuilt site against the old one, before and after launch: every old URL answers, redirects land, titles and descriptions exist, the sitemap matches, email survives the cutover; then a weekly audit of the live site. Use before deploying a migrated site, after the cutover, and on an audit alert."
---

# Cutover check

Run the check before judging. The old site's inventory
(`raw/site/<host>/_index/inventory.json`, from the crawl) is the ledger; the check
crawls the new site against it.

## Before deploying (in dev)

`npm run check` passes. Its seo area holds the old site to the new one,
with the inventory in `raw/site/<host>/` as the ledger: every old URL
answers, as a page or a 301 straight to one; every page has a title, one
h1 and a description; the sitemap lists every page; the homepage's JSON-LD
parses. Then show the owner what moved where, as a table.

## Deploying and the cutover

1. `site.url` in `src/site.ts` is the real domain (`npm run build` warns
   while it is empty), and the tracking IDs are there.
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

5. Set the weekly audit up as a team-only **scheduled job**. Tell the
   owner what it checks and that they can see or remove it on the app's
   Jobs tab. It exits non-zero on any finding, which alerts the owner;
   `raw/audit/_latest.json` names the report, and the chat offers "Fix the
   site audit issues":

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
