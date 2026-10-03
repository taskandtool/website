#!/usr/bin/env node
// The page as a visitor sees it, from the dev service on this machine.
// It is `tt-crawl shoot`, which prints where each image is and what to read first.
import { spawnSync } from "node:child_process";

const USAGE = `usage: npm run shots [-- /path] [--first-screen] [--width N ...]

The whole page at desktop (1280) and phone (390) width as strips:
uploads/<page>-<width>/01.png, 02.png … (read in order). /path defaults to /.
  --first-screen   only what shows before scrolling, one image per width
  --width N        a width in pixels; repeat for more`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const flags = [];
let path = "/";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--width") {
    if (!/^\d+$/.test(args[i + 1] || "")) {
      console.error(`shots: --width needs a number of pixels, e.g. --width 768\n\n${USAGE}`);
      process.exit(2);
    }
    flags.push(args[i], args[++i]);
  }
  else if (args[i].startsWith("--")) flags.push(args[i]);
  else path = args[i].startsWith("/") ? args[i] : `/${args[i]}`;
}
const run = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", ...flags], { stdio: "inherit" });
if (run.error) {
  console.error("shots: tt-crawl is not installed here. Try: bash ~/app/.taskandtool/setup.sh");
  process.exit(1);
}
process.exit(run.status ?? 1);
