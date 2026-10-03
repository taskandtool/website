#!/usr/bin/env node
// A first homepage's starting point from the business's current site:
// `npm run from-site -- https://theirsite.com [--only-homepage] [--json]`.
//
// Reads the homepage (tt-crawl brand --max-pages 1), then, unless
// --only-homepage, the pages it links to that hold photographs (gallery,
// photos, portfolio, projects, our work: two at most) and its services page,
// all at once (tt-crawl add). Then it does by script what needs no
// judgement: the business note's facts
// (cited to the crawl), the logo into brand/logo/, the sharpest photographs
// into static/images/ at web size, the site's name, fonts and logo in
// src/site.ts, and design tokens in design/system.yaml seeded from the
// site's own colours and fonts with every text pair at 4.5:1. It prints what
// it did and what the page has to work with; the design is still yours.
// A note or token already filled in is left alone.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { chromaHue, luminance, ratio } from "./theme.mjs";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
const onlyHomepage = args.includes("--only-homepage");
const asJson = args.includes("--json");
if (!/^https?:\/\//.test(url || "")) {
  console.error(`from-site needs the business's site as a full URL.
  Try: npm run from-site -- https://theirsite.com
  Options: --only-homepage (skip the gallery and services pages), --json (the summary as JSON)`);
  process.exit(1);
}
const host = new URL(url).hostname.replace(/^www\./, "");
const dir = `raw/site/${host}`;
const read = (f, fallback) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), "utf8")) : fallback);
const crawl = (cmd) => execFileSync("tt-crawl", cmd, { stdio: ["ignore", "ignore", "pipe"] });
try {
  if (!existsSync(join(dir, "_index/facts.json"))) crawl(["brand", url, "--max-pages", "1"]);
} catch (e) {
  console.error(`from-site: could not read ${url}: ${String(e.stderr || e.message).trim().split("\n").pop()}
  Is the address right? Try it in curl: curl -sI ${url}`);
  process.exit(1);
}
// The pages that carry what a homepage needs beyond the homepage itself.
const pagesRead = new Set((read("_index/manifest.json", {}).pages || []).map((p) => p.url));
const linked = (read("_index/inventory.json", {}).records || []).map((r) => r.url).filter((u) => !pagesRead.has(u));
const photoPages = linked.filter((u) => /\/(gallery|photos?|portfolio|projects|our-work|work)(\/|$)/i.test(new URL(u).pathname)).slice(0, 2);
const servicesPage = linked.find((u) => /\/(services?|what-we-do)\/?$/i.test(new URL(u).pathname));
const extra = onlyHomepage ? [] : [...photoPages, servicesPage].filter(Boolean);
if (extra.length) {
  try {
    crawl(["add", ...extra]);
  } catch {}
}
const facts = read("_index/facts.json", {});
const markup = read("structured/business.json", {});
const styles = read("_index/styles.json", { colors: [], fonts: [], roles: {} });
const media = read("_index/media.json", []);
const today = new Date().toISOString().slice(0, 10);
const first = (k) => facts[k]?.[0]?.value || "";
const done = [];

