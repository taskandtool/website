#!/usr/bin/env node
// The page as a visitor sees it: `npm run shots [-- /path] [--first-screen] [--width N]`.
// The whole page at desktop (1280) and phone (390) width by default, as
// strips under uploads/<name>-<width>/ (01.png first), from the dev service on
// this machine (localhost:3000). It is `tt-crawl shoot`, which prints where
// each image is and what to read first.
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const path = args.find((a) => a.startsWith("/")) || "/";
const rest = args.filter((a) => a !== path);
const run = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", ...rest], { stdio: "inherit" });
if (run.error) {
  console.error("shots: tt-crawl is not installed here. Try: bash ~/app/.taskandtool/setup.sh");
  process.exit(1);
}
process.exit(run.status ?? 1);
