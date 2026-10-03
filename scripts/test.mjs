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
const run = spawnSync("node", ["--import", "tsx", "--test", ...files], { stdio: "inherit" });
process.exit(run.status ?? 1);
