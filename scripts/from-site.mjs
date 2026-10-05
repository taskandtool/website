#!/usr/bin/env node
// A first homepage's starting point from the business's current site:
// `npm run from-site -- https://theirsite.com [--only-homepage] [--json]`.
//
// Reads the homepage (tt-crawl brand --max-pages 1), then, unless
// --only-homepage, the pages it links to that hold photographs (gallery,
// photos, portfolio, projects, our work: two at most), its services page and
// a page of proof (testimonials, reviews, clients, partners), all at once
// (tt-crawl add). Then it does by script what needs no judgement: the
// business note's facts (cited to the crawl), the logo into brand/logo/,
// their photographs at web size into static/images/, the proof (others'
// logos into static/images/marks/, reviews word for word) into
// public/proof.md, the logo in
// src/site.ts, and design tokens in design/system.yaml seeded from the site's
// own colours and fonts, written only when every text pair npm run check
// measures reaches 4.5:1. A note, logo or record already filled in is kept,
// and it says which.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { webSize } from "./images.mjs";
import { TEXT_PAIRS, chromaHue, isHex, luminance, ratio } from "./theme.mjs";

const USAGE = `usage: npm run from-site -- https://theirsite.com [--only-homepage] [--json]

Reads their homepage (and its gallery and services page), then writes the
business note, the logo, their photographs at web size, and design tokens
from their colours and fonts. Prints what it wrote, what it kept, and what
to read next.
  --only-homepage   skip the gallery and services pages
  --json            the summary as JSON`;
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const url = args.find((a) => !a.startsWith("--"));
const onlyHomepage = args.includes("--only-homepage");
const asJson = args.includes("--json");
if (!/^https?:\/\//.test(url || "")) {
  console.error(`from-site needs the business's site as a full URL.\n  Try: npm run from-site -- https://theirsite.com\n\n${USAGE}`);
  process.exit(2);
}
const host = new URL(url).hostname.replace(/^www\./, "");
const dir = `raw/site/${host}`;
const read = (f, fallback) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), "utf8")) : fallback);
const crawl = (cmd) => execFileSync("tt-crawl", cmd, { stdio: ["ignore", "ignore", "pipe"] });
const lastLine = (e) => String(e.stderr || e.message).trim().split("\n").pop();
const wrote = [];
const kept = [];
const notes = [];

// ── reading their site ────────────────────────────────────────────────────
try {
  if (!existsSync(join(dir, "_index/facts.json"))) crawl(["brand", url, "--max-pages", "1"]);
} catch (e) {
  console.error(`from-site: could not read ${url}: ${lastLine(e)}\n  Is the address right? Try: curl -sI ${url}`);
  process.exit(1);
}
const manifest = () => read("_index/manifest.json", {});
const inventory = read("_index/inventory.json", {}).records || [];
const pathOf = (u) => new URL(u).pathname;
const photoPages = inventory.map((r) => r.url).filter((u) => /\/(gallery|photos?|portfolio|projects|our-work|work)(\/|$)/i.test(pathOf(u))).slice(0, 2);
const servicesPage = inventory.map((r) => r.url).find((u) => /\/(services?|what-we-do)\/?$/i.test(pathOf(u)));
const proofPage = inventory.map((r) => r.url).find((u) => /\/(testimonials?|reviews?|clients?|partners?|our-clients|customers|case-studies)\/?$/i.test(pathOf(u)));
const isRead = (u) => (manifest().pages || []).some((p) => p.url === u);
const unread = (onlyHomepage ? [] : [...photoPages, servicesPage, proofPage]).filter((u) => u && !isRead(u));
if (unread.length) {
  try {
    crawl(["add", ...unread]);
  } catch (e) {
    notes.push(`could not read ${unread.join(", ")}: ${lastLine(e)}`);
  }
}
const facts = read("_index/facts.json", {});
const markup = read("structured/business.json", {});
const styles = read("_index/styles.json", { colors: [], fonts: [], roles: {} });
const media = read("_index/media.json", []);
const home = inventory[0] || {};
const first = (k) => facts[k]?.[0]?.value || "";

