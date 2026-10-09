#!/usr/bin/env node
// A first homepage's starting point from the business's current site:
// `npm run from-site -- https://theirsite.com [--only-homepage]`.
//
// Reads the homepage (tt-crawl brand --max-pages 1), then, unless
// --only-homepage, the pages it links to that hold photographs (gallery,
// photos, portfolio, projects, our work: two at most), its services page and
// a page of proof (testimonials, reviews, clients, partners), all at once
// (tt-crawl add). Then it does by script what needs no judgement: the
// business note's facts (cited to the crawl), the logo into brand/logo/,
// their photographs at web size into static/images/, the proof (their
// reviews and ratings, Google's too, and every logo of others) into
// public/proof.md, the logo in
// src/site.ts, and design tokens in design/system.yaml seeded from the site's
// own colours and fonts, written only when every text pair npm run check
// measures reaches 4.5:1. A note, logo or record already filled in is kept,
// and it says which.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";
import YAML from "yaml";
import { fail, has, machineEnv, misused } from "../src/data/cli.mjs";
import { MAX_WIDTH, webSize } from "./images.mjs";
import { frontmatter, start } from "./lib.mjs";
import { TEXT_PAIRS, chromaHue, isHex, luminance, ratio } from "./theme.mjs";

const a = start("from-site", `usage: npm run from-site -- https://theirsite.com [--only-homepage]

Reads their homepage (and its gallery and services page), then writes the
business note, the logo, their photographs at web size, and design tokens
from their colours and fonts, public/proof.md (their reviews, Google's
rating and reviews, logos) and numbered sheets of photos and logos to name.
Prints what it wrote, what it kept, and what to read next. Safe to run
again: a note, logo or record already filled in is kept.
  --only-homepage   skip the gallery and services pages`, { bools: ["only-homepage"], args: true });
if (a._.length > 1) misused(`from-site: one site at a time (given ${a._.join(" ")})`, "npm run from-site -- https://theirsite.com");
const given = a._[0];
// a bare domain is their site too
const url = given && !/^https?:\/\//.test(given) && /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(given) ? `https://${given}` : given;
const onlyHomepage = has(a, "only-homepage");
if (!/^https?:\/\//.test(url || "") || !URL.canParse(url)) misused("from-site: it needs the business's site as a full URL", "npm run from-site -- https://theirsite.com");
const host = new URL(url).hostname.replace(/^www\./, "");
// a profile or listing is not their site: its colours and facts would seed the note and the tokens for good
if (/(^|\.)(facebook|instagram|linkedin|tiktok|youtube|twitter|x|yelp|tripadvisor|nextdoor|linktr)\.(com|ee)$|(^|\.)(fb\.com|google\.[a-z.]+|g\.page|goo\.gl)$/i.test(host))
  misused(`from-site: ${host} is a profile or listing, not their own site (read it as proof); their Google listing names their site (the brand skill's listing row)`, "npm run from-site -- https://theirsite.com");
const dir = `raw/site/${host}`;
const read = (f, fallback) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), "utf8")) : fallback);
const crawl = (cmd) => execFileSync("tt-crawl", cmd, { stdio: ["ignore", "ignore", "pipe"] });
// tt-crawl prints progress first, then what went wrong unindented, its details and Try: line indented;
// under --json, one {"error": …} line
const errorLine = (e) => {
  const lines = String(e.stderr || e.message).split("\n").filter((l) => l.trim());
  const last = (lines.findLast((l) => !/^\s/.test(l)) || lines.at(-1) || "").trim();
  try {
    return JSON.parse(last).error || last;
  } catch {
    return last;
  }
};
const wrote = [];
const kept = [];
const notes = [];

