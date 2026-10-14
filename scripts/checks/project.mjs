// The project's own rules, for `npm run check`: the files the pages are made
// from, read without a browser. Each finding names its area:
//   facts   the brand notes BRAND.md lists exist; public/ holds only notes;
//           posts carry a real date; the phone and time zone read; proof is
//           marked only by the proof components
//   design  styles/theme.css, DESIGN.md and src/fonts.ts match
//           design/system.yaml, and the role pairs the layout uses (accent on
//           canvas, ink-2 on panel…) meet 4.5:1
//   code    page paths are unique, start with "/" and are listed; nothing the
//           production Worker imports uses a Node built-in (the edge rule)
//   seo     site-map.md's rows resolve; every old page the crawl read answers
//           (a page or a redirect); links between pages resolve; the sitemap
//           lists every page; no image over 1.5 MB; the homepage's JSON-LD parses
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { DESIGN, FONTS, RECORD, THEME, designMd, fontsTs, problems, readRecord, themeCss } from "../system.mjs";
import { pagePaths, walk } from "../lib.mjs";
import { TEXT_PAIRS, isHex, ratio, readTheme } from "../theme.mjs";

/**
 * `{ findings, notes }`: each finding `{ area, rule, level: "error", page, where: "", message }`;
 * notes are lines to print. The built site's checks run only when `built`.
 */
