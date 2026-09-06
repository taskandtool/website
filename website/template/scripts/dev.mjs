#!/usr/bin/env node
// The development loop in one process: the brand variables regenerated when
// brand/brand.json changes (and the server restarted, since the pages read
// it), Tailwind rebuilding public/site.css on every change, and the server
// restarting when src/ changes. This is what the `web` service runs on a
// Task & Tool machine, so an edit is live on refresh.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

for (const b of ["node_modules/.bin/tailwindcss", "node_modules/.bin/tsx"]) {
  if (!existsSync(b)) {
    console.error(`${b} is missing: run npm install first`);
    process.exit(1);
  }
}

const brand = () => spawnSync("node", ["scripts/brand.mjs"], { stdio: "inherit" });
brand();

let shuttingDown = false;
const shutdown = (code) => {
  if (shuttingDown) return;
  shuttingDown = true;
  css.kill("SIGTERM");
  server.kill("SIGTERM");
  process.exit(code ?? 1);
};

// `--watch=always` (through the css:watch script): keep watching when stdin
// is closed, which it is under a service; plain --watch exits then.
const css = spawn("npm", ["run", "--silent", "css:watch"], { stdio: "inherit" });
css.on("exit", (code) => shutdown(code));

function startServer() {
  const child = spawn("node_modules/.bin/tsx", ["watch", "--clear-screen=false", "src/server.ts"], {
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    // A deliberate restart is not a crash; anything else takes the loop down
    // so the service restarts it cleanly.
    if (!child.restarting) shutdown(code);
  });
  return child;
}
let server = startServer();

// A cheap poll rather than fs.watch: when brand/ is a mirror from another
// app, a refresh swaps the whole folder in, which kills directory watchers
// (tsx's included), so the server is restarted here on every brand change.
const stamp = () => {
  try {
    return statSync("brand/brand.json").mtimeMs;
  } catch {
    return 0;
  }
};
let last = stamp();
setInterval(() => {
  const now = stamp();
  if (now === last || shuttingDown) return;
  last = now;
  brand();
  server.restarting = true;
  server.kill("SIGTERM");
  server = startServer();
}, 1500).unref();

for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => shutdown(0));
