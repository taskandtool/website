// Typed access to the generated content (src/generated/content.json, from
// scripts/content.mjs) and the JSON-LD builders. Edge-safe: the JSON is
// bundled in. Nothing here is hand-written per page: the facts come from
// the notes, the JSON-LD from the facts.
import generated from "./generated/content.json";

export const content = generated as {
  generatedAt: string;
  facts: {
    business: Record<string, any> | null;
    locations: Record<string, any>[];
    offerings: Record<string, any>[];
    faq: { question: string; answer: string; answerHtml: string }[];
    proof: Record<string, any>[];
  };
  posts: { path: string; title: string; date: string; description: string; author: string; tags: string[]; html: string }[];
  legal: { path: string; title: string; updated: string; html: string }[];
};

const clean = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)));

function postalAddress(a: any) {
  if (!a || typeof a !== "object") return undefined;
  return clean({
    "@type": "PostalAddress",
    streetAddress: a.street,
    addressLocality: a.locality,
    addressRegion: a.region,
    postalCode: a.postal_code,
    addressCountry: a.country,
  });
}

/** schema.org LocalBusiness (or the subtype the note names) from a business or location note. */
export function localBusinessJsonLd(note: Record<string, any>, siteUrl: string) {
  return clean({
    "@context": "https://schema.org",
    "@type": note.schema_type || "LocalBusiness",
    name: note.name,
    legalName: note.legal_name,
    url: siteUrl || undefined,
    telephone: note.telephone,
    email: note.email,
    address: postalAddress(note.address),
    geo: note.geo && note.geo.lat != null ? { "@type": "GeoCoordinates", latitude: note.geo.lat, longitude: note.geo.lng } : undefined,
    openingHours: Array.isArray(note.opening_hours) ? note.opening_hours : undefined,
    priceRange: note.price_range,
    sameAs: Array.isArray(note.same_as) ? note.same_as : undefined,
    areaServed: note.area_served,
  });
}

/** schema.org FAQPage from the faq note's headings. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/** schema.org Service from an offering note. */
export function serviceJsonLd(note: Record<string, any>, providerName?: string) {
  return clean({
    "@context": "https://schema.org",
    "@type": "Service",
    name: note.title || note.name,
    description: note.summary,
    provider: providerName ? { "@type": "LocalBusiness", name: providerName } : undefined,
    areaServed: note.area_served,
    offers: note.price != null ? clean({ "@type": "Offer", price: note.price, priceCurrency: note.currency, unitText: note.unit }) : undefined,
  });
}

/** schema.org BlogPosting for a post. */
export function postJsonLd(post: { title: string; date: string; description: string; author: string; path: string }, siteUrl: string, siteName: string) {
  return clean({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.description,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: siteName },
    url: siteUrl ? siteUrl.replace(/\/$/, "") + post.path : undefined,
  });
}
