---
name: new-site
description: "Take a business from no website, or an old one, to a launched site like a good agency: a striking homepage first, from their current site and what they say, then the design system, the other pages and the launch when they want the whole site. Use for build me a homepage, build my site, redo my site, or a link to their business."
---

# New site

Work like a good agency: do the best you can with what the owner gave you
and what you can find, and show them something real soon. Owners say
little; "build me a homepage" and a link is a whole brief.

Prefer the homepage first. Build it, show it, and let the owner react; the
rest of the site follows when they want it.

## Where things stand

Read the folders and carry on from where they are:

| | Done when |
|---|---|
| The homepage | `src/pages/home.tsx` is this business's page, in its own tokens in `design/system.yaml`, and the owner has seen it |
| The whole site | `DESIGN.md`'s Identity is filled and every planned row in `site-map.md` is built |
| Launch | the site is deployed |

## The homepage

1. **Start from their site:** `npm run from-site -- <url>`. In seconds it
   crawls the homepage and does the mechanical part: the business note,
   the logo, the sharp photographs at web size, the fonts, and design
   tokens seeded from their colours. Read what it prints. With a name and
   no link, find their website first (a search connection when the app
   has one, otherwise your own web search) and say in one line who you
   found.
2. **Write `public/services.md`** from the homepage's words, with the
   `brand` skill's rules.
3. **Design and build it:** the `design` skill's "The homepage first", and
   its first screen above all. The owner is deciding whether to trust you
   with the rest of the site.
4. **Show it,** with the one or two things that would make it better (their
   own sharp photographs, a fact the site does not state).

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

The `website` skill's "Before each deploy", then `npm run deploy`. A site
that replaces an old one passes the `launch-check` skill first.
