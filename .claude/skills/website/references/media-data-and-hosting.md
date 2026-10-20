# Media, interactivity, data, and hosting

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
5. Classes stay as they are when they use the site's tokens. `npm run
   check:design` names any other: map it to a token, or add the value to
   `design/system.yaml` and say so.

## Images and media

- `npm run images -- <file>…` puts photographs in `static/images/` at web
  size (at most 3000px wide, under 600 KB where the quality allows) and
  prints each one's pixels. Real `alt` text always. Use photographs
  generously: big, full-bleed where they hold up, several per page.
- Video: muted h264 mp4 (plus webm). Read it with `ffprobe` first; for a
  background loop, trim it and drop the audio, and re-encode only a heavy
  file, keeping the source's resolution and a quality that stays sharp at
  full width (look at it). A loop of 10 to 20 MB is fine. Cloudflare serves
  each static file up to 25 MB, so a longer film embeds from the owner's
  platform (YouTube, Vimeo).

## Interactivity, forms, and data

- Small client-side state (a menu, a tab, a toggle): a few lines of plain
  JavaScript in `static/js/`, or Alpine.js from a CDN `<script>` in the
  layout. Server round-trips (a filter, a search) can use htmx the same way.
  No client framework unless a view needs one.
- Forms, bookings, payments, customers and the private `/admin` are
  already here, from the business skills beside this one (all on `data`):
  their code is in `src/<skill>/`, mounted by `src/business.tsx`. `reports`
  is copied into `src/reports/` when the site needs it, as its skill says.
  Where a skill asks for the business's time zone, pass `site.timeZone`
  (`src/site.ts`, from the business note's `time_zone`).
- Dynamic routes go in `src/app.tsx` below the page loop; they run in the
  Worker, so `npm run check:code` flags a Node import.
- Email goes through `data`'s `send.ts`: a notice to the team can go by
  Task & Tool email, and anything to a customer needs a sender the owner
  connects (Resend or Postmark). Without one, a submission is still stored
  for `/admin` and the CRM. Tell the owner which the site does.

## Off the platform

This site runs anywhere with Node 20. Off the platform, `npm run build`
then `npx wrangler deploy` (`wrangler.jsonc`); on this machine production
is `npm run deploy`, and any other destination is the `deploy` skill's.
