#!/usr/bin/env node
// The site's own checks, run with `npm run check`. They make DESIGN.md and
// BRAND.md enforceable rather than advisory:
//   - the brand notes the site is set from exist (BRAND.md)
//   - every colour DESIGN.md's palette table lists exists in the theme, and
//     the brand-dependent pairs (accent on canvas, ink-2 on canvas…) meet 4.5:1
//   - page paths are unique and start with "/"
//   - site-map.md's keep and merge rows resolve to a page or a redirect
//   - posts carry a real date; the business note's phone looks like one
//   - nothing under src/ except server.ts imports a Node built-in (the edge rule)
// What the rendered pages may and may not carry (the refuse list, the copy
// rules, contrast in context, the generated-page patterns) is `npm run lint`,
// which reads dist/ after a build.
// Exit 1 with the findings when something is off.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { colour, isHex, ratio, theme } from "./theme.mjs";

const findings = [];

// the brand notes (BRAND.md): the files the theme and the pages are set from
for (const f of ["positioning.md", "voice.md", "visual-identity.md"]) {
  if (!existsSync(join("brand", f))) findings.push(`brand/${f} is missing (BRAND.md lists the notes the site is set from)`);
}
const design = readFileSync("DESIGN.md", "utf8");
const identity = design.split("## Identity")[1]?.split("\n## ")[0] ?? "";
const unfilled = (identity.match(/to fill/g) ?? []).length;
if (unfilled) console.log(`note: DESIGN.md's Identity block has ${unfilled} line(s) still to fill; the site is a template until the design skill's brief fills them`);

// DESIGN.md palette vs the theme
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
const resolved = Object.fromEntries(["canvas", "panel", "surface", "accent", "accent-ink", "ink", "ink-2", "ink-3", "night", "night-ink", "night-ink-2"].map((n) => [n, colour(n)]));
const pairs = [
  ["ink", "canvas"], ["ink", "surface"], ["ink", "panel"],
  ["ink-2", "canvas"], ["ink-2", "panel"], ["ink-3", "canvas"], ["ink-3", "panel"],
  ["accent", "canvas"], ["accent-ink", "accent"],
  ["night-ink", "night"], ["night-ink-2", "night"],
];
for (const [fg, bg] of pairs) {
  const [a, b] = [resolved[fg], resolved[bg]];
  if (!isHex(a) || !isHex(b)) continue;
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

// site-map.md: every keep or merge row resolves to a page or a redirect
if (existsSync("site-map.md")) {
  const map = readFileSync("site-map.md", "utf8");
  const pagePaths = new Set();
  for (const file of walk("src/pages")) for (const m of readFileSync(file, "utf8").matchAll(/path:\s*["']([^"']+)["']/g)) pagePaths.add(m[1]);
  const redirectsSrc = existsSync("src/redirects.ts") ? readFileSync("src/redirects.ts", "utf8") : "";
  const redirectFroms = new Set([...redirectsSrc.matchAll(/\[\s*"([^"]+)"\s*,\s*"[^"]+"\s*\]/g)].map((m) => m[1]));
  let generated = { posts: [], legal: [] };
  try {
    generated = JSON.parse(readFileSync("src/generated/content.json", "utf8"));
  } catch {}
  for (const p of [...generated.posts, ...generated.legal]) pagePaths.add(p.path);
  if (generated.posts?.length) pagePaths.add("/blog");
  for (const line of map.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 7 || !cells[1].startsWith("/") || cells[1] === "old URL") continue;
    const [, oldUrl, action, target] = cells;
    const oldPath = oldUrl.replace(/^https?:\/\/[^/]+/, "") || "/";
    if (action === "keep" && !pagePaths.has(oldPath) && !pagePaths.has(target)) findings.push(`site-map.md: ${oldUrl} is a keep but no page has path ${target || oldPath}`);
    if ((action === "merge" || action === "drop") && target !== "-" && !redirectFroms.has(oldPath) && !pagePaths.has(oldPath)) {
      findings.push(`site-map.md: ${oldUrl} is a ${action} to ${target} but src/redirects.ts has no entry for ${oldPath}`);
    }
  }
}

// public/ is the facts folder, not the web root: an image or a stylesheet
// there is a misplaced asset (they belong in static/)
if (existsSync("public")) {
  const stray = readdirSync("public").filter((f) => !f.endsWith(".md") && !f.startsWith(".") && !statSync(join("public", f)).isDirectory());
  for (const f of stray) findings.push(`public/${f}: public/ holds the fact notes (markdown); served files go in static/`);
}

// the notes parse and posts have what the collection needs
try {
  const gen = JSON.parse(readFileSync("src/generated/content.json", "utf8"));
  for (const p of gen.posts) if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) findings.push(`posts/${p._file}: date must be YYYY-MM-DD`);
  if (gen.facts.business && gen.facts.business.name && gen.facts.business.telephone && !/^\+?[0-9 ()-]{6,}$/.test(gen.facts.business.telephone)) findings.push(`public/business.md: telephone does not look like a phone number`);
} catch {
  console.log("note: src/generated/content.json missing; run npm run content");
}

// the edge rule
const nodeImport = /from\s+["'](node:[a-z_]+|fs|path|child_process|os|net|crypto|http|https|stream|url|util)["']/;
for (const file of walk("src")) {
  const src = readFileSync(file, "utf8");
  if (!file.endsWith("server.ts")) {
    const m = src.match(nodeImport);
    if (m) findings.push(`${file} imports ${m[1]}: Node built-ins cannot run in production on Cloudflare (only src/server.ts may)`);
  }
}

if (findings.length) {
  console.error("check: " + findings.length + " finding(s)\n  - " + findings.join("\n  - "));
  process.exit(1);
}
console.log("check: ok");
