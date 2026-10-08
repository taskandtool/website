---
name: migrate-site
description: "Moves an existing website here page for page: an inventory, the facts and brand as notes, every old URL mapped to a page, the pages, the redirects, then launch-check. Use for migrate, move, clone or rebuild my site and keep its pages. Not for a new design from the homepage (new-site)."
---

# Migrate a site

Done when every old URL answers on the new site (a page or a redirect),
every fact the old site stated lives once in a note, and `launch-check`
passes. The rule: **facts first, pages second, URLs preserved.** Converting
the old pages one by one carries over dead sections, duplicated facts and
the old design. The steps below are in the order they depend on each other.

## 0. Two questions, first

Before anything: **keep the URLs?** (yes unless the structure is broken;
keeping them removes the largest migration risk) and **faithful rebuild
or redesign?** (faithful keeps the words and the page set; redesign
re-plans both). Write both answers at the top of `site-map.md`.

## 1. Inventory

One crawl reads the site into `raw/site/<host>/`; its ledger,
`_index/inventory.json`, holds one record per URL. The "Read" section of
`tt-crawl playbook rebuild` lists the files to read.

The crawler carries the recipes (`tt-crawl playbook rebuild`, `survey` for
a big site first, `import` for WordPress, RSS or Shopify collections); print
the one you need rather than guessing flags.

For a migration, add `--styles --screenshots` to the rebuild's `tt-crawl
pages` run: step 2 reads `_index/styles.json` and `shots/`, which only
those flags write. Then `tt-crawl docs` for the documents the pages link to.

Read `_index/inventory.md` and the screenshots; report pages found, the
limit if it was hit, forms and embeds seen, and the tracking IDs.

## 2. Facts and brand (the `brand` skill)

Every note in `public/` and `brand/`, from the crawl, with the `brand`
skill; legal text verbatim into `legal/` with `path` and `title`. Then
apply the brand (`BRAND.md`, "What the AI sets from them") and copy the
tracking IDs into `src/site.ts`. `npm run verify` names a brand note that is
missing or a fact note that does not read.

## 3. Plan: `site-map.md`

From the inventory and the two answers, write one row per old URL and per
new page: keep | merge | drop | new, the target, the page's job, the notes
it draws on, its status. Rules: a redirect the old site already had is kept;
a `noindex` page is never a keep; thin, duplicate, and orphan pages are the
merge and drop candidates, and whether a page mattered is judged by its body
links (the inventory's `body links` column), never its sitewide ones; dated
posts are the `posts/` collection under their old paths, not pages; every
form on the old site is reproduced or consciously dropped; sections that
stay where they are (a store, a booking system) go under "Out of scope" with
the link. The architecture section states the new nav in order and the
footer groups, mapped from `_index/furniture.json`, so nothing that held a
top-level slot disappears without a decision. Propose the whole map in one
message; the owner decides.

Write the merge and drop rows into `src/redirects.ts` as you go. `npm run
check` holds the map and the table to each other.

## 4. The look

A faithful rebuild keeps the old site's look: its colours and fonts are in
the record from step 2; fill the rest of it from how the old pages are laid
out (the `design` skill's "When the site grows"). A redesign starts with
the `new-site` skill's homepage (from "Look before choosing"), shown to the owner,
then the `design` skill's "When the site grows".

## 5. Pages, one per turn

Build each page with the `pages` skill (its brief, then the page, in the
site's record), with the old page's raw markdown open for what it said and
which links it carried. In a faithful rebuild the copy is the owner's: it
is only edited, never re-voiced unless asked. Title and h1
keep their intent (`.claude/skills/website/references/seo.md`); photographs come from `_index/media.json`'s
photo entries at full size with their alt text; internal
links point at the new map. Posts go through `.claude/skills/website/references/posts.md`; legal pages
render from `legal/`. Mark the row built, show the page, and
stop for review before the next page.

## 6. Plumbing, generated

The build generates the plumbing (`.claude/skills/website/references/seo.md`,
"Generated"); when something generated is wrong, the note or the map is
wrong.

## 7. Launch

The `launch-check` skill.
