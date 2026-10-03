#!/usr/bin/env node
// Screenshots of pages, sent to the chat as one group. Look at them yourself
// first (npm run shots); this only shows them.
import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const USAGE = `usage: npm run show [-- /path ...] [--from-shots] [--first-screen] [--width N ...] [--message "…"]

Takes each page whole at desktop (1280) and phone (390) width and sends every
image to the chat as one group (create_deliverables). /path defaults to /.
  --from-shots     send what npm run shots already took, without taking them again
  --first-screen   only what shows before scrolling
  --width N        a width in pixels; repeat for more
  --message "…"    the line shown with the images`;
const MAX_ITEMS = 50; // create_deliverables' limit for one group

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const paths = [];
const shootFlags = [];
let message = null;
let fromShots = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--message") message = args[++i];
  else if (a === "--from-shots") fromShots = true;
  else if (a === "--width") {
    if (!/^\d+$/.test(args[i + 1] || "")) {
      console.error(`show: --width needs a number of pixels, e.g. --width 768\n\n${USAGE}`);
      process.exit(2);
    }
    shootFlags.push(a, args[++i]);
  }
  else if (a === "--first-screen") shootFlags.push(a);
  else if (a.startsWith("--")) {
    console.error(`show: unknown option ${a}\n\n${USAGE}`);
    process.exit(2);
  } else paths.push(a.startsWith("/") ? a : `/${a}`);
}
if (!paths.length) paths.push("/");
const nameOf = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase());
message ||= paths.length === 1 ? `The ${nameOf(paths[0]) === "home" ? "home" : paths[0]} page at desktop and phone width` : `${paths.length} pages at desktop and phone width`;

// the image folders for each page: shot now, or the ones shots left
const folders = [];
for (const path of paths) {
  if (fromShots) {
    const mine = existsSync("uploads") ? readdirSync("uploads").filter((d) => new RegExp(`^${nameOf(path)}-\\d+$`).test(d)) : [];
    if (!mine.length) {
      console.error(`show: no screenshots of ${path} in uploads/. Run npm run shots -- ${path} first, or leave out --from-shots.`);
      process.exit(1);
    }
    folders.push(...mine.sort((a, b) => Number(b.split("-").pop()) - Number(a.split("-").pop())).map((d) => join("uploads", d)));
    continue;
  }
  const shot = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", "--json", ...shootFlags], { encoding: "utf8" });
  let results;
  try {
    results = JSON.parse(shot.stdout);
  } catch {
    console.error(`show: no screenshots of ${path} (${(shot.stderr || shot.error?.message || "tt-crawl failed").trim()})`);
    process.exit(1);
  }
  const failed = results.filter((r) => r.error);
  if (failed.length) {
    console.error(`show: ${path}: ${failed.map((r) => `${r.width}px: ${r.error}`).join("; ")}\nIs the page listed in src/pages/index.ts and the dev service running?`);
    process.exit(1);
  }
  folders.push(...results.map((r) => r.dir));
}

const files = folders.flatMap((d) => readdirSync(d).filter((f) => f.endsWith(".png")).sort().map((f) => join(d, f)));
const sent = files.slice(0, MAX_ITEMS);
const items = sent.map((f) => {
  const [page, width] = [f.split("/").slice(-2)[0].replace(/-\d+$/, ""), f.split("/").slice(-2)[0].split("-").pop()];
  return { path: f, title: `${page}, ${width}px, ${f.split("/").pop()}`, status: "info" };
});

const py = `import json, os, sys
sys.path.insert(0, os.path.expanduser("~"))
try:
    from tools.taskandtool import create_deliverables
except ImportError:
    print(json.dumps({"ok": False, "error": "not on a Task & Tool machine"})); sys.exit(0)
print(json.dumps(create_deliverables(json.loads(sys.argv[1]), sys.argv[2])))`;
const call = spawnSync("python3", ["-c", py, JSON.stringify(items), message], { encoding: "utf8" });
let reply = {};
try {
  reply = JSON.parse(call.stdout.trim().split("\n").pop());
} catch {}
const dropped = files.length - sent.length;
console.log(`show: ${files.length} image${files.length === 1 ? "" : "s"} of ${paths.join(" ")}${dropped ? ` (the first ${sent.length} sent; ${dropped} over the limit of ${MAX_ITEMS})` : ""}\n${sent.map((f) => `  ${f}`).join("\n")}`);
if (reply.ok) {
  console.log(`Sent to the chat as one group ("${message}").`);
  process.exit(0);
}
console.error(`Not sent: ${reply.error || (call.stderr || "").trim() || "create_deliverables failed"}. The images are in uploads/.`);
process.exit(1);
