// Sections that render from the notes (src/content.ts, FACTS.md) and render
// nothing when the note is empty, so a page can include them before the
// facts exist and they appear as the notes fill in. Each takes an id for the
// section and a heading; the composition around them is the page's.
import { raw } from "hono/html";
import { Section } from "./index";
import { content } from "../content";
import { site, formatHours } from "../site";

/** The offerings, as ruled rows: title, summary, price when stated. */
export function ServicesSection({ id = "services", heading = "What we do" }: { id?: string; heading?: string }) {
  const items = content.facts.offerings;
  if (!items.length) return null;
  return (
    <Section id={id} labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[12ch] text-section">{heading}</h2>
      <ol class="mt-block divide-y divide-line border-y border-line">
        {items.map((o) => (
          <li class="grid gap-3 py-8 sm:grid-cols-[1fr_auto] sm:gap-6">
            <div>
              <h3 class="text-title">{o.title || o.name}</h3>
              <p class="mt-3 max-w-prose text-ink-2">{o.summary}</p>
            </div>
            {o.price != null ? (
              <p class="text-title whitespace-nowrap">
                {o.currency ? `${o.currency} ` : ""}{o.price}{o.unit ? <span class="text-base text-ink-3"> {o.unit}</span> : null}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** The FAQ, as a definition list; the questions come from faq.md's headings. */
export function FaqSection({ id = "faq", heading = "Questions people ask", ground = "panel" as const }: { id?: string; heading?: string; ground?: "canvas" | "panel" }) {
  const items = content.facts.faq;
  if (!items.length) return null;
  return (
    <Section id={id} ground={ground} labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[12ch] text-section">{heading}</h2>
      <dl class="mt-block grid gap-8 md:grid-cols-2">
        {items.map((i) => (
          <div>
            <dt class="text-title">{i.question}</dt>
            <dd class="prose mt-3 max-w-prose text-ink-2">{raw(i.answerHtml)}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** Contact details from the business note: phone, email, address, hours. */
export function ContactSection({ id = "contact", heading = "Get in touch", ground = "night" as const }: { id?: string; heading?: string; ground?: "canvas" | "panel" | "night" }) {
  const c = site.contact;
  if (!c.phone && !c.email && !c.address && !c.hours) return null;
  const dark = ground === "night";
  const muted = dark ? "text-night-ink-2" : "text-ink-2";
  return (
    <Section id={id} ground={ground} labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[12ch] text-section">{heading}</h2>
      <dl class={`mt-block grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ${muted}`}>
        {c.phone ? <div><dt class="text-label uppercase">Phone</dt><dd class="mt-2 text-lede"><a href={`tel:${c.phone}`} class="no-underline hover:underline">{c.phone}</a></dd></div> : null}
        {c.email ? <div><dt class="text-label uppercase">Email</dt><dd class="mt-2 text-lede"><a href={`mailto:${c.email}`} class="no-underline hover:underline">{c.email}</a></dd></div> : null}
        {c.address ? <div><dt class="text-label uppercase">Address</dt><dd class="mt-2 text-lede">{c.address}</dd></div> : null}
        {c.hours ? <div><dt class="text-label uppercase">Hours</dt><dd class="mt-2 text-lede">{formatHours(c.hours)}</dd></div> : null}
      </dl>
    </Section>
  );
}

// ── proof: what others say (public/proof.md) ──────────────────────────────
// Defaults to restyle or rebuild; the design decides how proof looks.

const PLATFORM_ICONS: Record<string, string> = { google: "/images/platforms/google.svg", facebook: "/images/platforms/facebook.svg" };
const platformIcon = (platform?: string) => PLATFORM_ICONS[(platform || "").toLowerCase()];

/** Stars as the star graphic, one per whole star, read once as "4 out of 5 stars". */
export function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span class="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: n }, () => <img src="/images/platforms/star.svg" alt="" class={size} />)}
    </span>
  );
}

const reviewCount = (r: { count?: number; platform?: string }) => `${Number(r.count).toLocaleString("en-US")} ${r.platform ? `${r.platform} ` : ""}reviews`;

/** Every rating on one line: the platform's icon, the figure, its stars, the count, linked to the source. For a first screen or beside an action. */
export function RatingLine() {
  const items = content.facts.ratings;
  if (!items.length) return null;
  return (
    <ul class="flex flex-wrap items-center gap-x-8 gap-y-3">
      {items.map((r) => (
        <li class="flex items-center gap-2">
          {platformIcon(r.platform) ? <img src={platformIcon(r.platform)} alt={r.platform} class="size-6" /> : null}{" "}
          <span class="text-title">{r.value}</span>{" "}
          <Stars value={r.value} />{" "}
          {r.count ? (
            r.url ? <a href={r.url} class="text-ink-2 underline">{reviewCount(r)}</a> : <span class="text-ink-2">{reviewCount(r)}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Reviews and posts as cards: stars, the words as written, who, where and when (RatingLine goes where you want it). */
export function ReviewsSection({ id = "reviews", heading = "What customers say" }: { id?: string; heading?: string }) {
  const items = [...content.facts.reviews, ...content.facts.posts.map((p) => ({ quote: p.text || "", platform: p.platform, date: p.date, url: p.url }))].filter((r) => r.quote);
  if (!items.length) return null;
  return (
    <Section id={id} labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[14ch] text-section">{heading}</h2>
      <ul class="mt-block grid items-start gap-4 md:grid-cols-3">
        {items.map((r: Record<string, any>) => (
          <li class="flex flex-col gap-4 rounded-card border border-line bg-surface p-6">
            {r.stars ? <Stars value={r.stars} /> : null}
            <blockquote class="text-lede">“{r.quote}”</blockquote>
            <p class="flex items-center gap-2 text-ink-2">
              {platformIcon(r.platform) ? <img src={platformIcon(r.platform)} alt={r.platform} class="size-4" /> : null}
              <span>{[r.name, r.role, r.company].filter(Boolean).join(", ") || r.platform}{r.date ? `, ${r.date}` : ""}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const LOGO_GROUPS: [string, string][] = [
  ["customer", "Customers"], ["brand", "Brands we work on"], ["partner", "Partners"], ["supplier", "Suppliers"],
  ["member", "Members of"], ["certification", "Certified by"], ["award", "Awards"], ["press", "As seen in"], ["", ""],
];

/** Every logo of others, grouped by kind under its label, each at one optical height in its own colours. */
export function LogosSection({ id = "logos", heading, kinds }: { id?: string; heading?: string; kinds?: string[] }) {
  const all = content.facts.logos.filter((l) => !kinds || kinds.includes(l.kind || ""));
  if (!all.length) return null;
  const known = new Set(LOGO_GROUPS.map(([k]) => k));
  const groups = LOGO_GROUPS.map(([kind, label]) => [label, all.filter((l) => (known.has(l.kind || "") ? l.kind || "" : "") === kind)] as const).filter(([, items]) => items.length);
  return (
    <Section id={id} labelledBy={heading ? `${id}-title` : undefined}>
      {heading ? <h2 id={`${id}-title`} class="text-title">{heading}</h2> : null}
      <div class="flex flex-col gap-8">
        {groups.map(([label, items]) => (
          <div>
            {label && groups.length > 1 ? <p class="text-label text-ink-2" data-lint-allow="puffery">{label}</p> : null}
            <ul class="mt-4 flex flex-wrap items-center gap-x-12 gap-y-8">
              {items.map((l) => (
                <li>
                  <img src={l.file} alt={l.name} class="h-12 w-auto max-w-48 object-contain" loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** The numbers the business states: each figure large, with what it counts. */
export function NumbersSection({ id = "numbers" }: { id?: string }) {
  const items = content.facts.numbers;
  if (!items.length) return null;
  return (
    <Section id={id}>
      <dl class="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {items.map((n) => (
          <div>
            <dt class="text-section">{n.figure}</dt>
            <dd class="mt-2 text-ink-2">{n.says}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** The people: a photo, a name and a role each. */
export function PeopleSection({ id = "people", heading = "Who you will work with" }: { id?: string; heading?: string }) {
  const items = content.facts.people;
  if (!items.length) return null;
  return (
    <Section id={id} labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[14ch] text-section">{heading}</h2>
      <ul class="mt-block grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {items.map((p) => (
          <li>
            {p.photo ? <img src={p.photo} alt={p.name} class="aspect-square w-full rounded-card object-cover" loading="lazy" /> : null}
            <p class="mt-3 text-title">{p.name}</p>
            {p.role ? <p class="text-ink-2">{p.role}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
