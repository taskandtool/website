// What the whole site knows about itself. The AI writes this file from the
// brand notes in brand/ (positioning.md for the name, lines, and contact;
// visual-identity.md for the fonts and logo) — see BRAND.md. Edge-safe: no
// filesystem, no Node built-ins.

export interface Page {
  /** The route, starting with "/". Pre-rendered to dist/<path>.html at build. */
  path: string;
  /** The <title> and the nav label. */
  title: string;
  /** The meta description. Keep it a real sentence about this page. */
  description: string;
}

export const site = {
  /** The business name as it should appear: header, <title>, footer. */
  name: "Your business",
  tagline: "A website that is about to become yours.",
  description:
    "The working copy of a new website. Tell the AI about the business and this page becomes its front door.",
  locale: "en",
  /** The canonical URL once the site has one. */
  url: "",
  contact: { phone: "", email: "", address: "", hours: "" },
  social: {} as Record<string, string>,
  /** A file under brand/logo/, served at /brand/logo/<file>; empty sets the name as text. */
  logo: { file: "", alt: "" },
  fonts: {
    display: "Bricolage Grotesque",
    body: "Inter",
    /** The Google Fonts stylesheet loading them, or "" for self-hosted or system fonts. */
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600&display=swap",
  },
  /** Header links, in order (at most four; more belong in a menu). */
  nav: [
    { label: "What's inside", href: "#inside" },
    { label: "Brand", href: "#brand" },
  ],
  year: new Date().getFullYear(),
};

/** The URL of the logo file, or null when the name is set as text. */
export function logoUrl(): string | null {
  const file = site.logo.file;
  return file ? `/brand/logo/${file.replace(/^\/?(brand\/)?(logo\/)?/, "")}` : null;
}

/** A page's <title>. */
export function pageTitle(page: Page) {
  return page.path === "/" ? site.name : `${page.title} · ${site.name}`;
}
