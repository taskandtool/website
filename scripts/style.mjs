#!/usr/bin/env node
// Apply a style preset from the design skill's catalogue, or list them.
//
//   npm run style                       list the presets and what each is for
//   npm run style -- brutalist          copy the preset's DESIGN.md and
//                                       styles/theme.css in, set the fonts in
//                                       src/site.ts
//   npm run style -- brutalist --specimen
//                                       also add the preset's specimen page at
//                                       /specimen so the style can be seen on
//                                       this machine with real components
//   npm run style -- ./some/dir         a preset by path (the same files)
//   npm run style -- --remove-specimen  take the specimen page out again
//
// A preset is a starting point, not a brand: after applying one, run
// "Updating from the brand" in DESIGN.md so the business's own colours and
// fonts replace the preset's defaults. The command refuses to overwrite a
// DESIGN.md whose Identity block has been filled (the site has a design of
// its own by then) unless --force is given.
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const catalogue = resolve(".claude/skills/design/styles");
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const name = args.find((a) => !a.startsWith("--"));

function presets() {
  if (!existsSync(catalogue)) return [];
  return readdirSync(catalogue).filter((d) => statSync(join(catalogue, d)).isDirectory() && existsSync(join(catalogue, d, "DESIGN.md")));
}

function thesis(dir) {
  const md = readFileSync(join(dir, "DESIGN.md"), "utf8");
  const m = md.match(/^Thesis:\s*(.+)$/m);
  return m ? m[1].trim() : "";
}

if (flags.has("--remove-specimen")) {
  const page = "src/pages/specimen.tsx";
  if (existsSync(page)) unlinkSync(page);
  const indexPath = "src/pages/index.ts";
  const index = readFileSync(indexPath, "utf8")
    .replace(/import \{ Specimen \} from "\.\/specimen";\n/, "")
    .replace(/,\s*Specimen\b/, "")
    .replace(/\bSpecimen\s*,\s*/, "");
  writeFileSync(indexPath, index);
  console.log("specimen page removed");
  process.exit(0);
}

if (!name) {
  const list = presets();
  if (!list.length) {
    console.log(`no presets found under ${catalogue} (the design skill ships them)`);
    process.exit(0);
  }
  console.log("style presets (npm run style -- <name>):\n");
  for (const p of list) console.log(`  ${p.padEnd(12)} ${thesis(join(catalogue, p))}`);
  console.log(`\npreviews: ${catalogue}/<name>/preview.png and preview-mobile.png`);
  process.exit(0);
}

const dir = name.includes("/") || existsSync(name) ? resolve(name) : join(catalogue, name);
for (const f of ["DESIGN.md", "theme.css"]) {
  if (!existsSync(join(dir, f))) {
    console.error(`${dir} is not a preset: ${f} is missing. Presets: ${presets().join(", ") || "none"}`);
    process.exit(1);
  }
}

const current = existsSync("DESIGN.md") ? readFileSync("DESIGN.md", "utf8") : "";
const identity = current.split("## Identity")[1]?.split("\n## ")[0] ?? "";
if (current && !identity.includes("to fill") && !flags.has("--force")) {
  console.error("DESIGN.md's Identity block is filled: this site already has a design. Pass --force to replace it with the preset anyway.");
  process.exit(1);
}

copyFileSync(join(dir, "DESIGN.md"), "DESIGN.md");
copyFileSync(join(dir, "theme.css"), "styles/theme.css");
console.log(`applied ${dir}\n  DESIGN.md and styles/theme.css replaced`);

if (existsSync(join(dir, "fonts.json"))) {
  const fonts = JSON.parse(readFileSync(join(dir, "fonts.json"), "utf8"));
  const sitePath = "src/site.ts";
  let site = readFileSync(sitePath, "utf8");
  const before = site;
  site = site.replace(/(fonts:\s*\{[\s\S]*?display:\s*)"[^"]*"/, `$1${JSON.stringify(fonts.display ?? "")}`);
  site = site.replace(/(fonts:\s*\{[\s\S]*?\bbody:\s*)"[^"]*"/, `$1${JSON.stringify(fonts.body ?? "")}`);
  site = site.replace(/(fonts:\s*\{[\s\S]*?googleFontsUrl:\s*)\n?\s*"[^"]*"/, `$1${JSON.stringify(fonts.googleFontsUrl ?? "")}`);
  if (site !== before) {
    writeFileSync(sitePath, site);
    console.log(`  src/site.ts fonts set: ${fonts.display} / ${fonts.body}`);
  } else {
    console.log(`  could not find the fonts block in src/site.ts; set display, body and googleFontsUrl there by hand: ${JSON.stringify(fonts)}`);
  }
}

if (flags.has("--specimen") && existsSync(join(dir, "specimen.tsx"))) {
  copyFileSync(join(dir, "specimen.tsx"), "src/pages/specimen.tsx");
  const indexPath = "src/pages/index.ts";
  let index = readFileSync(indexPath, "utf8");
  if (!index.includes('from "./specimen"')) {
    index = index.replace(/(import \{ Home \} from "\.\/home";\n)/, `$1import { Specimen } from "./specimen";\n`);
    index = index.replace(/(const modules: PageModule\[\] = \[[^\]]*)\]/, (m, list) => `${list.trim().endsWith(",") || list.trim().endsWith("[") ? list : list + ", "}Specimen]`);
    writeFileSync(indexPath, index);
  }
  console.log("  specimen page added at /specimen (npm run style -- --remove-specimen takes it out; never publish it)");
}

console.log(`\nnext: npm run css && npm run check, look at the working copy, then "Updating from the brand" in DESIGN.md so the business's colours and fonts replace the preset's defaults.`);
