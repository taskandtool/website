#!/usr/bin/env node
// brand/brand.json -> styles/brand.css: one CSS variable per brand colour and
// font, so the theme (styles/theme.css) can map roles onto them. Runs before
// every CSS build and, under `npm run dev`, whenever brand.json changes.
// Missing values fall back to the starter brand (src/brand-defaults.ts holds
// the same defaults for the pages).
import { readFileSync, writeFileSync } from "node:fs";

const defaults = {
  colors: { primary: "#2f5bea", dark: "#14110d", light: "#f6f3ec", neutral: "#57514a" },
  fonts: { display: "Bricolage Grotesque", body: "Inter" },
};

let brand = {};
try {
  brand = JSON.parse(readFileSync("brand/brand.json", "utf8"));
} catch (e) {
  // Mid-swap of a mirrored folder, or a file with a typo: keep the site
  // building on the defaults and say so.
  console.error(`brand/brand.json unreadable (${e.message}); using the starter brand`);
}
const colors = { ...defaults.colors, ...(brand.colors ?? {}) };
const fonts = { ...defaults.fonts, ...(brand.fonts ?? {}) };
const hex = /^#[0-9a-fA-F]{6}$/;
const quote = (f) => `"${String(f).replace(/"/g, "")}"`;

const lines = [
  "/* Generated from brand/brand.json by scripts/brand.mjs. Do not edit; edit brand.json. */",
  ":root {",
];
for (const [name, value] of Object.entries(colors)) {
  if (!hex.test(value)) {
    console.error(`brand.json: colors.${name} must be a 6-digit hex colour, got ${JSON.stringify(value)}`);
    process.exit(1);
  }
  lines.push(`  --brand-${name.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}: ${value.toLowerCase()};`);
}
lines.push(`  --brand-font-display: ${quote(fonts.display)};`);
lines.push(`  --brand-font-body: ${quote(fonts.body)};`);
lines.push("}", "");
writeFileSync("styles/brand.css", lines.join("\n"));
if (process.argv.includes("--verbose")) console.log("styles/brand.css written");
