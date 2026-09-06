// What the whole site knows about itself. The AI writes the literals below
// from the brand notes (positioning.md for the name and lines,
// visual-identity.md for the fonts and logo; BRAND.md). Contact details,
// hours, and social links come from the `business` note in public/ when it
// has them (FACTS.md), so the footer never carries a second copy of a fact.
// Edge-safe: no filesystem, no Node built-ins.
import { content } from "./content";

export interface Page {
  /** The route, starting with "/". Pre-rendered to dist/<path>.html at build. */
  path: string;
  /** The <title> and the nav label. */
  title: string;
  /** The meta description. Keep it a real sentence about this page. */
  description: string;
  /** JSON-LD objects for this page, from src/content.ts builders. */
  jsonLd?: object[];
}

const business = content.facts.business ?? {};
// Hours stay in schema.org form in the note ("Mo-Fr 08:00-17:00"); the
// footer and contact section show them through formatHours().
const hours = Array.isArray(business.opening_hours) ? business.opening_hours.join("; ") : "";
const addr = business.address && typeof business.address === "object" ? business.address : {};
const addressLine = [addr.street, addr.locality, addr.region, addr.postal_code].filter(Boolean).join(", ");

export const site = {
  /** The business name as it should appear: header, <title>, footer. */
  name: business.name || "Your business",
  tagline: "A website that is about to become yours.",
  description:
    "The working copy of a new website. Tell the AI about the business and this page becomes its front door.",
  locale: "en",
  /** The canonical origin (https://example.com) once the site has one; the
   *  canonical tag points here so the platform copy never competes with it. */
  url: "",
  contact: {
    phone: business.telephone || "",
    email: business.email || "",
    address: addressLine,
    hours,
  },
  social: (Array.isArray(business.same_as) ? Object.fromEntries(business.same_as.map((u: string) => [hostLabel(u), u])) : {}) as Record<string, string>,
  /** A file under brand/logo/, served at /brand/logo/<file>; empty sets the name as text. */
  logo: { file: "", alt: "" },
  fonts: {
    display: "Bricolage Grotesque",
    body: "Inter",
    /** The Google Fonts stylesheet loading them, or "" for self-hosted or system fonts. */
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600&display=swap",
  },
  /** Analytics and verification IDs carried over from the old site (the
   *  inventory's `tracking`), rendered by the layout. Empty = nothing rendered. */
  tracking: { ga4: "", metaPixel: "", searchConsole: "" },
  /** Header links, in order (at most four; more belong in a menu). */
  nav: [
    { label: "What's inside", href: "#inside" },
    { label: "Brand", href: "#brand" },
  ],
  year: new Date().getFullYear(),
};

function hostLabel(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "").split(".")[0];
  } catch {
    return u;
  }
}

/** The URL of the logo file, or null when the name is set as text. */
export function logoUrl(): string | null {
  const file = site.logo.file;
  return file ? `/brand/logo/${file.replace(/^\/?(brand\/)?(logo\/)?/, "")}` : null;
}

/** A page's <title>. */
export function pageTitle(page: Page) {
  return page.path === "/" ? site.name : `${page.title} · ${site.name}`;
}

/** The canonical URL of a path: the real domain when set, else none. */
export function canonicalUrl(path: string): string | null {
  return site.url ? site.url.replace(/\/$/, "") + (path === "/" ? "/" : path) : null;
}

const DAYS: Record<string, string> = { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" };

/** "Mo-Fr 08:00-17:00; Sa 09:00-12:00" -> "Monday to Friday 8:00 to 17:00, Saturday 9:00 to 12:00". */
export function formatHours(spec: string): string {
  return spec
    .split(/;\s*/)
    .filter(Boolean)
    .map((part) => {
      const m = part.trim().match(/^([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
      if (!m) return part.trim();
      const days = m[2] ? `${DAYS[m[1]] ?? m[1]} to ${DAYS[m[2]] ?? m[2]}` : DAYS[m[1]] ?? m[1];
      return `${days} ${Number(m[3])}:${m[4]} to ${Number(m[5])}:${m[6]}`;
    })
    .join(", ");
}