// ── the business note ─────────────────────────────────────────────────────
// A time zone only where the address leaves no doubt: a US state or a
// country with one zone. Anywhere else it stays empty and the output says so.
const US_ONE_ZONE = { AL: "America/Chicago", AR: "America/Chicago", CA: "America/Los_Angeles", CO: "America/Denver", CT: "America/New_York", DC: "America/New_York", DE: "America/New_York", GA: "America/New_York", HI: "Pacific/Honolulu", IA: "America/Chicago", IL: "America/Chicago", LA: "America/Chicago", MA: "America/New_York", MD: "America/New_York", ME: "America/New_York", MN: "America/Chicago", MO: "America/Chicago", MS: "America/Chicago", MT: "America/Denver", NC: "America/New_York", NH: "America/New_York", NJ: "America/New_York", NM: "America/Denver", NY: "America/New_York", OH: "America/New_York", OK: "America/Chicago", PA: "America/New_York", RI: "America/New_York", SC: "America/New_York", UT: "America/Denver", VA: "America/New_York", VT: "America/New_York", WA: "America/Los_Angeles", WI: "America/Chicago", WV: "America/New_York", WY: "America/Denver" };
const COUNTRY_ONE_ZONE = { GB: "Europe/London", UK: "Europe/London", "UNITED KINGDOM": "Europe/London", IE: "Europe/Dublin", IRELAND: "Europe/Dublin", FR: "Europe/Paris", DE: "Europe/Berlin", NL: "Europe/Amsterdam", BE: "Europe/Brussels", IT: "Europe/Rome", CH: "Europe/Zurich", AT: "Europe/Vienna", SE: "Europe/Stockholm", NO: "Europe/Oslo", DK: "Europe/Copenhagen", FI: "Europe/Helsinki", PL: "Europe/Warsaw", NZ: "Pacific/Auckland", SG: "Asia/Singapore", JP: "Asia/Tokyo", ZA: "Africa/Johannesburg" };

function addressFrom() {
  const a = markup.address;
  if (a && typeof a === "object" && (a.streetAddress || a.addressLocality)) {
    const country = typeof a.addressCountry === "object" ? a.addressCountry?.name || "" : a.addressCountry || "";
    return { street: a.streetAddress || "", locality: a.addressLocality || "", region: a.addressRegion || "", postal_code: a.postalCode || "", country };
  }
  const line = (typeof a === "string" && a) || first("address");
  if (!line) return null;
  const m = line.match(/^(.+?),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)(?:,\s*(?:USA|US|United States))?$/);
  if (m) return { street: m[1], locality: m[2], region: m[3], postal_code: m[4], country: "US" };
  notes.push(`the address is one line in public/business.md (street); split it into locality, region, postal_code and country`);
  return { street: line, locality: "", region: "", postal_code: "", country: "" };
}

