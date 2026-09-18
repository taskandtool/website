Posts, one markdown file each, rendered by one template into `/blog/<slug>`
and listed at `/blog`. Frontmatter: `title`, `date` (YYYY-MM-DD),
`description`, `author` (optional), `tags` (optional list), `path`
(optional; defaults to /blog/<file name without .md>, and is what keeps an
old blog URL when a site is migrated). The body is markdown.
`npm run content` regenerates the collection; the dev loop runs it at start.

```
---
title: Why we replace hoses on site
date: 2026-08-14
description: What a hydraulic hose failure costs and how we keep crews moving.
path: /blog/replace-hoses-on-site
---
```
