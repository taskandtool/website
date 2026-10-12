// What from-site writes, held to expected copies: a saved crawl of a small
// bakery (test/fixtures/from-site/site/) and its Google listing (places/),
// run in a copy of this repository with tt-crawl and Google Fonts stubbed,
// so nothing leaves this computer. A change to what from-site writes shows
// here as a diff; when it is meant, write the expected copies again:
//   UPDATE_GOLDEN=1 node --test test/from-site.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const fixture = join(root, "test/fixtures/from-site");
const expected = join(fixture, "expected");
/** The files from-site writes that are compared whole. */
const WRITTEN = ["public/business.md", "public/proof.md", "brand/images.md", "src/site.ts", "design/system.yaml"];
/** The folders whose file names are compared. */
const LISTED = ["brand/logo", "static/images", "static/images/logos"];

const resizes = () =>
  spawnSync("ffmpeg", ["-version"]).status === 0 || spawnSync("python3", ["-c", "import PIL"]).status === 0;

/** This repository's tracked files in a temp folder, node_modules linked, the crawl and two stubs beside it. */
function workspace() {
  const dir = mkdtempSync(join(tmpdir(), "from-site-"));
  for (const f of execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean)) {
    if (f.startsWith("test/fixtures/") || !existsSync(join(root, f))) continue;
    mkdirSync(join(dir, dirname(f)), { recursive: true });
    cpSync(join(root, f), join(dir, f));
  }
  symlinkSync(join(root, "node_modules"), join(dir, "node_modules"));
  cpSync(join(fixture, "site"), join(dir, "raw/site"), { recursive: true });
  mkdirSync(join(dir, "bin"));
  // tt-crawl: places answers from the saved listing; anything else (a crawl, a sheet) fails, which from-site survives
  writeFileSync(join(dir, "bin/tt-crawl"), `#!/bin/sh
if [ "$1" = places ]; then mkdir -p raw/places && cp "${fixture}/places/"* raw/places/ && echo '{"ok": true, "place_id": "ChIJharlow"}'; exit 0; fi
exit 1
`);
  chmodSync(join(dir, "bin/tt-crawl"), 0o755);
  // Google Fonts serves every family in 400 and 700
  writeFileSync(join(dir, "bin/fonts.mjs"), `globalThis.fetch = async () => ({ ok: true, text: async () => "font-weight: 400;\\nfont-weight: 700;" });\n`);
  return dir;
}

/** The day a note was written is the day the test ran: masked. */
const masked = (text) => text.replace(/^updated: \d{4}-\d{2}-\d{2}$/gm, "updated: <today>");
const listing = (dir, folder) => (existsSync(join(dir, folder)) ? readdirSync(join(dir, folder)).filter((f) => f.includes(".")).sort() : []);

test("from-site writes the business note, proof, photos, logo and tokens it wrote before", { skip: !resizes() && "needs ffmpeg or Pillow to resize the photos" }, () => {
  const dir = workspace();
  try {
    const env = { PATH: `${join(dir, "bin")}:${process.env.PATH}`, HOME: dir, GOOGLE_PLACES_API_KEY: "test" };
    const run = spawnSync(process.execPath, ["--import", join(dir, "bin/fonts.mjs"), "scripts/from-site.mjs", "https://harlowbakery.com", "--only-homepage"],
      { cwd: dir, env, encoding: "utf8", timeout: 120_000 });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /^from-site: harlowbakery\.com\n/);
    const actual = Object.fromEntries([
      ...WRITTEN.map((f) => [f, masked(readFileSync(join(dir, f), "utf8"))]),
      ...LISTED.map((f) => [`${f}/`, listing(dir, f).join("\n") + "\n"]),
    ]);
    if (process.env.UPDATE_GOLDEN) {
      for (const [f, text] of Object.entries(actual)) {
        const out = join(expected, f.endsWith("/") ? `${f.slice(0, -1)}.list` : f);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, text);
      }
      return;
    }
    for (const [f, text] of Object.entries(actual)) {
      const want = join(expected, f.endsWith("/") ? `${f.slice(0, -1)}.list` : f);
      assert.equal(text, readFileSync(want, "utf8"), `${f} differs from ${want}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
