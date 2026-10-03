#!/usr/bin/env node
// What a page is built from, read from the files themselves so it is never
// stale: `npm run parts`. The components and their props, the design
// system's classes, the shape of a page module, the facts the notes hold,
// and the photographs in static/images/. Read it instead of opening the
// source to learn the same.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "");
const out = [];

// components: name, props (from the destructured signature), the doc line above
out.push("Components (import from \"../components\" and \"../components/facts\"):");
for (const file of ["src/components/index.tsx", "src/components/facts.tsx"]) {
  const src = read(file);
  for (const m of src.matchAll(/\/\*\*\s*([^*]+?)\s*\*\/\s*export function (\w+)\(\{([^}]*)\}/g)) {
    const props = m[3].split(",").map((p) => p.trim().split(/[=\s:]/)[0]).filter(Boolean).join(", ");
    out.push(`  <${m[2]}${props ? ` ${props}` : ""}>  ${m[1].replace(/\s+/g, " ")}`);
  }
}

// the design system's classes, as DESIGN.md (compiled from design/system.yaml) lists them
const guide = read("DESIGN.md").split("## Agent Prompt Guide")[1]?.split("\n## ")[0]?.trim();
if (guide) out.push("", "Classes (only these exist; Tailwind's own palette, radii and shadows are off):", ...guide.split("\n").map((l) => `  ${l.replace(/^- /, "")}`));

out.push(
  "",
  "A page: src/pages/<name>.tsx, listed in modules in src/pages/index.ts",
  "  const page: Page = { path: \"/name\", title: \"…\", description: \"one real sentence\" };",
  "  function Body() { return (<>…sections…</>); }   // only what goes inside <main>",
  "  export const Name = { page, Body };",
  "  class, not className; facts from content and site (src/content.ts, src/site.ts), never typed in",
);

// the facts the notes hold now
try {
  execFileSync("node", ["scripts/content.mjs"], { stdio: "ignore" });
  const facts = JSON.parse(read("src/generated/content.json")).facts;
  const b = facts.business || {};
  out.push(
    "",
    "Facts (content.facts, from public/):",
    `  business: ${[b.name, b.telephone, b.email].filter(Boolean).join(" · ") || "empty"}`,
    `  offerings: ${facts.offerings.length}, faq: ${facts.faq.length}, proof: ${facts.proof.length}, locations: ${facts.locations.length}`,
  );
} catch {
  out.push("", "Facts: run npm run content to see them (a note in public/ did not parse)");
}

// the photographs, with their size
const images = existsSync("static/images") ? readdirSync("static/images").filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)) : [];
out.push("", `Photographs (static/images/, served at /images/<file>): ${images.length || "none yet"}`);
if (images.length) {
  try {
    const sizes = execFileSync("python3", ["-c", "import sys\nfrom PIL import Image\nfor f in sys.argv[1:]:\n    w,h=Image.open(f).size; print(f'{w}x{h}')", ...images.map((f) => `static/images/${f}`)], { encoding: "utf8" }).trim().split("\n");
    images.forEach((f, i) => out.push(`  /images/${f}  ${sizes[i] || ""}`));
  } catch {
    images.forEach((f) => out.push(`  /images/${f}`));
  }
}
console.log(out.join("\n"));