const businessFile = "public/business.md";
const [, front = ""] = readFileSync(businessFile, "utf8").match(/^---\n([\s\S]*?)\n---/) || [];
const business = YAML.parseDocument(front);
if (business.get("name") && !/to fill/i.test(business.get("name"))) kept.push(`${businessFile} (already filled)`);
else {
  const address = addressFrom();
  const hours = [markup.openingHours].flat().filter((h) => typeof h === "string" && /^[A-Z][a-z](-[A-Z][a-z])?(,[A-Z][a-z])*\s+\d/.test(h));
  const inUS = address && /^(|US|USA|United States)$/i.test(String(address.country).trim());
  const zone = address && ((inUS && US_ONE_ZONE[address.region]) || COUNTRY_ONE_ZONE[String(address.country).trim().toUpperCase()]);
  const set = {
    updated: new Date().toISOString().slice(0, 10),
    name: markup.name || home.title?.split(/\s[|–-]\s/)[0].trim() || host,
    telephone: first("phone") || (typeof markup.telephone === "string" ? markup.telephone : ""),
    email: first("email") || (typeof markup.email === "string" ? markup.email : ""),
    ...(address ? { address } : {}),
    ...(hours.length ? { opening_hours: hours } : {}),
    ...(zone ? { time_zone: zone } : {}),
    same_as: [...new Set([...(facts.social || []).map((s) => s.value), ...[markup.sameAs].flat().filter((s) => typeof s === "string")])],
    sources: [`${dir}/_index/facts.json`, `${dir}/structured/business.json`],
  };
  for (const [k, v] of Object.entries(set)) business.set(k, v);
  if (!hours.length && facts.hours?.length) notes.push(`hours found but not in schema.org form (${facts.hours.map((h) => h.value).join("; ")}): write them into opening_hours, e.g. "Mo-Fr 08:00-17:00"`);
  if (!zone) notes.push(`time_zone not set, the address does not settle it: set it in ${businessFile} (e.g. America/New_York) before hours, bookings or reports`);
  const description = markup.description || home.meta_description || "";
  const cite = markup.description ? `${dir}/structured/business.json` : `the homepage's description, ${dir}/_index/inventory.json`;
  if (!description) notes.push(`${businessFile} has no paragraph yet: write what the business does from ${dir}/pages/index.md`);
  writeFileSync(businessFile, `---\n${business.toString().trimEnd()}\n---\n${description ? `\n${description} (${cite})\n` : ""}`);
  wrote.push(`${businessFile}: name, contact, address${hours.length ? ", hours" : ""}${zone ? `, time zone ${zone}` : ""} from the crawl`);
}

// ── the logo and the photographs ──────────────────────────────────────────
const fileOf = (it) => join(dir, "images", it.file);
const logo = media.filter((it) => it.kind === "logo" && it.file && existsSync(fileOf(it))).sort((a, b) => (b.width || 0) - (a.width || 0))[0];
if (logo) {
  mkdirSync("brand/logo", { recursive: true });
  if (existsSync(join("brand/logo", logo.file))) kept.push(`brand/logo/${logo.file} (already there)`);
  else {
    copyFileSync(fileOf(logo), join("brand/logo", logo.file));
    wrote.push(`brand/logo/${logo.file} (${logo.width}x${logo.height})`);
  }
}
const photos = media
  .filter((it) => it.kind === "photo" && it.file && (it.width || 0) >= 800 && existsSync(fileOf(it)))
  .sort((a, b) => (b.width || 0) - (a.width || 0))
  .slice(0, 16);
mkdirSync("static/images", { recursive: true });
// an alt worth keeping says something: not a file name, a number or "image"
const realAlt = (alt) => (alt && /[a-z]{3,}\s+[a-z]{3,}/i.test(alt) && !/\.(jpe?g|png|webp)|^(image|photo|img)\b/i.test(alt) ? alt : "");
const shown = photos.flatMap((it) => {
  const name = it.file.replace(/\.[a-z0-9]+$/i, "") + ".jpg";
  const dest = join("static/images", name);
  const out = existsSync(dest) ? { width: Math.min(it.width, 2400) } : webSize(fileOf(it), dest);
  if (!out) {
    notes.push(`${it.file} (${it.width}px wide) could not be resized here and was left out`);
    return [];
  }
  const width = out.width || Math.min(it.width, 2400);
  const height = out.height || Math.round((it.height * width) / it.width);
  const where = it.pages?.[0]?.heading ? ` beside "${it.pages[0].heading}"` : "";
  const alt = realAlt(it.alts?.[0]);
  return [`/images/${name}  ${width}x${height}${width >= 2000 ? "  full width" : ""}${out.kb ? `  ${out.kb} KB` : ""}${where}${alt ? `  alt "${alt}"` : ""}`];
});
if (shown.length) wrote.push(`static/images/: ${shown.length} photographs at web size`);

