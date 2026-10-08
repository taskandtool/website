---
name: new-site
description: "Builds a business's new website like a good agency: a striking homepage first, from their current site, then the system, the other pages and the launch. Use for build me a homepage, build my site, redesign my site, or a link to their business. Not for a page-for-page move (migrate-site)."
---

# New site

Work like a good agency: do the best you can with what the owner gave you
and what you can find, and show them something real soon. Owners say
little; "build me a homepage" and a link is a whole brief.

Prefer the homepage first. Build it for real, show it, and let the owner
react, rather than planning the site: most owners judge a design by
looking at it. The rest of the site follows when they want it.

## Where things stand

Read the folders and carry on from where they are:

| | Done when |
|---|---|
| The homepage | `src/pages/home.tsx` is this business's page, in its own tokens in `design/system.yaml`, and the owner has seen it |
| The whole site | `DESIGN.md`'s Identity is filled and every planned row in `site-map.md` is built |
| Launch | the site is deployed |

## The homepage

Done when it is plainly this business's page: its words from their own
material, all their proof on it, a look of its own, and the owner proud to
send the link. They are deciding whether to trust you with the rest of the
site, on its first screen above all.

The order matters; how you do each part is yours:

1. **Start from their site:** `npm run from-site -- <url>` (about a minute)
   does the mechanical part and prints what it wrote and what to read next.
   With a name and no link, their Google listing names the website (the
   `brand` skill's listing row); say in one line who you found, and ask for
   the link when it names none.
2. **The facts, as notes:** `public/services.md` from the services page
   `from-site` names, one `## <service>` per service, cited, with `updated`
   and `sources` set and no "to fill" left (it reads as empty); each
   photograph described once in `brand/images.md` from the numbered
   `raw/photos.png`, so you read that file from then on, not the pictures.
   The page reads facts from the notes (`ServicesSection`, `content`), never
   typed into the markup.
3. **All the proof:** name each logo in `public/proof.md` from
   `raw/logos.png` and delete what is not a logo; then add what `from-site`
   could not reach (the profiles in `business.md`'s `same_as`, anything the
   owner sent), word for word. `npm run proof` fails while any of it is off
   the page.
4. **Look before choosing:** their current site (`raw/site/<host>/`), what
   they linked or said they like (`tt-crawl reference <url>` captures its
   look), and the design library (the `design` skill's
   `references/library.md`). Borrow ideas from the closest one or two,
   never another site's words, pictures or logo.
5. **Brief, look, page:** the brief in `design/briefs/home.md` (the `pages`
   skill's `references/brief.md`; the frontmatter and the hero's lines are
   enough), the look in `design/system.yaml` with the `design` skill, then
   the page written whole from what `npm run parts` lists
   (`.claude/skills/pages/references/page-code.md`). `npm run verify` and
   fix its findings. When the owner asked for something the lint flags, put
   `data-lint-allow="<rule>"` on that element and say so.
6. **Review:** the `writing` skill's cold read (a sub-agent) and the
   `design` skill's review gate together; fix both lists in one pass.
7. **Commit, then show** (one plain line, so any version the owner saw
   comes back with `git checkout`). Name the one or two things that would
   make it better: their own sharp photographs, a fact the site does not
   state.

Then follow the owner. A small change gets an edit, one look at that
page's shots, and a show; a new section or page gets the full review. When they
want options, or a change worth comparing, build each option as the real
page in turn, commit each, show them side by side, and keep the one they
pick.

## The whole site

When the owner wants the rest, or brings a whole site to replace:

1. **Read the rest of their site:** `tt-crawl brand <url> --resume` reads
   only the pages the homepage crawl left. A site to replace page for page,
   keeping every old URL, is the `migrate-site` skill.
2. **The rest of the brand record** with the `brand` skill.
3. **Competitors, when they help** (the owner named some, or the business
   competes on a crowded local search): `tt-crawl survey <url> --external`
   reads what each says about itself. Note what they claim, what everyone
   claims, and the gap nobody fills, in `design/competitors.md`.
4. **The system:** the `design` skill's "When the site grows".
5. **The pages:** the `pages` skill.

## Launch

When the owner asks: the `website` skill's "Before each deploy", then
`npm run deploy`. A site
that replaces an old one passes the `launch-check` skill first.
