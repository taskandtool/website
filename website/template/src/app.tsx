// The Hono app: one instance shared by the machine entry (server.ts), the edge
// entry (worker.ts), and the build's pre-render. Edge-safe by construction:
// no filesystem, no Node built-ins, no per-request state.
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { pages } from "./pages";
import { NotFound } from "./pages/not-found";
import { Blog, postPage } from "./pages/blog";
import { legalPage } from "./pages/legal";
import { content } from "./content";
import { redirectFor } from "./redirects";
import { render } from "./layout";
import type { Page } from "./site";

type Bindings = { DATABASE_URL?: string };

const app = new Hono<{ Bindings: Bindings }>();

// Every route the build pre-renders: the listed pages, the blog index when
// there are posts, each post, each legal page.
export const routes: (Page & { Body: FC })[] = [
  ...pages,
  ...(content.posts.length ? [{ ...Blog.page, Body: Blog.Body }] : []),
  ...content.posts.map((p) => {
    const { page, Body } = postPage(p);
    return { ...page, Body };
  }),
  ...content.legal.map((d) => {
    const { page, Body } = legalPage(d);
    return { ...page, Body };
  }),
];

// Old paths → new paths (src/redirects.ts). Pre-rendered pages are static
// files and win first at the edge; here the table runs ahead of every route.
app.use("*", async (c, next) => {
  const to = redirectFor(new URL(c.req.url).pathname);
  if (to) return c.redirect(to, 301);
  await next();
});

for (const route of routes) {
  app.get(route.path, (c) => c.html(render(route, <route.Body />)));
}

// Dynamic routes (form posts, anything computed per request) go below. They
// run on the machine and, after publishing, in the edge Worker. See the
// `website` skill's forms.md for a contact form that writes to the project's
// database.

app.notFound((c) => c.html(render(NotFound.page, <NotFound.Body />), 404));

export default app;