// ── the proof: others' logos and reviews ──────────────────────────────────
// Every mark the crawl kept (an association, a certification, a partner, a
// client) goes in static/images/marks/ as it is, and every review word for
// word, into public/proof.md while it holds none. Naming each mark is the
// AI's: it looks at the logo.
const marks = media.filter((it) => it.kind === "mark" && it.file && existsSync(fileOf(it)));
const reviews = read("_index/reviews.json", []).filter((r) => r.quote && r.name);
const proofFile = "public/proof.md";
const proofNote = existsSync(proofFile) ? readFileSync(proofFile, "utf8") : "";
const [, proofFront = "title: Proof\ntype: proof\nstatus: current", proofBody = ""] = proofNote.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) || [];
const proof = YAML.parseDocument(proofFront);
const proofEmpty = !proof.get("items")?.items?.length && !proof.get("marks")?.items?.length;
// copied as they are: a logo keeps its transparency, and a second run finds the same file
const markRows = [];
if ((marks.length || reviews.length) && proofEmpty) {
  if (marks.length) mkdirSync("static/images/marks", { recursive: true });
  for (const it of marks) {
    const dest = join("static/images/marks", it.file);
    if (!existsSync(dest)) copyFileSync(fileOf(it), dest);
    const where = it.pages?.[0]?.beside || it.pages?.[0]?.heading || "";
    markRows.push({ file: `/images/marks/${it.file}`, alt: realAlt(it.alts?.[0]), where: where.slice(0, 60) });
  }
  proof.set("updated", new Date().toISOString().slice(0, 10));
  proof.set("items", reviews.map((r) => ({ quote: r.quote, who: r.name, platform: r.platform || "", date: r.date || "", ...(r.stars ? { stars: r.stars } : {}), source: `${dir}/_index/reviews.json (${r.url})` })));
  proof.set("marks", markRows.map((m) => ({ name: m.alt, file: m.file, kind: "", source: `${dir}/_index/media.json` })));
  proof.set("sources", [`${dir}/_index/reviews.json`, `${dir}/_index/media.json`]);
  const body = proofBody.trim() || "Real testimonials, and the logos of clients, partners, associations,\ncertifications, awards and press (`marks`), each with its source.";
  writeFileSync(proofFile, `---\n${proof.toString().trimEnd()}\n---\n\n${body}\n`);
  wrote.push(`${proofFile}: ${reviews.length} review${reviews.length === 1 ? "" : "s"} word for word, ${markRows.length} logo${markRows.length === 1 ? "" : "s"} of others in static/images/marks/`);
  if (markRows.some((m) => !m.alt)) notes.push(`name each logo in ${proofFile} (marks: name and kind): look at the image`);
} else if (marks.length || reviews.length) kept.push(`${proofFile} (already holds proof)`);

// ── the logo in src/site.ts, while it has none ────────────────────────────
const siteTs = readFileSync("src/site.ts", "utf8");
const noLogo = /logo: \{ file: "", alt: "" \}/;
if (logo && noLogo.test(siteTs)) {
  writeFileSync("src/site.ts", siteTs.replace(noLogo, `logo: { file: ${JSON.stringify(logo.file)}, alt: ${JSON.stringify(String(markup.name || host))} }`));
  wrote.push(`src/site.ts: the logo`);
} else if (logo) kept.push(`src/site.ts (has a logo already)`);

// ── colours and fonts into the design record ──────────────────────────────
const solid = (c) => (isHex(c) ? c.toLowerCase() : null);
const palette = [...new Set(styles.colors.map((c) => solid(c.color)).filter(Boolean))];
const iconFont = /icon|awesome|glyph|dashicons|eicons|material symbols/i;
const fonts = styles.fonts.filter((f) => !iconFont.test(f));
const bodyFont = [styles.roles.body?.font, styles.roles.p?.font, fonts[0]].find((f) => f && !iconFont.test(f)) || "";
const headFont = [styles.roles.h1?.font, styles.roles.h2?.font].find((f) => f && !iconFont.test(f)) || bodyFont;

