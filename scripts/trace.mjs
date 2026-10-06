#!/usr/bin/env node
// Does every fact on the built pages come from the notes? `npm run trace`
// (run by npm run verify after the build). It reads what a visitor sees in
// dist/**/*.html (text, img alt, tel: and mailto: links; never <head>,
// <script> or <style>) and pulls out the facts a reader takes on trust:
// phone numbers, emails, prices, percentages, years, counts with a noun
// ("25 years", "1,204 Google reviews") and quoted words (<blockquote>, <q>).
// Each must be in public/, brand/, design/briefs/, posts/ or legal/: a phone
// by its digits, a number by its value, a quote word for word with "…" gaps.
// The footer's "© <this year>" is the only fact it does not ask about. One
// element can opt out with data-lint-allow="trace" (an owner's exception).
import { existsSync, readFileSync } from "node:fs";
import { parse } from "node-html-parser";
import { fail } from "../src/data/cli.mjs";
import { start, walk } from "./lib.mjs";

// ── the notes, as one text ────────────────────────────────────────────────
const SOURCES = ["public", "brand", "design/briefs", "posts", "legal"];
const FOLDERS = `${SOURCES.slice(0, -1).map((d) => `${d}/`).join(", ")} or ${SOURCES.at(-1)}/`;

start("trace", `usage: npm run trace

Checks that every phone, email, price, percentage, year, count and quote on
the built pages (dist/) is in the notes:
${FOLDERS}.
Prints how many facts it checked; each one not found is listed on stderr,
with the words around it, and exits 1. Run npm run build first. Opt one
element out with data-lint-allow="trace".`);
if (!existsSync("dist/index.html")) fail("trace: no dist/ yet", "npm run build, then npm run trace");

