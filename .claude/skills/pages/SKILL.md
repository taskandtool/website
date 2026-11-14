---
name: pages
description: "Plans and builds this website's pages like an agency: which pages the business needs, a brief per page with its words and facts, then each page's code in the site's system. Use for a new page, the page plan, or what a page should say. Not for the look (design) or a small edit (website)."
---

# Pages

How a page looks is in the system record, `design/system.yaml`. What can go
on it depends on its page type, and its words are in its brief. You make
every judgement in the brief. The owner can read it there, and the page must
match it. When you build the page, you lay out words already approved.

Read the `writing` skill with this one. Write every word on the page to its
standard.

## 1. Plan the site

1. **Answer the five questions once**, from `references/industries.md`:
   the visitor's doubt, what is bought, the decision cost, retrieval or
   persuasion, and what the law requires. Write them into `site-map.md`
   under "The reader"; they hold for every page.
2. **Choose the pages.** `industries.md`'s `<sitemaps>` lists what each kind
   of business usually needs, most necessary first. Take the minimum, then
   add a page only when `public/` and `brand/` hold the facts for it: an
   empty team, blog or FAQ page costs more trust than a missing one. With an
   old site, its pages are in the ledger already (the `migrate-site` skill)
   and each keep or merge row becomes a page here.
3. **One row per page in `site-map.md`**, with its job and the notes it
   draws on, status `planned`. Write the nav under "Architecture", with the
   action as the button.
4. **Show the owner the plan in one message**, with just enough for a yes:

   ```
   Five pages: Home, Kitchens, Wardrobes, About, Contact.
   Nav: Kitchens · Wardrobes · About, with Book a visit as the button.
     Kitchens   what is made, the woods, three finished kitchens, a visit
     ...
   Two things would make it better: a typical price, and photographs of a wardrobe.
   ```

   Then carry on: build them all and show them together. In a migration
   (`migrate-site`), build and review each page in its own turn instead. Put
   what the owner changes later into the briefs.

## 2. A brief per page

Write `design/briefs/<slug>.md` for each planned page, in the format of
`references/brief.md`. A brief is done when the owner could approve the
page from it alone: its angle, every band's real words, and what was left
out and why. The guide for its page type, `references/types/<type>.md` (and
its `<variant>`), lists what the type can hold. You choose:

- **The angle:** the guide's `<angle>` (reader, pain, offer, lead) or
  `<reader>`, decided for this page from this business's material.
- **The bands,** from the guide's `<sections>`, in page order: the `core`
  ones, every section the old page had (its words in `raw/site/<host>/pages/`),
  and any other the material answers well. Put what you leave out in
  `omit:`, one clause each.
- **The material,** sorted into the guide's `<inventory>` bins with sources
  (`public/`, `brand/`, `brand/images.md`, and every page, review and
  listing the crawl saved in `raw/`). When the crawl missed a page of
  their site, fetch it with `tt-crawl add <url>` rather than ask. When the
  page replaces an old one, the new page holds at least what the old one
  did, in a shape of your own: carry or improve each old section, or drop
  it in `omit:` with the reason. When the owner names a page to model this
  one on, use the `design` skill.
- **The copy.** Write it in the business's voice, and plainer where their
  own copy is marketese. Use only this business's material. Don't copy
  wording from a guide or another page. Then fill the search fields.

  Draft hero: "Bespoke kitchens crafted with passion and precision." <!-- tropes-allow -->
  Rewrite: "We make solid oak kitchens in our Leeds workshop and fit them in
  three days." The rewrite has the material, the place and the wait: the
  facts a buyer compares.

## 3. Build each page

Build each page from its brief, in the system record:

- **The register:** use `x_layout.registers.<mode>` in `design/system.yaml`
  for the guide's mode (persuasion, retrieval, reading). It sets the head
  (`statement` or `plain`), the type and the rhythm.
- **Each band** by its shape and count: a list of named things is `items`,
  questions are `qa`, steps are `sequence`, and so on. Lay it out as
  `x_layout.shapes.<shape>` says for that many. Build the page's last ask
  from `x_layout.close`. When the record has no `x_layout` (the starter's
  has none), take the layout from `DESIGN.md` and the design skill.
- **The code:** `references/page-code.md` (a module in `src/pages`, listed
  in `src/pages/index.ts`, facts read from the content), with `page.title`
  and `page.description` from the brief.
- **The words are the brief's.** When a line does not fit, change it in the brief first, then on the page. Build without the fact a `NEED:` names;
  never fill the gap with a placeholder sentence.
- **The nav** from `site-map.md` into `site.nav` in `src/site.ts`.

## 4. Check and show

1. On every new page, run the design skill's review gate, the writing
   skill's cold read, and the "By hand" list in
   `.claude/skills/website/references/seo.md`. Collect every finding in one
   list and fix them in one pass.
2. Mark the rows `built` in `site-map.md`, show the pages together, then
   the one line of what would make them better (the `NEED:`s, rolled up).

## Changing a page later

Change how a page looks in the record (the `design` skill), never on one
page. When a page needs a pattern the site lacks (a photograph banner per
menu section), build it as a component in `src/components` from the
record's tokens. The next page can then use it too.
