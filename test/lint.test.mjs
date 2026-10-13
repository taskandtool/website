// The page lint on a built page of its own: this repository's tracked files
// in a temp folder, node_modules linked, dist/ holding only that page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/** npm run lint over one page; all it said. */
function lint(body) {
  const dir = mkdtempSync(join(tmpdir(), "lint-"));
  try {
    for (const f of execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean)) {
      if (f.startsWith("test/fixtures/") || !existsSync(join(root, f))) continue;
      mkdirSync(join(dir, dirname(f)), { recursive: true });
      cpSync(join(root, f), join(dir, f));
    }
    symlinkSync(join(root, "node_modules"), join(dir, "node_modules"));
    mkdirSync(join(dir, "dist/images/logos"), { recursive: true });
    for (const f of ["images/a.jpg", "images/b.jpg", "images/logos/acme.png"]) writeFileSync(join(dir, "dist", f), "");
    writeFileSync(join(dir, "dist/index.html"), `<!doctype html><html lang="en"><head><title>Harlow Bakery</title></head><body><main><h1>Bread</h1>${body}</main></body></html>`);
    const r = spawnSync(process.execPath, ["scripts/lint.mjs"], { cwd: dir, encoding: "utf8", timeout: 60_000 }); return r.stdout + r.stderr;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("a photograph shown twice on a page is a hint; a logo shown twice is not", () => {
  const twice = lint(`<img src="/images/a.jpg" alt="The counter"><img src="/images/b.jpg" alt="Loaves"><img src="/images/a.jpg" alt="The counter">`);
  assert.match(twice, /\/images\/a\.jpg is on this page twice/);
  assert.doesNotMatch(twice, /\/images\/b\.jpg is on this page twice/);
  const logos = lint(`<img src="/images/logos/acme.png" alt="Acme"><img src="/images/logos/acme.png" alt="Acme">`);
  assert.doesNotMatch(logos, /on this page twice/);
});
