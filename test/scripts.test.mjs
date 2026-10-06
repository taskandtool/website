// Every script keeps the contract before it touches anything: --help and -h
// print the usage and exit 0; an unknown flag, or a stray argument where none
// is taken, exits 2 with nothing on stdout and a Try line on stderr.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
/** The entry points: every .mjs but the shared modules, and the .ts scripts npm runs directly. */
const LIBRARIES = new Set(["lib.mjs", "run.mjs", "theme.mjs"]);
const TS_ENTRIES = ["build.ts", "db.ts"];
const scripts = [...readdirSync(`${root}scripts`).filter((f) => f.endsWith(".mjs") && !LIBRARIES.has(f)), ...TS_ENTRIES];
/** The ones that take arguments, so a stray word is not misuse for them. */
const TAKES_ARGS = new Set(["forms.mjs", "from-site.mjs", "images.mjs", "shots.mjs", "show.mjs"]);

const run = (script, args) =>
  new Promise((done) => {
    const argv = script.endsWith(".ts") ? ["--import", "tsx", `scripts/${script}`, ...args] : [`scripts/${script}`, ...args];
    execFile(process.execPath, argv, { cwd: root, encoding: "utf8", timeout: 60_000 }, (err, stdout, stderr) =>
      done({ status: err ? (typeof err.code === "number" ? err.code : 1) : 0, stdout, stderr }),
    );
  });

for (const script of scripts) {
  test(`${script}: --help and -h print the usage and exit 0`, async () => {
    for (const h of ["--help", "-h"]) {
      const r = await run(script, [h]);
      assert.equal(r.status, 0, `${script} ${h}: ${r.stderr}`);
      assert.match(r.stdout, /\S/, `${script} ${h} printed nothing`);
    }
  });

  test(`${script}: an unknown flag exits 2 with a Try line`, async () => {
    const r = await run(script, ["--no-such-flag"]);
    assert.equal(r.status, 2, `${script} --no-such-flag: ${r.stderr}`);
    assert.equal(r.stdout, "");
    assert.match(r.stderr, /Try: /);
  });

  if (!TAKES_ARGS.has(script)) {
    test(`${script}: a stray argument exits 2 with a Try line`, async () => {
      const r = await run(script, ["stray"]);
      assert.equal(r.status, 2, `${script} stray: ${r.stderr}`);
      assert.equal(r.stdout, "");
      assert.match(r.stderr, /Try: /);
    });
  }
}

test("from-site, images and shots refuse wrong input with exit 2 before any work", async () => {
  for (const [script, args, said] of [
    ["from-site.mjs", [], /full URL/],
    ["from-site.mjs", ["a.com", "b.com"], /one site at a time/],
    ["images.mjs", [], /name the picture/],
    ["images.mjs", ["a.jpg", "b.jpg", "--as", "hero"], /--as names one file/],
    ["shots.mjs", ["--width", "wide"], /--width needs a number/],
    ["show.mjs", ["--width"], /show: --width needs a value/],
  ]) {
    const r = await run(script, args);
    assert.equal(r.status, 2, `${script} ${args.join(" ")}: ${r.stderr}`);
    assert.equal(r.stdout, "");
    assert.match(r.stderr, said);
    assert.match(r.stderr, /Try: /);
  }
});
