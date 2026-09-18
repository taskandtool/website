// The 301 table: old paths → new paths, from site-map.md's merge and drop
// rows and any redirect the old site already had. Served by the app on the
// machine and, after publishing, by the Worker at the edge (pre-rendered
// pages are static assets and win first; only paths that are not a file
// reach this table). `npm run check` refuses loops and targets that are
// neither a page, another redirect, nor an external URL.
export const redirects: Array<[from: string, to: string]> = [
  // ["/old-services.html", "/services"],
];

/** The redirect for a path, if any (exact match, trailing slash ignored). */
export function redirectFor(path: string): string | null {
  const wanted = path.length > 1 ? path.replace(/\/$/, "") : path;
  for (const [from, to] of redirects) {
    const f = from.length > 1 ? from.replace(/\/$/, "") : from;
    if (f === wanted) return to;
  }
  return null;
}
