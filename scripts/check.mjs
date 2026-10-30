#!/usr/bin/env node
// Is anything wrong? `npm run check` checks every area; `npm run check:<area>`
// one of them. Each builds first, so it reads the pages a visitor gets:
//   code    the TypeScript, the tests, the build, page paths, the edge rule
//   facts   the notes compile, the brand notes, photo notes, the proof on the homepage
//   copy    the words: the tropes rules, calls to action, every number and quote traced to the notes
//   design  the record and its contrast, the refuse list, no CSS of the site's own,
//           and in a browser at 390, 900, 1280 and 1600 wide: one left edge, no
//           text under 14px, room inside a panel, no sideways scrolling
//   seo     titles, descriptions, headings, alt text, links, the sitemap, image
//           weight, and every old page the crawl read still answering
// Pages named after the area check only those (`npm run check:copy -- /about`);
// the whole-site parts (the record, the sitemap, the old pages) always run.
// Every finding is printed at once, by area, so all are fixed in one pass;
// hints never fail, two per rule. The parts live in scripts/checks/.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { done, fail, misused } from "../src/data/cli.mjs";
import { start, walk } from "./lib.mjs";
import { pageFindings } from "./checks/pages.mjs";
import { projectFindings } from "./checks/project.mjs";
import { proofFindings } from "./checks/proof.mjs";
import { traceFindings } from "./checks/trace.mjs";

const AREAS = ["code", "facts", "copy", "design", "seo"];
// how many pages the browser measures: each takes about three seconds
const MEASURED = 21;
const WHOLE = new Set(["code", "facts"]);
const HELP = `usage: npm run check [-- <page>…]
       npm run check:<area> [-- <page>…]     areas: ${AREAS.join(", ")}

Builds the site, then checks it: every area, or the one named.
  code    the TypeScript, the tests, the build, page paths, the edge rule
  facts   the notes compile, the brand notes, photo notes, the proof on the homepage
  copy    the words: the tropes rules, calls to action, numbers and quotes traced to the notes
  design  the design record and its contrast, the refuse list, no CSS of the site's own;
          then in a browser at 390, 900, 1280 and 1600 wide (the homepage and up to
          ${MEASURED - 1} more): one left edge, no text under 14px, room inside a panel,
          no sideways scrolling
  seo     titles, descriptions, headings, alt text, links, the sitemap, image weight,
          and every old page the crawl read still answering
Name pages (/, /about) to check only those; code and facts check the whole
site and take none. Prints one line per area, then every error and two hints
per rule; exits 1 when there is an error. Hints never fail.`;

const a = start("check", HELP, { args: true });
const [first, ...rest] = a._;
const areas = AREAS.includes(first) ? [first] : AREAS;
const pages = AREAS.includes(first) ? rest : a._;
const tryCmd = `npm run check${areas.length === 1 ? `:${areas[0]}` : ""}`;
for (const p of pages) if (!p.startsWith("/")) misused(`check: "${p}" is not a page; name pages by their path (/, /about)`, `${tryCmd} -- /about`);
if (pages.length && areas.every((x) => WHOLE.has(x))) misused(`check:${areas[0]} checks the whole site; it takes no pages`, tryCmd);

const findings = [];
const lines = {};
const say = (area, line) => (lines[area] ??= []).push(line);
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: `${r.stdout || ""}${r.stderr || ""}`.trim() };
};
const tail = (out, n = 25) => out.split("\n").slice(-n).join("\n");
const failed = (area, rule, out, what) => findings.push({ area, rule, level: "error", page: "", where: "", message: `${what}\n${tail(out).replace(/^/gm, "        ")}` });

// the notes first: a note that does not compile is a fact to fix, not a build bug
const content = run("node", ["scripts/content.mjs"]);
if (!content.ok) failed("facts", "content", content.out, "the notes do not compile");

if (areas.includes("code")) {
  const types = run("npx", ["tsc", "--noEmit", "-p", "."]);
  if (!types.ok) failed("code", "typescript", types.out, "the TypeScript does not compile");
  const tests = run("node", ["scripts/test.mjs"]);
  // the failing tests by name; node --import tsx --test <file> shows one file's whole output
  const names = [...new Set([...tests.out.matchAll(/^\s*not ok \d+ - (.+)$/gm)].map((m) => m[1]))];
  if (!tests.ok) findings.push({ area: "code", rule: "tests", level: "error", page: "", where: "", message: `${names.length ? names.map((n) => `failing: ${n}`).join("\n        ") : tail(tests.out)}\n        (node --import tsx --test <file> shows one file's whole output)` });
  say("code", tests.out.split("\n").filter(Boolean).pop()?.replace(/^test: /, "tests: ") ?? "");
  // every line of the code, its comments and copy, and the skills: no tells of AI-written text
  const scan = run("node", [".claude/skills/tropes/tropes.mjs", "--scan", "--json", "src", "scripts", "test", ".claude", "AGENTS.md"]);
  const scanned = scan.ok || scan.out.startsWith("[") ? JSON.parse(scan.out.split("\n")[0] || "[]") : null;
  if (!scanned) failed("code", "tropes", scan.out, "the code's words could not be scanned");
  else for (const f of scanned) findings.push({ area: "code", rule: f.rule, level: "error", page: "", where: `${f.file}:${f.line}`, message: `"${f.match}": ${f.fix}` });
}

const build = content.ok ? run("npx", ["tsx", "scripts/build.ts"]) : { ok: false, out: "" };
if (content.ok && !build.ok) failed("code", "build", build.out, "the build fails");
const built = build.ok && existsSync("dist/index.html");

