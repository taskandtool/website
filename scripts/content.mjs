#!/usr/bin/env node
// Notes → data the site can render. Reads the frontmatter of public/*.md
// (the facts the brand skill wrote; FACTS.md says which
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
import { fail, has } from "../src/data/cli.mjs";
import { frontmatter, start } from "./lib.mjs";

const a = start("content", `usage: npm run content [-- --verbose]

Compiles public/, posts/ and legal/ into src/generated/content.json for the
pages. Silent when every note reads; a note that does not is listed on
stderr and exits 1.
  --verbose   one line of what it compiled (npm run content passes it)`, { bools: ["verbose"] });

// a note that cannot be read leaves its facts off the site: say so and fail
const problems = [];

function readNote(file) {
  const raw = readFileSync(file, "utf8");
  const note = frontmatter(raw);
  if (!note) return { data: {}, body: raw };
  let data = {};
  try {
    data = YAML.parse(note.front) ?? {};
  } catch (e) {
    problems.push(`${file}: frontmatter is not valid YAML (${e.message.split("\n")[0]})`);
  }
  return { data, body: note.body };
}

const notes = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md").sort() : []);
const filled = (v) => typeof v === "string" && v.trim() !== "" && !/to fill/i.test(v);
const slug = (file) => basename(file, ".md");

// public/: the facts. One note per topic; the frontmatter `type` says how
// the build reads it (see FACTS.md).
const facts = { business: null, locations: [], offerings: [], faq: [], reviews: [], ratings: [], logos: [], people: [], numbers: [], posts: [] };
for (const f of notes("public")) {
  const { data, body } = readNote(join("public", f));
  const type = data.type;
  if (type === "business") {
    facts.business = { ...data, _file: f };
  } else if (type === "location") {
    facts.locations.push({ ...data, _file: f });
  } else if (type === "offering") {
    // One offering per note, or, when the body has `## ` headings, one per
    // section: the heading is its title and its first paragraph the summary.
    // A note-level price belongs to no one section, so sections carry none.
    const firstPara = (text) => text.trim().split(/\n\s*\n/)[0] ?? "";
    const sections = [...body.matchAll(/^##\s+(.+?)\s*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/gm)];
    if (sections.length) {
      const { price, currency, unit, ...shared } = data;
      for (const m of sections) {
        const summary = firstPara(m[2]);
        if (filled(summary)) facts.offerings.push({ ...shared, title: m[1].trim(), price: null, _file: f, summary });
      }
    } else {
      const summary = firstPara(body);
      if (filled(data.title) && filled(summary)) facts.offerings.push({ ...data, _file: f, summary });
    }
  } else if (type === "faq") {
    // Questions are `## ` headings; the answer is what follows until the next.
    for (const m of body.matchAll(/^##\s+(.+?)\s*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/gm)) {
      const q = m[1].trim();
      const a = m[2].trim();
      if (q && filled(a)) facts.faq.push({ question: q, answer: a, answerHtml: marked.parse(a), _file: f });
    }
  } else if (type === "proof") {
    // what others say: each kind as written, kept once it holds what it shows
    const kinds = { reviews: (r) => r.quote, ratings: (r) => r.value, logos: (r) => r.file, people: (r) => r.name, numbers: (r) => r.figure, posts: (r) => r.text };
    for (const [kind, shows] of Object.entries(kinds)) for (const item of data[kind] ?? []) if (item && shows(item)) facts[kind].push({ ...item, _file: f });
  }
}
// A business note still full of "to fill" is not a fact yet.
if (facts.business) {
  if (Array.isArray(facts.business.area_served)) facts.business.area_served = facts.business.area_served.join(", ");
  for (const k of ["name", "legal_name", "telephone", "email", "price_range", "area_served"]) if (!filled(facts.business[k])) delete facts.business[k];
  if (!facts.business.name) facts.business = null;
}

// posts/: the collection.
const posts = [];
for (const f of notes("posts")) {
  const { data, body } = readNote(join("posts", f));
  if (!data.title || !data.date) {
    problems.push(`posts/${f}: needs title and date in frontmatter`);
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
const out = { facts, posts, legal };
writeFileSync("src/generated/content.json", JSON.stringify(out, null, 2) + "\n");
if (problems.length) fail(`content: ${problems.length} note(s) not read, so their facts are not on the site:\n  - ${problems.join("\n  - ")}`, "npm run content, once each is fixed");
if (has(a, "verbose")) {
  console.log(`content: business ${facts.business ? "yes" : "no"}, ${facts.offerings.length} offering(s), ${facts.faq.length} faq, ${posts.length} post(s), ${legal.length} legal page(s)`);
}
