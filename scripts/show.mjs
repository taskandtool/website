#!/usr/bin/env node
// Screenshots of a page, sent to the chat: `npm run show [-- /path] [--message "…"]`.
// Takes the whole page at desktop and phone width (npm run shots), then hands
// the images to create_deliverables as one group, so the person sees what you
// see. Look at the images yourself first; this only shows them.
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const args = process.argv.slice(2);
const path = args.find((a) => a.startsWith("/")) || "/";
const at = args.indexOf("--message");
const message = at >= 0 ? args[at + 1] : `The ${path === "/" ? "home" : path} page at desktop and phone width`;
const name = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const shot = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", "--json"], { encoding: "utf8" });
let results;
try {
  results = JSON.parse(shot.stdout);
} catch {
  console.error(`show: no screenshots (${(shot.stderr || shot.error?.message || "tt-crawl failed").trim()})`);
  process.exit(1);
}
const failed = results.filter((r) => r.error);
if (failed.length) {
  console.error(`show: ${failed.map((r) => `${r.width}px: ${r.error}`).join("; ")}\nIs the page served? curl -s -o /dev/null -w '%{http_code}' http://localhost:3000${path}`);
  process.exit(1);
}
const files = results.flatMap((r) => readdirSync(r.dir).filter((f) => f.endsWith(".png")).sort().map((f) => join(r.dir, f)));
const items = files.slice(0, 20).map((f) => ({ path: f, title: `${name}, ${f.split("-").pop().split("/")[0]}px, ${f.split("/").pop()}`, status: "info" }));

const py = `import json, os, sys
sys.path.insert(0, os.path.expanduser("~"))
try:
    from tools.taskandtool import create_deliverables
except ImportError:
    print(json.dumps({"ok": False, "error": "not on a Task & Tool machine"})); sys.exit(0)
print(json.dumps(create_deliverables(json.loads(sys.argv[1]), sys.argv[2])))`;
const sent = spawnSync("python3", ["-c", py, JSON.stringify(items), message], { encoding: "utf8" });
let reply = {};
try {
  reply = JSON.parse(sent.stdout.trim().split("\n").pop());
} catch {}
console.log(`show: ${files.length} image${files.length === 1 ? "" : "s"} of ${path}\n${files.map((f) => `  ${f}`).join("\n")}`);
console.log(reply.ok ? `Sent to the chat as one group ("${message}").` : `Not sent: ${reply.error || (sent.stderr || "").trim() || "create_deliverables failed"}. The images are in uploads/.`);
process.exit(reply.ok ? 0 : 1);
