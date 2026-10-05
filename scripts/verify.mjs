#!/usr/bin/env node
// Every check before showing work, in one call: `npm run verify`.
// content (the notes compiled), check (the project), typecheck (src/), test
// (any skill's tests), build (dist/), proof (the homepage shows it all), trace
// (every fact on the pages is in the notes), lint (the built pages), one line
// each. It runs them all and lists every failure together, so they are fixed
// in one pass; proof, trace and lint need the build, so a failed build skips
// them. Lint hints are listed but never fail.
import { spawnSync } from "node:child_process";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("usage: npm run verify\n\nRuns content, check, typecheck, test, build, proof, trace and lint, and lists every failure together.");
  process.exit(0);
}

const steps = [
  ["content", "the notes in public/, posts/ and legal/ compiled for the pages"],
  ["check", "the project: the design record, contrast, page paths, the site map, the Cloudflare rule"],
  ["typecheck", "the TypeScript in src/"],
  ["test", "the tests under src/"],
  ["build", "every page pre-rendered to dist/, the Worker bundled"],
  ["proof", "every logo and rating in public/proof.md on the homepage, and its reviews"],
  ["trace", "every phone, email, price, year, count and quote on the pages is in the notes"],
  ["lint", "the built pages"],
];
const NEEDS_BUILD = new Set(["proof", "trace", "lint"]);

const failed = [];
for (const [name, what] of steps) {
  if (NEEDS_BUILD.has(name) && failed.some((f) => f.name === "build")) {
    console.log(`  --  ${name}: skipped until the build passes`);
    continue;
  }
  const run = spawnSync("npm", ["run", "--silent", name], { encoding: "utf8" });
  const out = `${run.stdout || ""}${run.stderr || ""}`.replace(/\s+$/, "");
  if (run.status !== 0) {
    console.log(`  !!  ${name}: failed (${what})`);
    const all = out.split("\n");
    const cut = all.length > 25 ? `(${all.length - 25} more lines above: npm run ${name})\n` : "";
    failed.push({ name, tail: cut + all.slice(-25).join("\n") });
    continue;
  }
  const lines = out.split("\n").filter((l) => l.trim());
  const last = (lines.pop() || "ok").trim().replace(new RegExp(`^${name}: `), "");
  console.log(`  ok  ${name}: ${name === "build" ? "dist/ written" : last}`);
  if (name === "lint") {
    const hints = out.split("\n").filter((l) => /^\s*hint\b|^\s{8}\S/.test(l));
    if (hints.length) console.log(hints.join("\n"));
  }
}
if (failed.length) {
  console.error(`\n${failed.map((f) => `── ${f.name}\n${f.tail}`).join("\n\n")}\n\nverify: ${failed.length} failed (${failed.map((f) => f.name).join(", ")}). Fix them all in one pass, then npm run verify again.`);
  process.exit(1);
}
console.log("verify: all passed. Next: npm run shots, and look at the images.");
