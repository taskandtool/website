#!/usr/bin/env node
// The rendered pages, linted: `npm run build && npm run lint`. It reads what a
// visitor gets (dist/**/*.html and the compiled static/site.css), so the
// layout, the components and the facts are checked along with each page.
//
// Errors fail (exit 1): what breaks the theme, the reader or the copy rules.
// Hints never fail: a pattern that reads as generated when it is a habit
// rather than a choice. Each finding says what to do instead, and each rule
// prints at most two findings, so the list is a set of cues, not a wall.
//
// A hint the design uses on purpose is declared in DESIGN.md under
// "## Declared", one line each: `- rule-id: the reason`. Then the rule is
// quiet. One element can opt out of one rule with data-lint-allow="rule-id"
// (an owner who insists on a phrase, a decorative exception), on it or an
// ancestor. Legal pages are verbatim and exempt from the copy rules.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { chromaHue, luminance, ratio, readTheme } from "./theme.mjs";

if (!existsSync("dist/index.html")) {
  console.error("lint: no dist/ yet; run npm run build first");
  process.exit(1);
}
const { colours } = readTheme();

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// ── what the site declares and what the CSS defines ──────────────────────
const design = readFileSync("DESIGN.md", "utf8");
const declaredBlock = design.split("## Declared")[1]?.split("\n## ")[0] ?? "";
const declared = new Map([...declaredBlock.matchAll(/^-\s*`?([a-z0-9-]+)`?:\s*(.+)$/gm)].map((m) => [m[1], m[2]]));

// The classes a stylesheet defines, unescaped (md\:grid-cols-2 → md:grid-cols-2).
const classesIn = (css) => new Set([...css.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)].map((m) => m[1].replace(/\\(.)/g, "$1")));
const siteCss = existsSync("static/site.css") ? classesIn(readFileSync("static/site.css", "utf8")) : new Set();

let legalPaths = new Set();
try {
  legalPaths = new Set(JSON.parse(readFileSync("src/generated/content.json", "utf8")).legal.map((p) => p.path));
} catch {}

// ── findings ──────────────────────────────────────────────────────────────
const findings = [];
const HINTS = new Set(["same-hue-text", "light-on-dark", "adjacent-ground", "card-in-card", "side-stripe",
  "icon-card-row", "eyebrow", "italic-heading-word", "entrance-everywhere", "declared-unread"]);
const allowed = (el, rule) => {
  for (let e = el; e; e = e.parentNode) if (e.getAttribute?.("data-lint-allow")?.split(/\s+/).includes(rule)) return true;
  return false;
};
const report = (rule, page, el, message) => {
  if (HINTS.has(rule) && declared.has(rule)) return;
  if (el && allowed(el, rule)) return;
  findings.push({ rule, level: HINTS.has(rule) ? "hint" : "error", page, where: el ? describe(el) : "", message });
};
const describe = (el) => {
  const text = el.text.replace(/\s+/g, " ").trim().slice(0, 40);
  const cls = (el.getAttribute("class") || "").split(/\s+/)[0];
  return `<${el.rawTagName}${cls ? "." + cls : ""}>${text ? ` "${text}${el.text.trim().length > 40 ? "…" : ""}"` : ""}`;
};
const classes = (el) => (el.getAttribute?.("class") || "").split(/\s+/).filter(Boolean);
// The nearest token of a kind (text-ink-2, bg-night) on the element or an ancestor, ignoring variants.
const nearest = (el, prefix) => {
  for (let e = el; e && e.getAttribute; e = e.parentNode) {
    const hit = classes(e).find((c) => c.startsWith(prefix) && colours[c.slice(prefix.length)]);
    if (hit) return hit.slice(prefix.length);
  }
  return undefined;
};

