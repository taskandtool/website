// Build the site for publishing:
//   dist/            every static asset (static/ and brand/logo/), the built
//                    CSS, sitemap.xml and robots.txt, and every route
//                    pre-rendered to HTML (pages, posts, legal)
//   build/worker.mjs the app bundled as one ES module for the edge, reached
//                    only for paths that are not a file in dist/ (redirects,
//                    form posts, dynamic routes, the 404 page)
// Run with `npm run build`. The deploy hook (scripts/deploy.py) runs it too.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { build } from "esbuild";

const dist = "dist";
const out = "build";

function step(label: string) {
  console.log(`== ${label}`);
}

function run(label: string, cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`${label} failed`);
    process.exit(r.status ?? 1);
  }
}

step("content");
run("content", "node", ["scripts/content.mjs", "--verbose"]);
step("css");
run("css", "npm", ["run", "--silent", "css"]);

// Imported after the content is generated, so the routes see it.
const { default: app, routes } = await import("../src/app");
const { redirects } = await import("../src/redirects");
const { site } = await import("../src/site");

step("static assets");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync("static", dist, { recursive: true });
if (existsSync("brand/logo")) {
  cpSync("brand/logo", join(dist, "brand", "logo"), {
    recursive: true,
    filter: (src) => !src.endsWith("README.md"),
  });
}

step("routes");
const routePaths = new Set<string>();
for (const r of routes) {
  if (routePaths.has(r.path)) {
    console.error(`two routes claim ${r.path} (a page, a post, or a legal page share a path)`);
    process.exit(1);
  }
  routePaths.add(r.path);
}
console.log(`   ${routes.length} route(s), no duplicates`);

step("redirects");
const froms = new Set<string>();
for (const [from, to] of redirects) {
  if (froms.has(from)) {
    console.error(`redirect ${from} is listed twice`);
    process.exit(1);
  }
  froms.add(from);
  if (routePaths.has(from)) {
    console.error(`redirect ${from} shadows a page of the same path`);
    process.exit(1);
  }
  const external = /^https?:\/\//.test(to);
  if (!external && !routePaths.has(to) && !redirects.some(([f]) => f === to)) {
    console.error(`redirect ${from} -> ${to}: the target is neither a page, another redirect, nor an external URL`);
    process.exit(1);
  }
}
for (const [from] of redirects) {
  // no loops: follow the table at most as many times as it has rows
  let cur = from;
  for (let i = 0; i <= redirects.length; i++) {
    const next = redirects.find(([f]) => f === cur)?.[1];
    if (!next) break;
    if (next === from) {
      console.error(`redirect loop through ${from}`);
      process.exit(1);
    }
    cur = next;
  }
}
console.log(`   ${redirects.length} redirect(s) ok`);

step("pages");
for (const route of routes) {
  const res = await app.request(route.path);
  if (res.status !== 200) {
    console.error(`${route.path} rendered with status ${res.status}`);
    process.exit(1);
  }
  const file = route.path === "/" ? "index.html" : `${route.path.replace(/^\//, "").replace(/\/$/, "")}.html`;
  const target = join(dist, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, await res.text());
  console.log(`   ${route.path} -> ${target}`);
}
const nf = await app.request("/this-page-does-not-exist");
writeFileSync(join(dist, "404.html"), await nf.text());
console.log(`   404 -> ${join(dist, "404.html")}`);

step("sitemap and robots");
const origin = site.url ? site.url.replace(/\/$/, "") : "";
const urls = routes
  .map((r) => r.path)
  .sort()
  .map((p) => `  <url><loc>${origin}${p === "/" ? "/" : p}</loc></url>`)
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`);
if (!origin) console.log("   site.url is empty: sitemap locations are relative; set the real domain in src/site.ts before launch");

step("worker");
mkdirSync(out, { recursive: true });
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
  logLevel: "warning",
});
console.log(`   src/worker.ts -> ${join(out, "worker.mjs")}`);
console.log(`\nbuilt: ${routes.length} route(s) + 404 in ${dist}/, Worker in ${out}/worker.mjs`);
