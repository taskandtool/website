Legal pages, verbatim. Each file is one page: `privacy.md`, `terms.md`,
`cookies.md`, `returns.md`, whatever the business has. Frontmatter names
the route and the title; the body is the owner's text, copied from the old
site or supplied by them, and never rewritten by the AI (it may point out
gaps). `npm run content` turns them into routes; `src/pages/legal.tsx`
renders them with the page shell around the text.

```
---
path: /privacy-policy
title: Privacy policy
updated: 2026-09-07
---
```
