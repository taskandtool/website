# Launching on their domain

At the cutover, you point the owner's domain at this site instead of any old one. Done when the domain serves
this site, email still works, and every old address still answers.

## Before deploying

`npm run check` passes. When there was an old site, the seo part of the
check compares this site with the old site's crawl: every old URL must
answer as a page or as a 301 straight to one. Show the owner what moved
where, as a table.

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

5. Offer a regular site audit, weekly or monthly, as a team-only
   **scheduled job**. The owner decides how often it runs, or whether it
   runs at all, and changes or removes it on the app's Jobs tab. A run
   that finds a problem exits 1. Task & Tool then posts a note in the
   app's chat and activity, once, until a run passes again. `raw/audit/_latest.json`
   names the latest report. Weekly, Mondays at 07:00 UTC:

   ```bash
   python3 ~/tools/taskandtool.py schedule-job "Site audit" --when "0 7 * * 1" \
     --command "tt-crawl audit https://theirdomain.com"
   ```

   `tt-crawl audit` crawls production for broken links, missing titles and
   h1s, redirect chains and sitemap drift. After a move from an old site,
   `--inventory raw/site/<host>/_index/inventory.json` checks the old
   addresses too; suggest it for the first weeks.

## Telling the owner

In plain words: how many old addresses still work, how many redirect,
anything missing and what you did about it, and that rankings usually
settle within a few weeks after a clean move. After an audit alert, read
the latest report, fix what is in the site's control (a
broken internal link, a missing description, a page that lost its h1),
tell the owner about what is not (a partner's site that went away), and
offer to deploy the fix.