const project = projectFindings({ built });
findings.push(...project.findings);
if (built) {
  findings.push(...pageFindings());
  const proof = proofFindings();
  findings.push(...proof.findings);
  say("facts", `the homepage shows ${proof.shows}`);
  const trace = traceFindings();
  findings.push(...trace.findings);
  say("copy", `${trace.checked} facts traced to the notes`);
}

// the look in a browser: the built pages served here, measured by tt-crawl
const pathOfFile = (f) => "/" + f.slice(5).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
if (built && areas.includes("design")) {
  const all = walk("dist").filter((f) => f.endsWith(".html")).map(pathOfFile).filter((p) => p !== "/404").sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
  const chosen = (pages.length ? pages : all).slice(0, MEASURED);
  if (!pages.length && all.length > MEASURED) project.notes.push(`measured ${MEASURED} of ${all.length} pages in a browser; name the others to measure them (npm run check:design -- /page)`);
  const measured = await measure(chosen);
  if (measured.note) project.notes.push(measured.note);
  else say("design", `${chosen.length} page(s) measured in a browser at 390, 900, 1280 and 1600 wide`);
  findings.push(...(measured.findings ?? []));
}

// what to print: the areas asked for, on the pages asked for (a whole-site finding always)
const builtPages = new Set(built ? walk("dist").filter((f) => f.endsWith(".html")).map((f) => "/" + f.slice(5).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "")) : []);
for (const p of pages) if (built && !builtPages.has(p)) misused(`check: no page ${p} in the build; pages: ${[...builtPages].sort().join(" ")}`, tryCmd);
const wanted = new Set(pages);
// notes that do not compile, or a build that fails, stop every area, so they show whichever was asked
const BLOCKING = new Set(["content", "build"]);
const shown = findings.filter((f) => (areas.includes(f.area) || BLOCKING.has(f.rule)) && (!wanted.size || !builtPages.has(f.page) || wanted.has(f.page)));

const on = pages.length ? pages.join(" ") : built ? `every page (${builtPages.size})` : "every page";
console.log(`check: ${areas.length === AREAS.length ? "all" : areas[0]} on ${on}`);
for (const area of areas) {
  const mine = shown.filter((f) => f.area === area);
  const errors = mine.filter((f) => f.level === "error").length;
  const hints = mine.length - errors;
  const skipped = !built && area !== "code" && area !== "facts";
  const what = skipped ? "skipped until the build passes" : [errors && `${errors} error(s)`, hints && `${hints} hint(s)`, ...(errors ? [] : lines[area] ?? [])].filter(Boolean).join("; ") || "ok";
  console.log(`  ${errors ? "!!" : skipped ? "--" : "ok"}  ${area}: ${what}`);
}
for (const n of project.notes) console.log(`  note: ${n}`);

const errors = shown.filter((f) => f.level === "error");
const hints = shown.filter((f) => f.level === "hint");
const out = [];
for (const area of [...new Set([...areas, ...shown.map((f) => f.area)])]) {
  const mine = [...errors, ...hints].filter((f) => f.area === area);
  if (!mine.length) continue;
  out.push(`\n── ${area}`);
  const perRule = new Map();
  for (const f of mine) {
    const n = perRule.get(f.rule) ?? 0;
    perRule.set(f.rule, n + 1);
    if (f.level === "hint" && n >= 2) continue;
    out.push(`  ${f.level.padEnd(5)} ${f.rule}  ${f.page}${f.where ? `  ${f.where}` : ""}\n        ${f.message}`);
  }
  for (const [rule, n] of perRule) {
    const isHint = mine.find((f) => f.rule === rule).level === "hint";
    if (isHint && n > 2) out.push(`        (+${n - 2} more ${rule} hints: data-lint-allow="${rule}" keeps one on purpose)`);
  }
}
const again = `${tryCmd}${pages.length ? ` -- ${pages.join(" ")}` : ""}`;
if (errors.length) {
  console.error(out.join("\n"));
  fail(`check: ${errors.length} error(s); fix them all in one pass`, again);
}
if (out.length) console.log(out.join("\n"));
done("check", `${areas.length === AREAS.length ? "every area" : areas[0]} passed${hints.length ? `, ${hints.length} hint(s) to weigh` : ""}`, {
  next: areas.includes("design") ? `npm run shots${pages.length ? ` -- ${pages.join(" ")}` : ""}, and look at every image it names` : undefined,
});

/** The built pages served on a free local port, measured by `tt-crawl measure`: `{ findings }`, or `{ note }` when it cannot run. */
async function measure(paths) {
  if (spawnSync("tt-crawl", ["--version"], { encoding: "utf8" }).status !== 0) return { note: "the browser checks need tt-crawl (tt-crawl setup); skipped" };
  const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".json": "application/json", ".mp4": "video/mp4" };
  const server = createServer(async (req, res) => {
    const p = decodeURIComponent((req.url || "/").split("?")[0]);
    for (const f of [p, `${p}.html`, `${p}/index.html`].map((x) => join("dist", x))) {
      try {
        if (!statSync(f).isFile()) continue;
        res.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" });
        return res.end(await readFile(f));
      } catch {}
    }
    res.writeHead(404).end();
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const base = `http://127.0.0.1:${server.address().port}`;
  const out = await new Promise((ok) => {
    let text = "";
    const child = spawn("tt-crawl", ["measure", ...paths.map((p) => base + p), "--json"]);
    child.stdout.on("data", (d) => (text += d));
    child.on("close", () => ok(text));
  });
  server.close();
  let pages;
  try {
    pages = JSON.parse(out);
  } catch {
    return { note: "tt-crawl measure gave no answer; the browser checks were skipped (tt-crawl measure --help)" };
  }
  return {
    findings: pages.flatMap(({ url, problems }) =>
      problems.map(({ rule, line }) => ({ area: "design", rule, level: "error", page: url.slice(base.length) || "/", where: "", message: line }))),
  };
}