// ── reading their site ────────────────────────────────────────────────────
try {
  if (!existsSync(join(dir, "_index/facts.json"))) crawl(["brand", url, "--max-pages", "1"]);
} catch (e) {
  if (e.code === "ENOENT") fail("from-site: tt-crawl is not installed here", "bash ~/app/.taskandtool/setup.sh");
  fail(`from-site: could not read ${url}: ${errorLine(e)}\n  Is the address right?`, `curl -sI ${url}`);
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
    crawl(["add", "--out", dir, ...unread]);
  } catch (e) {
    notes.push(`could not read ${unread.join(", ")}: ${errorLine(e)}`);
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

// "Mon: 8:00am - 6:00pm" lines as schema.org opening hours, runs of days with
// the same times joined ("Mo-Sa 08:00-18:00"); [] when they do not read cleanly
function schemaHours(lines) {
  const DAYS = ["mo", "tu", "we", "th", "fr", "sa", "su"];
  const t24 = (h, m, ap) => `${String((Number(h) % 12) + (/p/i.test(ap) ? 12 : 0)).padStart(2, "0")}:${m || "00"}`;
  const byDay = new Map();
  for (const line of lines) {
    const m = String(line).match(/^\s*(mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?\s*:?\s*(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?\s*[-–to]+\s*(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m/i);
    if (m) byDay.set(m[1].slice(0, 2).toLowerCase(), `${t24(m[2], m[3], m[4])}-${t24(m[5], m[6], m[7])}`);
  }
  const out = [];
  for (let i = 0; i < 7; i++) {
    const t = byDay.get(DAYS[i]);
    if (!t) continue;
    let j = i;
    while (j + 1 < 7 && byDay.get(DAYS[j + 1]) === t) j++;
    const cap = (d) => d[0].toUpperCase() + d[1];
    out.push(`${cap(DAYS[i])}${j > i ? `-${cap(DAYS[j])}` : ""} ${t}`);
    i = j;
  }
  return out;
}

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
const business = YAML.parseDocument(frontmatter(readFileSync(businessFile, "utf8"))?.front || "");
// whether this run wrote the note (so the Google listing may fill its gaps), and
// whether its hours came from the site's own markup (which beats the listing's)
let businessWritten = false;
let hoursMarked = false;
if (business.get("name") && !/to fill/i.test(business.get("name"))) kept.push(`${businessFile} (already filled)`);
else {
  businessWritten = true;
  const address = addressFrom();
  const marked = [markup.openingHours].flat().filter((h) => typeof h === "string" && /^[A-Z][a-z](-[A-Z][a-z])?(,[A-Z][a-z])*\s+\d/.test(h));
  hoursMarked = marked.length > 0;
  const hours = marked.length ? marked : schemaHours((facts.hours || []).map((h) => h.value));
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
const photoRows = [];
const shown = photos.flatMap((it) => {
  const name = it.file.replace(/\.[a-z0-9]+$/i, "") + ".jpg";
  const dest = join("static/images", name);
  const out = existsSync(dest) ? { width: Math.min(it.width, MAX_WIDTH) } : webSize(fileOf(it), dest);
  if (!out) {
    notes.push(`${it.file} (${it.width}px wide) could not be resized here and was left out`);
    return [];
  }
  const width = out.width || Math.min(it.width, MAX_WIDTH);
  const height = out.height || Math.round((it.height * width) / it.width);
  const where = it.pages?.[0]?.heading ? ` beside "${it.pages[0].heading}"` : "";
  const alt = realAlt(it.alts?.[0]);
  photoRows.push({ file: dest, source: fileOf(it), width, height });
  return [`/images/${name}  ${width}x${height}${width >= 1600 ? "  full width" : ""}${out.kb ? `  ${out.kb} KB` : ""}${where}${alt ? `  alt "${alt}"` : ""}`];
});
if (shown.length) wrote.push(`static/images/: ${shown.length} photographs at web size`);

// Their videos: at web size in static/videos/ (ffmpeg, else as they are),
// with one frame each beside the photographs on the sheet.
const probe = (file) => {
  try {
    const [w, h, s] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "csv=p=0:s=,", file], { encoding: "utf8" }).trim().split(/[,\n]/);
    return { width: Number(w), height: Number(h), seconds: Math.round(Number(s)) };
  } catch {
    return null;
  }
};
const videoRows = [];
for (const it of media.filter((m) => m.kind === "video" && m.file && existsSync(fileOf(m)))) {
  mkdirSync("static/videos", { recursive: true });
  mkdirSync("raw/frames", { recursive: true });
  const dest = join("static/videos", it.file.replace(/\.[a-z0-9]+$/i, ".mp4"));
  if (!existsSync(dest)) {
    try {
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", fileOf(it), "-vf", "scale='min(1920,iw)':-2", "-c:v", "libx264", "-crf", "28", "-preset", "veryfast", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", dest], { stdio: "ignore" });
    } catch {
      copyFileSync(fileOf(it), dest);
    }
  }
  const frame = join("raw/frames", basename(dest).replace(/\.mp4$/, ".jpg"));
  try {
    if (!existsSync(frame)) execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "1", "-i", dest, "-frames:v", "1", frame], { stdio: "ignore" });
  } catch {}
  const p = probe(dest) || {};
  videoRows.push({ file: dest, frame: existsSync(frame) ? frame : "", source: fileOf(it), ...p, autoplay: it.autoplay });
}
if (videoRows.length) wrote.push(`static/videos/: ${videoRows.length} videos at web size`);

