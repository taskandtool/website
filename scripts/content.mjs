#!/usr/bin/env node
// Notes → data the site can render. Reads the frontmatter of public/*.md
// (the facts the brain or the site-facts skill wrote; FACTS.md says which
// fields the build uses), posts/*.md (the blog collection), and legal/*.md
// (verbatim legal pages), and writes src/generated/content.json. The pages
// and the layout import that file, so the site stays edge-safe (no
// filesystem at request time) and the facts are typed once, in the notes.
// Runs before every build and at the start of `npm run dev`; run
// `npm run content` after editing a note by hand.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import YAML from "yaml";
import { marked } from "marked";

function readNote(file) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  let data = {};
  try {
    data = YAML.parse(m[1]) ?? {};
  } catch (e) {
    console.error(`${file}: frontmatter is not valid YAML (${e.message}); ignored`);
  }
  return { data, body: m[2] };
}

const notes = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md").sort() : []);
const filled = (v) => typeof v === "string" && v.trim() !== "" && !/to fill/i.test(v);
const slug = (file) => basename(file, ".md");

// public/: the facts. One note per topic; the frontmatter `type` says how
// the build reads it (see FACTS.md).
const facts = { business: null, locations: [], offerings: [], faq: [], proof: [] };
for (const f of notes("public")) {
  const { data, body } = readNote(join("public", f));
  const type = data.type;
  if (type === "business") {
    facts.business = { ...data, _file: f };
  } else if (type === "location") {
    facts.locations.push({ ...data, _file: f });
  } else if (type === "offering") {
    const summary = body.trim().split(/\n\s*\n/)[0] ?? "";
    if (filled(data.title) && filled(summary)) facts.offerings.push({ ...data, _file: f, summary });
  } else if (type === "faq") {
    // Questions are `## ` headings; the answer is what follows until the next.
    for (const m of body.matchAll(/^##\s+(.+?)\s*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/gm)) {
      const q = m[1].trim();
      const a = m[2].trim();
      if (q && filled(a)) facts.faq.push({ question: q, answer: a, answerHtml: marked.parse(a), _file: f });
    }
  } else if (type === "proof") {
    for (const item of data.items ?? []) if (item && item.quote) facts.proof.push({ ...item, _file: f });
  }
}
// A business note still full of "to fill" is not a fact yet.
if (facts.business) {
  for (const k of ["name", "legal_name", "telephone", "email", "price_range", "area_served"]) if (!filled(facts.business[k])) delete facts.business[k];
  if (!facts.business.name) facts.business = null;
}

// posts/: the collection.
const posts = [];
for (const f of notes("posts")) {
  const { data, body } = readNote(join("posts", f));
  if (!data.title || !data.date) {
    console.error(`posts/${f}: needs title and date in frontmatter; skipped`);
    continue;
  }
  posts.push({
    path: data.path || `/blog/${slug(f)}`,
    title: String(data.title),
    date: String(data.date),
    description: String(data.description ?? ""),
    author: data.author ? String(data.author) : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    html: marked.parse(body),
    _file: f,
  });
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

// legal/: verbatim pages.
const legal = [];
for (const f of notes("legal")) {
  const { data, body } = readNote(join("legal", f));
  legal.push({
    path: data.path || `/${slug(f)}`,
    title: String(data.title ?? slug(f)),
    updated: data.updated ? String(data.updated) : "",
    html: marked.parse(body),
    _file: f,
  });
}

mkdirSync("src/generated", { recursive: true });
const out = { generatedAt: new Date().toISOString(), facts, posts, legal };
writeFileSync("src/generated/content.json", JSON.stringify(out, null, 2) + "\n");
if (process.argv.includes("--verbose")) {
  console.log(`content: business ${facts.business ? "yes" : "no"}, ${facts.offerings.length} offering(s), ${facts.faq.length} faq, ${posts.length} post(s), ${legal.length} legal page(s)`);
}
