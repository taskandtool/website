#!/usr/bin/env node
// Every check before showing work, in one call: `npm run verify`.
// check (the project), typecheck (src/), build (dist/), lint (the built
// pages), in that order, one line each. It stops at the first that fails and
// prints the end of its output, which says what to fix; lint hints are shown
// but never fail.
import { spawnSync } from "node:child_process";

const steps = [
  ["check", "the project: the design record, contrast, page paths, the site map, the Cloudflare rule"],
  ["typecheck", "the TypeScript in src/"],
  ["build", "every page pre-rendered to dist/, the Worker bundled"],
  ["lint", "the built pages"],
];

for (const [name, what] of steps) {
  const run = spawnSync("npm", ["run", "--silent", name], { encoding: "utf8" });
  const out = `${run.stdout || ""}${run.stderr || ""}`.trim();
  if (run.status !== 0) {
    const tail = out.split("\n").slice(-25).join("\n");
    console.log(`verify: ${name} failed (${what})\n\n${tail}\n\nFix that, then npm run verify again.`);
    process.exit(1);
  }
  const last = (out.split("\n").filter((l) => l.trim()).pop() || "ok").replace(new RegExp(`^${name}: `), "");
  console.log(`  ok  ${name}: ${name === "build" ? "dist/ written" : last}`);
  if (name === "lint" && /[1-9]\d* hint/.test(out)) console.log(out.split("\n").filter((l) => /^\s+hint|^\s{8}\S/.test(l)).join("\n"));
}
console.log("verify: all passed. Next: npm run show to look at the page and share it.");
