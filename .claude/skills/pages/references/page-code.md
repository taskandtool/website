# A page's code

Read when writing or changing a page's code.

## Adding a page

1. Create `src/pages/<name>.tsx` in the shape of `home.tsx`: `export const
   Name = { page, Body }`, where `page.path` starts with `/` and
   `page.description` is a real sentence about the page.
2. Add it to `modules` in `src/pages/index.ts`. That makes it a route here
   and a pre-rendered `dist/<name>.html` when deployed, served at
   `/<name>`. Add its row to `site-map.md`. Nested paths work the same way:
   `/services/roofing` becomes `dist/services/roofing.html`.
3. Put it in the header nav through `site.nav` in `src/site.ts` when it
   belongs there (at most four links; more go in a menu).
4. Build the page from `Section`, the type classes, and the tokens. The
   Tailwind default palette, shadows, radii, blurs, and animations are
   switched off in the theme, so only the site's tokens exist as classes;
   `npm run lint` refuses the rest (`DESIGN.md`: Do's and Don'ts).

## How a page is written

Pages are Hono JSX: mostly markup, written the way the HTML will read, so
the next turn can change them safely.

- `class`, `for` and a plain-string `style` work as in HTML; never
  `className` or `htmlFor`.
- The layout (`src/layout.tsx`) owns the head, header and footer. A page
  returns only what goes inside `<main>`.
- Facts come from `content` and `site` (the notes, compiled), never typed
  into a page. The sections in `src/components/facts.tsx` render them and
  render nothing while their note is empty; `npm run parts` lists them.
- Logic stays small: a `.map()` over a list, a condition around a block.
  Anything bigger belongs in `src/content.ts`, typed, where `npm run
  typecheck` checks it.
- JSX escapes text by default. `raw()` is only for markup the site
  generates itself (JSON-LD, a post's rendered markdown).
