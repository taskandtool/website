// Build the site for production:
//   dist/            every static asset (static/ and brand/logo/), the built
//                    CSS, sitemap.xml and robots.txt, and every route
//                    pre-rendered to HTML (pages, posts, legal)
//   build/worker.mjs the app bundled as one ES module for the edge, reached
//                    only for paths that are not a file in dist/ (redirects,
//                    form posts, dynamic routes, the 404 page)
// Run with `npm run build`; `npm run deploy` runs it too.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { build } from "esbuild";
import { done, fail } from "../src/data/cli.mjs";
import { start } from "./lib.mjs";

start("build", `usage: npm run build

Compiles the notes and the CSS, pre-renders every route (pages, posts, legal)
and the 404 page to dist/ beside static/, writes sitemap.xml and robots.txt,
checks the redirect table, and bundles the Worker to build/worker.mjs. Prints
one line of what it built, then the redirects and anything to set before
launch. A failure says which step, on stderr, and exits 1.`, { tryHelp: "npm run build -- --help" });

const dist = "dist";
const out = "build";

/** A step's own output only when it fails. */
function run(step: string, cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) fail(`build: the ${step} step failed\n${`${r.stdout || ""}${r.stderr || ""}`.trim()}`, `npm run ${step}`);
}

run("content", "node", ["scripts/content.mjs"]);
run("css", "npm", ["run", "--silent", "css"]);

// Imported after the content is generated, so the routes see it. A page that
// throws as it loads is named here, not left as a stack trace.
const loaded = await Promise.all([import("../src/app"), import("../src/redirects"), import("../src/site")]).catch((e: unknown) =>
  fail(`build: the app did not load: ${e instanceof Error ? e.message : String(e)}`, "npm run typecheck, which names the file"),
);
const [{ default: app, routes }, { redirects }, { site }] = loaded;

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync("static", dist, { recursive: true });
cpSync("src/forms/cart.js", join(dist, "cart.js"));
if (existsSync("brand/logo")) {
  cpSync("brand/logo", join(dist, "brand", "logo"), {
    recursive: true,
    filter: (src) => !src.endsWith("README.md"),
  });
}

const routePaths = new Set<string>();
for (const r of routes) {
  if (routePaths.has(r.path)) fail(`build: two routes claim ${r.path} (a page, a post or a legal page share a path)`, "npm run check, which names the files");
  routePaths.add(r.path);
}

const fixRedirects = "npm run build, once src/redirects.ts is fixed";
const froms = new Set<string>();
for (const [from, to] of redirects) {
  if (froms.has(from)) fail(`build: redirect ${from} is listed twice in src/redirects.ts`, fixRedirects);
  froms.add(from);
  if (routePaths.has(from)) fail(`build: redirect ${from} shadows a page of the same path`, fixRedirects);
  const external = /^https?:\/\//.test(to);
  if (!external && !routePaths.has(to) && !redirects.some(([f]) => f === to)) {
    fail(`build: redirect ${from} -> ${to}: the target is neither a page, another redirect, nor an external URL`, fixRedirects);
  }
}
for (const [from] of redirects) {
  // no loops: follow the table at most as many times as it has rows
  let cur = from;
  for (let i = 0; i <= redirects.length; i++) {
    const next = redirects.find(([f]) => f === cur)?.[1];
    if (!next) break;
    if (next === from) fail(`build: redirect loop through ${from}`, fixRedirects);
    cur = next;
  }
}

for (const route of routes) {
  const res = await app.request(route.path);
  if (res.status !== 200) fail(`build: ${route.path} rendered with status ${res.status}`, `curl -si http://localhost:3000${route.path} | head -20`);
  const file = route.path === "/" ? "index.html" : `${route.path.replace(/^\//, "").replace(/\/$/, "")}.html`;
  const target = join(dist, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, await res.text());
}
const nf = await app.request("/this-page-does-not-exist");
writeFileSync(join(dist, "404.html"), await nf.text());

for (const [path, file] of [["/sitemap.xml", "sitemap.xml"], ["/robots.txt", "robots.txt"]] as const) {
  const res = await app.request(path);
  writeFileSync(join(dist, file), await res.text());
}

mkdirSync(out, { recursive: true });
try {
  await build({
    entryPoints: ["src/worker.ts"],
    bundle: true,
    format: "esm",
    outfile: join(out, "worker.mjs"),
    platform: "browser",
    conditions: ["workerd", "worker", "browser"],
    target: "es2022",
    jsx: "automatic",
    jsxImportSource: "hono/jsx",
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
  });
} catch (e) {
  fail(`build: the Worker did not bundle\n${e instanceof Error ? e.message : String(e)}`, "npm run check, which finds a Node import the Worker reaches");
}

done("build", `${routes.length} route${routes.length === 1 ? "" : "s"} + 404 to ${dist}/, Worker to ${out}/worker.mjs`, {
  lines: [
    `${redirects.length} redirect(s) checked; sitemap.xml and robots.txt written`,
    ...(site.url ? [] : ["site.url is empty, so the sitemap's locations are relative: set the real domain in src/site.ts before launch"]),
  ],
});
