#!/usr/bin/env node
// The site's tests: `npm test`. Every test under src/ (the tests a skill's
// code arrives with, in src/<skill>/test/), the scripts' own in test/, and the
// tropes skill's, which lint runs in place: Node's test runner through tsx.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fail } from "../src/data/cli.mjs";
import { start, walk } from "./lib.mjs";

start("test", `usage: npm test

Runs every *.test.ts, .tsx and .mjs under src/, test/ and the tropes skill,
and prints one line: passed, failed, skipped. A failure prints its details
on stderr first. Tests that need a database skip without TEST_DATABASE_URL.`);

const files = ["src", "test", ".claude/skills/tropes/test"].filter(existsSync).flatMap(walk).filter((f) => /\.test\.(tsx?|mjs)$/.test(f));
const run = spawnSync("node", ["--import", "tsx", "--test", ...files], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const tap = `${run.stdout || ""}${run.stderr || ""}`;
const n = (k) => Number((tap.match(new RegExp(`^# ${k} (\\d+)`, "m")) || [])[1] || 0);
const [passed, failed, skipped] = [n("pass"), n("fail"), n("skipped")];
const summary = `${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped (they need TEST_DATABASE_URL)` : ""} in ${files.length} file(s)`;
if (run.status !== 0) {
  // Only the failures: each "not ok" with its details, up to the next result.
  const failures = tap.split(/\n(?=\s*(?:not )?ok \d)/).filter((b) => /^\s*not ok/.test(b)).map((b) => b.split(/\n\d+\.\.\d+\n/)[0]);
  console.error(failures.join("\n").trim() || tap.trim().split("\n").slice(-40).join("\n"));
  fail(`test: ${summary}`, "node --import tsx --test <file>, for one file's whole output");
}
console.log(`test: ${summary}`);
