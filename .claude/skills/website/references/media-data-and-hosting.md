# Media, interactivity, data, and hosting

The parts of the website skill a page change rarely needs.

## From an HTML page to a page here

A page designed as plain HTML (one the owner hands over) becomes a page
here in five mechanical steps:

1. Keep only what sits inside `<main>`; the layout already has the head,
   header and footer. Move anything the page adds to the head into
   `page.jsonLd` or the layout.
2. Self-close void tags: `<br />`, `<img … />`, `<input … />`, `<hr />`.
3. HTML comments become `{/* … */}`; a literal `{` or `}` in text becomes
   `{"{"}` or `{"}"}`.
4. Repeated blocks with facts in them (services, reviews, FAQ) become a
   `.map()` over `content`, or the matching section from
   `src/components/facts.tsx`, so each fact lives once, in its note.
5. Classes stay as they are when they use the site's tokens. Run `npm run
   verify`; a class the theme does not have is the lint's finding to fix,
   not something to add a token for silently.

## Images and media

- `npm run images -- <file>…` puts photographs in `static/images/` at web
  size (at most 2400px wide, under 300 KB where the quality allows) and
  prints each one's pixels. Real `alt` text always.
- Video: a few MB, muted h264 mp4 plus webm, compressed here with ffmpeg;
  long-form video embeds from the owner's platform. Keep files over 100 MB
  out of git (`.gitignore`).
- In production, Cloudflare serves the pre-rendered pages and everything
  in `static/` as static files; dev still shows this machine's working
  copy.
- Self-hosted fonts go in `static/fonts/` with `@font-face` in
  `styles/input.css`; `npm run system` then leaves them out of the Google
  Fonts link in `src/fonts.ts`.

## Interactivity, forms, and data

- Small client-side state (a menu, a tab, a toggle): a few lines of plain
  JavaScript in `static/js/`, or Alpine.js from a CDN `<script>` in the
  layout. Server round-trips (a filter, a search) can use htmx the same way.
  No client framework unless a view genuinely needs one.
- Forms, the private side and data the project's other apps share come
  from the business skills beside this one, on `data` (the database
  handle, settings, email, spam checks). `forms` (any form a visitor sends,
  stored in `submissions`, where a CRM finds them; an order or a booking
  is a form with steps), `booking`, `payments` and `admin` (the private
  `/admin`, kept for the team by setup) are already here: their code is in
  `src/<skill>/` and `src/business.tsx` mounts it. `reports` (charts and
  report pages) is copied into `src/reports/` as its skill says when the
  site needs it, its tests with it. Here the handle is
  `fromNeon(envVar(c, "DATABASE_URL"))`, since production runs on the Neon
  HTTP driver. Where a skill asks for the business's time zone, pass
  `content.facts.business.time_zone` (the business note's `time_zone`).
  Another private view on a public site is kept for the team with
  `python3 ~/tools/taskandtool.py add-private-path <path>`. If the app has
  no database, `python3 ~/tools/taskandtool.py request-capability postgres`
  asks the owner for one.
- Dynamic routes go in `src/app.tsx` below the page loop, under the same
  rule as all of `src/` (AGENTS.md: Rules); `npm run check` flags a Node
  import anything `src/worker.ts` reaches.
- Sending email needs a sender the owner connects (Resend or Postmark,
  through the platform's `connections` skill); Task & Tool sends none.
  `data`'s `send.ts` uses it. Without one, the submission is stored and the
  owner sees it in `/admin` or the CRM. Say which the site does.

## After launch

A site nobody checks rots quietly. Once the site is on its real domain,
the `launch-check` skill schedules `tt-crawl audit` as a weekly job
(broken links and images, missing titles or descriptions, h1 problems,
redirect chains, sitemap drift); a failing run alerts the owner and the
chat offers "Fix the site audit findings".
`tt-crawl audit URL` runs it by hand any time.

## Off the platform

This site runs anywhere with Node 20: `npm install`, `npm run dev`. Only
`npm run deploy` depends on Task & Tool. Off the platform, on the owner's
own computer and Cloudflare account, `npm run build` then `npx wrangler
deploy` (`wrangler.jsonc`) does the same job. On this machine, production
is `npm run deploy`; any other destination, the owner's own Cloudflare
account included, is the `deploy` skill's.
