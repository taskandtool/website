---
name: new-site
description: "Builds a business's new website like a good agency: a striking homepage first, from their current site, then the design system, the other pages and the launch. Use for build me a homepage, build my site, redesign my site, or a link to their business. Not for a page-for-page move (migrate-site)."
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

1. **Start from their site:** `npm run from-site -- <url>` (about a
   minute). It does the mechanical part: the business note, the logo,
   their photographs at web size, the fonts, design tokens from their
   colours, and the proof it can reach (their site's reviews and logos,
   their Google rating and reviews). It prints what to read next. With a
   name and no link, their Google listing names the website (the `brand`
   skill's listing row); say in one line who you found, and ask for the
   link when it names none.
2. **Write `public/services.md`** from the services page `from-site`
   names: one `## <service>` section per service, in the page's own facts, cited, with
   `updated` and `sources` set and no "to fill" left. The page shows them
   through `ServicesSection` or `content`, never typed into the markup.
   Describe each photograph once in `brand/images.md`, from the numbered
   `raw/photos.png`; from then on read that file, not the pictures.
3. **Proof.** Name each logo in `public/proof.md` (`raw/logos.png` shows
   them numbered) and delete any that is not a logo. Then get what
   `from-site` could not reach: the profiles in `public/business.md`'s
   `same_as` and anything the owner sent. Paste the words in as written.

4. **Look before choosing.** Their current site (`raw/site/<host>/`, its
   screenshot in `shots/`), anything they linked or said they like
   (`tt-crawl reference <url>` captures its look), the design library (the
   `design` skill's `references/library.md`: fourteen systems with a
   preview each), and their photographs as `brand/images.md` describes
   them. Take ideas from the one or two references closest to what this
   business needs, but never another site's words, pictures or logo. The site's system
   is always its own.
5. **Write the brief,** `design/briefs/home.md` in the `pages` skill's
   format (`.claude/skills/pages/references/brief.md`); for a first
   homepage, the frontmatter and the hero's lines are enough.
6. **Set the look** in `design/system.yaml` with the `design` skill: change
   what this design needs from the tokens `from-site` seeded (colours by
   role, fonts, sizes, radii), then `npm run system`.
7. **Build the page** from what `npm run parts` lists now, in
   `src/pages/home.tsx`, written whole in one go
   (`.claude/skills/pages/references/page-code.md`), then `npm run verify`
   and fix the findings that are mistakes. When the owner asked for something the lint
   flags, put `data-lint-allow="<rule>"` on that element and say so in one
   line.
8. **Review.** Start the `writing` skill's cold read (a sub-agent) on the
   built page, run the `design` skill's review gate meanwhile, and fix both
   lists in one pass.
9. **Commit and show.** Commit (one plain line), so any version the owner
   has seen comes back with one `git checkout`; then show it. The owner is
   deciding whether to trust you with the rest of the site, on its first
   screen above all. Say the one or two things that would make it better
   (their own sharp photographs, a fact the site does not state).

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
