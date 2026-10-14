# Launching on their domain

The cutover is the moment the owner's domain starts serving this site, and,
when they had one, stops serving their old site. Done when the domain serves
this site, email still works, every old address still answers, and the
weekly audit is set up.

## Before deploying

`npm run check` passes. When there was an old site, its seo area holds this
one to the old one's crawl, so every old URL answers as a page or a 301
straight to one; show the owner what moved where, as a table.

## The cutover

1. `site.url` in `src/site.ts` is the real domain (`npm run build` warns
   while it is empty), and the tracking IDs are there.
2. `npm run deploy`. Ask the owner to make production public when they are
   ready for visitors.
3. The owner points the domain at the platform (a custom domain in the
   app's Settings: a CNAME with an automatic certificate). Say plainly: this
   changes where the website is served from and nothing else; mail records
   (MX) are untouched and email keeps working. Ask them to keep the old site
   up until the check below passes.
4. After the cutover, with an old site, check the real domain against its
   pages:

   ```bash
   tt-crawl check https://theirdomain.com
   ```

5. Set up the weekly audit as a team-only **scheduled job**, and tell the
   owner what it checks and that they can see or remove it on the app's
   Jobs tab. It exits non-zero on any finding, which alerts the owner;
   `raw/audit/_latest.json` names the report, and the chat offers "Fix the
   site audit issues":

   ```bash
   python3 ~/tools/taskandtool.py schedule-job weekly-site-audit --when "0 7 * * 1" \
     --command "tt-crawl audit https://theirdomain.com --inventory raw/site/<host>/_index/inventory.json" --team-only
   ```

   `tt-crawl audit` crawls production for broken links, missing titles and
   h1s, redirect chains and sitemap drift, and with `--inventory` the old
   site's addresses too (leave it off when there was no old site).

## Telling the owner

In plain words: how many old addresses still work, how many redirect,
anything missing and what you did about it, and that rankings usually
settle within two to four weeks after a clean move. When the weekly audit
alerts them, read the latest report, fix what is in the site's control (a
broken internal link, a missing description, a page that lost its h1),
tell the owner about what is not (a partner's site that went away), and
offer to deploy the fix.