// ── the business note ─────────────────────────────────────────────────────
const businessFile = "public/business.md";
const note = readFileSync(businessFile, "utf8");
const [, front = "", body = ""] = note.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) || [];
const data = YAML.parse(front) || {};
if (!data.name || data.name === "to fill") {
  const address = first("address");
  const m = address.match(/^(.+?),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  Object.assign(data, {
    updated: today,
    name: markup.name || host,
    telephone: first("phone") || data.telephone,
    email: first("email") || data.email,
    address: m ? { street: m[1], locality: m[2], region: m[3], postal_code: m[4], country: "US" } : address ? { street: address, locality: "", region: "", postal_code: "", country: "" } : data.address,
    same_as: (facts.social || []).map((s) => s.value),
    sources: [`${dir}/_index/facts.json`, `${dir}/structured/business.json`],
  });
  const description = markup.description ? `${markup.description} (${dir}/structured/business.json)` : `What ${data.name} does, from ${dir}/pages/.`;
  writeFileSync(businessFile, `---\n${YAML.stringify(data).trimEnd()}\n---\n\n${description}\n`);
  done.push(`${businessFile}: name, phone, email, address from the crawl`);
}

// ── the logo and the photographs ──────────────────────────────────────────
const fileOf = (it) => join(dir, "images", it.file);
const logo = media.filter((it) => it.kind === "logo" && it.file && existsSync(fileOf(it))).sort((a, b) => (b.width || 0) - (a.width || 0))[0];
let logoFile = "";
if (logo) {
  mkdirSync("brand/logo", { recursive: true });
  logoFile = logo.file;
  copyFileSync(fileOf(logo), join("brand/logo", logoFile));
  done.push(`brand/logo/${logoFile} (${logo.width}x${logo.height})`);
}
const photos = media
  .filter((it) => it.kind === "photo" && it.file && (it.width || 0) >= 800 && existsSync(fileOf(it)))
  .sort((a, b) => (b.width || 0) - (a.width || 0))
  .slice(0, 16);
mkdirSync("static/images", { recursive: true });
// At most 2400px wide for the web: ffmpeg, else Pillow; a photograph neither
// can shrink is left out rather than shipped at its full size.
const webSize = (src, dest, width) => {
  const tries = [
    ["ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vf", "scale='min(2400,iw)':-2", "-q:v", "7", dest]],
    ["python3", ["-c", "import sys; from PIL import Image; i = Image.open(sys.argv[1]).convert('RGB'); i.thumbnail((2400, 2400 * i.height // i.width)); i.save(sys.argv[2], quality=80)", src, dest]],
  ];
  for (const [cmd, args] of tries) {
    try {
      execFileSync(cmd, args, { stdio: "ignore" });
      return true;
    } catch {}
  }
  if (width > 2400) return false;
  copyFileSync(src, dest);
  return true;
};
const shown = photos.flatMap((it) => {
  const name = it.file.replace(/\.(png|jpe?g|webp)$/i, ".jpg");
  if (!existsSync(join("static/images", name)) && !webSize(fileOf(it), join("static/images", name), it.width)) return [];
  const where = it.pages?.[0]?.heading ? ` beside "${it.pages[0].heading}"` : "";
  const fits = it.width >= 2000 ? "  full width" : "";
  return [`/images/${name}  ${it.width}x${it.height}${fits}${where}${it.alts?.[0] ? ` alt "${it.alts[0]}"` : ""}`];
});
if (shown.length) done.push(`static/images/: ${shown.length} photographs, at most 2400px wide`);

