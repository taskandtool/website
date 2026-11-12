# Website

**A business website your AI agent builds, checks and updates by chat.** Every
page comes from notes the agent keeps on the business.

[![Deploy on Task & Tool](https://taskandtool.com/images/deploy-button.svg)](https://taskandtool.com/accounts/register?starter_app=website)

![The Northline Gardens and Bellwork Boxing websites, both built with this Starter App](https://taskandtool.com/images/starter-apps/website.webp)

It's made to run on Task & Tool. Each project there has its own Postgres
database for the leads and bookings the site takes. Each app runs on a
separate computer, where your AI agent uses the skills and scripts in this
repo to build a site in your brand and check every page against your
business facts. The site is Hono and Tailwind.

## Features

### The agent can read facts about your business

Facts such as your address, phone number, services, FAQs, reviews and
prices sit in plain text notes in the repo. The agent reads them before it
writes a page. When a price changes, it edits one note, and the next build
shows the new price on every page.

### Facts can come from your site, your files or the chat

Give it your current website and it reads the main pages and your Google
listing in about a minute. Attach price lists, brochures or photos in chat,
or upload whole folders on the app's Files tab. Anything you tell it in
chat counts as a source. The agent records where each fact came from.

### Pages show only the prices and quotes in your notes

Everything from the address in the footer to the prices on the services
page comes from the notes. If a page shows a number or a quote that isn't
in them, the copy check fails and the agent fixes the page. When a fact is
missing, the agent asks you for it.

![The Bellwork Boxing prices: first class $0, unlimited $179 a month, ten classes $220](https://taskandtool.com/images/marketing/bellwork-boxing-site-prices.webp)

### Every page follows one design system

The agent picks your colors and fonts from your current site and logo and
saves them in one design file. Every page takes its colors, type and
spacing from that file, so a new page matches the rest. If the business has
no site yet, the agent begins with one of 14 ready-made designs that suits
it. These two sites came from this repo:

<p>
  <img src="https://taskandtool.com/images/marketing/northline-gardens-site-patios-phone.webp" width="300" alt="The Northline Gardens patios page at phone width: a serif heading, Stone patios and paths, over a photo of a stone patio in Oak Park">
  <img src="https://taskandtool.com/images/marketing/bellwork-boxing-site-timetable-phone.webp" width="300" alt="The Bellwork Boxing timetable at phone width: This week, 24 classes, and a 6:00 AM Box and Burn class with Coach Marcus">
</p>

### A script checks your site's SEO, facts, code, copy and design

The agent runs it before it shows you any work and fixes what it finds.
Then it sends you screenshots of each changed page on a phone and a desktop.

| Check | What it catches |
|---|---|
| SEO | Missing titles, descriptions and alt text, broken links, and old pages that no longer redirect |
| Facts | Reviews and ratings in your notes that the homepage doesn't show |
| Code | Type errors, failing tests and a build that breaks |
| Copy | Prices and quotes that aren't in your notes, and wording that sounds like AI |
| Design | Colors outside your design, hard-to-read text, and pages that break on a phone |

### The agent follows a skill for each kind of work

A skill is a set of instructions the agent loads when a task needs it. This
repo has 15:

| Skill | What it does |
|---|---|
| `new-site` | Builds a new site in order: the homepage, the design, the other pages, the launch |
| `pages` | Plans the pages a business needs, with guides for 18 kinds of page |
| `design` | Sets the colors, type, photos and layout, and reviews each page |
| `writing` | Writes in the owner's voice and edits the draft |
| `tropes` | Spots phrases that read as machine-written |
| `brand` | Gathers facts and the brand's look from the sources above |
| `migrate-site` | Moves your current site to the new one and redirects every old link |
| `website` | Runs the site day to day: edits, blog posts, SEO and going live |
| `forms` `booking` `payments` `admin` `customers` `reports` `data` | Forms, bookings, Stripe payments, an admin page for the team, customer notes and reports |

Scripts handle the repetitive steps, such as reading a website or listing
the photos a page can use. Each one has a `--help`. `npm test` runs 351
tests on the scripts and the business code, 106 of them against a
Postgres database.

### The agent redirects every old URL when it moves a site

It reads the old site and maps each old page to a new one with a redirect.
The build stops if a redirect loops or points to a missing page. The agent
copies your Google Analytics and ad tracking IDs, and brings a WordPress
blog across post by post with its dates and authors.

### Forms, bookings and payments

A single form can run over several steps and end with a booking and a
payment. Each submission can email your team or go to your CRM. A hidden
spam trap catches bots. Each person who gets in touch has one customer
record, and the CRM and your other apps read the same records.

A booking page shows open times from each person's hours and days off. Two
people can't book the same slot. Once you connect Resend or Postmark, each
booker gets a calendar invite and a link to move or cancel. Payments go
through your Stripe account: orders, deposits, paid bookings and refunds.

Your team sees submissions, bookings and payments on a private admin page.
They can search, filter, change a status, act on many rows at once and
export to CSV.

<img src="https://taskandtool.com/images/marketing/northline-gardens-site-book-phone.webp" width="300" alt="The Northline Gardens Book a visit form at phone width: what needs doing, with Fall cleanup and Hedges picked, then a choice of days">

### The agent can run a prompt or a script on a schedule

Ask the agent to schedule a job. It can run now, once at a set time, or on
a repeat as often as every 15 minutes. A prompt job starts a fresh chat
with the agent, and a script job runs a command. For example:

| Job | What it does |
|---|---|
| Weekly site audit | Checks the live site for broken links and missing titles, and posts in the chat when something fails |
| A blog post every Friday | Prompt: "Draft next week's blog post and show it to me" |
| Monthly report | A PDF of your leads, bookings and Google search figures |
| Calendar sync and reminders | Reads busy times from Google or Outlook calendars and sends booking reminders. Needs the [CRM Starter App](https://github.com/taskandtool/crm) |

### Pages load fast from Cloudflare

The build turns each page into a plain HTML file ahead of time, and
Cloudflare serves it from servers near each visitor. Only forms and a few
dynamic pages run code. The same build writes the sitemap, `robots.txt`,
canonical tags and the business's structured data for Google.

## Get started

Click the button above, or pick Website when you create an app on
[Task & Tool](https://taskandtool.com/starter-apps/website). Then ask for a
homepage in the chat.

## What else Task & Tool gives the site

- A dev address your team can open while the agent works
- A production address that only your team sees until you make it public
- Connections to Stripe, Google, email and other services, so no key is
  stored in this repo
- Scheduled jobs for the audits, reports and reminders above
- Sign-in for your team, which keeps the admin pages private

## What's in the repo

```
src/              the app: pages, components, layout and the business routes
brand/            notes on the brand: voice, audience, look and logo
public/           the fact notes, blog posts and legal pages
design/           the design system and the page briefs
styles/           the Tailwind theme, compiled from the design system
static/           images and other files served as they are
scripts/          the build, the checks, reading a site, applying the design
test/             the tests
.claude/skills/   the 15 skills
AGENTS.md         what the agent reads first
.taskandtool/     setup for an install on Task & Tool
starter-app.json  the App Library listing and the suggestions an empty chat shows
```

## Commands

- `npm run dev` runs the site and reloads it on every change.
- `npm run check` runs the five checks, and `npm test` runs the tests.
- `npm run deploy` builds the site and publishes it to production.

## Third-party tools

- [`tt-crawl`](https://github.com/taskandtool/crawler), our crawler, with
  headless Chrome for reading sites and taking screenshots, and Obscura
  (Apache-2.0) as a fallback browser.
- npm packages, MIT: `hono`, `@hono/node-server`, `@neondatabase/serverless`,
  `marked`, `tailwindcss` + `@tailwindcss/cli`, `esbuild`, `tsx`,
  `node-html-parser`, `pg`; `yaml` (ISC) and `typescript` (Apache-2.0).

## Contributing

Pull requests are welcome. The repo holds no credentials, and a secret scan
runs before each push.

## License

MIT. See `LICENSE`.