const note = (file) =>
  readFileSync(file, "utf8")
    // a frontmatter comment is a template's example, not a fact
    .replace(/^---\n[\s\S]*?\n---/, (fm) => fm.replace(/^\s*#.*$|\s+#\s.*$/gm, ""))
    // a value a note has replaced is no longer a fact
    .replace(/^.*\bsuperseded\b.*$/gim, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
const corpus = SOURCES.filter(existsSync)
  .flatMap(walk)
  .filter((f) => /\.(md|ya?ml)$/.test(f) && !/(^|\/)README\.md$/.test(f))
  .map(note)
  .join("\n");
const lower = corpus.toLowerCase();

const norm = (s) =>
  String(s).normalize("NFKC").toLowerCase().replace(/[’‘`´ʼ']/g, "").replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const corpusN = ` ${norm(corpus)} `;
const digits = (s) => String(s).replace(/\D/g, "");
const value = (s) => (String(s).match(/\d[\d,]*(?:\.\d+)?/) || [""])[0].replace(/,/g, "").replace(/\.0+$/, "");

const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20 };
const numbers = new Set();
for (const [m] of corpus.matchAll(/\d+(?:[.,]\d+)*/g)) {
  numbers.add(value(m));
  for (const [p] of m.matchAll(/\d+/g)) numbers.add(String(Number(p)));
}
for (const [w] of lower.matchAll(/[a-z]+/g)) if (WORDS[w]) numbers.add(String(WORDS[w]));

const PHONE = /(?:\+\d{1,3}[ .-]?)?(?:\(\d{2,5}\)[ .-]?)?\d[\d .-]{5,}\d/g;
const isPhone = (m) => { const d = digits(m); return (d.length >= 10 && d.length <= 13) || (d.length >= 7 && /[+(]|^\d{3}[ .-]\d{4}$/.test(m.trim())); };
const phones = [...corpus.matchAll(PHONE)].map(([m]) => m).filter(isPhone).map(digits);
// "+1 (512) 555-0199" against "512-555-0199": the shorter ends the longer, give or take a country code
const samePhone = (a, b) => { const [s, l] = [a.replace(/^0+/, ""), b.replace(/^0+/, "")].sort((x, y) => x.length - y.length); return s.length >= 7 && l.endsWith(s) && l.length - s.length <= 3; };

// ── the facts on a page ───────────────────────────────────────────────────
const NOT_NOUNS = new Set(("to and or of out by in on at for from the a an am pm is are was were with per x " +
  "january february march april may june july august september october november december jan feb mar apr jun jul aug sep sept oct nov dec " +
  "monday tuesday wednesday thursday friday saturday sunday").split(" "));
const THIS_YEAR = String(new Date().getFullYear());
// A count is a number and the word after it; "01", "02" is a design's numbering, not a count.
const KINDS = [
  ["email", /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, (m) => lower.includes(m.toLowerCase())],
  ["phone", PHONE, (m) => phones.some((p) => samePhone(digits(m), p)), isPhone],
  ["price", /[$£€]\s?\d(?:[\d,]*\d)?(?:\.\d+)?|\b(?:USD|GBP|EUR|CAD|AUD)\s?\d(?:[\d,]*\d)?(?:\.\d+)?|\b\d(?:[\d,]*\d)?(?:\.\d+)?\s?(?:USD|GBP|EUR|dollars|pounds|euros)\b/g, (m) => numbers.has(value(m))],
  ["percentage", /\b\d+(?:\.\d+)?\s?(?:%|per ?cent\b)/g, (m) => numbers.has(value(m))],
  ["year", /\b(?:19|20)\d{2}\b/g, (m) => numbers.has(m)],
  ["count", /(?<![\d.,:/-])(?!0\d)\d(?:[\d,]*\d)?(?:\.\d+)?\+?\s+[A-Za-z][A-Za-z'-]*/g, (m) => numbers.has(value(m)), (m) => !NOT_NOUNS.has(m.match(/[A-Za-z][A-Za-z'-]*$/)[0].toLowerCase())],
];

/** Each fact in a run of text, consumed as it is found so a phone's digits are not also a count. */
function factsIn(text) {
  let rest = text.replace(new RegExp(`©\\s*(?:(?:19|20)\\d{2}\\s*[-–]\\s*)?${THIS_YEAR}`, "g"), (m) => m.replace(THIS_YEAR, ""));
  const out = [];
  for (const [kind, re, found, keep = () => true] of KINDS) {
    rest = rest.replace(re, (m) => {
      if (!keep(m)) return m;
      out.push({ kind, atom: m.trim().replace(/\s+/g, " "), ok: found(m), line: text.split("\n").find((l) => l.includes(m.trim().split("\n")[0])) || "" });
      return " ".repeat(m.length);
    });
  }
  return out;
}

/** A quote is in the notes when each piece between "…" gaps is, in order. */
function quoted(q) {
  let at = 0;
  for (const piece of q.split(/\s*(?:\[…\]|\[\.\.\.\]|…|\.\.\.)\s*/).map(norm).filter(Boolean)) {
    const i = corpusN.indexOf(` ${piece} `, at);
    if (i < 0) return false;
    at = i + piece.length;
  }
  return true;
}

const SKIP = new Set(["script", "style", "template", "noscript", "svg", "head", "title"]);
const INLINE = new Set(["a", "abbr", "b", "cite", "code", "data", "em", "i", "mark", "small", "span", "strong", "sub", "sup", "time", "u", "label"]);
const tag = (n) => (n.rawTagName || "").toLowerCase();

/** The visible text of a page as lines, its quotes, and its tel:/mailto: links. */
function read(root) {
  let text = "";
  const quotes = [];
  const walkNode = (n) => {
    if (n.nodeType === 3) { text += n.text; return; }
    if (n.nodeType !== 1 || SKIP.has(tag(n))) return;
    if (n.getAttribute("data-lint-allow")?.split(/\s+/).includes("trace")) return;
    if (tag(n) === "br") { text += "\n"; return; }
    // an image always parts the words beside it: "4.7", stars, "68 reviews" is not 4.768
    if (tag(n) === "img") { text += n.getAttribute("alt") ? `\n${n.getAttribute("alt")}\n` : " "; return; }
    const href = tag(n) === "a" ? n.getAttribute("href") || "" : "";
    if (/^(tel|mailto):/i.test(href)) text += `\n${decodeURIComponent(href.replace(/^\w+:/, "").split("?")[0])}\n`;
    if (tag(n) === "blockquote" || tag(n) === "q") {
      const q = n.childNodes.filter((c) => !["cite", "footer", "figcaption"].includes(tag(c))).map((c) => c.text).join(" ");
      quotes.push(q.replace(/\s+/g, " ").trim().replace(/^["“”'‘’«\s]+|["“”'‘’»\s]+$/g, ""));
      return;
    }
    const sep = INLINE.has(tag(n)) ? "" : "\n";
    text += sep;
    for (const c of n.childNodes) walkNode(c);
    text += sep;
  };
  walkNode(root);
  return { text: text.replace(/[ \t\r ]+/g, " ").replace(/ *\n[\n ]*/g, "\n"), quotes: quotes.filter(Boolean) };
}

// ── every page ────────────────────────────────────────────────────────────
const pages = walk("dist").filter((f) => f.endsWith(".html")).sort();
const missing = [];
let checked = 0;
for (const file of pages) {
  const html = parse(readFileSync(file, "utf8"), { comment: false });
  const { text, quotes } = read(html.querySelector("body") || html);
  const seen = new Set();
  const facts = [...factsIn(text), ...quotes.map((q) => ({ kind: "quote", atom: q, ok: quoted(q), line: "" }))];
  for (const f of facts) {
    const id = `${f.kind}|${f.kind === "phone" ? digits(f.atom) : f.atom.toLowerCase()}`;
    if (seen.has(id)) continue;
    seen.add(id);
    checked++;
    if (!f.ok) missing.push({ page: file.replace(/^dist\//, ""), ...f });
  }
}

const clip = (s, n = 70) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
// the words around the fact, so a long paragraph still shows where it is
const around = (line, atom) => { const at = Math.max(0, line.indexOf(atom.split(" ")[0]) - 25); return (at ? "…" : "") + clip(line.slice(at)); };
if (missing.length) {
  const rows = missing.map((m) => `  ${m.page}  ${m.kind}  ${clip(m.atom, 60)}${m.line && m.line.trim() !== m.atom ? `\n      in: ${around(m.line.trim(), m.atom)}` : ""}`);
  fail(`trace: ${missing.length} of ${checked} facts on the pages are not in ${FOLDERS}\n${rows.join("\n")}\n  For each: add it to the right note with its source, or take it off the page. An owner's exception: data-lint-allow="trace" on the element.`, "npm run build && npm run trace");
}
console.log(`trace: ${checked} facts checked across ${pages.length} pages`);
