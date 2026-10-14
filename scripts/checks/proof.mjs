// Is all the proof on the homepage? Part of `npm run check:facts`. It reads
// public/proof.md and the built dist/index.html and finds a logo, rating,
// person, number or post in the note missing from the page, a note with
// reviews and a page that shows none, and a logo with no name.
import { existsSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { frontmatter } from "../lib.mjs";

const PUT = "put it on the page with RatingLine, ReviewsSection, LogosSection, PeopleSection or NumbersSection (npm run parts)";

/**
 * `{ findings, shows }`: each finding `{ area: "facts", rule: "proof", level,
 * page: "/", where, message }`, and what the homepage shows of each kind.
 */
export function proofFindings() {
  const findings = [];
  const add = (where, message) => findings.push({ area: "facts", rule: "proof", level: "error", page: "/", where, message });
  const note = existsSync("public/proof.md") ? readFileSync("public/proof.md", "utf8") : "";
  let proof = {};
  try {
    proof = YAML.parse(frontmatter(note)?.front || "") || {};
  } catch (e) {
    add("public/proof.md", `its frontmatter is not valid YAML: ${e.message.split("\n")[0]}`);
    return { findings, shows: "" };
  }
  const page = readFileSync("dist/index.html", "utf8");
  // letters and digits only, so entities, quotes and "1,204" against 1204 never decide a match
  const bare = (t) => String(t).toLowerCase().replace(/&[a-z#0-9]+;/gi, "").replace(/[^a-z0-9.]+/g, "");
  const text = bare(page.replace(/<[^>]+>/g, " "));
  const list = (k) => (Array.isArray(proof[k]) ? proof[k] : []);

  const logos = list("logos").filter((l) => l?.file);
  const missingLogos = logos.filter((l) => !page.includes(l.file));
  const unnamed = logos.filter((l) => !l.name);
  if (unnamed.length) add("logos", `${unnamed.length} logo${unnamed.length === 1 ? " has" : "s have"} no name in public/proof.md: name them from raw/logos.png (numbered in the note's order)`);
  if (missingLogos.length) add("logos", `${missingLogos.length} of ${logos.length} are not on the homepage (${missingLogos.map((l) => l.name || l.file).join(", ")}); ${PUT}`);

  const ratings = list("ratings").filter((r) => r?.value);
  const missingRatings = ratings.filter((r) => !text.includes(bare(r.value)) || (r.count && !text.includes(bare(r.count))));
  if (missingRatings.length) add("ratings", `not on the homepage: ${missingRatings.map((r) => `${r.value} from ${r.count || "?"} on ${r.platform}`).join("; ")}; ${PUT}`);

  const reviews = list("reviews").filter((r) => r?.quote);
  const opening = (q) => bare(q).slice(0, 30);
  const shownReviews = reviews.filter((r) => text.includes(opening(r.quote)));
  if (reviews.length && !shownReviews.length) add("reviews", `the note has ${reviews.length} and the homepage shows none; ${PUT}`);

  // the rest of the note: each person, number and post somewhere on the page
  const rest = [["people", (r) => r.name], ["numbers", (r) => r.figure], ["posts", (r) => r.text]].map(([kind, words]) => {
    const items = list(kind).filter((r) => r && words(r));
    const shown = items.filter((r) => text.includes(opening(words(r))));
    if (shown.length < items.length) add(kind, `not on the homepage: ${items.filter((r) => !shown.includes(r)).map((r) => String(words(r)).slice(0, 40)).join("; ")}; ${PUT}`);
    return `${kind} ${shown.length}/${items.length}`;
  });
  const shows = `logos ${logos.length - missingLogos.length}/${logos.length}, ratings ${ratings.length - missingRatings.length}/${ratings.length}, reviews ${shownReviews.length}/${reviews.length}, ${rest.join(", ")}`;
  return { findings, shows };
}
