---
name: pages
description: "Plans and builds this website's pages like an agency: which pages the business needs, a brief per page with its words and facts, then each page's code in the site's design system. Use for a new page, the page plan, or what a page should say. Not for the look (design) or a small edit (website)."
---

# Pages

The design system (`design/system.yaml`) decides how a page looks. The page
type decides what can go on it, and the brief decides the words. All the
judgement happens in the brief, where the owner can see it and the page can
be held to it; building the page then lays out approved words.

Read the `writing` skill with this one, and `brand/voice.md` before writing
a line.

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
   draws on, status `planned`. Write the nav under "Architecture" (at most
   four links, with the action as the button).
4. **Show the plan in one message**, the least that lets them say yes:

   ```
   Five pages: Home, Kitchens, Wardrobes, About, Contact.
   Nav: Kitchens · Wardrobes · About, with Book a visit as the button.
     Kitchens   what is made, the woods, three finished kitchens, a visit
     ...
   Two things would make it better: a typical price, and photographs of a wardrobe.
   ```

   Then carry on: build them all and show them together, except in a
   migration (`migrate-site`), where each page is built and reviewed in its
   own turn. What the owner changes later goes into the briefs.

## 2. A brief per page

For each planned page, in the plan's order, write `design/briefs/<slug>.md`
in the format of `references/brief.md`:

1. **Read the type's guide**, `references/types/<type>.md`, and its
   `<variant>` when the page is one (a services index is `service` with
   `variant: index`).
2. **Decide the angle**: a persuasion page's `reader`, `pain`, `offer` and
   `lead`; a retrieval page's `<reader>`.
3. **Sort the material** into the guide's `<inventory>` bins, each item with
   its source: `public/`, `brand/`, `static/images/` (described in `brand/images.md`), the crawl in `raw/`.
   When the page replaces an old one, start from the old page: list each
   section it had and mark it carry, improve or drop; a drop goes in
   `omit:` with its reason. The old page is the floor for how complete the
   new one is, not the template for its shape.
4. **Fetch rather than ask.** A page of their site the crawl did not read
   is one `tt-crawl add <url>` away.
5. **Choose the bands.** `core` bands are on nearly every page of the type;
   every other band earns its place when the material answers its question
   well. A good page is usually shorter than the guide's full menu of bands. What you considered
   and left out goes in `omit:`, one clause each.
6. **Write the copy**, in the business's voice and plainer where their
   voice is marketese, from this business's material alone: never wording
   from a guide or another page.
7. **Write the search fields** (`references/brief.md`).

## 3. Build each page

From its brief, in the record:

- **The register:** the guide's mode (persuasion, retrieval, reading) picks
  `x_layout.registers.<mode>` in `design/system.yaml`: the head (`statement`
  or `plain`), the type, the rhythm.
- **Each band** by its shape and count: a list of named things is `items`,
  questions are `qa`, steps are `sequence`, and so on, laid out as
  `x_layout.shapes.<shape>` says for that many. The page's last ask is
  `x_layout.close`. When the record has no `x_layout` (as the starter's
  does not), `DESIGN.md` and the design skill decide the layout instead.
- **The code:** `references/page-code.md` (a module in `src/pages`, listed
  in `src/pages/index.ts`, facts read from the content), with `page.title`
  and `page.description` from the brief.
- **The words are the brief's.** A line that does not fit is changed in the
  brief first, then on the page. Build without the fact a `NEED:` names;
  never fill the gap with a placeholder sentence.
- **The nav** from `site-map.md` into `site.nav` in `src/site.ts`.

## 4. Check and show

1. The design skill's review gate on every new page, the writing skill's
   cold read, and `.claude/skills/website/references/seo.md`'s "By hand"
   list. Put everything they find in one list and fix it in one pass.
2. Mark the rows `built` in `site-map.md`, show the pages together, then
   the one line of what would make them better (the `NEED:`s, rolled up).

## Changing a page later

What a page says changes in its brief first, then on the page. How it looks
changes in the record (the `design` skill), never on one page.
