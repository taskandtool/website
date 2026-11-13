# Website

**A business website your AI agent builds, checks and updates by chat.** The
agent writes each page from notes it keeps on the business.

[![Deploy on Task & Tool](https://taskandtool.com/images/deploy-button.svg)](https://taskandtool.com/accounts/register?starter_app=website)

![The Northline Gardens and Bellwork Boxing websites, both built with this Starter App](https://taskandtool.com/images/starter-apps/website.webp)

It's made to run on Task & Tool. There, each app has its own computer for
your AI agent. The project has a Postgres database for leads and bookings.
The agent uses the skills and scripts in this repo to build a site in your
brand and check every page against your business facts. The site is built
with Hono and Tailwind.

## Get started

Click the button above, or pick Website when you create an app on [Task &
Tool](https://taskandtool.com/starter-apps/website). Then ask for a homepage
in the chat.

See it in use on the [Website page](https://taskandtool.com/starter-apps/website).

## Features

### Your business facts are plain text notes

Facts such as your address, phone number, services, FAQs, reviews and prices
are in plain text notes in the repo. AI agents work best with plain text
files on a computer. Keeping your facts this way follows best practice for
AI. The agent reads the notes before it writes a page. When a price changes,
the agent edits one note. You see the new price on every page after the next
build.

### Facts can come from your site, your files or the chat

Send the agent your current site. It reads the main pages and your Google
listing in about a minute. Attach price lists, brochures or photos in chat,
or upload whole folders on the app's Files tab. Anything you tell it in chat
counts as a source. The agent records where each fact came from.

### Prices and quotes come only from your notes

If a number or quote on a page isn't in your notes, the copy check fails.
The agent then fixes the page. When a fact is missing, the agent asks you
for it.

![The Bellwork Boxing prices: first class $0, unlimited $179 a month, ten classes $220](https://taskandtool.com/images/marketing/bellwork-boxing-site-prices.webp)

### Your colors and fonts are set in one design file

The agent takes your colors and fonts from your current site and logo. It
saves them in one design file and builds every page from that file. If the
business has no site yet, it starts from the one of 14 ready-made designs
that suits the business best. These two sites came from this repo:

<p>
  <img src="https://taskandtool.com/images/marketing/northline-gardens-site-patios-phone.webp" width="300" alt="The Northline Gardens patios page at phone width: a serif heading, Stone patios and paths, over a photo of a stone patio in Oak Park">
  <img src="https://taskandtool.com/images/marketing/bellwork-boxing-site-timetable-phone.webp" width="300" alt="The Bellwork Boxing timetable at phone width: This week, 24 classes, and a 6:00 AM Box and Burn class with Coach Marcus">
</p>

### The agent checks SEO, facts, code, copy and design

Before you see any work, the agent runs `npm run check` and fixes what it
finds. Then it sends you screenshots of each changed page on a phone and a
desktop.

| Check | What fails it |
|---|---|
| SEO | Missing titles, descriptions and alt text, broken links, and old pages that no longer redirect |
| Facts | Reviews and ratings in your notes that are missing from the homepage |
| Code | Type errors, failing tests and a build that breaks |
| Copy | Prices and quotes that aren't in your notes, and wording that sounds like AI |
| Design | Colors outside your design, low contrast, small text, and sideways scrolling on a phone |

### Skills in this repo

A skill is a set of instructions for one kind of work. The agent loads one
when a task needs it. This repo has 15:

| Skill | The agent uses it to |
|---|---|
| `new-site` | build a new site in order: the homepage, the design, the other pages, the launch |
| `pages` | plan the pages a business needs. It has guides for 18 kinds of page |
| `design` | set the colors, type, photos and layout, and review each page |
| `writing` | write in the owner's voice and edit the draft |
| `tropes` | spot phrases that read as machine-written |
| `brand` | gather facts and the brand's look from the sources above |
| `migrate-site` | move your current site to the new one and redirect every old link |
| `website` | run the site day to day: edits, blog posts, SEO and going live |
| `forms` `booking` `payments` `admin` `customers` `reports` `data` | add forms, bookings, Stripe payments, an admin page for the team, customer notes and reports. `data` is the database code they share |

The agent runs scripts to read a website, list the photos a page can use and
do other repeated steps. Each one has a `--help`.

### Old URLs redirect to the new site

The agent reads the old site and redirects old pages to their new ones. The
build stops if a redirect loops or points to a missing page. The agent
copies your Google Analytics and ad tracking IDs. It also moves your
WordPress blog posts over with their dates and authors.

### Forms, bookings and payments

You can make a form with several steps that ends in a booking and a payment.
You can get an email when someone submits a form, or send submissions to
your CRM. A submission that fills a hidden field or comes in under three
seconds is kept as spam. Someone who gets in touch twice still has one
customer record. Your team sees that record in the CRM and your other apps.

Customers see open times based on your staff's hours and days off. Two
people can't book the same slot. Once you connect Resend or Postmark, people
who book get a calendar invite and a link to move or cancel. Payments go
through your Stripe account: orders, deposits, paid bookings and refunds.

Your team sees submissions, bookings and payments on a private admin page.
They can search, filter, change a status, act on many rows at once and
export to CSV.

<img src="https://taskandtool.com/images/marketing/northline-gardens-site-book-phone.webp" width="300" alt="The Northline Gardens Book a visit form at phone width: what needs doing, with Fall cleanup and Hedges picked, then a choice of days">

### You can run a prompt or a script on a schedule

Ask the agent to schedule a job. It can run now, once at a set time, or on a
repeat as often as every 15 minutes. A prompt job starts a fresh chat with
the agent. A script job runs a command. For example:

| Job | What runs |
|---|---|
| Weekly site audit | An audit of the live site for broken links and missing titles. You get a note in the chat when a run fails |
| A blog post every Friday | Prompt: "Draft next week's blog post and show it to me" |
| Monthly report | A PDF of your leads, bookings and Google search figures |
| Calendar sync and reminders | Busy times from Google or Outlook calendars, and booking reminders. Needs the [CRM Starter App](https://github.com/taskandtool/crm) |

### Production pages are plain HTML on Cloudflare

Before a deploy, the agent builds every page into a plain HTML file.
Cloudflare serves those files from servers near your visitors. Only forms
and a few dynamic pages run code. The build also includes the sitemap,
`robots.txt`, canonical tags and the business's structured data for Google.

## Why run it on Task & Tool

Task & Tool is the easiest place to run it. The database is included. The
agent publishes the site to Cloudflare when you ask. Each app gets:

- Its own computer for the agent
- A dev address your team opens to see changes before they go live
- A Postgres database for leads, bookings and payments. You can roll it back
  to an earlier point in time.
- Publishing on your own domain with a free SSL certificate. Only your team
  sees production until you make it public.
- Connections to Stripe, Google, email and other services. Their keys are
  kept out of this repo.
- Scheduled jobs for the audits, reports and reminders above
- Sign-in for your team on the admin pages

## Make it your own

Ask the agent for any change in the chat. To start from your own copy, fork
this repo, change what you like, and start a new app from your fork on Task
& Tool. You can also copy its skills from `.claude/skills/` into another
repo.

## What's in the repo

```
src/              the app: pages, components, layout and the business routes
brand/            notes on the brand: voice, audience, look and logo
public/           the fact notes
posts/            the blog posts, one markdown file each
legal/            the legal pages
design/           the design system and the page briefs
styles/           the Tailwind theme, compiled from the design system
static/           images and other files served as they are
scripts/          the build, the checks, reading a site, applying the design
test/             the tests
.claude/skills/   the 15 skills
AGENTS.md         what the agent reads first
.taskandtool/     setup for an install on Task & Tool
starter-app.json  what the app needs and its chat suggestions
```

## Commands

The agent runs these on the app's computer. With Node 20 or later, you can
run them on your own computer too. Run `npm install` first.

- `npm run dev` serves the site on localhost:3000 and restarts on every
  change. Forms, bookings and payments need a database in `DATABASE_URL`.
- `npm run check` runs the five checks. The browser checks need `tt-crawl`.
- `npm test` runs the tests.
- `npm run deploy` builds the site and publishes it to production. It works
  only on Task & Tool.

## Third-party tools

- [`tt-crawl`](https://github.com/taskandtool/crawler), our crawler (MIT).
  It reads sites and takes screenshots in headless Chrome. Obscura is its
  fallback browser.
- npm packages, MIT: `hono`, `@hono/node-server`,
  `@neondatabase/serverless`, `marked`, `tailwindcss` + `@tailwindcss/cli`,
  `esbuild`, `tsx`, `node-html-parser`, `pg`; `yaml` (ISC) and `typescript`
  (Apache-2.0).

## Contributing

Pull requests are welcome. Please keep credentials out of your changes. We
scan our own pushes for secrets.

## License

MIT. See `LICENSE`.