// Each photograph and video is looked at once: one numbered sheet
// (raw/photos.png) and a row for each in brand/images.md, which the AI fills
// from the sheet; later work reads the file, not the pictures.
let photoSheet = "";
const imagesNote = "brand/images.md";
if ((photoRows.length || videoRows.length) && existsSync(imagesNote) && /\| to fill \|/.test(readFileSync(imagesNote, "utf8"))) {
  const pictures = [...photoRows.map((r) => r.file), ...videoRows.filter((v) => v.frame).map((v) => v.frame)];
  try {
    execFileSync("tt-crawl", ["sheet", ...pictures, "--columns", "3", "--cell", "380x300", "--out", "raw/photos.png"], { stdio: "ignore" });
    photoSheet = "raw/photos.png";
  } catch {}
  const shape = (v) => (v.width ? `${v.width}x${v.height}, ${v.seconds}s, ${v.width >= v.height ? "landscape" : "portrait"}` : "video");
  const rows = [
    ...photoRows.map((r) => `| ${r.file} (${r.width}x${r.height}) | | | | | | ${r.source} |`),
    ...videoRows.filter((v) => v.frame).map((v) => `| ${v.file} (video: ${shape(v)}) | | | | | | ${v.source} |`),
  ].join("\n");
  writeFileSync(imagesNote, readFileSync(imagesNote, "utf8").replace(/^\| to fill \|.*$/m, rows));
  wrote.push(`${imagesNote}: a row for each photograph${photoSheet ? `, numbered in ${photoSheet}` : ""}`);
  notes.push(`describe each photograph and video once in ${imagesNote}${photoSheet ? ` from ${photoSheet} (numbered in the table's order)` : ""}: what it shows, who, the focal point, its best use (hero, feature, gallery, or skip: a flyer, collage, watermark or blur)`);
}
if (photoRows.length && !photoRows.some((r) => r.width >= 1600) && !videoRows.length)
  notes.push("no photograph is 1600px wide: ask the owner for the originals (a NEED) rather than running a smaller one full width");

// ── the proof: what others say ────────────────────────────────────────────
// Everything the crawl and their Google listing hold goes into
// public/proof.md while it holds nothing: reviews word for word, ratings,
// and every logo of others, copied as it is into static/images/logos/ with
// one numbered sheet of them all (raw/logos.png) so naming them is one look.
const logoItems = media.filter((it) => it.kind === "mark" && it.file && existsSync(fileOf(it)));
const siteReviews = read("_index/reviews.json", []).filter((r) => r.quote);
const siteRatings = (facts.ratings || []).filter((r) => r.value);
const proofFile = "public/proof.md";
const proofNote = existsSync(proofFile) ? readFileSync(proofFile, "utf8") : "";
const { front: proofFront, body: proofBody } = frontmatter(proofNote) || { front: "title: Proof\ntype: proof\nstatus: current", body: "" };
const proof = YAML.parseDocument(proofFront);
const PROOF_KINDS = ["reviews", "ratings", "logos", "people", "numbers", "posts"];
const proofEmpty = PROOF_KINDS.every((k) => !proof.get(k)?.items?.length);

// The crawler reads Places with GOOGLE_PLACES_API_KEY, at GOOGLE_PLACES_API_URL
// when set. Without a key of the owner's, a Google Places Connection granted
// to this app stands in: its gateway URL, with the machine token as the key
// (the gateway swaps in the real one; neither leaves for Google).
function placesEnv() {
  const env = machineEnv();
  if (env.GOOGLE_PLACES_API_KEY || !env.MACHINE_TOKEN) return env;
  try {
    const listed = execFileSync("python3", [join(homedir(), "tools", "taskandtool.py"), "list-connections", "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const places = (JSON.parse(listed)?.connections || []).find((c) => c.provider === "google-places" && c.gateway_url);
    if (places) return { ...env, GOOGLE_PLACES_API_URL: places.gateway_url.replace(/\/$/, "") + "/v1", GOOGLE_PLACES_API_KEY: env.MACHINE_TOKEN };
  } catch {
    // No bridge here (off the platform): the key, if any, is the whole story.
  }
  return env;
}

// their Google listing, through a key or the Google Places Connection
function google() {
  const filled = business.toJSON() || {};
  const name = markup.name || filled.name;
  const where = [filled.address?.locality, filled.address?.region].filter(Boolean).join(", ") || first("address");
  if (!name || /to fill/i.test(name)) return null;
  try {
    const out = execFileSync("tt-crawl", ["places", `${name}, ${where}`, "--first", "--out", "raw/places", "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: placesEnv() });
    const answer = JSON.parse(out.trim().split("\n").pop());
    const d = JSON.parse(readFileSync(join("raw/places", `${answer.place_id}.json`), "utf8"));
    const src = `raw/places/${answer.place_id}.json`;
    // only their own listing: its website is the site we crawled
    const listed = (() => { try { return new URL(d.websiteUri).hostname.replace(/^www\./, ""); } catch { return ""; } })();
    if (listed !== host) {
      notes.push(`the Google listing found for "${name}, ${where}" is ${d.displayName?.text || "another place"} (${listed || "no website"}), not ${host}: left out; find theirs with tt-crawl places --place-id`);
      return null;
    }
    fillFromListing(d, src);
    return {
      rating: d.rating ? { platform: "Google", value: d.rating, count: d.userRatingCount || null, url: d.googleMapsUri || "", source: src } : null,
      reviews: (d.reviews || []).map((r) => ({
        quote: (r.text?.text || r.originalText?.text || "").trim(), name: r.authorAttribution?.displayName || "",
        platform: "Google", date: (r.publishTime || "").slice(0, 10), stars: r.rating || null, url: r.authorAttribution?.uri || "", photo: r.authorAttribution?.photoUri || "", source: src,
      })).filter((r) => r.quote),
    };
  } catch (e) {
    const why = String(e.stderr || e.message);
    notes.push(/no Google Places access|unknown_connection|not granted/.test(why)
      ? 'no Google listing read: for their rating and reviews, ask for the connection (python3 ~/tools/taskandtool.py request-connection google-places --why "their Google rating and reviews") or find them elsewhere'
      : `their Google listing could not be read: ${errorLine(e).slice(0, 160)}`);
    return null;
  }
}

// Google's kind of place as a schema.org type; anything else stays LocalBusiness
const SCHEMA_TYPES = {
  bakery: "Bakery", cafe: "CafeOrCoffeeShop", coffee_shop: "CafeOrCoffeeShop", restaurant: "Restaurant", bar: "BarOrPub",
  dentist: "Dentist", doctor: "Physician", pharmacy: "Pharmacy", veterinary_care: "VeterinaryCare", plumber: "Plumber",
  electrician: "Electrician", roofing_contractor: "RoofingContractor", general_contractor: "GeneralContractor",
  painter: "HousePainter", locksmith: "Locksmith", moving_company: "MovingCompany", car_repair: "AutoRepair",
  hair_salon: "HairSalon", beauty_salon: "BeautySalon", gym: "ExerciseGym", florist: "Florist", hotel: "Hotel",
  lawyer: "Attorney", accounting: "AccountingService", insurance_agency: "InsuranceAgency", real_estate_agency: "RealEstateAgent",
};
const schemaType = (d) => {
  for (const t of [d.primaryType, ...(d.types || [])].filter(Boolean)) {
    if (SCHEMA_TYPES[t]) return SCHEMA_TYPES[t];
    if (t.endsWith("_restaurant")) return "Restaurant";
  }
  return "";
};

// Google's addressComponents as the note's address (tt-crawl's address_parts)
function listedAddress(components = []) {
  const out = { street: "", locality: "", region: "", postal_code: "", country: "" };
  let number = "", route = "";
  for (const c of components) {
    const types = new Set(c.types || []), text = c.longText || c.shortText || "";
    if (types.has("street_number")) number = text;
    else if (types.has("route")) route = text;
    else if (types.has("locality") || types.has("postal_town")) out.locality ||= text;
    else if (types.has("administrative_area_level_1")) out.region = c.shortText || text;
    else if (types.has("postal_code")) out.postal_code = text;
    else if (types.has("country")) out.country = c.shortText || text;
  }
  out.street = [number, route].filter(Boolean).join(" ");
  return out;
}

// Google's regularOpeningHours.periods as schema.org strings ("Mo-Fr 08:00-17:00")
function listedHours(regular) {
  const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const pad = (n) => String(n || 0).padStart(2, "0");
  const periods = regular?.periods || [];
  // open around the clock: one period that never closes
  if (periods.length === 1 && !periods[0].close && !periods[0].open?.hour) return ["Mo-Su 00:00-23:59"];
  const byDay = new Map();
  for (const { open, close } of periods) {
    if (open?.day === undefined) continue;
    byDay.set(DAYS[(open.day + 6) % 7], close ? `${pad(open.hour)}:${pad(open.minute)}-${pad(close.hour)}:${pad(close.minute)}` : "00:00-23:59");
  }
  const out = [];
  for (let i = 0; i < 7; i++) {
    const t = byDay.get(DAYS[i]);
    if (!t) continue;
    let j = i;
    while (j + 1 < 7 && byDay.get(DAYS[j + 1]) === t) j++;
    out.push(`${DAYS[i]}${j > i ? `-${DAYS[j]}` : ""} ${t}`);
    i = j;
  }
  return out;
}

// What the site left out of the business note, from their own Google listing:
// the address, hours, time zone, phone, map point and kind of business. Only a
// note this run wrote; an owner's note is theirs.
function fillFromListing(d, src) {
  if (!businessWritten) return;
  const note = business.toJSON() || {};
  const filled = [];
  const set = (key, value, label) => {
    business.set(key, value);
    filled.push(label);
  };
  const drop = (re) => notes.splice(0, notes.length, ...notes.filter((n) => !re.test(n)));
  const address = listedAddress(d.addressComponents);
  if ((!note.address?.street || !note.address?.locality) && address.street && address.locality) {
    set("address", address, "address");
    drop(/^the address is one line/);
  }
  const hours = listedHours(d.regularOpeningHours);
  if (hours.length && !hoursMarked) {
    set("opening_hours", hours, "hours");
    drop(/^hours found but not in schema\.org form/);
  }
  if (!note.time_zone && d.timeZone?.id) {
    set("time_zone", d.timeZone.id, `time zone ${d.timeZone.id}`);
    drop(/^time_zone not set/);
  }
  if (!note.telephone && (d.nationalPhoneNumber || d.internationalPhoneNumber)) set("telephone", d.nationalPhoneNumber || d.internationalPhoneNumber, "phone");
  if (note.geo?.lat == null && d.location?.latitude != null) set("geo", { lat: d.location.latitude, lng: d.location.longitude }, "map point");
  const type = schemaType(d);
  if ((!note.schema_type || note.schema_type === "LocalBusiness") && type) set("schema_type", type, `type ${type}`);
  if (!filled.length) return;
  business.set("sources", [...new Set([...(note.sources || []), src])]);
  const body = frontmatter(readFileSync(businessFile, "utf8"))?.body || "";
  writeFileSync(businessFile, `---\n${business.toString().trimEnd()}\n---\n${body}`);
  wrote.push(`${businessFile}: ${filled.join(", ")} from their Google listing`);
}

const logoRows = [];
// a logo trimmed to its own edges, so a row of them sits at one height (Pillow, when the machine has it)
const TRIM_PY = `import sys
from PIL import Image, ImageChops
p = sys.argv[1]
im = Image.open(p); im.load()
rgba = im.convert("RGBA")
if rgba.getchannel("A").getextrema()[0] < 255:
    box = rgba.getchannel("A").getbbox()
else:
    rgb = rgba.convert("RGB")
    diff = ImageChops.difference(rgb, Image.new("RGB", im.size, rgb.getpixel((0, 0))))
    box = ImageChops.add(diff, diff, 2.0, -20).getbbox()
if box and box != (0, 0) + im.size:
    im.crop(box).save(p, **({"quality": 95} if p.lower().endswith((".jpg", ".jpeg")) else {}))`;
const trim = (file) => {
  try {
    execFileSync("python3", ["-c", TRIM_PY, file], { stdio: "ignore" });
  } catch {}
};
let reviewRows = [];
let ratingRows = [];
let sheet = "";
if (proofEmpty) {
  const g = google();
  reviewRows = [
    ...siteReviews.map((r) => ({ quote: r.quote, name: r.name || "", platform: r.platform || "", date: r.date || "", ...(r.stars ? { stars: r.stars } : {}), source: `${dir}/_index/reviews.json (${r.url})` })),
    ...(g?.reviews || []),
  ];
  ratingRows = [
    // out of 5 whatever scale the site used, once each
    ...siteRatings.map((r) => {
      const best = Number(r.best) || 5;
      return { platform: r.platform || "", value: Math.round((Number(r.value) * 5 / best) * 10) / 10, count: Number(String(r.count ?? "").replace(/\D/g, "")) || null, url: r.url || "", source: `${dir}/_index/facts.json` };
    }).filter((r, i, all) => r.value && all.findIndex((x) => x.value === r.value && x.count === r.count) === i),
    ...(g?.rating ? [g.rating] : []),
  ];
  if (logoItems.length) mkdirSync("static/images/logos", { recursive: true });
  for (const it of logoItems) {
    const dest = join("static/images/logos", it.file);
    if (!existsSync(dest)) {
      copyFileSync(fileOf(it), dest);
      trim(dest);
    }
    logoRows.push({ name: realAlt(it.alts?.[0]), file: `/images/logos/${it.file}`, source: `${dir}/_index/media.json` });
  }
  if (logoRows.length) {
    try {
      execFileSync("tt-crawl", ["sheet", ...logoItems.map((it) => join("static/images/logos", it.file)), "--out", "raw/logos.png"], { stdio: "ignore" });
      sheet = "raw/logos.png";
    } catch {}
  }
  if (reviewRows.length || ratingRows.length || logoRows.length) {
    proof.set("updated", new Date().toISOString().slice(0, 10));
    proof.set("reviews", reviewRows);
    proof.set("ratings", ratingRows);
    proof.set("logos", logoRows);
    proof.set("sources", [...new Set([...reviewRows, ...ratingRows, ...logoRows].map((r) => r.source.split(" (")[0]))]);
    writeFileSync(proofFile, `---\n${proof.toString().trimEnd()}\n---\n\n${proofBody.trim()}\n`);
    wrote.push(`${proofFile}: ${reviewRows.length} reviews, ${ratingRows.length} ratings, ${logoRows.length} logos (static/images/logos/)`);
    if (logoRows.some((l) => !l.name)) notes.push(`name each logo in ${proofFile}: ${sheet ? `${sheet} shows them numbered in the note's order` : "look at each"}`);
  }
} else kept.push(`${proofFile} (already holds proof)`);

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
const ratings = ratingRows.map((r) => `${r.value} from ${r.count || "?"} on ${r.platform}`);
const next = [
  services ? `write public/services.md from ${dir}/${services}` : "write public/services.md from the homepage's words",
  "find the rest of the proof, then design and build the homepage with all of it on it (the new-site skill's homepage, from 'All the proof')",
];
const list = (title, items) => (items.length ? `${title}\n${items.map((d) => `  ${d}`).join("\n")}\n` : "");
console.log(`from-site: ${host}
${list("Wrote:", wrote)}${list("Kept:", kept)}${list("Check:", notes)}
The homepage's words:    ${dir}/pages/index.md${services ? `\nThe services page:       ${dir}/${services}` : ""}
How it looks today:      ${dir}/shots/index/
Colours by use:          ${palette.slice(0, 8).join(" ") || "none read"}
Fonts:                   ${fonts.join(", ") || "none read"}
Photographs (in static/images/; "full width" ones can run edge to edge):
${shown.map((s) => `  ${s}`).join("\n") || "  none 800px or wider"}
Proof (public/proof.md): ${reviewRows.length} reviews, ${logoRows.length} logos${sheet ? ` (numbered in ${sheet})` : ""}, ratings: ${ratings.join("; ") || "none yet"}
Later, the rest of their site: tt-crawl brand ${manifest().start || url} --resume

Next: ${next.join("; then ")}.`);
