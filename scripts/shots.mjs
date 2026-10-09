#!/usr/bin/env node
// The page as a visitor sees it, from the dev service on this machine.
// It is `tt-crawl shoot`, which prints where each image is and what to read first.
import { spawnSync } from "node:child_process";
import { fail, has } from "../src/data/cli.mjs";
import { devUp, shootFlags, start } from "./lib.mjs";

const a = start("shots", `usage: npm run shots [-- /path ... | --all] [--first-screen] [--width N ...]

The page at desktop (1280) and phone (390) width: uploads/<page>-<width>/
overview.png (the whole page in one image, for its shape, when it is
longer than one image), then 01.png,
02.png … (the page at full size, read in order), and page.png (the whole
page at full size, what npm run show sends). /path defaults to /; give
several to shoot several pages. Prints each width's folder, which image
to read first, and any width where the page scrolls sideways (and what
sticks out).
  --all            every page in the site's sitemap.xml (after a change across the site)
  --first-screen   only what shows before scrolling, one image per width
  --width N        a width in pixels; repeat for more`, { flags: ["width"], bools: ["all", "first-screen"], args: true });

const shoot = shootFlags(a, "shots");
if (!devUp()) fail("shots: dev is not answering on localhost:3000", "bash ~/app/.taskandtool/setup.sh (or npm run dev)");
// --all: the pages dev serves, as its sitemap lists them (the 404 page is not one)
const listed = async () => {
  const xml = await (await fetch("http://localhost:3000/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1], "http://localhost:3000").pathname);
};
const paths = [...a._.map((p) => (p.startsWith("/") ? p : `/${p}`)), ...(has(a, "all") ? await listed() : [])];
if (!paths.length) paths.push("/");
let status = 0;
for (const path of paths) {
  const run = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", ...shoot], { stdio: "inherit" });
  if (run.error) fail("shots: tt-crawl is not installed here", "bash ~/app/.taskandtool/setup.sh");
  status ||= run.status ?? 1;
}
process.exit(status);
