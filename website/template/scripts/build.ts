// Build the site for publishing:
//   dist/            every static asset (public/), the built CSS, and every
//                    page pre-rendered to HTML (index.html, about.html, ...)
//   build/worker.mjs the app bundled as one ES module for the edge, reached
//                    only for paths that are not a file in dist/ (form posts,
//                    dynamic routes, the 404 page)
// Run with `npm run build`. The deploy hook (scripts/deploy.py) runs it too.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { build } from "esbuild";
import app from "../src/app";
import { pages } from "../src/pages";

const dist = "dist";
const out = "build";

function step(label: string) {
  console.log(`== ${label}`);
}

step("css");
const css = spawnSync(
  "node_modules/.bin/tailwindcss",
  ["-i", "styles/input.css", "-o", "public/site.css", "--minify"],
  { stdio: "inherit" },
);
if (css.status !== 0) {
  console.error("tailwind failed");
  process.exit(css.status ?? 1);
}

step("static assets");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync("public", dist, { recursive: true });

step("pages");
const paths = [...pages.map((p) => p.path)];
for (const path of paths) {
  const res = await app.request(path);
  if (res.status !== 200) {
    console.error(`${path} rendered with status ${res.status}`);
    process.exit(1);
  }
  const file = path === "/" ? "index.html" : `${path.replace(/^\//, "").replace(/\/$/, "")}.html`;
  const target = join(dist, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, await res.text());
  console.log(`   ${path} -> ${target}`);
}
const nf = await app.request("/this-page-does-not-exist");
writeFileSync(join(dist, "404.html"), await nf.text());
console.log(`   404 -> ${join(dist, "404.html")}`);

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
if (!existsSync(join(out, "worker.mjs"))) {
  console.error("worker bundle missing");
  process.exit(1);
}
console.log(`   src/worker.ts -> ${join(out, "worker.mjs")}`);
console.log(`\nbuilt: ${paths.length} page(s) + 404 in ${dist}/, Worker in ${out}/worker.mjs`);
