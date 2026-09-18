// The edge entry. Cloudflare serves everything under dist/ as static assets
// first (every pre-rendered page, the CSS, images); only paths that match no
// asset reach this handler: form posts, dynamic routes, the 404 page.
// Bundled by `npm run build` to build/worker.mjs. Keep Node built-ins out of
// anything this file imports.
import app from "./app";

export default app;
