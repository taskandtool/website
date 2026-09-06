// What the whole site knows about itself: the brand facts and the pages.
// Edge-safe: no filesystem, no Node built-ins. brand.json is bundled in.
import brand from "../brand/brand.json";

export type Brand = typeof brand;

export interface Page {
  /** The route, starting with "/". Pre-rendered to dist/<path>.html at build. */
  path: string;
  /** The <title> and the nav label. */
  title: string;
  /** The meta description. Keep it a real sentence about this page. */
  description: string;
  /** Show in the header nav (in the order listed). */
  nav?: boolean;
}

export const site = {
  brand,
  /** The site name shown in the header and the <title> suffix. */
  name: brand.name,
  /** Header links. Anchors on the home page until there are real pages. */
  nav: [
    { label: "What's inside", href: "#inside" },
    { label: "Brand", href: "#brand" },
  ],
  year: new Date().getFullYear(),
};

/** A page's <title>. */
export function pageTitle(page: Page) {
  return page.path === "/" ? site.name : `${page.title} · ${site.name}`;
}
