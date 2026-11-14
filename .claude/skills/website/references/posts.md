# Posts: the blog collection

`posts/*.md` is the collection; one file per post, rendered by
`src/pages/blog.tsx` into `/blog/<slug>` and listed at `/blog`, all
pre-rendered at build.

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

Migrating a blog: write one file per old post from `raw/site/<host>/pages/`
(first run `tt-crawl import` for a WordPress site, or `tt-crawl import
--template post` for one with a feed; both write each post there with its
exact author and date). Set `path` to the old URL: the post then needs no
redirect.
Keep the words, edited only through the writing skill's passes, and keep
the date. The `/blog` index appears automatically once a post exists; add it
to the nav in `src/site.ts` when the business wants it there.

Writing a new post: use the `writing` skill first, write a description
that works as the search snippet, and add a real photo when there is one.
