#!/usr/bin/env node
// The site's tests: `npm test`. Every *.test.ts under src/ (the tests a skill's
// code arrives with, in src/<skill>/test/), run with Node's test runner
// through tsx. With none yet it says so and passes.
import { spawnSync } from "node:child_process";
import { walk } from "./files.mjs";

const files = walk("src").filter((f) => /\.test\.tsx?$/.test(f));
if (!files.length) {
  console.log("test: no tests yet (a skill's tests go in src/<skill>/test/)");
  process.exit(0);
}
const run = spawnSync("node", ["--import", "tsx", "--test", ...files], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const tap = `${run.stdout || ""}${run.stderr || ""}`;
const n = (k) => Number((tap.match(new RegExp(`^# ${k} (\\d+)`, "m")) || [])[1] || 0);
const [pass, fail, skipped] = [n("pass"), n("fail"), n("skipped")];
const summary = `${pass} passed, ${fail} failed${skipped ? `, ${skipped} skipped (they need TEST_DATABASE_URL)` : ""} in ${files.length} file(s)`;
if (run.status !== 0) {
  // Only the failures: each "not ok" with its details, up to the next result.
  const failures = tap.split(/\n(?=\s*(?:not )?ok \d)/).filter((b) => /^\s*not ok/.test(b)).map((b) => b.split(/\n\d+\.\.\d+\n/)[0]);
  console.error(`${failures.join("\n").trim() || tap.trim().split("\n").slice(-40).join("\n")}\ntest: ${summary}\n  Try: node --import tsx --test <file> for one file's whole output`);
  process.exit(1);
}
console.log(`test: ${summary}`);
