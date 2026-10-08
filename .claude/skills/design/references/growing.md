# When the site grows

When the owner wants more than the homepage, the record carries the look to
every page:

1. **Fill the rest of the record** by `references/authoring.md`: the rules
   with their reasons, the imagery, the motion, `x_layout` for every shape
   of content (not only what the homepage shows), and `identity` from the
   brief. `references/records/` holds the library's fourteen as worked examples,
   and `references/authoring.md` ends with a filled identity. Then
   `npm run system`.
2. **Rebuild it blind.** Give a sub-agent with a fresh context only
   `design/briefs/home.md`, `public/`, `brand/` and `design/system.yaml`,
   and have it build the homepage as a scratch page at `/rebuild`
   (`src/pages/rebuild.tsx`, listed in `src/pages/index.ts`). Screenshot both (`npm run shots -- /rebuild`).
   Where the two differ in a way the owner would notice, the record left
   something out: add it, rebuild once more, then delete the scratch page. Without a
   sub-agent, skip this and say so.
3. **Check it:** `npm run verify`.

The other pages then follow the record (the `pages` skill). A later change
to the look is a change to the record.
