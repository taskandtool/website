# A page's code

Read when writing or changing a page's code.

## Adding a page

1. Create `src/pages/<name>.tsx`; `page.description` is a real sentence
   about the page.
2. Add it to `modules` in `src/pages/index.ts`. That makes it a route here
   and a pre-rendered `dist/<name>.html` when deployed, served at
   `/<name>`. Add its row to `site-map.md`. Nested paths work the same way:
   `/services/roofing` becomes `dist/services/roofing.html`.
3. Put it in the header nav through `site.nav` in `src/site.ts` when it
   belongs there.

## How a page is written

Pages are Hono JSX. Write them as mostly markup, close to the HTML they
become. They are then safe to change in a later turn.

- Keep logic small: a `.map()` over a list, a condition around a block.
  Put anything bigger in `src/content.ts`, typed. `npm run check:code`
  checks it there.
- JSX escapes text by default. `raw()` is only for markup the site
  generates itself (JSON-LD, a post's rendered markdown).
