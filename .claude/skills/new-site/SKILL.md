---
name: new-site
description: "Builds a business's new website like a good agency: a striking homepage first, from their current site, then the system, the other pages and the launch. Use for build me a homepage, build my site, redesign my site, or a link to their business. Not for a page-for-page move (migrate-site)."
---

# New site

Owners say little: "build me a homepage" and a link is enough to start.
Build the homepage first and show it; most owners judge a design by
looking at it, and the rest of the site follows when they want it.

## Where things stand

Read the folders and carry on from where they are:

| | Done when |
|---|---|
| The homepage | `src/pages/home.tsx` is this business's page, in its own tokens in `design/system.yaml`, and the owner has seen it |
| The whole site | `DESIGN.md`'s Identity is filled and every planned row in `site-map.md` is built |
| Launch | the site is deployed |

## The homepage

Done when its words come from their own material, all their proof is on
it, every section their homepage has is on it or left out for a reason you
can name (`from-site` lists them), its look is theirs (the `design` skill),
and `npm run check` passes.
The order matters; how you do each part is yours:

1. **Start from their site:** `npm run from-site -- <url>` (about a minute)
   does the mechanical part and prints what it wrote and what to read next.
   With a name and no link, their Google listing names the website (the
   `brand` skill's listing row); say in one line who you found, and ask for
   the link when it names none.
2. **The notes:** `public/services.md` from their services page, one
   `## <service>` each, cited; each photograph described in
   `brand/images.md` after looking at `raw/photos.png`. Pages read facts
   from the notes, never typed into the markup.
3. **All the proof** in `public/proof.md`, word for word: what `from-site`
   found, the logos in `raw/logos.png` that really are others' logos, and
   what it could not reach (the profiles in `business.md`'s `same_as`,
   anything the owner sent).
4. **The look,** with the `design` skill.
5. **The page,** written whole from what `npm run parts` lists
   (`.claude/skills/pages/references/page-code.md`), then `npm run check`
   and fix its errors.
6. **Review:** the `design` skill's review gate, with the `writing`
   skill's cold read (a sub-agent) in the same list.
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

When the owner asks: the `website` skill's "Before each deploy" (which
includes `cutover-check` for a replaced site), then `npm run deploy`.
