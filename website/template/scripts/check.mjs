#!/usr/bin/env node
// The site's own checks, run with `npm run check`. They make DESIGN.md and
// BRAND.md enforceable rather than advisory:
//   - the brand notes the site is set from exist (BRAND.md)
//   - every colour DESIGN.md's palette table lists exists in the theme, and
//     the brand-dependent pairs (accent on canvas, ink-2 on canvas…) meet 4.5:1
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

// the brand notes (BRAND.md): the files the theme and the pages are set from
for (const f of ["positioning.md", "voice.md", "visual-identity.md"]) {
  if (!existsSync(join("brand", f))) findings.push(`brand/${f} is missing (BRAND.md lists the notes the site is set from)`);
}
if (existsSync("brand/_mirror.md")) console.log("note: brand/ is a mirror from the Company Brain; change brand facts there, then re-apply them here");
const design = readFileSync("DESIGN.md", "utf8");
const identity = design.split("## Identity")[1]?.split("\n## ")[0] ?? "";
const unfilled = (identity.match(/to fill/g) ?? []).length;
if (unfilled) console.log(`note: DESIGN.md's Identity block has ${unfilled} line(s) still to fill; the site is a template until the design skill's brief fills them`);

// DESIGN.md palette vs the theme
const theme = readFileSync("styles/theme.css", "utf8");
const palette = design.split("## Color")[1]?.split("\n## ")[0] ?? "";
const known = new Set((theme.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((h) => h.toLowerCase()));
for (const h of new Set(palette.match(/#[0-9a-fA-F]{6}\b/g) ?? [])) {
  if (!known.has(h.toLowerCase())) findings.push(`DESIGN.md lists ${h} but styles/theme.css does not define it`);
}
for (const token of new Set(palette.match(/`(--color-[a-z0-9-]+)`/g) ?? [])) {
  const name = token.replace(/`/g, "");
  if (!theme.includes(`${name}:`)) findings.push(`DESIGN.md names ${name} but styles/theme.css does not define it`);
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
// a token's hex, following one level of var(--brand-*) into the brand block
const varHex = (name) => theme.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
const themeHex = (name) => {
  const raw = theme.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!raw) return undefined;
  if (hex.test(raw)) return raw;
  const ref = raw.match(/^var\(--([a-z0-9-]+)\)$/)?.[1];
  return ref ? varHex(ref) : undefined;
};
const resolved = Object.fromEntries(["canvas", "panel", "accent", "accent-ink", "ink-2", "night", "night-ink"].map((n) => [n, themeHex(n)]));
const pairs = [["accent", "canvas"], ["accent-ink", "accent"], ["ink-2", "canvas"], ["ink-2", "panel"], ["night-ink", "night"]];
for (const [fg, bg] of pairs) {
  const [a, b] = [resolved[fg], resolved[bg]];
  if (!a || !b || !hex.test(a) || !hex.test(b)) continue;
  const r = ratio(a, b);
  if (r < 4.5) findings.push(`contrast: ${fg} (${a}) on ${bg} (${b}) is ${r.toFixed(1)}:1, under 4.5:1. Give the role a different value in styles/theme.css (DESIGN.md: Color rules)`);
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
