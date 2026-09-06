#!/usr/bin/env node
// The site's own checks, run with `npm run check`:
//   - brand/brand.json parses and names the business
//   - every colour DESIGN.md's palette table lists exists in brand/tokens.css
//   - every page has a unique path starting with "/"
//   - nothing under src/ except server.ts imports a Node built-in (the edge rule)
// Exit 1 with the findings when something is off.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const findings = [];

const brand = JSON.parse(readFileSync("brand/brand.json", "utf8"));
if (!brand.name || typeof brand.name !== "string") findings.push("brand/brand.json: name is missing");

const tokens = readFileSync("brand/tokens.css", "utf8");
const design = readFileSync("DESIGN.md", "utf8");
const palette = design.split("## Color")[1]?.split("\n## ")[0] ?? "";
for (const hex of new Set(palette.match(/#[0-9a-fA-F]{6}\b/g) ?? [])) {
  if (!tokens.toLowerCase().includes(hex.toLowerCase())) {
    findings.push(`DESIGN.md lists ${hex} but brand/tokens.css does not define it`);
  }
}
for (const token of new Set(palette.match(/`(--color-[a-z0-9-]+)`/g) ?? [])) {
  const name = token.replace(/`/g, "");
  if (!tokens.includes(`${name}:`)) findings.push(`DESIGN.md names ${name} but brand/tokens.css does not define it`);
}

const pagesSrc = readFileSync("src/pages/index.ts", "utf8");
if (!/export const pages/.test(pagesSrc)) findings.push("src/pages/index.ts must export `pages`");

function walk(dir) {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const nodeImport = /from\s+["'](node:[a-z_]+|fs|path|child_process|os|net|crypto|http|https|stream|url|util)["']/;
for (const file of walk("src")) {
  if (file.endsWith("server.ts")) continue;
  const src = readFileSync(file, "utf8");
  const m = src.match(nodeImport);
  if (m) findings.push(`${file} imports ${m[1]}: Node built-ins cannot run at the edge (only src/server.ts may)`);
}
const seen = new Set();
for (const m of pagesSrc.matchAll(/path:\s*["']([^"']+)["']/g)) {
  if (!m[1].startsWith("/")) findings.push(`page path ${m[1]} must start with /`);
  if (seen.has(m[1])) findings.push(`page path ${m[1]} is listed twice`);
  seen.add(m[1]);
}

if (findings.length) {
  console.error("check: " + findings.length + " finding(s)\n  - " + findings.join("\n  - "));
  process.exit(1);
}
console.log("check: ok");
