// The Hono app: one instance shared by the machine entry (server.ts), the edge
// entry (worker.ts), and the build's pre-render. Edge-safe by construction:
// no filesystem, no Node built-ins, no per-request state.
import { Hono } from "hono";
import { pages } from "./pages";
import { NotFound } from "./pages/not-found";
import { render } from "./layout";

type Bindings = { DATABASE_URL?: string };

const app = new Hono<{ Bindings: Bindings }>();

// Every page in src/pages is a GET route here and a pre-rendered HTML file
// after `npm run build`.
for (const page of pages) {
  app.get(page.path, (c) => c.html(render(page, <page.Body />)));
}

// Dynamic routes (form posts, anything computed per request) go below. They
// run on the machine and, after publishing, in the edge Worker. See the
// `website` skill's forms.md for a contact form that writes to the project's
// database.

app.notFound((c) => c.html(render(NotFound.page, <NotFound.Body />), 404));

export default app;
