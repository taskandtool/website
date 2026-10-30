// The checks on a built page of their own: this repository's tracked files in
// a temp folder, node_modules linked, dist/ holding only that page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pageFindings } from "../scripts/checks/pages.mjs";
import { proofFindings } from "../scripts/checks/proof.mjs";
import { projectFindings } from "../scripts/checks/project.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

/** The page findings for one page, with brand/images.md's rows and extra CSS when given. */
function check(body, { rows = "", css = "", proof = "", page = "", run = pageFindings } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "check-"));
  const back = process.cwd();
  try {
    for (const f of execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean)) {
      if (f.startsWith("test/fixtures/") || !existsSync(join(root, f))) continue;
      mkdirSync(join(dir, dirname(f)), { recursive: true });
      cpSync(join(root, f), join(dir, f));
    }
    symlinkSync(join(root, "node_modules"), join(dir, "node_modules"));
    mkdirSync(join(dir, "dist/images/logos"), { recursive: true });
    for (const f of ["images/a.jpg", "images/b.jpg", "images/logos/acme.png"]) writeFileSync(join(dir, "dist", f), "");
    if (rows) writeFileSync(join(dir, "brand/images.md"), `| File | What it shows |\n|---|---|\n${rows}\n`);
    if (css) appendFileSync(join(dir, "styles/input.css"), css);
    if (page) writeFileSync(join(dir, "src/pages/reviews.tsx"), page);
    if (proof) writeFileSync(join(dir, "public/proof.md"), `---\n${proof}\n---\n`);
    writeFileSync(join(dir, "dist/index.html"), `<!doctype html><html lang="en"><head><title>Harlow Bakery</title></head><body><main><h1>Bread</h1>${body}</main></body></html>`);
    process.chdir(dir);
    return run();
  } finally {
    process.chdir(back);
    rmSync(dir, { recursive: true, force: true });
  }
}
const said = (findings) => findings.map((f) => `${f.level} ${f.area} ${f.rule} ${f.message}`).join("\n");

test("a photograph shown twice on a page is a design hint; a logo shown twice is not", () => {
  const twice = said(check(`<img src="/images/a.jpg" alt="The counter"><img src="/images/b.jpg" alt="Loaves"><img src="/images/a.jpg" alt="The counter">`));
  assert.match(twice, /hint design repeated-photo \/images\/a\.jpg is on this page twice/);
  assert.doesNotMatch(twice, /\/images\/b\.jpg is on this page twice/);
  assert.doesNotMatch(said(check(`<img src="/images/logos/acme.png" alt="Acme"><img src="/images/logos/acme.png" alt="Acme">`)), /on this page twice/);
});

test("a photograph on a page that brand/images.md does not describe is a facts error", () => {
  const out = said(check(`<img src="/images/a.jpg" alt="The counter"><img src="/images/b.jpg" alt="Loaves">`, {
    rows: "| static/images/a.jpg (1600x1067) | The counter at opening, bread on the shelves |\n| static/images/b.jpg (1600x2400) | |",
  }));
  assert.match(out, /error facts photo-undescribed \/images\/b\.jpg is on the page but brand\/images\.md does not say what it shows/);
  assert.doesNotMatch(out, /\/images\/a\.jpg is on the page but/);
});

test("a class of the site's own in styles/ is a design error; the starter's are not", () => {
  assert.doesNotMatch(said(check("<p>Fresh daily.</p>")), /custom-css/);
  const out = said(check("<p>Fresh daily.</p>", { css: "\n.bakery-hero { font-size: 11px; }\n.bakery-hero .note, .club-band { padding: 0; }\n" }));
  assert.match(out, /error design custom-css styles\/input\.css defines its own classes \(\.bakery-hero, \.note, \.club-band\)/);
});

test("each finding names its area: search, copy, design", () => {
  const out = said(check(`<img src="/images/b.jpg"><p>We offer unparalleled, world-class quality — always.</p>`)); // tropes-allow
  assert.match(out, /error seo img-alt/);
  assert.match(out, /error copy em-dash/);
  assert.match(said(check("<footer><p>Original shop powered by <a href=\"https://squarespace.com\">Squarespace</a></p></footer>")), /error copy old-builder "powered by Squarespace" is the old site's builder credit/);
});

test("reviews count only through ReviewsSection; typed out by hand they are named", () => {
  const proof = "reviews:\n  - quote: Delicious and addictive, the key lime is our favourite\n    name: Chris B.\n    platform: Google";
  const byHand = said(check("<p>Delicious and addictive, the key lime is our favourite</p>", { proof, run: () => proofFindings().findings }));
  assert.match(byHand, /error facts proof 1 on the page, but not through ReviewsSection/);
  const shown = check('<ul data-proof="reviews"><li><blockquote>Delicious and addictive, the key lime is our favourite</blockquote></li></ul>', { proof, run: proofFindings });
  assert.deepEqual(shown.findings, []);
  assert.match(shown.shows, /reviews 1\/1/);
});

test("a rating or review under 4 stars is not asked for", () => {
  const proof = "ratings:\n  - value: 3.1\n    count: 691\n    platform: Google\nreviews:\n  - quote: Took three months and nobody called back\n    stars: 1\n    platform: Google";
  const { findings, shows } = check("<p>Windows and doors.</p>", { proof, run: proofFindings });
  assert.deepEqual(findings, []);
  assert.match(shows, /ratings 0\/0, reviews 0\/0/);
});

test("proof marked by hand outside the proof components fails check:facts", () => {
  const byHand = check("<p>Bread.</p>", { page: 'export const R = () => <figure data-proof="reviews">Lovely</figure>;\n', run: () => projectFindings({ built: false }).findings });
  assert.ok(byHand.some((f) => f.area === "facts" && f.page === "src/pages/reviews.tsx" && /writes data-proof itself/.test(f.message)));
  assert.ok(!check("<p>Bread.</p>", { run: () => projectFindings({ built: false }).findings }).some((f) => /data-proof/.test(f.message)));
});
