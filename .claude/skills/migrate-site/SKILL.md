---
name: migrate-site
description: "Moves an existing website here page for page: an inventory, the facts and brand as notes, every old URL mapped to a page, the pages, the redirects, then the launch. Use when the owner asks to migrate, move, clone or rebuild their site and keep its pages. Not for a new design from the homepage (new-site)."
---

# Migrate a site

Done when every old URL answers on the new site (a page or a redirect),
every fact the old site stated is in one note, once, and `npm run check`
passes. Gather the facts first, build the pages second, and keep the URLs.
If you convert the old pages one by one, you carry over dead sections,
duplicated facts and the old design.

## 0. Two questions

Ask these before anything else, and write both answers at the top of
`site-map.md`:

- **Keep the URLs?** Yes unless the structure is broken: keeping them
  removes the largest migration risk.
- **Faithful rebuild or redesign?** A faithful rebuild keeps the words and
  the page set; a redesign plans both again.

Move an address that names its old technology (`/about.php`, `/menu.html`,
`.asp`) to a clean one (`/about`), with a 301 from the old address in
`src/redirects.ts`. The 301 keeps the page's search ranking.

## 1. Inventory

Run the commands `tt-crawl playbook rebuild` prints. They crawl the site
into `raw/site/<host>/` (`import` covers WordPress, RSS and Shopify
collections). Add `--styles --screenshots` to the `tt-crawl pages` run:
later steps read `_index/styles.json` and `shots/`. Read the files its
"Read" section lists, and the screenshots. Report the pages found, the
limit if the crawl hit it, the forms and embeds, and the tracking IDs.

## 2. Facts and brand (the `brand` skill)

Write every note in `public/` and `brand/` from the crawl, with the `brand`
skill. Copy legal text word for word into `legal/`, with `path`, `title`
and `updated`. Then apply the brand (`BRAND.md`, "What the AI sets from
them") and copy the tracking IDs into `src/site.ts`. `npm run check:facts`
names a brand note that is missing or a fact note that does not read.

## 3. Plan: `site-map.md`

From the inventory and the two answers, write one row per old URL and per
new page: keep | merge | drop | new, the target, the page's job, the notes
it uses, and its status.

- Keep a redirect the old site already had.
- A `noindex` page is never a keep.
- Thin, duplicate and orphan pages are the candidates to merge or drop.
  Judge whether a page mattered by its body links (the inventory's `body
  links` column), not its sitewide ones.
- Dated posts go in the `posts/` collection under their old paths, not in
  pages.
- Reproduce every form on the old site, or drop it on purpose.
- Sections that stay where they are (a store, a booking system) go under
  "Out of scope" with their link.

In the architecture section, list the new nav in order and the footer
groups, mapped from `_index/furniture.json`. Anything that held a top-level
slot then needs a decision before it goes. Propose the whole map in one
message; the owner decides.

Write the merge and drop rows into `src/redirects.ts` as you go. `npm run check` fails a keep row with no page and a merge or drop row with no redirect.

## 4. The look

In a faithful rebuild, keep the old site's look. Its colours and fonts are
in the record from step 2; fill in the rest from how the old pages are laid
out (the `design` skill's "When the site grows"). For a redesign, build the
`new-site` skill's homepage and show it to the owner, then follow the
`design` skill's "When the site grows".

## 5. Pages, one per turn

Build each page with the `pages` skill (its brief, then its own layout, in
the site's record). Keep the old page's raw markdown open for what it said
and which links it carried. Never fill one template from the old HTML.

Done when each page is at least as good as the old one. Compare its shots
with the old page's (`raw/site/<host>/shots/`), and keep what made the old
page work (its photographs and their size, its emphasis).

- In a faithful rebuild the copy is the owner's: keep it, with small edits at most, unless they ask for a new voice.
- Keep the intent of each title and h1
  (`.claude/skills/website/references/seo.md`).
- Use the photo entries in `_index/media.json`, at full size, with their
  alt text.
- Point internal links at the new map.
- For posts, follow `.claude/skills/website/references/posts.md`. Legal
  pages render from `legal/`.

Mark the row built, show the page, and stop for review before the next
page. When the owner asked for the whole site at once, build every page in
this turn and show them together.

## 6. Plumbing, generated

The build generates the plumbing (`.claude/skills/website/references/seo.md`,
"Generated"). When something generated is wrong, fix the note or the map.
The SEO pass is `npm run check:seo`: each page's title, description and h1,
every old URL answering, redirects that chain, the sitemap.

## 7. Launch

The `website` skill's `references/launch.md`.
