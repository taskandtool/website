---
name: new-site
description: "Take a business from no website, or an old one, to a launched site the way a good agency would: gather its facts and look, study its competitors and sites the owner admires, show three homepages, then build the design system and the pages. Use when the owner says build my site, make my website or redo my site. Not for changing one page (website)."
---

# New site

Work like a good agency: few questions, real material, and something the
owner can see at the end of every step. Never a questionnaire; never a page
built on facts nobody gave you.

## Where things stand

Read the folders and start at the first step that is not done. Say in one
line where things stand and what you will do next.

| Step | Done when |
|---|---|
| 1. Intake | `brand/positioning.md` and `public/business.md` hold real facts, not "to fill" |
| 2. The market | `design/competitors.md` exists, with screenshots under `raw/external/` |
| 3. Three homepages | `design/variants/*/index.html` exist and the owner has picked one |
| 4. The system | `DESIGN.md`'s Identity is filled and `src/pages/home.tsx` is the picked homepage |
| 5. The pages | every planned row in `site-map.md` is built |
| 6. Launch | the `launch-check` skill passes and the site is published |

An owner with a site to replace starts at 1 too; the old URLs go into
`site-map.md` (the `migrate-site` skill) so none is lost.

## 1. Intake

Owners say little. "Build my site" or "make this look more modern" with one
link is a normal brief, and it is enough: work from what they gave and what
you can find, show a homepage, and let them react to that.

1. **File what they gave** by the `brand` skill's Sources table: their words
   to `raw/transcripts/` as they wrote them, their website crawled
   (`tt-crawl playbook brand`, then what it prints), a Google profile to
   `raw/places/`, photos, a logo or a brochure where the table says.
   Competitors and liked sites wait for step 2.
2. **Find them on the web** when they gave a name but no link, or a link
   but nothing else: their website, their Google profile, their social
   profiles. A search or places connection, when the app has one, brings
   its own instructions; otherwise use your own web search. When you found
   them by searching, say in one line who you found ("Smith Plumbing in
   Tulsa, smithplumbing.com") and carry on; they will say if it is wrong.
3. **Read what is already here.** `brand/` and `public/` may hold notes from
   an earlier chat or crawl. Run the `brand` skill on everything new so it
   lands in those notes.
4. **Ask only when you cannot start:** you cannot tell which business this
   is, or what it does. Then ask once, briefly, for a link or a name and
   town. Anything else missing is not a question yet: build without it, and
   after the homepages are shown, list the few things that would make the
   site better (a phone number, real photos, what sets them apart).

Never fill a gap with an invented fact: no made-up phone number, price,
review, award or years in business. A missing fact is left out, not guessed.

## 2. The market

- **Competitors:** the ones the owner named, or find three by searching for
  their main service in their area.
- Capture each homepage with `tt-crawl reference <url>`, and any site the
  owner admires the same way.
- Write `design/competitors.md`: per competitor, what they do well, the
  claims they make, how they look; then the claims everyone makes (saying
  them louder will not stand out) and the gap nobody fills.
- Show the screenshots as one group, one line each, and ask what they like
  and what they would never want.

## 3. Three homepages

The `design` skill's step 3: references, one brief, three directions, three
real homepages built and linted, shown together, the pick iterated on.

## 4. The system

When the owner likes the look, ask: "Ready for us to build the design system
and your other pages?" On a yes, the `design` skill's step 4 turns the picked
homepage into the site.

## 5. The pages

Plan the pages in `site-map.md`: what the business sells and what people
look for (services, about, contact, the questions customers ask), checked
against what competitors and the old site have. Build each with the
`website` skill ("Adding a page"), its words from the `writing` skill and its
facts from `public/`, then `npm run build && npm run lint`. Show each page as
it is built.

## 6. Launch

The `launch-check` skill, then the `ship` skill. Production opens to the
team first; the owner decides when it goes public.
