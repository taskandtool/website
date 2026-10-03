---
name: pages
description: "Plan and build this website's pages the way an agency would: which pages the business needs, a brief per page holding its words and facts, then each page built in the site's design system, linted and set up for search. Use for a new page, the site's page plan, or what a page should say. Not for the look (design) or a small edit (website)."
---

# Pages

The design system (`design/system.yaml`) decides how a page looks. The page
type decides what can go on it, and the brief decides the words. All the
judgement happens in the brief, where the owner can see it and the page can
be held to it; building the page then lays out approved words.

Read the `writing` skill with this one, and `brand/voice.md` before writing
a line.

## 1. Plan the site

1. **Answer the five questions once**, from `references/types/industries.md`:
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
   draws on, status `planned`; the nav in "Architecture" (at most four
   links, the action as the button).
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
   its source: `public/`, `brand/`, `brand/images/`, the crawl in `raw/`.
   When the page replaces an old one, start from the old page: list each
   section it had and mark it carry, improve or drop; a drop goes in
   `omit:` with its reason. The old page is the floor for how complete the
   new one is, not the template for its shape.
4. **Fetch rather than ask.** A page of their site the crawl did not read
   is one `tt-crawl add <url>` away.
5. **Choose the bands.** `core` bands are on nearly every page of the type;
   every other band earns its place when the material answers its question
   well. A good page is usually shorter than the menu. What you considered
   and left out goes in `omit:`, one clause each.
6. **Write the copy**, in the business's voice and plainer where their
   voice is marketese, from this business's material alone: never wording
   from a guide or another page.
7. **Write the search fields** (`references/brief.md`).

**Read the briefs cold.** When you can start a sub-agent, give a fresh one
the briefs, `public/` and the `writing` skill: it checks every fact against
the notes and reads the words as someone who did not write them. Apply what
it finds, except a change that would lose a fact.

## 3. Build each page

From its brief, in the record:

- **The register:** the guide's mode (persuasion, retrieval, reading) picks
  `x_layout.registers.<mode>` in `design/system.yaml`: the head (`statement`
  or `plain`), the type, the rhythm.
- **Each band** by its shape and count: a list of named things is `items`,
  questions are `qa`, steps are `sequence`, and so on, laid out as
  `x_layout.shapes.<shape>` says for that many. The page's last ask is
  `x_layout.close`. A record without `x_layout` (the starter) leaves this to
  `DESIGN.md` and the design skill.
- **The mechanics** are the website skill's "Adding a page" and "How a page
  is written": a module in `src/pages`, listed in `src/pages/index.ts`, facts
  read from the content, `page.title` and `page.description` from the
  brief.
- **The words are the brief's.** A line that does not fit is changed in the
  brief first, then on the page. A `NEED:` is built without, never filled
  with a placeholder sentence.
- **The nav** from `site-map.md` into `site.nav` in `src/site.ts`.

## 4. Check and show

1. `npm run verify`: fix every error, read every hint as a question about
   the page.
2. The website skill's `seo.md` by hand: one h1, headings in order, internal
   links with descriptive text, real alt text.
3. `npm run shots -- /path` for each page (the design skill's review gate),
   look, and fix what the screenshots show.
4. Mark the row `built` in `site-map.md`, show each page (`npm run show --
   /path`), then the one line of what would make them better (the
   `NEED:`s, rolled up).

## Reviews, on any page

Wherever a page shows a review or a rating, it shows whose it is and how
many stars, as graphics:

- **The platform's mark** beside each review and rating, in its own colours,
  unaltered (an SVG from the platform's brand resources, in
  `static/images/platforms/`). A platform without one is named in words.
- **The stars** as one graphic per star, in a row labelled once for screen
  readers ("5 out of 5 stars"), from the review's own count; a rating nobody
  recorded is not assumed.
- A review whose platform is unknown carries neither, and its attribution is
  as the source gives it.

## Changing a page later

What a page says changes in its brief first, then on the page. How it looks
changes in the record (the `design` skill), never on one page.
