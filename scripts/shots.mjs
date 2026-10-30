#!/usr/bin/env node
// The page as a visitor sees it: from the dev service on this machine, or at
// any full address (production, dev's team address), signed in where it asks.
// It is `tt-crawl shoot`, which prints where each image is and what to read first.
import { spawnSync } from "node:child_process";
import { fail, has } from "../src/data/cli.mjs";
import { devUp, shootFlags, start } from "./lib.mjs";

const a = start("shots", `usage: npm run shots [-- /path|https://... ... | --all] [--first-screen] [--width N ...]

The page at desktop (1280) and phone (390) width: uploads/<page>-<width>/
overview.webp (the whole page in one image, for its shape, when it is
longer than one image), then 01.webp,
02.webp … (the page at full size, read in order), and page.png (the whole
page at full size, what npm run show sends). /path is dev's and defaults
to /; a full address (https://...) shoots that page, production included,
as the person you work for sees it. Give several to shoot several pages.
Prints each width's folder and which image to read first. What a browser can measure (left edges, text size,
room in a panel, sideways scrolling) is npm run check:design.
  --all            every page in the site's sitemap.xml (after a change across the site)
  --first-screen   only what shows before scrolling, one image per width
  --width N        a width in pixels; repeat for more`, { flags: ["width"], bools: ["all", "first-screen"], args: true });

const shoot = shootFlags(a, "shots");
const full = (p) => /^https?:\/\//.test(p);
const needsDev = !a._.length || has(a, "all") || a._.some((p) => !full(p));
if (needsDev && !devUp()) fail("shots: dev is not answering on localhost:3000", "bash ~/app/.taskandtool/setup.sh (or npm run dev)");
// --all: the pages dev serves, as its sitemap lists them (the 404 page is not one)
const listed = async () => {
  const res = await fetch("http://localhost:3000/sitemap.xml").catch(() => null);
  const xml = res?.ok ? await res.text() : "";
  const found = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1], "http://localhost:3000").pathname);
  if (!found.length) fail(`shots: --all read no pages from /sitemap.xml (${res ? `answered ${res.status}` : "no answer"})`, "curl -s localhost:3000/sitemap.xml");
  return found;
};
const local = (p) => `http://localhost:3000${p.startsWith("/") ? p : `/${p}`}`;
const urls = [...a._.map((p) => (full(p) ? p : local(p))), ...(has(a, "all") ? (await listed()).map(local) : [])];
if (!urls.length) urls.push(local("/"));
let status = 0;
for (const url of urls) {
  const run = spawnSync("tt-crawl", ["shoot", url, "--out", "uploads", ...shoot], { stdio: "inherit" });
  if (run.error) fail("shots: tt-crawl is not installed here", "bash ~/app/.taskandtool/setup.sh");
  status ||= run.status ?? 1;
}
process.exit(status);
