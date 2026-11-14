# When the site grows

When the owner wants more than the homepage, finish the record so every
page can follow it:

1. **Fill the rest of the record** by `references/authoring.md`: the rules
   with their reasons, the imagery, the motion, `x_layout` for every shape
   of content (not only what the homepage shows), and `identity` from the
   homepage and what the owner said. Then `npm run apply-design`.
2. **Rebuild it blind.** Give a sub-agent with a fresh context only
   `public/`, `brand/` and `design/system.yaml`,
   and have it build the homepage as a scratch page at `/rebuild`
   (`src/pages/rebuild.tsx`, listed in `src/pages/index.ts`). Screenshot both (`tt-crawl shoot / /rebuild`).
   Where the two differ in a way the owner would notice, the record is
   missing something: add it, rebuild once more, then delete the scratch page. Without a
   sub-agent, skip this and say so.
3. **Check it:** `npm run check`.

Then build the other pages from the record (the `pages` skill). Make any
later change to the look in the record.
