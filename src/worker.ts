// The edge entry. Cloudflare serves everything under dist/ as static assets
// first (every pre-rendered page, the CSS, images); only paths that match no
// asset reach this handler: form posts, dynamic routes, the 404 page.
// Bundled by `npm run build` to build/worker.mjs. Keep Node built-ins out of
// anything this file imports. The routing Worker hands each request the
// app's connections (`ctx.props.tt`), which app code reads as `TT`
// (data/gateway.ts).
import type { ExecutionContext } from "hono";
import app from "./app";

type Context = ExecutionContext & { props?: { tt?: unknown } };

export default {
  fetch(request: Request, env: Record<string, unknown>, ctx: Context) {
    return app.fetch(request, { ...env, TT: ctx.props?.tt }, ctx);
  },
};
