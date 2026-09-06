#!/usr/bin/env node
// The site's own checks, run with `npm run check`. They make DESIGN.md and
// BRAND.md enforceable rather than advisory:
//   - brand/brand.json follows the brand contract (BRAND.md)
//   - every colour DESIGN.md's palette table lists exists in the theme or the brand
//   - page paths are unique and start with "/"
//   - nothing under src/ except server.ts imports a Node built-in (the edge rule)
//   - no markup uses what DESIGN.md refuses: hex values, arbitrary values other
//     than a measure, tracking/leading overrides, weights above 700, gradients,
//     blur, glass, animations
// Exit 1 with the findings when something is off.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const findings = [];
const hex = /^#[0-9a-fA-F]{6}$/;

// brand.json against the contract
const brand = JSON.parse(readFileSync("brand/brand.json", "utf8"));
if (brand.schema !== "taskandtool/brand/1") findings.push(`brand/brand.json: schema must be "taskandtool/brand/1"`);
if (!brand.name || typeof brand.name !== "string") findings.push("brand/brand.json: name is missing");
if (!brand.colors || !hex.test(brand.colors.primary ?? "")) findings.push("brand/brand.json: colors.primary must be a 6-digit hex colour");
for (const [k, v] of Object.entries(brand.colors ?? {})) {
  if (!hex.test(String(v))) findings.push(`brand/brand.json: colors.${k} is not a 6-digit hex colour`);
}
for (const k of ["display", "body", "googleFontsUrl"]) {
  if (brand.fonts && brand.fonts[k] !== undefined && typeof brand.fonts[k] !== "string") findings.push(`brand/brand.json: fonts.${k} must be a string`);
}
if (brand.logo?.file && !existsSync(join("brand", brand.logo.file.replace(/^\/?(brand\/)?/, "")))) {
  findings.push(`brand/brand.json: logo.file ${brand.logo.file} is not in brand/`);
}
if (existsSync("brand/_mirror.md")) console.log("note: brand/ is a mirror from another app; edit brand facts at the source");

// DESIGN.md palette vs the theme and the brand
const theme = readFileSync("styles/theme.css", "utf8");
const design = readFileSync("DESIGN.md", "utf8");
const palette = design.split("## Color")[1]?.split("\n## ")[0] ?? "";
const known = new Set([...(theme.match(/#[0-9a-fA-F]{6}\b/g) ?? []), ...Object.values(brand.colors ?? {})].map((h) => h.toLowerCase()));
for (const h of new Set(palette.match(/#[0-9a-fA-F]{6}\b/g) ?? [])) {
  if (!known.has(h.toLowerCase())) findings.push(`DESIGN.md lists ${h} but neither styles/theme.css nor brand.json defines it`);
}
for (const token of new Set(palette.match(/`(--color-[a-z0-9-]+)`/g) ?? [])) {
  const name = token.replace(/`/g, "");
  if (!theme.includes(`${name}:`)) findings.push(`DESIGN.md names ${name} but styles/theme.css does not define it`);
}
for (const m of palette.matchAll(/brand `([a-z0-9-]+)`/g)) {
  if (!brand.colors?.[m[1]]) findings.push(`DESIGN.md maps a role onto brand \`${m[1]}\` but brand.json has no colors.${m[1]}`);
}

// contrast of the brand-dependent pairs (WCAG 2.x)
const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const themeHex = (name) => theme.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
const resolved = {
  canvas: themeHex("canvas"), panel: themeHex("panel"), "accent-ink": themeHex("accent-ink"),
  accent: brand.colors?.primary, "ink-2": brand.colors?.neutral ?? themeHex("ink-2"),
  night: brand.colors?.dark ?? themeHex("night"), "night-ink": brand.colors?.light ?? themeHex("night-ink"),
};
const pairs = [["accent", "canvas"], ["accent-ink", "accent"], ["ink-2", "canvas"], ["ink-2", "panel"], ["night-ink", "night"]];
for (const [fg, bg] of pairs) {
  const [a, b] = [resolved[fg], resolved[bg]];
  if (!a || !b || !hex.test(a) || !hex.test(b)) continue;
  const r = ratio(a, b);
  if (r < 4.5) findings.push(`contrast: ${fg} (${a}) on ${bg} (${b}) is ${r.toFixed(1)}:1, under 4.5:1. Remap the role in styles/theme.css (DESIGN.md: Color rules)`);
}

// pages
function walk(dir) {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const pageFiles = walk("src/pages").filter((f) => f.endsWith(".tsx"));
const seen = new Map();
for (const file of pageFiles) {
  for (const m of readFileSync(file, "utf8").matchAll(/path:\s*["']([^"']+)["']/g)) {
    if (!m[1].startsWith("/")) findings.push(`${file}: page path ${m[1]} must start with /`);
    if (seen.has(m[1]) && seen.get(m[1]) !== file) findings.push(`page path ${m[1]} is defined in both ${seen.get(m[1])} and ${file}`);
    seen.set(m[1], file);
  }
}

// the edge rule and the refuse list
const nodeImport = /from\s+["'](node:[a-z_]+|fs|path|child_process|os|net|crypto|http|https|stream|url|util)["']/;
const refuse = [
  [/\b(bg|text|border|from|to|via|ring|outline|fill|stroke)-\[#/, "a hex colour in markup: add a brand colour and a role token instead"],
  [/\b(bg|text|border|ring|outline)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b/, "a Tailwind default colour: the palette is the theme's tokens only"],
  [/\b(bg-gradient-|bg-linear-|bg-radial-|bg-conic-)/, "a gradient (DESIGN.md: no gradients on interface elements)"],
  [/\b(backdrop-blur|blur-|drop-shadow-)/, "blur or glass (DESIGN.md refuses them)"],
  [/\banimate-/, "an animation utility (one thing moves per page, and only with a reason; write it in CSS with a reduced-motion state)"],
  [/\b(tracking|leading)-/, "a tracking/leading override: the size token carries both"],
  [/\bfont-(bold|extrabold|black)\b/, "a weight above the heading weight: use the size tokens' weights or font-semibold"],
  [/\btext-\[(?!clamp)/, "an arbitrary text size: add a --text-* token"],
];
for (const file of walk("src")) {
  const src = readFileSync(file, "utf8");
  if (!file.endsWith("server.ts")) {
    const m = src.match(nodeImport);
    if (m) findings.push(`${file} imports ${m[1]}: Node built-ins cannot run at the edge (only src/server.ts may)`);
  }
  if (file.endsWith(".tsx")) {
    for (const [rx, why] of refuse) {
      const m = src.match(rx);
      if (m) findings.push(`${file}: "${m[0]}" is ${why}`);
    }
  }
}

if (findings.length) {
  console.error("check: " + findings.length + " finding(s)\n  - " + findings.join("\n  - "));
  process.exit(1);
}
console.log("check: ok");
