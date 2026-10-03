#!/usr/bin/env node
// Every check before showing work, in one call: `npm run verify`.
// content (the notes compiled), check (the project), typecheck (src/), test
// (any skill's tests), build (dist/), lint (the built pages), in that order,
// one line each. It stops at the first that fails and prints the end of its
// output, which says what to fix; lint hints are listed but never fail.
import { spawnSync } from "node:child_process";

const steps = [
  ["content", "the notes in public/, posts/ and legal/ compiled for the pages"],
  ["check", "the project: the design record, contrast, page paths, the site map, the Cloudflare rule"],
  ["typecheck", "the TypeScript in src/"],
  ["test", "the tests under src/"],
  ["build", "every page pre-rendered to dist/, the Worker bundled"],
  ["lint", "the built pages"],
];

for (const [name, what] of steps) {
  const run = spawnSync("npm", ["run", "--silent", name], { encoding: "utf8" });
  const out = `${run.stdout || ""}${run.stderr || ""}`.replace(/\s+$/, "");
  if (run.status !== 0) {
    const tail = out.split("\n").slice(-25).join("\n");
    console.error(`verify: ${name} failed (${what})\n\n${tail}\n\nFix that, then npm run verify again.`);
    process.exit(1);
  }
  const lines = out.split("\n").filter((l) => l.trim());
  const last = (lines.pop() || "ok").trim().replace(new RegExp(`^${name}: `), "");
  console.log(`  ok  ${name}: ${name === "build" ? "dist/ written" : name === "content" ? "compiled" : last}`);
  if (name === "lint") {
    const hints = out.split("\n").filter((l) => /^\s*hint\b|^\s{8}\S/.test(l));
    if (hints.length) console.log(hints.join("\n"));
  }
}
console.log("verify: all passed. Next: npm run shots, and look at the images.");
