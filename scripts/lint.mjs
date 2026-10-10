#!/usr/bin/env node
// The rendered pages, linted: `npm run build && npm run lint`. It reads what a
// visitor gets (dist/**/*.html and the compiled static/site.css), so the
// layout, the components and the facts are checked along with each page.
//
// Errors fail (exit 1): what breaks the theme, the reader or the copy rules.
// Hints never fail: a pattern that reads as generated when it is a habit
// rather than a choice. Each finding says what to do instead. Every error is
// printed and at most two hints per rule, so the hints are cues, not a wall.
//
// A hint the design uses on purpose is declared in DESIGN.md under
// "## Declared", one line each: `- rule-id: the reason`. Then the rule is
// quiet. One element can opt out of one rule with data-lint-allow="rule-id"
// (an owner who insists on a phrase, a decorative exception), on it or an
// ancestor. Legal pages are verbatim and exempt from the copy rules.
//
// The copy rules are the tropes skill's (.claude/skills/tropes/tropes.mjs),
// run per band of <main> with the band's heading, and across the bands.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { check as tropes, findings as tropesIn, HINT_RULES } from "../.claude/skills/tropes/tropes.mjs";
import { fail } from "../src/data/cli.mjs";
import { start, walk } from "./lib.mjs";
import { chromaHue, luminance, ratio, readTheme } from "./theme.mjs";

start("lint", `usage: npm run lint

Checks the built pages in dist/: the refuse list, contrast in context, and
the copy through the tropes skill. Prints a count of errors and hints first,
then every error and two hints per rule, each with what to do instead.
Errors exit 1; hints never fail. Run npm run build first.`);

if (!existsSync("dist/index.html")) fail("lint: no dist/ yet", "npm run build, then npm run lint");
const { colours } = readTheme();


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
const HINTS = new Set(["same-hue-text", "dark-bands", "adjacent-ground", "card-in-card", "side-stripe",
  "icon-card-row", "eyebrow", "italic-heading-word", "entrance-everywhere", "declared-unknown", "we-over-you",
  "long-h1", "cta-labels", "numbered-markers", "arrow-cta", "phrase-across-pages", "title-length", "description-length",
  "duplicate-title", "tinted-grounds", "default-font", ...HINT_RULES]);
