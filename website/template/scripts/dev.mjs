#!/usr/bin/env node
// The development loop in one process: the content regenerated when a note,
// post, or legal page changes, Tailwind rebuilding static/site.css on every
// change, and the server restarting when src/ changes (the generated content
// is imported, so a regenerated file restarts it too). This is what the
// `web` service runs on a Task & Tool machine, so an edit is live on refresh.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

for (const b of ["node_modules/.bin/tailwindcss", "node_modules/.bin/tsx"]) {
  if (!existsSync(b)) {
    console.error(`${b} is missing: run npm install first`);
    process.exit(1);
  }
}

const content = () => spawnSync("node", ["scripts/content.mjs"], { stdio: "inherit" });
content();
// A cheap poll over the note folders (a mirror refresh swaps whole folders,
// which kills directory watchers).
const stamp = () => {
  let latest = 0;
  for (const dir of ["public", "posts", "legal"]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      try {
        latest = Math.max(latest, statSync(join(dir, f)).mtimeMs);
      } catch {}
    }
  }
  return latest;
};
let last = stamp();
setInterval(() => {
  const now = stamp();
  if (now !== last) {
    last = now;
    content();
  }
}, 2000).unref();

const children = [
  // `--watch=always` (through the css:watch script): keep watching when stdin
  // is closed, which it is under a service; plain --watch exits then and
  // would take the server down with it.
  spawn("npm", ["run", "--silent", "css:watch"], { stdio: "inherit" }),
  spawn("node_modules/.bin/tsx", ["watch", "--clear-screen=false", "src/server.ts"], { stdio: "inherit" }),
];

let stopping = false;
const stop = (signal, code) => {
  if (stopping) return;
  stopping = true;
  for (const c of children) c.kill(signal);
  process.exit(code ?? 0);
};
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => stop(s, 0));
for (const c of children) {
  // If either half dies, take the other down so the service restarts cleanly.
  c.on("exit", (code) => stop("SIGTERM", code ?? 1));
}