// ── colours and fonts ─────────────────────────────────────────────────────
const solid = (c) => (/^#[0-9a-f]{6}$/i.test(c) ? c.toLowerCase() : null);
const palette = styles.colors.map((c) => solid(c.color)).filter(Boolean);
const iconFont = /icon|awesome|glyph|dashicons|eicons|material symbols/i;
const fonts = styles.fonts.filter((f) => !iconFont.test(f));
const bodyFont = [styles.roles.body?.font, styles.roles.p?.font, fonts[0]].find((f) => f && !iconFont.test(f)) || "";
const headFont = [styles.roles.h1?.font, styles.roles.h2?.font].find((f) => f && !iconFont.test(f)) || bodyFont;

const mix = (a, b, t) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
// step a text colour toward the far end until it reads at 4.5:1 on its ground
const readable = (fg, bg) => {
  const toward = luminance(bg) > 0.4 ? "#000000" : "#ffffff";
  for (let t = 0; t <= 1 && ratio(fg, bg) < 4.5; t += 0.05) fg = mix(fg, toward, 0.05);
  return fg;
};

const recordFile = "design/system.yaml";
const doc = YAML.parseDocument(readFileSync(recordFile, "utf8"));
const starter = doc.get("id") === "starter";
if (starter && palette.length) {
  const canvas = solid(styles.roles.body?.background) || palette.find((c) => luminance(c) > 0.85) || "#ffffff";
  const ink = readable(solid(styles.roles.body?.color) || palette.find((c) => luminance(c) < 0.1) || "#111111", canvas);
  const accent = palette.find((c) => chromaHue(c).chroma > 0.35) || ink;
  const night = palette.find((c) => luminance(c) < 0.05 && c !== ink) || mix(ink, "#000000", 0.4);
  const colours = {
    canvas,
    surface: mix(canvas, "#ffffff", 0.5),
    panel: mix(canvas, ink, 0.05),
    night,
    ink,
    "ink-2": readable(mix(ink, canvas, 0.3), mix(canvas, ink, 0.05)),
    "ink-3": readable(mix(ink, canvas, 0.45), mix(canvas, ink, 0.05)),
    "night-ink": readable(mix(canvas, "#ffffff", 0.5), night),
    "night-ink-2": readable(mix(canvas, night, 0.3), night),
    accent: readable(accent, canvas),
    "accent-ink": ratio("#ffffff", readable(accent, canvas)) >= 4.5 ? "#ffffff" : ink,
  };
  for (const [k, v] of Object.entries(colours)) doc.setIn(["tokens", "colors", k], v);
  if (headFont && bodyFont) {
    for (const [style, v] of Object.entries(doc.getIn(["tokens", "typography"]).toJSON())) {
      doc.setIn(["tokens", "typography", style, "fontFamily"], ["display", "section", "title", "specimen"].includes(style) ? headFont : bodyFont);
    }
  }
  doc.set("id", "site");
  doc.set("title", markup.name || host);
  writeFileSync(recordFile, doc.toString());
  execFileSync("node", ["scripts/system.mjs"], { stdio: "ignore" });
  done.push(`design/system.yaml: colours from the site (accent ${colours.accent}, ink ${ink} on ${canvas}), ${[...new Set([headFont, bodyFont])].join(" and ")}; npm run system`);
}

// ── src/site.ts: fonts and logo, while it still has the starter's ─────────
if (headFont && bodyFont && readFileSync("src/site.ts", "utf8").includes('display: "Bricolage Grotesque"')) {
  const family = (f) => `family=${f.replace(/ /g, "+")}:wght@400;600;700`;
  const fontsUrl = `https://fonts.googleapis.com/css2?${[...new Set([headFont, bodyFont])].map(family).join("&")}&display=swap`;
  let siteTs = readFileSync("src/site.ts", "utf8");
  siteTs = siteTs
    .replace(/display: "[^"]*"/, `display: "${headFont}"`)
    .replace(/body: "[^"]*"/, `body: "${bodyFont}"`)
    .replace(/googleFontsUrl:\s*"[^"]*"/, `googleFontsUrl:\n      "${fontsUrl}"`);
  if (logoFile) siteTs = siteTs.replace(/logo: \{ file: "[^"]*", alt: "[^"]*" \}/, `logo: { file: "${logoFile}", alt: "${(markup.name || host).replace(/"/g, "")}" }`);
  writeFileSync("src/site.ts", siteTs);
  done.push(`src/site.ts: ${[...new Set([headFont, bodyFont])].join(" and ")} from Google Fonts${logoFile ? ", the logo" : ""}`);
}

// ── what the agent reads next ─────────────────────────────────────────────
const pageFile = (u) => (read("_index/manifest.json", {}).pages || []).find((p) => p.url === u)?.file;
const services = servicesPage && pageFile(servicesPage);
const summary = {
  site: host,
  wrote: done,
  homepage_words: `${dir}/pages/index.md`,
  services_words: services ? `${dir}/${services}` : null,
  looks_today: `${dir}/shots/index/`,
  colours_by_use: palette.slice(0, 8),
  fonts,
  photographs: shown,
  next: [
    services ? `write public/services.md from ${dir}/${services}` : "write public/services.md from the homepage's words",
    "design and build the homepage: the design skill's \"The homepage first\"",
  ],
};
if (asJson) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`from-site: ${host}
${done.map((d) => `  ${d}`).join("\n")}

The homepage's words:    ${summary.homepage_words}${summary.services_words ? `\nThe services page:       ${summary.services_words}` : ""}
How it looks today:      ${summary.looks_today}
Colours by use:          ${summary.colours_by_use.join(" ")}
Fonts:                   ${fonts.join(", ") || "none read"}
Photographs (in static/images/, at most 2400px wide; "full width" ones can run edge to edge):
${shown.map((s) => `  ${s}`).join("\n") || "  none sharp enough for a full-width image"}

Next: ${summary.next.join("; then ")}.`);
}
