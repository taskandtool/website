#!/usr/bin/env node
// The site's own checks, run with `npm run check`. They make DESIGN.md and
// BRAND.md enforceable rather than advisory:
//   - the brand notes the site is set from exist (BRAND.md)
//   - styles/theme.css and DESIGN.md match design/system.yaml, and the
//     role pairs the layout uses (accent on canvas, ink-2 on panel…) meet 4.5:1
//   - page paths are unique and start with "/"
//   - site-map.md's keep and merge rows resolve to a page or a redirect
//   - posts carry a real date; the business note's phone looks like one
//   - nothing the production Worker imports uses a Node built-in (the edge rule)
// What the rendered pages may and may not carry (the refuse list, the copy
// rules, contrast in context, the generated-page patterns) is `npm run lint`,
// which reads dist/ after a build.
// Exit 1 with the findings when something is off.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { DESIGN, FONTS, RECORD, THEME, designMd, fontsTs, problems, readRecord, themeCss } from "./system.mjs";
import { fail } from "../src/data/cli.mjs";
import { pagePaths, start } from "./lib.mjs";
import { TEXT_PAIRS, isHex, ratio, readTheme } from "./theme.mjs";

start("check", `usage: npm run check

The project's own checks: the brand notes, the design record and its
contrast, page paths, the site map, the business facts, the Cloudflare rule.
Prints "check: ok", or each finding on stderr and exits 1.`);

const findings = [];
const { source: theme, colour } = readTheme();

// the brand notes (BRAND.md): the files the theme and the pages are set from
for (const f of ["positioning.md", "voice.md", "visual-identity.md"]) {
  if (!existsSync(join("brand", f))) findings.push(`brand/${f} is missing (BRAND.md lists the notes the site is set from)`);
}

// styles/theme.css and DESIGN.md are compiled from the record; a hand edit
// to either is lost on the next compile, so it is a finding here
const record = readRecord();
const unfilled = Object.values(record.identity ?? {}).filter((v) => String(v).startsWith("to fill")).length;
if (unfilled) console.log(`note: ${RECORD}'s identity has ${unfilled} line(s) still to fill; the design skill fills them when the site grows`);
const recordProblems = problems(record);
for (const p of recordProblems) findings.push(`${RECORD}: ${p}`);
if (!recordProblems.length) {
  if (theme !== themeCss(record)) findings.push(`${THEME} does not match ${RECORD}: change the record and run npm run system`);
  if (!existsSync(FONTS) || readFileSync(FONTS, "utf8") !== fontsTs(record)) findings.push(`${FONTS} does not match ${RECORD}: run npm run system`);
  if (readFileSync(DESIGN, "utf8") !== designMd(record)) findings.push(`${DESIGN} does not match ${RECORD}: change the record and run npm run system`);
}

// contrast of the role pairs the layout and components use (WCAG 2.x)
const resolved = Object.fromEntries(["canvas", "panel", "surface", "accent", "accent-ink", "ink", "ink-2", "ink-3", "night", "night-ink", "night-ink-2"].map((n) => [n, colour(n)]));
for (const [fg, bg] of TEXT_PAIRS) {
  const [a, b] = [resolved[fg], resolved[bg]];
  if (!isHex(a) || !isHex(b)) {
    for (const [role, v] of [[fg, a], [bg, b]]) {
      const f = `contrast: ${role} is ${v}, which cannot be measured: give it a 6-digit hex in design/system.yaml`;
      if (v && !isHex(v) && !findings.includes(f)) findings.push(f);
    }
    continue;
  }
  const r = ratio(a, b);
  if (r < 4.5) findings.push(`contrast: ${fg} (${a}) on ${bg} (${b}) is ${r.toFixed(1)}:1, under 4.5:1. Give the role a different value in design/system.yaml`);
}

// pages
const paths = pagePaths();
const seen = new Map();
for (const { file, path } of paths) {
  if (!path.startsWith("/")) findings.push(`${file}: page path ${path} must start with /`);
  if (seen.has(path) && seen.get(path) !== file) findings.push(`page path ${path} is defined in both ${seen.get(path)} and ${file}`);
  seen.set(path, file);
}

