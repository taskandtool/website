// What the whole site knows about itself: the brand facts and the pages.
// Edge-safe: no filesystem, no Node built-ins. brand.json is bundled in and
// merged over the starter defaults, so a partial brand still renders.
import brandJson from "../brand/brand.json";
import { withDefaults, type Brand } from "./brand-defaults";

export type { Brand };

export interface Page {
  /** The route, starting with "/". Pre-rendered to dist/<path>.html at build. */
  path: string;
  /** The <title> and the nav label. */
  title: string;
  /** The meta description. Keep it a real sentence about this page. */
  description: string;
}

const brand = withDefaults(brandJson as Record<string, unknown>);

export const site = {
  brand,
  /** The site name shown in the header and the <title> suffix. */
  name: brand.name,
  /** Header links, in order (at most four; more belong in a menu). */
  nav: [
    { label: "What's inside", href: "#inside" },
    { label: "Brand", href: "#brand" },
  ],
  year: new Date().getFullYear(),
};

/** The URL of a logo file named in brand.json (`logo/wordmark.svg` -> `/brand/logo/wordmark.svg`). */
export function logoUrl(): string | null {
  const file = brand.logo.file;
  return file ? `/brand/${file.replace(/^\/?(brand\/)?/, "")}` : null;
}

/** A page's <title>. */
export function pageTitle(page: Page) {
  return page.path === "/" ? site.name : `${page.title} · ${site.name}`;
}
