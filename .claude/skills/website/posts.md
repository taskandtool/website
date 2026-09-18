# Posts: the blog collection

`posts/*.md` is the collection; one file per post, rendered by
`src/pages/blog.tsx` into `/blog/<slug>` and listed at `/blog`, all
pre-rendered at build. `npm run content` regenerates it (the dev loop does
this on its own when a file changes).

```markdown
---
title: Why we replace hoses on site
date: 2026-08-14
description: What a hydraulic hose failure costs and how we keep crews moving.
author: Dana Ortiz            # optional
tags: [hydraulics, field]     # optional
path: /blog/replace-hoses-on-site   # optional; keeps an old URL when migrating
---

Body in markdown. Headings from `##` down; images from static/images/
with alt text; links to the site's pages.
```

Migrating a blog: one file per old post from `raw/web/` (or from
`raw/structured/wp/` when the old site was WordPress, which keeps authors
and dates exactly), `path` set to the old URL so nothing redirects, the
words kept and edited only through the writing skill's passes, the date
kept. The `/blog` index appears automatically once a post exists; add it
to the nav in `src/site.ts` when the business wants it there.

Writing a new post: the `writing` skill's brief and voice card first; a
description that reads as the snippet; a real photo when there is one.
