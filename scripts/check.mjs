#!/usr/bin/env node
// Is anything wrong? `npm run check` checks every area; `npm run check:<area>`
// one of them. Each builds first, so it reads the pages a visitor gets:
//   code    the TypeScript, the tests, the build, page paths, the edge rule
//   facts   the notes compile, the brand notes, photo notes, the proof on the homepage
//   copy    the words: the tropes rules, calls to action, every number and quote traced to the notes
//   design  the record and its contrast, the refuse list, no CSS of the site's own
//   seo     titles, descriptions, headings, alt text, links, the sitemap, image
//           weight, and every old page the crawl read still answering
// Pages named after the area check only those (`npm run check:copy -- /about`);
// the whole-site parts (the record, the sitemap, the old pages) always run.
// Every finding is printed at once, by area, so all are fixed in one pass;
// hints never fail, two per rule. The parts live in scripts/checks/.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { done, fail, misused } from "../src/data/cli.mjs";
import { start, walk } from "./lib.mjs";
import { pageFindings } from "./checks/pages.mjs";
import { projectFindings } from "./checks/project.mjs";
import { proofFindings } from "./checks/proof.mjs";
import { traceFindings } from "./checks/trace.mjs";

const AREAS = ["code", "facts", "copy", "design", "seo"];
const WHOLE = new Set(["code", "facts"]);
const HELP = `usage: npm run check [-- <page>…]
       npm run check:<area> [-- <page>…]     areas: ${AREAS.join(", ")}

Builds the site, then checks it: every area, or the one named.
  code    the TypeScript, the tests, the build, page paths, the edge rule
  facts   the notes compile, the brand notes, photo notes, the proof on the homepage
  copy    the words: the tropes rules, calls to action, numbers and quotes traced to the notes
  design  the design record and its contrast, the refuse list, no CSS of the site's own
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
  const what = skipped ? "skipped until the build passes" : [errors && `${errors} error(s)`, hints && `${hints} hint(s)`].filter(Boolean).join(", ") || (lines[area] ?? []).join("; ") || "ok";
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