export function projectFindings({ built = true } = {}) {
  const findings = [];
  const notes = [];
  let area = "facts";
  const push = (page, message) => findings.push({ area, rule: area, level: "error", page, where: "", message });
  const { source: theme, colour } = readTheme();

  area = "facts";
  // the brand notes (BRAND.md): the files the theme and the pages are set from
  for (const f of ["positioning.md", "voice.md", "visual-identity.md"]) {
    if (!existsSync(join("brand", f))) push("", `brand/${f} is missing (BRAND.md lists the notes the site is set from)`);
  }

  area = "design";
  // styles/theme.css and DESIGN.md are compiled from the record; a hand edit
  // to either is lost on the next compile, so it is a finding here
  const record = readRecord();
  const unfilled = Object.values(record.identity ?? {}).filter((v) => String(v).startsWith("to fill")).length;
  if (unfilled) notes.push(`${RECORD}'s identity has ${unfilled} line(s) still to fill; the design skill fills them when the site grows`);
  const recordProblems = problems(record);
  for (const p of recordProblems) push("", `${RECORD}: ${p}`);
  if (!recordProblems.length) {
    if (theme !== themeCss(record)) push("", `${THEME} does not match ${RECORD}: change the record and run npm run system`);
    if (!existsSync(FONTS) || readFileSync(FONTS, "utf8") !== fontsTs(record)) push("", `${FONTS} does not match ${RECORD}: run npm run system`);
    if (readFileSync(DESIGN, "utf8") !== designMd(record)) push("", `${DESIGN} does not match ${RECORD}: change the record and run npm run system`);
  }

  // contrast of the role pairs the layout and components use (WCAG 2.x)
  const resolved = Object.fromEntries(["canvas", "panel", "surface", "accent", "accent-ink", "ink", "ink-2", "ink-3", "night", "night-ink", "night-ink-2"].map((n) => [n, colour(n)]));
  for (const [fg, bg] of TEXT_PAIRS) {
    const [a, b] = [resolved[fg], resolved[bg]];
    if (!isHex(a) || !isHex(b)) {
      for (const [role, v] of [[fg, a], [bg, b]]) {
        const f = `contrast: ${role} is ${v}, which cannot be measured: give it a 6-digit hex in design/system.yaml`;
        if (v && !isHex(v) && !findings.some((x) => x.message === f)) push("", f);
      }
      continue;
    }
    const r = ratio(a, b);
    if (r < 4.5) push("", `contrast: ${fg} (${a}) on ${bg} (${b}) is ${r.toFixed(1)}:1, under 4.5:1. Give the role a different value in design/system.yaml`);
  }

  area = "code";
  // pages
  const paths = pagePaths();
  const seen = new Map();
  for (const { file, path } of paths) {
    if (!path.startsWith("/")) push("", `${file}: page path ${path} must start with /`);
    if (seen.has(path) && seen.get(path) !== file) push("", `page path ${path} is defined in both ${seen.get(path)} and ${file}`);
    seen.set(path, file);
  }

  // a page module nothing imports is never routed: it is listed in src/pages/index.ts
  const imports = ["src/pages/index.ts", "src/app.tsx"].filter(existsSync).map((f) => readFileSync(f, "utf8")).join("\n");
  for (const file of new Set(paths.map((p) => p.file))) {
    const name = file.replace(/^src\/pages\//, "").replace(/\.tsx$/, "");
    if (!new RegExp(`from ["']\\./${name}["']|from ["']\\./pages/${name}["']`).test(imports))
      push("", `${file} is a page nothing lists: import it in src/pages/index.ts and add it to modules`);
  }

  area = "seo";
  // site-map.md: every keep or merge row resolves to a page or a redirect
  if (existsSync("site-map.md")) {
    const map = readFileSync("site-map.md", "utf8");
    const known = new Set(paths.map((p) => p.path));
    // a page made from data (a product per note) has no path of its own in
    // src/pages; once built, the built pages say which exist
    if (built) for (const f of walk("dist").filter((f) => f.endsWith(".html"))) known.add("/" + f.slice(5).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, ""));
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
      if (action === "keep" && !known.has(oldPath) && !known.has(target)) push("", `site-map.md: ${oldUrl} is a keep but no page has path ${target || oldPath}`);
      if ((action === "merge" || action === "drop") && target !== "-" && !redirectFroms.has(oldPath) && !known.has(oldPath)) {
        push("", `site-map.md: ${oldUrl} is a ${action} to ${target} but src/redirects.ts has no entry for ${oldPath}`);
      }
    }
  }

  area = "facts";
  // proof is shown by the proof components, which mark it (data-proof) for
  // check:facts; the marker anywhere else is plain text passed off as proof
  const PROOF_HOME = "src/components/facts.tsx";
  for (const file of walk("src").filter((f) => /\.(tsx?|jsx?)$/.test(f) && f !== PROOF_HOME && !/\/test\//.test(f))) {
    if (readFileSync(file, "utf8").includes("data-proof"))
      push(file, `${file} writes data-proof itself; show proof with RatingLine, ReviewsSection, LogosSection, PeopleSection or NumbersSection from ${PROOF_HOME}, restyled to fit, so it carries the platform, the stars and the date`);
  }

  // public/ is the facts folder, not the web root: an image or a stylesheet
  // there is a misplaced asset (they belong in static/)
  if (existsSync("public")) {
    const stray = readdirSync("public").filter((f) => !f.endsWith(".md") && !f.startsWith(".") && !statSync(join("public", f)).isDirectory());
    for (const f of stray) push("", `public/${f}: public/ holds the fact notes (markdown); served files go in static/`);
  }

  // the notes parse and posts have what the collection needs
  try {
    const gen = JSON.parse(readFileSync("src/generated/content.json", "utf8"));
    for (const p of gen.posts) if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) push("", `posts/${p._file}: date must be YYYY-MM-DD`);
    const b = gen.facts.business || {};
    if (b.name && b.telephone && !/^\+?[0-9 ().-]{6,}$/.test(b.telephone)) push("", `public/business.md: telephone "${b.telephone}" does not look like a phone number (digits, spaces, dots, dashes, brackets)`);
    if (b.time_zone) {
      try {
        new Intl.DateTimeFormat("en", { timeZone: b.time_zone });
      } catch {
        push("", `public/business.md: time_zone "${b.time_zone}" is not an IANA zone (e.g. America/New_York, Europe/London)`);
      }
    }
  } catch {
    notes.push("src/generated/content.json is missing; npm run content compiles the notes");
  }

  area = "code";
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
    if (m) push("", `${file} imports ${m[1]}, and the production Worker imports ${file}: Node built-ins cannot run on Cloudflare (keep machine-only code out of what src/worker.ts reaches)`);
    for (const [, spec] of src.matchAll(localImport)) {
      const next = resolveImport(file, spec);
      if (next) queue.push(next);
    }
  }

  area = "seo";
  if (built) {
    // the built site: each page's path, and what else answers (a file, a redirect)
    const pathOf = (file) => "/" + file.slice("dist/".length).replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
    const htmlFiles = walk("dist").filter((f) => f.endsWith(".html"));
    const built = new Set(htmlFiles.map(pathOf));
    const redirectsSrc = existsSync("src/redirects.ts") ? readFileSync("src/redirects.ts", "utf8") : "";
    const bare = (p) => (decodeURI(p.split(/[?#]/)[0]).replace(/(.)\/$/, "$1") || "/");
    const redirects = new Map([...redirectsSrc.matchAll(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g)].map((m) => [bare(m[1]), m[2]]));
    const answers = (p) => built.has(bare(p)) || redirects.has(bare(p)) || existsSync(join("dist", bare(p)));

    // a redirect goes straight to its page: one pointing at another redirect is a chain
    for (const [from, to] of redirects) if (to.startsWith("/") && redirects.has(bare(to))) push(from, `redirects to ${to}, which redirects again; point it at ${redirects.get(bare(to))} in src/redirects.ts`);

    // every old page the crawl read still answers here, as a page or a redirect
    for (const inv of existsSync("raw/site") ? readdirSync("raw/site").map((h) => join("raw/site", h, "_index/inventory.json")).filter(existsSync) : []) {
      let records = [];
      try {
        records = JSON.parse(readFileSync(inv, "utf8")).records || [];
      } catch {}
      for (const r of records) {
        if (r.status !== 200 || !r.file) continue;
        const old = new URL(r.url).pathname;
        if (!answers(old)) push(old, `the old site's ${old} does not answer here; build it, or add a 301 to src/redirects.ts (and its row in site-map.md)`);
      }
    }

    // links between pages, and the sitemap
    const sitemap = existsSync("dist/sitemap.xml") ? readFileSync("dist/sitemap.xml", "utf8") : "";
    const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => bare(m[1].replace(/^https?:\/\/[^/]+/, "") || "/")));
    for (const file of htmlFiles) {
      const page = pathOf(file);
      const html = readFileSync(file, "utf8");
      const broken = new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]).filter((h) => !h.startsWith("//") && !answers(h)));
      for (const h of broken) push(page, `links to ${h}, which does not answer; point it at a page, or add the page or a redirect`);
      if (page !== "/404" && !/<meta[^>]+noindex/i.test(html) && !listed.has(page)) push(page, "is not in sitemap.xml; the build lists every page, so rebuild (npm run build)");
    }

    // what a phone downloads, and what search reads on the homepage
    for (const f of walk("dist").filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))) {
      const mb = statSync(f).size / 1024 / 1024;
      if (mb > 1.5) push(f.slice("dist".length), `is ${mb.toFixed(1)} MB; npm run images -- <its source> makes it web size`);
    }
    for (const [, json] of readFileSync("dist/index.html", "utf8").matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(json);
      } catch (e) {
        push("/", `the homepage's JSON-LD does not parse (${e.message}); it comes from the notes, so fix the note`);
      }
    }
  }

  return { findings, notes };
}
