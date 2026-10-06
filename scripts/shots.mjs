#!/usr/bin/env node
// The page as a visitor sees it, from the dev service on this machine.
// It is `tt-crawl shoot`, which prints where each image is and what to read first.
import { spawnSync } from "node:child_process";
import { fail, has } from "../src/data/cli.mjs";
import { devUp, pagePaths, shootFlags, start } from "./lib.mjs";

const a = start("shots", `usage: npm run shots [-- /path ... | --all] [--first-screen] [--width N ...]

The page at desktop (1280) and phone (390) width: uploads/<page>-<width>/
overview.png (the whole page in one image, for its shape, when it is
longer than one image), then 01.png,
02.png … (the page at full size, read in order), and page.png (the whole
page at full size, what npm run show sends). /path defaults to /; give
several to shoot several pages. Prints each width's folder and which image
to read first.
  --all            every page the site lists (after a change across the site)
  --first-screen   only what shows before scrolling, one image per width
  --width N        a width in pixels; repeat for more`, { flags: ["width"], bools: ["all", "first-screen"], args: true });

const shoot = shootFlags(a, "shots");
const paths = [...a._.map((p) => (p.startsWith("/") ? p : `/${p}`)), ...(has(a, "all") ? pagePaths().map((p) => p.path).filter((p) => p.startsWith("/")) : [])];
if (!paths.length) paths.push("/");
if (!devUp()) fail("shots: dev is not answering on localhost:3000", "bash ~/app/.taskandtool/setup.sh (or npm run dev)");
let status = 0;
for (const path of paths) {
  const run = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", ...shoot], { stdio: "inherit" });
  if (run.error) fail("shots: tt-crawl is not installed here", "bash ~/app/.taskandtool/setup.sh");
  status ||= run.status ?? 1;
}
process.exit(status);
