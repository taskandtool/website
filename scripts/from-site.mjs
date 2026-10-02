#!/usr/bin/env node
// A first homepage's starting point from the business's current site:
// `npm run from-site -- https://theirsite.com`.
//
// Crawls the homepage when it has not been (tt-crawl brand --max-pages 1),
// then does by script what needs no judgement: the business note's facts
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

const url = process.argv[2];
if (!/^https?:\/\//.test(url || "")) {
  console.error("usage: npm run from-site -- https://theirsite.com");
  process.exit(1);
}
const host = new URL(url).hostname.replace(/^www\./, "");
const dir = `raw/site/${host}`;
if (!existsSync(join(dir, "_index/facts.json"))) {
  execFileSync("tt-crawl", ["brand", url, "--max-pages", "1"], { stdio: ["ignore", "ignore", "inherit"] });
}
const read = (f, fallback) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), "utf8")) : fallback);
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
  .filter((it) => it.kind === "photo" && it.file && (it.width || 0) >= 1200 && existsSync(fileOf(it)))
  .sort((a, b) => (b.width || 0) - (a.width || 0))
  .slice(0, 8);
mkdirSync("static/images", { recursive: true });
const webSize = (src, dest) => {
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vf", "scale='min(2400,iw)':-2", "-q:v", "7", dest]);
  } catch {
    copyFileSync(src, dest);
  }
};
const shown = photos.map((it) => {
  const name = it.file.replace(/\.(png|jpe?g|webp)$/i, ".jpg");
  if (!existsSync(join("static/images", name))) webSize(fileOf(it), join("static/images", name));
  const where = it.pages?.[0]?.heading ? ` beside "${it.pages[0].heading}"` : "";
  return `/images/${name}  ${it.width}x${it.height}${where}${it.alts?.[0] ? ` alt "${it.alts[0]}"` : ""}`;
});
if (shown.length) done.push(`static/images/: ${shown.length} photographs at most 2400px wide`);

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

// ── src/site.ts: fonts and logo ───────────────────────────────────────────
if (headFont && bodyFont) {
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

console.log(`from-site: ${host}
${done.map((d) => `  ${d}`).join("\n")}

The homepage's words:    ${dir}/pages/index.md
How it looks today:      ${dir}/shots/index/
Colours by use:          ${palette.slice(0, 8).join(" ")}
Fonts:                   ${fonts.join(", ") || "none read"}
Photographs:
${shown.map((s) => `  ${s}`).join("\n") || "  none sharp enough for a full-width image"}`);
