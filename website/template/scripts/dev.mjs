#!/usr/bin/env node
// The development loop in one process: Tailwind rebuilding public/site.css on
// every change and the server restarting when src/ changes. This is what the
// `web` service runs on a Task & Tool machine, so an edit is live on refresh.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const bin = (name) => `node_modules/.bin/${name}`;
for (const b of ["tailwindcss", "tsx"]) {
  if (!existsSync(bin(b))) {
    console.error(`${bin(b)} is missing: run npm install first`);
    process.exit(1);
  }
}

const children = [
  // `--watch=always`: keep watching when stdin is closed, which it is under a
  // service; plain `--watch` exits then and would take the server down.
  spawn(bin("tailwindcss"), ["-i", "styles/input.css", "-o", "public/site.css", "--watch=always"], {
    stdio: "inherit",
  }),
  spawn(bin("tsx"), ["watch", "--clear-screen=false", "src/server.ts"], { stdio: "inherit" }),
];

const stop = (signal) => {
  for (const c of children) c.kill(signal);
};
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => stop(s));
for (const c of children) {
  c.on("exit", (code) => {
    // If either half dies, take the other down so the service restarts cleanly.
    stop("SIGTERM");
    process.exit(code ?? 1);
  });
}
