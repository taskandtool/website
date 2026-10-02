---
name: new-site
description: "Take a business from no website, or an old one, to a launched site like a good agency: a striking homepage first, from their current site and what they say, then the design system, the other pages and the launch when they want the whole site. Use when the owner says build my site, make me a homepage or redo my site. Not for one page's edits (website)."
---

# New site

Work like a good agency: few questions, real material, and something the
owner can look at as soon as possible. Never a questionnaire; never a page
built on facts nobody gave you.

Prefer the homepage first. Build one, show it, and let the owner react; the
rest of the site follows when they want it, not before.

## Where things stand

Read the folders and carry on from where they are. Say in one line where
things stand and what you will do next.

| | Done when |
|---|---|
| The homepage | `src/pages/home.tsx` is this business's page, in its own tokens in `design/system.yaml`, and the owner has seen it |
| The whole site | the record is filled (`DESIGN.md`'s Identity is not "to fill"), every planned row in `site-map.md` is built |
| Launch | the `launch-check` skill passes and the site is deployed |

## The homepage

Owners say little. "Build me a homepage" or "make this look more modern"
with one link is a normal brief, and it is enough.

1. **Find the business.** A link: crawl its homepage only, `tt-crawl brand
   <url> --max-pages 1` (seconds: the logo, colours and fonts, a
   screenshot, the contact details, the homepage's text and photographs). A
   name with no link: find their website or Google profile with a search
   connection when the app has one, otherwise your own web search, and say
   in one line who you found ("Smith Plumbing in Tulsa, smithplumbing.com");
   they will say if it is wrong.
2. **Write what a homepage needs**, by the `brand` skill's rules (cite every
   fact, invent nothing): `public/business.md` (name, what they do, where,
   how to reach them), `public/services.md` as the homepage lists them, and
   `brand/visual-identity.md` (logo, colours, fonts, the best photographs).
   Their own words from the chat go to `raw/transcripts/` first. The rest of
   the brand record waits for the whole site.
3. **Design and build it**: the `design` skill's step 3, and its first
   screen above all. The owner is deciding whether to trust you with the
   rest of the site.
4. **Show it,** with the one or two things that would make it better (their
   own sharp photographs, a fact the site does not state).

Ask only when you cannot start: you cannot tell which business this is, or
what it does. Then ask once, briefly, for a link or a name and town.

Never fill a gap with an invented fact: no made-up phone number, price,
review, award or years in business. A missing fact is left out, not guessed.

## The whole site

When the owner wants the rest ("build out the site", "add the other
pages"), or brings a whole site to replace:

1. **Read the rest of their site.** `tt-crawl brand <url> --resume` carries
   on from the homepage crawl and reads only the pages not yet read. A site
   to replace page for page is the `migrate-site` skill, so no old URL is
   lost.
2. **Fill the brand record** with the `brand` skill: the voice card, the
   audience, the FAQ, the team, the reviews.
3. **Competitors, when they help:** the owner named some, or the business
   competes on a crowded local search. Capture each homepage with `tt-crawl
   reference <url>`; note what they claim, what everyone claims, and the
   gap nobody fills, in `design/competitors.md`.
4. **The system:** the `design` skill's step 4 fills the record so every
   page keeps the homepage's look.
5. **The pages:** the `pages` skill.

## Launch

The `launch-check` skill, then `npm run deploy` (the `website` skill).
Production opens to the team first; the owner decides when it goes public.
