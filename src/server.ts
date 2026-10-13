// The machine entry: serves static/ and brand/logo/ as static files, then the
// app. `npm run dev` runs this under a watcher beside the Tailwind watcher, so
// an edit is live on the next refresh. Node only where src/worker.ts does not
// reach (npm run check).
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono, type Context } from "hono";
import app from "./app";
import { devFiles } from "./forms/files";

const port = Number(process.env.PORT ?? 3000);

const server = new Hono();
// While the site is being built, its files change (site.css on every edit):
// the browser asks again each time (a 304 when nothing changed) instead of keeping a copy
// whose classes the new pages do not have.
const fresh = (_path: string, c: Context) => c.header("Cache-Control", "no-cache");
// Static files win over routes, exactly as they do at the edge.
server.use("/brand/logo/*", serveStatic({ root: "./brand/logo", rewriteRequestPath: (p) => p.replace(/^\/brand\/logo/, ""), onFound: fresh }));
server.use("/*", serveStatic({ root: "./static", onFound: fresh }));
// The order cart (the forms skill's cart.js), copied to dist/cart.js by the build.
server.use("/cart.js", serveStatic({ path: "./src/forms/cart.js", onFound: fresh }));
// A photo field's uploads on localhost (the routing worker answers them at the app's addresses).
server.route("/", devFiles());
server.route("/", app);

serve({ fetch: server.fetch, port, hostname: "0.0.0.0" }, (info) => {
  console.log(`website listening on http://localhost:${info.port}`);
});