const allowed = (el, rule) => {
  for (let e = el; e; e = e.parentNode) if (e.getAttribute?.("data-lint-allow")?.split(/\s+/).includes(rule)) return true;
  return false;
};
const report = (rule, page, el, message, level = HINTS.has(rule) ? "hint" : "error") => {
  if (level === "hint" && declared.has(rule)) return;
  if (el && allowed(el, rule)) return;
  findings.push({ rule, level, page, where: el ? describe(el) : "", message });
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
const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
// The platforms' gold star (Stars, RatingLine): it vanishes on a strong ground of its own hue.
const STAR = readFileSync("static/images/platforms/star.svg", "utf8").match(/fill="(#[0-9a-f]{6})"/i)?.[1];

// ── the refuse list (DESIGN.md: Do's and Don'ts) and the copy rules ──────
const refuse = [
  [/^(bg|text|border|from|to|via|ring|outline|fill|stroke)-\[#/, "a hex colour in markup; give the colour a role in design/system.yaml and run npm run system"],
  [/^(bg|text|border|ring|outline)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-|$)/, "a Tailwind default colour; use the theme's tokens (bg-canvas, bg-panel, bg-night, text-ink…)"],
  [/^(bg-gradient-|bg-linear-|bg-radial-|bg-conic-)/, "a gradient; use a flat token ground, or scrim / scrim-up for words over a photograph"],
  [/^(backdrop-blur|blur-|drop-shadow-)/, "blur or glass; give depth with the theme's grounds instead"],
  [/^(bg-clip-text|text-transparent)$/, "gradient text; set the heading in a token colour"],
  [/^animate-/, "an animation utility; motion here is data-rise, data-reveal and data-marquee (styles/input.css), each with its reduced-motion state"],
  [/^(tracking|leading)-/, "a tracking or leading override; the size token carries both"],
  [/^font-(bold|extrabold|black)$/, "a weight above the heading weight; use the size tokens' weights or font-semibold"],
  [/^text-\[(?!clamp)/, "an arbitrary text size; add a type style to design/system.yaml and run npm run system"],
  [/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[/, "an arbitrary spacing value; use the nearest step on the scale, or fix the alignment that needed it"],
];
const variantless = (c) => c.slice(c.lastIndexOf(":") + 1);

// ── a band's prose: its text less headings, questions, calls to action and quotes ──
const BLOCK = /^(p|div|li|ul|ol|section|article|header|footer|aside|nav|blockquote|figure|figcaption|br|tr|td|th|dd|dl|form|label|table|details)$/;
// quotes are others' words, kept as they wrote them: never ours to fix
const SKIP = /^(h[1-6]|summary|dt|a|button|script|style|svg|noscript|template|blockquote|q)$/;
// teasers: also skip a list item or card that links to another page (a blog index's summaries)
const prose = (node, teasers = false) => {
  if (node.nodeType === 3) return node.text;
  const tag = node.rawTagName?.toLowerCase() || "";
  const teaser = teasers && /^(li|article)$/.test(tag) && node.querySelector('a[href^="/"]');
  if (teaser || SKIP.test(tag) || node.getAttribute?.("aria-hidden") === "true") return BLOCK.test(tag) || /^h[1-6]$/.test(tag) ? "\n" : " ";
  const inner = node.childNodes.map((n) => prose(n, teasers)).join("");
  return BLOCK.test(tag) ? `\n${inner}\n` : inner;
};
const tidy = (t) => t.replace(/[ \t]+/g, " ").replace(/ *\n[\s]*/g, "\n").trim();

// Where a rating comes from: a count ("212 Google reviews", "4.9/5") or a platform named in text or a logo's alt.
const PROOF_COUNT = /\b\d[\d,.]*\+?\s+(\w+\s+)?(reviews?|ratings?|customers?|clients?|bookings?)\b|\b\d(\.\d)?\s*\/\s*5\b/i;
const PLATFORMS = /\b(google|facebook|yelp|trustpilot|tripadvisor|houzz|checkatrade|airbnb|booking\.com|etsy|amazon|g2|capterra|feefo|reviews\.io|bbb|angi|thumbtack|nextdoor|app store|google play|bark|treatwell|opentable)\b/i;
const pageBands = [];

// ── each page ────────────────────────────────────────────────────────────
const pages = walk("dist").filter((f) => f.endsWith(".html"));
// each title and the pages that carry it, for a duplicate across pages
const titles = new Map();
for (const file of pages) {
  const page = "/" + file.slice("dist/".length).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
  const root = parse(readFileSync(file, "utf8"), { comment: false });
  const main = root.querySelector("main") || root.querySelector("body") || root;
  const all = root.querySelectorAll("*");

  // the document
  if (!root.querySelector("html")?.getAttribute("lang")) report("html-lang", page, null, "the <html> has no lang; the layout sets it from site.locale");
  const h1s = root.querySelectorAll("h1").length;
  if (page !== "/404" && h1s !== 1) report("single-h1", page, null, `${h1s} <h1> on the page; give it exactly one, the page's own heading`);
  let level = 0;
  for (const h of all.filter((e) => /^h[1-6]$/i.test(e.rawTagName))) {
    const n = Number(h.rawTagName[1]);
    if (level && n > level + 1) report("heading-order", page, h, `an <h${n}> after an <h${level}> skips a level; screen readers navigate by them, so use <h${level + 1}> and set its size with a class`);
    level = n;
  }
  const h1 = root.querySelector("h1");
  const h1Words = h1 ? h1.text.trim().split(/\s+/).filter(Boolean).length : 0;
  if (h1Words > 10) report("long-h1", page, h1, `the <h1> is ${h1Words} words; a headline is one claim, so cut it to ten or fewer and move the rest to the line beneath`);
  // what a search result shows: the title and the description, each once
  if (page !== "/404") {
    const title = root.querySelector("title")?.text.trim() || "";
    const description = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
    if (!title) report("missing-title", page, null, "no <title>; set the page's title in its Page");
    else if (title.length > 60) report("title-length", page, null, `the <title> is ${title.length} characters; search results cut it near 60, so lead with what the page is`);
    if (!description) report("missing-description", page, null, "no meta description; set the page's description in its Page");
    else if (description.length < 70 || description.length > 160) report("description-length", page, null, `the description is ${description.length} characters; search results show about 70 to 160`);
    if (title) (titles.get(title) || titles.set(title, []).get(title)).push(page);
  }

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
    const cols = Number(cls.map((c) => c.match(/^grid-cols-(\d+)$/)?.[1]).find(Boolean) || 0);
    // three small things (stats, logos) can sit side by side on a phone: a look; four or more overflow
    if (cols >= 3 && !cls.includes("hidden")) report("phone-grid", page, el, `"grid-cols-${cols}" applies at every width, so a phone gets ${cols} columns${cols >= 4 ? " and overflows or crushes them" : "; fine for three small things, crushed for cards of text"}; start at one or two and widen from a breakpoint (md:grid-cols-${cols})`, cols >= 4 ? "error" : "hint");
    if (tag === "video" && el.hasAttribute("autoplay")) {
      const missing = ["muted", "playsinline", "poster"].filter((a) => !el.hasAttribute(a));
      if (missing.length) report("video-autoplay", page, el, `an autoplaying <video> without ${missing.join(", ")}; phones only autoplay a muted inline video, and the poster is what shows until it plays`);
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
    report("dark-bands", page, null, `light text on a dark ground in ${dark} of ${bands.length} bands; keep the dark ground for the bands that need weight and set the rest light, so the dark ones mean something`);
  }
  grounds.forEach((g, i) => {
    if (i && g && g === grounds[i - 1]) report("adjacent-ground", page, bands[i], `bands ${i} and ${i + 1} share bg-${g}; change one ground, or merge the two bands`);
  });
  const moving = bands.filter((b) => b.querySelector("[data-rise], [data-reveal]") || b.hasAttribute?.("data-rise") || b.hasAttribute?.("data-reveal") || /\b(starting:|transition-(opacity|transform|all))/.test(b.toString())).length;
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

  // proof: stars say where they came from (a count, a platform, or the quoted review they belong to)
  const ownText = (el) => el.childNodes.filter((n) => n.nodeType === 3).map((n) => n.text).join("");
  for (const el of all) {
    const stars = /out of \d+ stars?/i.test(el.getAttribute?.("aria-label") || "") || (ownText(el).match(/[★☆]/g) || []).length >= 3
      || el.childNodes.filter((n) => n.rawTagName?.toLowerCase() === "img" && /star/i.test(n.getAttribute("src") || "")).length >= 3;
    if (!stars || el.parentNode?.getAttribute?.("aria-label")?.match(/stars?$/i)) continue;
    const ground = nearest(el, "bg-");
    if (STAR && ground && chromaHue(colours[ground]).chroma > 0.3 && hueGap(chromaHue(colours[ground]).hue, chromaHue(STAR).hue) < 30)
      report("contrast", page, el, `the gold stars vanish on bg-${ground}, a strong colour of their own hue; set the rating on a light or dark ground`);
    let sourced = false;
    for (let a = el.parentNode, i = 0; !sourced && a?.getAttribute && i < 3 && !/^(section|main|body)$/i.test(a.rawTagName); a = a.parentNode, i++) {
      const said = `${a.text} ${a.querySelectorAll("img").map((m) => m.getAttribute("alt") || "").join(" ")}`;
      sourced = PROOF_COUNT.test(said) || PLATFORMS.test(said) || !!a.querySelector('blockquote, q, a[href^="http"]');
    }
    if (!sourced) report("unsourced-stars", page, el, "stars with no count and no platform beside them read as made up; show them from public/proof.md with RatingLine (the figure, the count, the platform), or on the review they belong to");
  }

  // calls to action: links styled as buttons, and buttons, outside the site's header, nav and footer
  const actions = main.querySelectorAll("a, button").filter((el) => {
    if (el.closest("nav") || (main.rawTagName?.toLowerCase() !== "main" && el.closest("header, footer"))) return false;
    if (/^(tel|mailto):/.test(el.getAttribute("href") || "") || (el.getAttribute("type") === "button" && el.closest("form"))) return false;
    return el.rawTagName.toLowerCase() === "button" || classes(el).map(variantless).some((c) => /^(bg-|rounded|border$)/.test(c));
  });
  const labels = [];
  for (const l of actions.map((el) => el.text.replace(/\s+/g, " ").replace(/[→›»]\s*$/, "").trim().toLowerCase()).filter(Boolean)) {
    if (!labels.some((x) => l.startsWith(x) || x.startsWith(l))) labels.push(l);
  }
  if (labels.length > 2) report("cta-labels", page, null, `${labels.length} different calls to action (${labels.map((l) => `"${l}"`).join(", ")}); pick the one action this page asks for and word it the same everywhere, with links for the rest`);
  for (const el of main.querySelectorAll("a, button")) {
    if (!el.closest("nav") && /[→›»]\s*$/.test(el.text.trim())) report("arrow-cta", page, el, "an arrow after the label; let the verb carry the action");
  }
  const marks = main.querySelectorAll("*").filter((el) => !el.childNodes.some((n) => n.nodeType === 1) && /^(0[1-9]|10)\.?$/.test(el.text.trim()));
  if (marks.length >= 2 && !marks.every((m) => m.closest("ol"))) report("numbered-markers", page, marks[0], `${marks.length} "01, 02" markers outside an <ol>; number only a real sequence (steps, in order, in an <ol>), and drop them from items that are merely parallel`);

  // the copy: em dashes, and the tropes skill per band (legal pages are verbatim)
  if (!legalPaths.has(page)) {
    pageBands.push({ page, bands: (bands.length ? bands : [main]).map((b) => ({ el: b, whole: b.text.replace(/\s+/g, " ").trim(), lines: tidy(prose(b, true)).split("\n") })) });
    for (const el of main.querySelectorAll("*")) {
      const own = el.childNodes.filter((n) => n.nodeType === 3).map((n) => n.text).join(" ");
      if (!own.trim() || el.closest("script") || el.closest("blockquote, q")) continue;
      if (own.includes("—")) report("em-dash", page, el, "an em dash in the copy; write a comma, a colon or a new sentence");
    }
    lintCopy(page, bands.length ? bands : [main]);
  }
}

// ── the copy, through the tropes skill ───────────────────────────────────
// A band's prose is its text less headings, questions (a FAQ's summary or dt)
// and calls to action, checked on their own, and quotes, which stay as written. Block elements break
// lines, so list items and cards stay separate sentences.
// The innermost element in the band holding the words, so data-lint-allow and
// the report point at it. `norm` puts an element's text in the needle's form.
const flat = (t) => t.replace(/\s+/g, " ").toLowerCase();
function locateIn(band, needle, norm = flat) {
  let hit = null;
  for (const el of band.querySelectorAll("*")) if (norm(el.text).includes(needle)) hit = el;
  return hit || band;
}

function lintCopy(page, bands) {
  const locate = (band, match) => locateIn(band, flat(match));
  const sections = bands.map((band) => {
    const h = band.querySelector("h1, h2, h3");
    return { heading: h ? h.text.replace(/\s+/g, " ").trim() : "", body: tidy(prose(band)) };
  });
  const say = (f) => `"${f.match.slice(0, 60)}": ${f.fix}`;
  for (const f of tropes(sections, { kind: "page" })) {
    if (f.rule === "em-dash") continue; // reported per element above
    if (f.sections) {
      const [i, j] = f.sections;
      report(f.rule, page, locate(bands[j], f.match), `${say(f)} (said in band ${i + 1} too)`, f.severity === "hint" ? "hint" : "error");
    } else {
      const band = f.section === undefined ? null : bands[f.section];
      const el = band && (["triads", "uniform-length", "dated-vocabulary"].includes(f.rule) ? band : locate(band, f.match));
      report(f.rule, page, el, say(f), f.severity === "hint" ? "hint" : "error");
    }
  }
  // Calls to action and FAQ questions, one by one.
  for (const band of bands) {
    for (const el of band.querySelectorAll("a, button, summary, dt")) {
      if (el.closest("nav")) continue;
      const label = el.text.replace(/\s+/g, " ").trim();
      if (!label) continue;
      for (const f of tropesIn(label, { kind: "page" })) {
        if (f.rule === "em-dash" || f.rule === "we-over-you") continue;
        report(f.rule, page, el, say(f), f.severity === "hint" ? "hint" : "error");
      }
    }
  }
}

// The same five-word phrase on two pages. A band that is the same on both
// (a shared component) is one thing said once, and is skipped.
const WORD = /[a-z0-9]+(?:['’][a-z]+)?/g;
const shared = new Set();
const seenBand = new Map();
for (const { page, bands } of pageBands) for (const b of bands) {
  if (b.whole && seenBand.has(b.whole) && seenBand.get(b.whole) !== page) shared.add(b.whole);
  if (!seenBand.has(b.whole)) seenBand.set(b.whole, page);
}
const phrases = new Map();
for (const { page, bands } of pageBands) {
  const said = new Set();
  for (const b of bands) {
    if (shared.has(b.whole)) continue;
    for (const line of b.lines) {
      const w = line.toLowerCase().match(WORD) || [];
      for (let i = 0; i + 5 <= w.length; i++) {
        const g = w.slice(i, i + 5).join(" ");
        const first = phrases.get(g);
        if (!first) phrases.set(g, page);
        else if (first !== page && !said.has(first)) {
          said.add(first);
          report("phrase-across-pages", page, locateIn(b.el, g, (t) => (t.toLowerCase().match(WORD) || []).join(" ")), `"${g}" is on ${first} too; say it once, where it belongs, and give this page its own words`);
        }
      }
    }
  }
}

// A declaration no rule reads is a typo, or a rule that no longer exists.
for (const id of declared.keys()) if (!HINTS.has(id)) findings.push({ rule: "declared-unknown", level: "hint", page: "DESIGN.md", where: "", message: `"${id}" is declared but no hint by that name exists; check the spelling (only hints can be declared)` });

// ── the report ───────────────────────────────────────────────────────────
// the record as a whole: grounds that are all tints of one hue, and the
// fonts generated sites reach for by default
const tints = ["canvas", "surface", "panel"].filter((k) => colours[k]).map((k) => ({ v: colours[k], ...chromaHue(colours[k]) }));
if (tints.length === 3 && tints.every((t) => t.chroma > 0.04 && hueGap(t.hue, tints[0].hue) < 30))
  report("tinted-grounds", "design/system.yaml", null, `canvas, surface and panel are all tints of one hue (${tints.map((t) => t.v).join(" ")}); make one white or near it, so the deep brand colour and the photographs carry the colour`);
const DEFAULT_FONTS = /^(Inter|Roboto|Arial|Helvetica|Open Sans|Lato|Montserrat|Poppins|DM Sans|DM Serif Display|Fraunces|Playfair Display|Space Grotesk)$/;
for (const [, role, family] of readTheme().source.matchAll(/--font-(display|body):\s*"([^"]+)"/g))
  if (DEFAULT_FONTS.test(family)) report("default-font", "design/system.yaml", null, `the ${role} font "${family}" is one generated sites reach for by default; choose one for this business (its own, or a library record's pairing), or declare default-font with the reason it fits`);
for (const [title, on] of titles) if (on.length > 1) for (const page of on.slice(1)) report("duplicate-title", page, null, `"${title}" is also the title of ${on[0]}; each page needs its own, or search shows two alike`);
const byRule = new Map();
for (const f of findings) byRule.set(f.rule, [...(byRule.get(f.rule) || []), f]);
const errors = findings.filter((f) => f.level === "error").length;
const hints = findings.length - errors;
// summary first, then every error (so all are fixed in one pass) and two hints per rule;
// all on stderr when an error fails the run, so the order holds
const say = errors ? console.error : console.log;
say(`lint: ${errors} error(s), ${hints} hint(s) across ${pages.length} page(s)`);
for (const [rule, list] of byRule) {
  const shown = list[0].level === "error" ? list : list.slice(0, 2);
  for (const f of shown) say(`  ${f.level.padEnd(5)} ${rule}  ${f.page}${f.where ? "  " + f.where : ""}\n        ${f.message}`);
  if (list.length > shown.length) say(`        (+${list.length - shown.length} more hints like this)`);
}
if (errors) fail(`lint: fix the ${errors} error(s) above in one pass`, "npm run build && npm run lint");
