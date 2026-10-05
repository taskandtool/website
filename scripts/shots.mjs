#!/usr/bin/env node
// The page as a visitor sees it, from the dev service on this machine.
// It is `tt-crawl shoot`, which prints where each image is and what to read first.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";

// dev must answer before anything is shot, or every page looks missing
const devUp = () => spawnSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "5", "http://localhost:3000/"], { encoding: "utf8" }).stdout !== "000";

// every page's path, from its module in src/pages/
const pagePaths = () =>
  readdirSync("src/pages").filter((f) => f.endsWith(".tsx"))
    .flatMap((f) => [...readFileSync(`src/pages/${f}`, "utf8").matchAll(/path:\s*["'](\/[^"']*)["']/g)].map((m) => m[1]));

const USAGE = `usage: npm run shots [-- /path ... | --all] [--first-screen] [--width N ...]

The page at desktop (1280) and phone (390) width: uploads/<page>-<width>/
overview.png (the whole page in one image, for its shape, when it is
longer than one image), then 01.png,
02.png … (the page at full size, read in order), and page.png (the whole
page at full size, what npm run show sends). /path defaults to /; give
several to shoot several pages.
  --all            every page the site lists (after a change across the site)
  --first-screen   only what shows before scrolling, one image per width
  --width N        a width in pixels; repeat for more`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const flags = [];
const paths = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--width") {
    if (!/^\d+$/.test(args[i + 1] || "")) {
      console.error(`shots: --width needs a number of pixels, e.g. --width 768\n\n${USAGE}`);
      process.exit(2);
    }
    flags.push(args[i], args[++i]);
  }
  else if (args[i] === "--all") paths.push(...pagePaths());
  else if (args[i].startsWith("--")) flags.push(args[i]);
  else paths.push(args[i].startsWith("/") ? args[i] : `/${args[i]}`);
}
if (!paths.length) paths.push("/");
if (!devUp()) {
  console.error("shots: dev is not answering on localhost:3000. Start it: bash ~/app/.taskandtool/setup.sh (or npm run dev)");
  process.exit(1);
}
let status = 0;
for (const path of paths) {
  const run = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", ...flags], { stdio: "inherit" });
  if (run.error) {
    console.error("shots: tt-crawl is not installed here. Try: bash ~/app/.taskandtool/setup.sh");
    process.exit(1);
  }
  status ||= run.status ?? 1;
}
process.exit(status);
