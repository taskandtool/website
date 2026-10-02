#!/usr/bin/env node
// A homepage variant as one standalone page the owner can click through in
// the chat: `npm run variant -- design/variants/<n>`.
//
// The folder holds page.html (a whole document using Tailwind classes) and
// theme.css (that direction's tokens, shaped like styles/theme.css). This
// compiles the page's classes against that theme with the site's own base
// styles (styles/input.css, its theme and source swapped for the variant's),
// and writes <folder>/index.html with the CSS inlined, so it opens anywhere
// with nothing beside it. Images and fonts load from https URLs.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, "page.html")) || !existsSync(join(dir, "theme.css"))) {
  console.error("usage: npm run variant -- design/variants/<n>   (the folder holds page.html and theme.css)");
  process.exit(1);
}

const entry = join(dir, ".input.css");
const input = readFileSync("styles/input.css", "utf8")
  .replace(/@import "\.\/theme\.css";[^\n]*/, `@import "${resolve(dir, "theme.css")}";`)
  .replace(/@source "[^"]*";/, `@source "${resolve(dir, "page.html")}";`);
writeFileSync(entry, input);
let css;
try {
  css = execFileSync("node_modules/.bin/tailwindcss", ["-i", entry, "--minify"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
} finally {
  rmSync(entry, { force: true });
}

const page = readFileSync(join(dir, "page.html"), "utf8")
  .replace(/<link[^>]+rel="stylesheet"[^>]+href="\/?site\.css"[^>]*>/g, "");
if (!page.includes("</head>")) {
  console.error(`${dir}/page.html needs a <head>: write the whole document`);
  process.exit(1);
}
writeFileSync(join(dir, "index.html"), page.replace("</head>", `<style>${css}</style>\n</head>`));
console.log(`${dir}/index.html  ${(css.length / 1024).toFixed(0)} KB of CSS inlined`);
