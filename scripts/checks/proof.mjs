// Is all the proof on the homepage, shown the way the platforms show it? Part
// of `npm run check:facts`. It reads public/proof.md and the built
// dist/index.html, and counts what the proof components show (RatingLine,
// ReviewsSection, LogosSection, PeopleSection, NumbersSection mark it with
// data-proof): a review typed out by hand has no stars, platform or date, so
// it does not count. It finds a logo, rating, person, number or post in the
// note missing from them, a note with reviews they show none of, and a logo
// with no name. A rating or review under 4 stars is not asked for: it stays
// in the note, off the page, and the owner is told.
import { existsSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";
import YAML from "yaml";
import { frontmatter } from "../lib.mjs";

const COMPONENT = { logos: "LogosSection", ratings: "RatingLine", reviews: "ReviewsSection", people: "PeopleSection", numbers: "NumbersSection", posts: "ReviewsSection" };

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
  const html = readFileSync("dist/index.html", "utf8");
  const root = parse(html, { comment: false });
  // letters and digits only, so entities, quotes and "1,204" against 1204 never decide a match
  const bare = (t) => String(t).toLowerCase().replace(/&[a-z#0-9]+;/gi, "").replace(/[^a-z0-9.]+/g, "");
  const shown = (kind) => {
    const els = root.querySelectorAll(`[data-proof~="${kind === "posts" ? "reviews" : kind}"]`);
    return { text: bare(els.map((e) => e.text).join(" ")), markup: els.map((e) => e.toString()).join("\n") };
  };
  const anywhere = bare(root.text);
  const list = (k) => (Array.isArray(proof[k]) ? proof[k] : []);
  const opening = (q) => bare(q).slice(0, 30);
  // missing from the component: typed out by hand somewhere on the page, or not there at all
  const say = (kind, items, label) => {
    if (!items.length) return;
    const byHand = items.filter((it) => anywhere.includes(opening(label(it)))).length;
    const how = byHand === items.length ? `on the page, but not through ${COMPONENT[kind]}, so without what the platforms show beside them` : `not on the homepage`;
    add(kind, `${items.length} ${how} (${items.map((it) => String(label(it)).slice(0, 40)).join("; ")}); show them with ${COMPONENT[kind]} (npm run parts) and restyle it to fit`);
  };

  const logos = list("logos").filter((l) => l?.file);
  const logoMarkup = shown("logos").markup;
  const missingLogos = logos.filter((l) => !logoMarkup.includes(l.file));
  const unnamed = logos.filter((l) => !l.name);
  if (unnamed.length) add("logos", `${unnamed.length} logo${unnamed.length === 1 ? " has" : "s have"} no name in public/proof.md: name them from raw/logos.png (numbered in the note's order)`);
  if (missingLogos.length) add("logos", `${missingLogos.length} of ${logos.length} are not in LogosSection (${missingLogos.map((l) => l.name || l.file).join(", ")}); show every one with LogosSection (npm run parts)`);

  const ratingText = shown("ratings").text;
  // under 4 stars hurts more than it helps; the note keeps it, the page need not show it
  const good = (stars) => !(Number(stars) < 4);
  const ratings = list("ratings").filter((r) => r?.value && good(r.value));
  const missingRatings = ratings.filter((r) => !ratingText.includes(bare(r.value)) || (r.count && !ratingText.includes(bare(r.count))));
  if (missingRatings.length) add("ratings", `${missingRatings.map((r) => `${r.value} from ${r.count || "?"} on ${r.platform}`).join("; ")}: not through RatingLine, which shows the platform, the stars and the count; put RatingLine on the page (npm run parts)`);

  const reviewText = shown("reviews").text;
  const reviews = list("reviews").filter((r) => r?.quote && good(r.stars));
  const shownReviews = reviews.filter((r) => reviewText.includes(opening(r.quote)));
  if (reviews.length && !shownReviews.length) say("reviews", reviews, (r) => r.quote);

  // the rest of the note: each person, number and post in its component
  const rest = [["people", (r) => r.name], ["numbers", (r) => r.figure], ["posts", (r) => r.text]].map(([kind, words]) => {
    const text = shown(kind).text;
    const items = list(kind).filter((r) => r && words(r));
    const missing = items.filter((r) => !text.includes(opening(words(r))));
    say(kind, missing, words);
    return `${kind} ${items.length - missing.length}/${items.length}`;
  });
  const shows = `logos ${logos.length - missingLogos.length}/${logos.length}, ratings ${ratings.length - missingRatings.length}/${ratings.length}, reviews ${shownReviews.length}/${reviews.length}, ${rest.join(", ")}`;
  return { findings, shows };
}
