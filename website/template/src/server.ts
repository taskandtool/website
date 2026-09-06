// The machine entry: serves public/ as static files, then the app.
// `npm run dev` runs this under a watcher beside the Tailwind watcher, so an
// edit is live on the next refresh. This is the only file that may use Node.
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import app from "./app";

const port = Number(process.env.PORT ?? 3000);

const server = new Hono();
// Static files win over routes, exactly as they do at the edge.
server.use("/*", serveStatic({ root: "./public" }));
server.route("/", app);

serve({ fetch: server.fetch, port, hostname: "0.0.0.0" }, (info) => {
  console.log(`website listening on http://localhost:${info.port}`);
});