// ── the refuse list (DESIGN.md: Do's and Don'ts) and the copy rules ──────
const refuse = [
  [/^(bg|text|border|from|to|via|ring|outline|fill|stroke)-\[#/, "a hex colour in markup; give the colour a role in design/system.yaml and run npm run system"],
  [/^(bg|text|border|ring|outline)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-|$)/, "a Tailwind default colour; use the theme's tokens (bg-canvas, bg-panel, bg-night, text-ink…)"],
  [/^(bg-gradient-|bg-linear-|bg-radial-|bg-conic-)/, "a gradient; use a flat token ground"],
  [/^(backdrop-blur|blur-|drop-shadow-)/, "blur or glass; give depth with the theme's grounds instead"],
  [/^(bg-clip-text|text-transparent)$/, "gradient text; set the heading in a token colour"],
  [/^animate-/, "an animation utility; one thing moves per page, written in CSS with a reduced-motion state"],
  [/^(tracking|leading)-/, "a tracking or leading override; the size token carries both"],
  [/^font-(bold|extrabold|black)$/, "a weight above the heading weight; use the size tokens' weights or font-semibold"],
  [/^text-\[(?!clamp)/, "an arbitrary text size; add a type style to design/system.yaml and run npm run system"],
  [/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[/, "an arbitrary spacing value; use the nearest step on the scale, or fix the alignment that needed it"],
];
const copyTells = [
  /\bin today'?s (fast-paced|digital|competitive|ever-changing) world\b/i,
  /\bin a world where\b/i, /\bimagine a world\b/i, /\bwelcome to (our|my|the) (website|site|home)/i,
  /\bhere'?s the thing\b/i, /\band honestly\?/i, /\byou know what'?s wild\b/i, /\bthat changes everything\b/i,
  /\bwhether you'?re\b/i, /\blook no further\b/i, /\blet'?s dive in\b/i,
  /\bsay goodbye to\b/i, /\bto the next level\b/i, /\bdon'?t just \w+, \w+/i,
  /\bgame-?changer\b/i, /\ball-in-one\b/i, /\bseamless(ly)?\b/i, /\bcutting-edge\b/i,
  /\b(unlock|unleash|elevate|revolutioni[sz]e|supercharge) your\b/i, /\bleverage\b/i,
  /\bwe'?re passionate about\b/i, /\bwe pride ourselves\b/i, /\bwe do things differently\b/i,
  /\bstands? as a testament\b/i, /\bevolving landscape\b/i, /\bnestled in\b/i, /\bin the heart of\b/i,
  /\bit'?s not (just )?(about )?\w+[,.;] it'?s\b/i, /\bnot just \w+(?: \w+)?, but\b/i,
];
const variantless = (c) => c.slice(c.lastIndexOf(":") + 1);

// ── each page ────────────────────────────────────────────────────────────
const pages = walk("dist").filter((f) => f.endsWith(".html"));
for (const file of pages) {
  const page = "/" + file.slice("dist/".length).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
  const root = parse(readFileSync(file, "utf8"), { comment: false });
  const main = root.querySelector("main") || root.querySelector("body") || root;
  const all = root.querySelectorAll("*");

  // the document
  if (!root.querySelector("html")?.getAttribute("lang")) report("html-lang", page, null, "the <html> has no lang; the layout sets it from site.locale");
  const h1s = root.querySelectorAll("h1").length;
  if (page !== "/404" && h1s !== 1) report("single-h1", page, null, `${h1s} <h1> on the page; give it exactly one, the page's own heading`);

  for (const el of all) {
    const tag = el.rawTagName?.toLowerCase();
    const cls = classes(el);

    // markup the theme refuses, and utilities the CSS never generated
    for (const c of cls) {
      const bare = variantless(c);
      const hit = refuse.find(([rx]) => rx.test(bare));
      if (hit) report("refused-class", page, el, `"${c}" is ${hit[1]}`);
      else if (!siteCss.has(c) && !c.startsWith("js-")) report("unknown-utility", page, el, `"${c}" produced no CSS, so it does nothing; use a theme token or a utility that exists`);
    }
    if (tag === "style" && el.parentNode?.rawTagName?.toLowerCase() !== "head") report("raw-style", page, el, "a <style> block in the page bypasses the theme; use utilities, or add a token to design/system.yaml");
    const style = el.getAttribute?.("style");
    if (style && /(#[0-9a-f]{3,6}\b|rgb|hsl|\d(px|rem|em)\b)/i.test(style) && !/^--[\w-]+:/.test(style.trim())) report("raw-style", page, el, `style="${style.slice(0, 40)}" sets a colour or length inline; use a utility (a dynamic value goes in a CSS variable)`);

    // what a reader needs
    if (tag === "img") {
      if (!el.hasAttribute("alt")) report("img-alt", page, el, 'an image with no alt; describe it, or alt="" when it is decoration');
      const src = el.getAttribute("src") || "";
      if (src && !/^(https?:|data:|\/\/)/.test(src) && !existsSync(join("dist", src.split(/[?#]/)[0]))) report("img-src", page, el, `${src} is not in dist/; put the file in static/ or fix the path`);
    }
    if (["input", "select", "textarea"].includes(tag) && !["hidden", "submit", "button"].includes(el.getAttribute("type"))) {
      const id = el.getAttribute("id");
      const labelled = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")
        || (id && root.querySelector(`label[for="${id}"]`)) || el.closest("label");
      if (!labelled) report("input-label", page, el, "a form field with no label; add a <label for> (a placeholder is not a label)");
    }
  }

  // contrast and colour, for every element that holds its own text
  const pairs = new Map();
  for (const el of main.querySelectorAll("*")) {
    if (!el.childNodes.some((n) => n.nodeType === 3 && n.text.trim())) continue;
    if (el.closest("svg") || el.closest('[aria-hidden="true"]')) continue;
    const fg = nearest(el, "text-");
    const bg = nearest(el, "bg-") ?? nearest(root.querySelector("body"), "bg-");
    if (!fg || !bg) continue;
    const key = `${fg} on ${bg}`;
    if (!pairs.has(key)) pairs.set(key, { fg, bg, el, large: /^h[12]$/.test(el.rawTagName?.toLowerCase()) });
  }
  for (const { fg, bg, el, large } of pairs.values()) {
    const [a, b] = [colours[fg], colours[bg]];
    const r = ratio(a, b);
    if (r < (large ? 3 : 4.5)) {
      const darkGround = luminance(b) < 0.2 && luminance(a) < 0.2;
      report("contrast", page, el, darkGround
        ? `text-${fg} on the dark bg-${bg} is ${r.toFixed(1)}:1; on a dark band set the night ink (text-night-ink, text-night-ink-2)`
        : `text-${fg} on bg-${bg} is ${r.toFixed(1)}:1, under ${large ? 3 : 4.5}:1; use a stronger ink, or move this to a lighter band`);
    }
    const [f, g] = [chromaHue(a), chromaHue(b)];
    const gap = Math.min(Math.abs(f.hue - g.hue), 360 - Math.abs(f.hue - g.hue));
    if (f.chroma > 0.12 && g.chroma > 0.12 && gap < 40 && r < 7) {
      report("same-hue-text", page, el, `text-${fg} on bg-${bg} is a tint of its own ground (${r.toFixed(1)}:1); set it in the ground's neutral or a deep shade at 7:1, and step secondary text down by size`);
    }
  }

  // the bands: what main is made of, in order
  const bands = main.childNodes.filter((n) => n.nodeType === 1 && /^(section|div|article|aside|header|footer|form|nav)$/.test(n.rawTagName?.toLowerCase()));
  const groundOf = (band) => classes(band).map(variantless).find((c) => c.startsWith("bg-") && colours[c.slice(3)])?.slice(3);
  const grounds = bands.map(groundOf);
  const dark = grounds.filter((g) => g && luminance(colours[g]) < 0.2).length;
  if (bands.length >= 3 && dark / bands.length > 0.5) {
    report("light-on-dark", page, null, `light text on a dark ground in ${dark} of ${bands.length} bands; keep the dark ground for the bands that need weight and set the rest light, so the dark ones mean something`);
  }
  grounds.forEach((g, i) => {
    if (i && g && g === grounds[i - 1]) report("adjacent-ground", page, bands[i], `bands ${i} and ${i + 1} share bg-${g}; change one ground, or merge the two bands`);
  });
  const moving = bands.filter((b) => b.querySelector("[data-motion]") || b.getAttribute?.("data-motion") || /\b(starting:|transition-(opacity|transform|all))/.test(b.toString())).length;
  if (moving > 3) report("entrance-everywhere", page, null, `an entrance animation in ${moving} bands; keep the one moment that explains something and let the rest be still`);

  // generated-UI patterns
  const isCard = (el) => {
    const c = classes(el).map(variantless);
    return c.some((x) => /^(border|shadow-)/.test(x) && !/^border-(t|b|l|r|x|y)\b/.test(x)) && c.some((x) => /^(p|px|py)-/.test(x));
  };
  for (const el of main.querySelectorAll("*")) {
    const tag = el.rawTagName?.toLowerCase();
    const cls = classes(el).map(variantless);
    if (isCard(el)) {
      for (let a = el.parentNode; a && a !== main; a = a.parentNode) {
        if (a.getAttribute && isCard(a)) { report("card-in-card", page, el, "a card inside a card; keep the outer surface and separate the inner items with spacing or a rule"); break; }
      }
    }
    if (cls.some((x) => /^border-l-([2-9]|\d{2})$/.test(x))) report("side-stripe", page, el, "a thick coloured stripe down one side; carry the emphasis in the heading or the ground instead");
    if (/^h[1-3]$/.test(tag) && (el.querySelector("em, i") || el.querySelector(".italic"))) report("italic-heading-word", page, el, "one italic word in a heading; let the sentence carry the emphasis");
    if (/^h[1-3]$/.test(tag)) {
      const prev = el.previousElementSibling;
      // a dateline (a <time> above a post's title) is metadata, not an eyebrow
      if (prev && /^(p|span|div)$/.test(prev.rawTagName?.toLowerCase()) && !prev.querySelector("time") && classes(prev).some((x) => /^(uppercase|text-label)$/.test(variantless(x)))) {
        report("eyebrow", page, prev, "a small uppercase label above the heading; fold its words into the heading, or drop it");
      }
    }
    const kids = el.childNodes.filter((n) => n.nodeType === 1);
    if (kids.length >= 3) {
      const shape = (k) => k.querySelector("svg, img") && k.querySelector("h3, h4") && k.querySelector("p");
      if (kids.every(shape) && new Set(kids.map((k) => k.rawTagName)).size === 1) {
        report("icon-card-row", page, el, `${kids.length} identical icon, heading and text blocks in a row; make parallel items rows (title left, sentence right), or give the one that matters the room`);
      }
    }
  }

  // the copy: refused phrases and em dashes in what the page says (legal pages are verbatim)
  if (!legalPaths.has(page)) {
    for (const el of main.querySelectorAll("*")) {
      const own = el.childNodes.filter((n) => n.nodeType === 3).map((n) => n.text).join(" ");
      if (!own.trim() || el.closest("script")) continue;
      if (own.includes("—")) report("em-dash", page, el, "an em dash in the copy; write a comma, a colon or a new sentence");
      const m = copyTells.map((rx) => own.match(rx)).find(Boolean);
      if (m) report("refused-phrase", page, el, `"${m[0]}" is a phrase the writing skill refuses; say the specific thing instead`);
    }
  }
}

// A declaration no rule reads is a typo, or a rule that no longer exists.
for (const id of declared.keys()) if (!HINTS.has(id)) findings.push({ rule: "declared-unread", level: "hint", page: "DESIGN.md", where: "", message: `"${id}" is declared but no hint by that name exists; check the spelling (only hints can be declared)` });

// ── the report ───────────────────────────────────────────────────────────
const byRule = new Map();
for (const f of findings) byRule.set(f.rule, [...(byRule.get(f.rule) || []), f]);
const errors = findings.filter((f) => f.level === "error").length;
const hints = findings.length - errors;
for (const [rule, list] of byRule) {
  for (const f of list.slice(0, 2)) console.log(`  ${f.level.padEnd(5)} ${rule}  ${f.page}${f.where ? "  " + f.where : ""}\n        ${f.message}`);
  if (list.length > 2) console.log(`        (+${list.length - 2} more like this)`);
}
console.log(`lint: ${errors} error(s), ${hints} hint(s) across ${pages.length} page(s)`);
if (errors) process.exit(1);