// The weights Google Fonts serves a family in, [] when it does not serve it,
// null when it could not be asked. A record weight the family lacks makes
// Google drop that weight, or the whole family when none is left.
async function googleWeights(family) {
  const ask = async (q) => {
    const res = await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}${q}`, { signal: AbortSignal.timeout(15000) });
    return res.ok ? [...new Set([...(await res.text()).matchAll(/font-weight:\s*(\d+)/g)].map((m) => Number(m[1])))] : [];
  };
  try {
    const all = await ask(":wght@100;200;300;400;500;600;700;800;900");
    return all.length ? all : await ask("");
  } catch {
    return null;
  }
}
const HEAD_STYLES = ["display", "section", "title", "specimen"];
const served = new Map();
for (const f of new Set([headFont, bodyFont].filter(Boolean))) served.set(f, await googleWeights(f));
const families = [...served].filter(([, w]) => w?.length).map(([f]) => f);
for (const [f, w] of served) {
  if (w === null) notes.push(`could not ask Google Fonts about ${f}, so the starter's fonts stay; set fonts in design/system.yaml`);
  else if (!w.length) notes.push(`${f} is not on Google Fonts, so the starter's font stays in its place; self-host it (@font-face in styles/input.css) or choose another`);
}

const mix = (a, b, t) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
// a colour stepped toward black or white, whichever its ground is further
// from, until it reads at `min` on that ground
const readable = (fg, bg, min = 4.5) => {
  const toward = luminance(bg) > 0.18 ? "#000000" : "#ffffff";
  for (let i = 0; i < 40 && ratio(fg, bg) < min; i++) fg = mix(fg, toward, 0.08);
  return fg;
};

function colours() {
  const canvas = solid(styles.roles.body?.background) || palette.find((c) => luminance(c) > 0.85) || "#ffffff";
  const dark = luminance(canvas) < 0.18;
  const ink = readable(solid(styles.roles.body?.color) || (dark ? "#f2f2f2" : "#111111"), canvas, 7);
  const surface = dark ? mix(canvas, ink, 0.08) : mix(canvas, "#ffffff", 0.5);
  const panel = mix(canvas, ink, 0.05);
  const strong = palette.find((c) => chromaHue(c).chroma > 0.35);
  if (!strong) notes.push(`no strong colour on their site, so the accent is a shade of the ink: choose one in design/system.yaml`);
  const accent = readable(strong || mix(ink, canvas, 0.2), canvas);
  const accentInk = ["#ffffff", "#111111", canvas, ink].sort((a, b) => ratio(b, accent) - ratio(a, accent))[0];
  // night: the dark band and the footer; on a dark site, a step darker than the canvas
  const night = dark ? mix(canvas, "#000000", 0.5) : palette.find((c) => luminance(c) < 0.05 && c !== ink) || mix(ink, "#000000", 0.4);
  const nightInk = readable(dark ? ink : mix(canvas, "#ffffff", 0.5), night, 7);
  // three steps of text, each quieter than the one before and never under 4.5:1
  const ink2 = readable(mix(ink, canvas, 0.25), panel, Math.max(4.5, Math.min(7, ratio(ink, panel) - 1.5)));
  return {
    canvas,
    surface,
    panel,
    night,
    ink,
    "ink-2": ink2,
    "ink-3": readable(mix(ink, canvas, 0.45), panel, Math.max(4.5, Math.min(5.5, ratio(ink2, panel) - 1))),
    "night-ink": nightInk,
    "night-ink-2": readable(mix(nightInk, night, 0.3), night),
    accent,
    "accent-ink": readable(accentInk, accent),
  };
}

