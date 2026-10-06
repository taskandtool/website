#!/usr/bin/env node
// Screenshots of pages, sent to the chat as one group: each page whole at each
// width, one image apiece (page.png), for the owner to scroll. Look at them
// yourself first (npm run shots); this only shows them.
import { existsSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { done, fail, flag, has, misused } from "../src/data/cli.mjs";
import { devUp, shootFlags, start } from "./lib.mjs";

const a = start("show", `usage: npm run show [-- /path ...] [--from-shots] [--first-screen] [--width N ...] [--message "…"]

Takes each page whole at desktop (1280) and phone (390) width and sends one
image of each whole page per width to the chat as one group
(create-deliverables). /path defaults to /. Prints what it sent and the
bridge's line for the group.
  --from-shots     send what npm run shots already took, without taking them again
  --first-screen   only what shows before scrolling
  --width N        a width in pixels; repeat for more
  --message "…"    the line shown with the images`, { flags: ["width", "message"], bools: ["from-shots", "first-screen"], args: true });
const MAX_ITEMS = 50; // create-deliverables' limit for one group
const BRIDGE = join(homedir(), "tools", "taskandtool.py");

const shoot = shootFlags(a, "show");
if (has(a, "message") && !flag(a, "message")) misused("show: --message needs the line to show", 'npm run show -- --message "The new homepage"');
const fromShots = has(a, "from-shots");
const paths = a._.map((p) => (p.startsWith("/") ? p : `/${p}`));
if (!paths.length) paths.push("/");
const nameOf = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase());
const message = flag(a, "message") || (paths.length === 1 ? `The ${nameOf(paths[0]) === "home" ? "home" : paths[0]} page at desktop and phone width` : `${paths.length} pages at desktop and phone width`);

if (!existsSync(BRIDGE)) fail("show: no Task & Tool bridge on this machine, so there is no chat to send to", "npm run shots, and read the images in uploads/");
if (!fromShots && !devUp()) fail("show: dev is not answering on localhost:3000", "bash ~/app/.taskandtool/setup.sh (or npm run dev), or send what shots took: npm run show -- --from-shots");

// the image folders for each page: shot now, or the ones shots left
const folders = [];
for (const path of paths) {
  if (fromShots) {
    const mine = existsSync("uploads") ? readdirSync("uploads").filter((d) => new RegExp(`^${nameOf(path)}-\\d+$`).test(d)) : [];
    if (!mine.length) fail(`show: no screenshots of ${path} in uploads/`, `npm run shots -- ${path}, then this again (or leave out --from-shots)`);
    folders.push(...mine.sort((a, b) => Number(b.split("-").pop()) - Number(a.split("-").pop())).map((d) => join("uploads", d)));
    continue;
  }
  const shot = spawnSync("tt-crawl", ["shoot", `http://localhost:3000${path}`, "--out", "uploads", "--json", ...shoot], { encoding: "utf8" });
  let results;
  try {
    results = JSON.parse(shot.stdout);
  } catch {
    fail(`show: no screenshots of ${path} (${(shot.stderr || shot.error?.message || "tt-crawl failed").trim()})`, `npm run shots -- ${path}, which says why`);
  }
  const failed = results.filter((r) => r.error);
  if (failed.length) fail(`show: ${path}: ${failed.map((r) => `${r.width}px: ${r.error}`).join("; ")}\n  Is the page listed in src/pages/index.ts?`, `curl -sI http://localhost:3000${path}`);
  folders.push(...results.map((r) => r.dir));
}

// the whole page in one image when shoot made one, else its strips in order
const files = folders.flatMap((d) => {
  const pngs = readdirSync(d).filter((f) => f.endsWith(".png"));
  // create_deliverables takes images under 8 MB; a longer page goes as strips
  if (pngs.includes("page.png") && statSync(join(d, "page.png")).size < 7.5 * 1024 * 1024) return [join(d, "page.png")];
  return pngs.filter((f) => /^\d+\.png$/.test(f)).sort().map((f) => join(d, f));
});
const sent = files.slice(0, MAX_ITEMS);
const items = sent.map((f) => {
  const [page, width] = [f.split("/").slice(-2)[0].replace(/-\d+$/, ""), f.split("/").slice(-2)[0].split("-").pop()];
  const which = f.endsWith("page.png") ? "the whole page" : f.split("/").pop();
  return { path: f, title: `${page}, ${width}px, ${which}`, status: "info" };
});

const call = spawnSync("python3", [BRIDGE, "create-deliverables", "--file", "-", "--message", message], { input: JSON.stringify(items), encoding: "utf8" });
const dropped = files.length - sent.length;
const what = `${files.length} image${files.length === 1 ? "" : "s"} of ${paths.join(" ")}${dropped ? ` (the first ${sent.length}; ${dropped} over the limit of ${MAX_ITEMS})` : ""}`;
if (call.status !== 0) {
  // The bridge's reason, without its own Try line: this one says how to send them again.
  const why = (call.stderr || call.error?.message || "the bridge failed").trim().split("\n").filter((l) => !/^\s*Try:/.test(l)).join("\n  ");
  fail(`show: ${what} not sent; they are in uploads/\n  ${why}`, `npm run show -- ${paths.join(" ")} --from-shots, once that is fixed`);
}
done("show", `${what} sent to the chat as one group ("${message}")`, { lines: [...sent, ...call.stdout.trim().split("\n")] });
