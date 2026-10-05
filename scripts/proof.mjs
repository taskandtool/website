#!/usr/bin/env node
// Is all the proof on the homepage? `npm run proof` (run by npm run verify
// after the build). It reads public/proof.md and the built dist/index.html
// and fails when a logo, rating, person, number or post in the note is
// missing from the page, when the note has reviews and the page shows none,
// or when a logo has no name. It prints what the page shows of each kind.
import { existsSync, readFileSync } from "node:fs";
import YAML from "yaml";

if (process.argv.includes("--help")) {
  console.log("usage: npm run proof\n\nChecks that dist/index.html shows every logo and rating in public/proof.md, and at least one review.");
  process.exit(0);
}
const note = existsSync("public/proof.md") ? readFileSync("public/proof.md", "utf8") : "";
const proof = YAML.parse(note.match(/^---\n([\s\S]*?)\n---/)?.[1] || "") || {};
if (!existsSync("dist/index.html")) {
  console.error("proof: no dist/ yet; run npm run build first");
  process.exit(1);
}
const page = readFileSync("dist/index.html", "utf8");
// letters and digits only, so entities, quotes and "1,204" against 1204 never decide a match
const bare = (t) => String(t).toLowerCase().replace(/&[a-z#0-9]+;/gi, "").replace(/[^a-z0-9.]+/g, "");
const text = bare(page.replace(/<[^>]+>/g, " "));
const list = (k) => (Array.isArray(proof[k]) ? proof[k] : []);
const findings = [];

const logos = list("logos").filter((l) => l?.file);
const missingLogos = logos.filter((l) => !page.includes(l.file));
for (const l of logos.filter((l) => !l.name)) findings.push(`${l.file} has no name in public/proof.md: look at it and write the organisation's name`);
if (missingLogos.length) findings.push(`${missingLogos.length} of ${logos.length} logos are not on the homepage: ${missingLogos.map((l) => l.name || l.file).join(", ")}`);

const ratings = list("ratings").filter((r) => r?.value);
const missingRatings = ratings.filter((r) => !text.includes(bare(r.value)) || (r.count && !text.includes(bare(r.count))));
if (missingRatings.length) findings.push(`ratings not on the homepage: ${missingRatings.map((r) => `${r.value} from ${r.count || "?"} on ${r.platform}`).join("; ")}`);

const reviews = list("reviews").filter((r) => r?.quote);
const opening = (q) => bare(q).slice(0, 30);
const shownReviews = reviews.filter((r) => text.includes(opening(r.quote)));
if (reviews.length && !shownReviews.length) findings.push(`the note has ${reviews.length} reviews and the homepage shows none`);

// the rest of the note: each person, number and post somewhere on the page
const rest = [["people", (r) => r.name], ["numbers", (r) => r.figure], ["posts", (r) => r.text]].map(([kind, words]) => {
  const items = list(kind).filter((r) => r && words(r));
  const shown = items.filter((r) => text.includes(opening(words(r))));
  if (shown.length < items.length) findings.push(`${kind} not on the homepage: ${items.filter((r) => !shown.includes(r)).map((r) => String(words(r)).slice(0, 40)).join("; ")}`);
  return `${kind} ${shown.length}/${items.length}`;
});
const counts = `logos ${logos.length - missingLogos.length}/${logos.length}, ratings ${ratings.length - missingRatings.length}/${ratings.length}, reviews ${shownReviews.length}/${reviews.length}, ${rest.join(", ")}`;
if (findings.length) {
  console.error(`proof: the homepage shows ${counts}\n  - ${findings.join("\n  - ")}\nPut it on the page: the design skill's "Proof, front and centre".`);
  process.exit(1);
}
console.log(`proof: the homepage shows ${counts}`);