const recordFile = "design/system.yaml";
const record = YAML.parseDocument(readFileSync(recordFile, "utf8"));
let tokens = null;
if (record.get("id") !== "starter") kept.push(`${recordFile} (no longer the starter)`);
else if (!palette.length) notes.push(`no colours read from their site, so ${recordFile} keeps the starter's`);
else {
  tokens = colours();
  const short = TEXT_PAIRS.filter(([a, b]) => ratio(tokens[a], tokens[b]) < 4.5);
  if (short.length) {
    notes.push(`their colours do not reach 4.5:1 in ${short.map(([a, b]) => `${a} on ${b}`).join(", ")}, so ${recordFile} keeps the starter's: set the colours by hand`);
    tokens = null;
  } else {
    for (const [k, v] of Object.entries(tokens)) record.setIn(["tokens", "colors", k], v);
    for (const [style, v] of Object.entries(record.getIn(["tokens", "typography"]).toJSON())) {
      const family = HEAD_STYLES.includes(style) ? headFont : bodyFont;
      const weights = served.get(family);
      if (!weights?.length) continue;
      record.setIn(["tokens", "typography", style, "fontFamily"], family);
      const want = Number(v.fontWeight) || 400;
      const near = weights.reduce((a, b) => (Math.abs(b - want) < Math.abs(a - want) ? b : a));
      if (near !== want) record.setIn(["tokens", "typography", style, "fontWeight"], near);
    }
    record.set("id", "site");
    record.set("title", markup.name || host);
    record.set("summary", `Seeded from ${host}'s colours and fonts by npm run from-site; the first homepage's design replaces this.`);
    if (record.hasIn(["sections", "overview"])) {
      record.setIn(["sections", "overview"], `Seeded from ${host}'s own colours (${tokens.accent} on ${tokens.canvas})${families.length ? ` and fonts (${families.join(" and ")})` : ""}. The first homepage's design replaces this paragraph.`);
    }
    writeFileSync(recordFile, record.toString());
    execFileSync("node", ["scripts/system.mjs"], { stdio: "ignore" });
    wrote.push(`${recordFile}: their colours (accent ${tokens.accent}, ink ${tokens.ink} on ${tokens.canvas})${families.length ? ` and fonts (${families.join(" and ")})` : ""}, then npm run system`);
  }
}

// ── what the agent reads next ─────────────────────────────────────────────
const pageFile = (u) => (manifest().pages || []).find((p) => p.url === u)?.file;
const services = servicesPage && pageFile(servicesPage);
const summary = {
  site: host,
  wrote,
  kept,
  notes,
  homepage_words: `${dir}/pages/index.md`,
  services_words: services ? `${dir}/${services}` : null,
  looks_today: `${dir}/shots/index/`,
  colours_by_use: palette.slice(0, 8),
  fonts,
  photographs: shown,
  proof: { logos: markRows.map((m) => `${m.file}${m.alt ? `  "${m.alt}"` : ""}${m.where ? `  beside "${m.where}"` : ""}`), reviews: reviews.length },
  rest_of_site_later: `tt-crawl brand ${manifest().start || url} --resume`,
  next: [
    services ? `write public/services.md from ${dir}/${services}` : "write public/services.md from the homepage's words",
    ...(markRows.some((m) => !m.alt) ? [`name the logos in public/proof.md`] : []),
    "design and build the homepage, with the proof on it: the design skill's \"The homepage first\"",
  ],
};
if (asJson) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  const list = (title, items) => (items.length ? `${title}\n${items.map((d) => `  ${d}`).join("\n")}\n` : "");
  console.log(`from-site: ${host}
${list("Wrote:", wrote)}${list("Kept:", kept)}${list("Check:", notes)}
The homepage's words:    ${summary.homepage_words}${summary.services_words ? `\nThe services page:       ${summary.services_words}` : ""}
How it looks today:      ${summary.looks_today}
Colours by use:          ${summary.colours_by_use.join(" ") || "none read"}
Fonts:                   ${fonts.join(", ") || "none read"}
Photographs (in static/images/; "full width" ones can run edge to edge):
${shown.map((s) => `  ${s}`).join("\n") || "  none 800px or wider"}
Proof (public/proof.md): ${reviews.length} review${reviews.length === 1 ? "" : "s"}, ${markRows.length} logo${markRows.length === 1 ? "" : "s"} of others${markRows.length ? " (static/images/marks/):" : ""}
${summary.proof.logos.map((l) => `  ${l}`).join("\n")}

Next: ${summary.next.join("; then ")}.
Later, the rest of their site: ${summary.rest_of_site_later}`);
}