// a page module nothing imports is never routed: it is listed in src/pages/index.ts
const imports = ["src/pages/index.ts", "src/app.tsx"].filter(existsSync).map((f) => readFileSync(f, "utf8")).join("\n");
for (const file of new Set(paths.map((p) => p.file))) {
  const name = file.replace(/^src\/pages\//, "").replace(/\.tsx$/, "");
  if (!new RegExp(`from ["']\\./${name}["']|from ["']\\./pages/${name}["']`).test(imports))
    findings.push(`${file} is a page nothing lists: import it in src/pages/index.ts and add it to modules`);
}

// site-map.md: every keep or merge row resolves to a page or a redirect
if (existsSync("site-map.md")) {
  const map = readFileSync("site-map.md", "utf8");
  const known = new Set(paths.map((p) => p.path));
  const redirectsSrc = existsSync("src/redirects.ts") ? readFileSync("src/redirects.ts", "utf8") : "";
  const redirectFroms = new Set([...redirectsSrc.matchAll(/\[\s*"([^"]+)"\s*,\s*"[^"]+"\s*\]/g)].map((m) => m[1]));
  let generated = { posts: [], legal: [] };
  try {
    generated = JSON.parse(readFileSync("src/generated/content.json", "utf8"));
  } catch {}
  for (const p of [...generated.posts, ...generated.legal]) known.add(p.path);
  if (generated.posts?.length) known.add("/blog");
  for (const line of map.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 7 || !cells[1].startsWith("/") || cells[1] === "old URL") continue;
    const [, oldUrl, action, target] = cells;
    const oldPath = oldUrl.replace(/^https?:\/\/[^/]+/, "") || "/";
    if (action === "keep" && !known.has(oldPath) && !known.has(target)) findings.push(`site-map.md: ${oldUrl} is a keep but no page has path ${target || oldPath}`);
    if ((action === "merge" || action === "drop") && target !== "-" && !redirectFroms.has(oldPath) && !known.has(oldPath)) {
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
  const b = gen.facts.business || {};
  if (b.name && b.telephone && !/^\+?[0-9 ().-]{6,}$/.test(b.telephone)) findings.push(`public/business.md: telephone "${b.telephone}" does not look like a phone number (digits, spaces, dots, dashes, brackets)`);
  if (b.time_zone) {
    try {
      new Intl.DateTimeFormat("en", { timeZone: b.time_zone });
    } catch {
      findings.push(`public/business.md: time_zone "${b.time_zone}" is not an IANA zone (e.g. America/New_York, Europe/London)`);
    }
  }
} catch {
  console.log("note: src/generated/content.json missing; run npm run content");
}

// the edge rule: what ships to Cloudflare is src/worker.ts and everything it
// imports. A machine-only file (a skill's cli.ts, a test) imports Node freely,
// so long as nothing the Worker reaches imports it.
const nodeImport = /(?:from\s+|import\s*\(?\s*|require\s*\(\s*)["'](node:[a-z_/]+|(?:fs|path|child_process|os|net|crypto|http|https|stream|url|util)(?:\/[a-z_]+)?)["']/;
const localImport = /(?:from\s+|import\s*\(?\s*)["'](\.{1,2}\/[^"']+)["']/g;
// comments out, strings kept: a "/api/*" route must not open a comment
const code = (src) => src.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m, str) => str ?? "");
const resolveImport = (from, spec) => {
  const base = join(dirname(from), spec);
  return [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")].find((f) => existsSync(f) && statSync(f).isFile());
};
const shipped = new Set();
const queue = [join("src", "worker.ts")];
while (queue.length) {
  const file = queue.pop();
  if (shipped.has(file) || !existsSync(file)) continue;
  shipped.add(file);
  const src = code(readFileSync(file, "utf8"));
  const m = src.match(nodeImport);
  if (m) findings.push(`${file} imports ${m[1]}, and the production Worker imports ${file}: Node built-ins cannot run on Cloudflare (keep machine-only code out of what src/worker.ts reaches)`);
  for (const [, spec] of src.matchAll(localImport)) {
    const next = resolveImport(file, spec);
    if (next) queue.push(next);
  }
}

if (findings.length) fail(`check: ${findings.length} finding(s)\n  - ${findings.join("\n  - ")}`, "npm run check, once each is fixed");
console.log("check: ok");
