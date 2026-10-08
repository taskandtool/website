# The page brief

One file per page, `design/briefs/<slug>.md` (`home` for `/`, the path with
slashes as dashes otherwise: `services-kitchens` for `/services/kitchens`).
It holds what goes on the page and the words it says, so the owner can
approve them and the page can be held to them. It never says how the page
looks; the system record does.

> Write: *the four services, each by the name a customer would search for, one line on what it involves.*
> Never: *a three-up card grid.*

````markdown
---
path: /
type: homepage        # a guide in references/types/
variant:              # the guide's <variant>, e.g. index, when the page is one
action: Book a workshop visit → /contact
job: Say what Harlow Joinery makes, where, and get a homeowner planning a kitchen to book a visit.
reader: a Bristol homeowner renovating a kitchen, comparing three or four makers
pain: showroom kitchens that do not fit an old house's walls
offer: made to measure in their own workshop, fitted by the people who made it
lead: what they make and where, with made-to-measure beside it
omit:
  - team: one photograph of two people, carried by the about band instead
query: fitted kitchens Bristol
title: Fitted kitchens made in Bristol
description: Kitchens and wardrobes made to measure in our Bristol workshop and fitted by the joiners who built them. Visits across Bristol and Bath.
arrives: [search "fitted kitchens Bristol", the van's phone number]
---

## hero
Headline: Fitted kitchens, made in our Bristol workshop
Lead: Kitchens and wardrobes made to measure for old houses and new, fitted by the joiners who built them.
Action: Book a workshop visit → /contact

![Oak kitchen with a deep sink under a sash window, finished last spring](brand/images/kitchen-oak.jpg)

## offerings
Heading: What we make
- **Kitchens**: made to the room, in oak, ash or painted tulipwood.
- **Wardrobes**: fitted into alcoves and under eaves.

> "Made to measure" is the owner's own phrase. Keep it.

NEED: a typical price for a kitchen. The old site says "from" with no number.
````

The example shows the format, not wording to reuse; the business is made
up. The body is markdown with a few labelled lines:

| | means |
|---|---|
| `## <band>` | a band, by its id from the guide's `<sections>`, in page order; a second one of the same id is `<id>-2` |
| `Headline:` | the page's one h1, in the hero only |
| `Heading:` / `Lead:` | a band's visible heading, and the line under it that answers the band's question |
| `Action:` | a button or link label; `→ /path` when it goes to another page |
| `### group` | a group inside a band: a menu's courses, a topic of questions |
| lists, prose | the copy itself: named items as `- **Name**: line`; a quote as `"Words" — Name, platform, date`, exactly as the source gives it |
| `> note` | an instruction for building the page: an attribution, a caveat. Never copy |
| `![alt](path)` | a photograph, by its path in the repository, with alt text written after looking at it, never from its filename |
| `NEED: x` | a fact we do not have; the band is built without it or left out |

## The rules

- **Literal words, never pointers.** The owner approves what the page will
  say, so the brief says it: the phone number, the hours, the price. On the
  page, a fact that lives in `public/` is read from the content, not typed
  into the JSX; the brief and the note must agree.
- **Only what will appear.** A reviews page's brief holds the six reviews
  chosen, not all of them. "The rest are in raw/" means the choosing is
  not done.
- **No derived numbers.** A range or a count worked out in your head goes
  stale; use the values the material states.
- **No dated fact without its year**, and only when the material confirms it.
- **Each fact once per site as a lead figure.** A figure the site leads on
  ("15 towns") is set as a figure on one page; elsewhere it is a sentence.
- **The action's link** is the one the business already uses (a booking or
  quote link from the crawl or `public/business.md`); with none, the phone,
  and a `NEED:` for the link.
- **Gaps are never questions.** A missing fact is a `NEED:` line, and the
  page is built without it. All of them roll into one short "what would make
  this better" line when the pages are shown.

## The search fields

- `query`: the one search this page answers, in the customer's words, with
  the town for a local page.
- `title`: the page's claim or service and where, unique on the site,
  under 60 characters including the business name the layout adds. When an old page
  ranked, keep its title unless it is wrong.
- `description`: 70 to 155 characters of specific facts from this brief,
  unique on the site.
- `arrives` (optional): how readers reach the page, when it changes the
  page: an ad's promise, a local search, a question. Leave it off the
  homepage, about, faq and legal.
