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
      <ol class="mt-lead divide-y divide-line border-y border-line">
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
      <dl class="mt-lead grid gap-8 md:grid-cols-2">
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
      <dl class={`mt-lead grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ${muted}`}>
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

// "Mar 2026": when it was said, which does not go stale the way "3 months ago" does
const said = (date?: string) => {
  const d = date ? new Date(date) : null;
  return d && !isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : date || "";
};

/** The reviewer's own photo (Google gives one), else their initial in a circle. */
function Avatar({ name, photo }: { name?: string; photo?: string }) {
  if (photo) return <img src={photo} alt="" width="40" height="40" loading="lazy" referrerpolicy="no-referrer" class="size-10 shrink-0 rounded-full object-cover" />;
  return (
    <span aria-hidden="true" class="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink font-semibold">
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}

/** Reviews and posts as cards of one height, the way the platforms show them: photo or initial, name and when, the platform's mark, the stars, the words as written (cut at five lines). The rating sits under the heading. */
export function ReviewsSection({ id = "reviews", heading = "What customers say", ground = "panel" }: { id?: string; heading?: string; ground?: "canvas" | "panel" | "night" }) {
  const items = [...content.facts.reviews, ...content.facts.posts.map((p) => ({ quote: p.text || "", platform: p.platform, date: p.date, url: p.url }))].filter((r) => r.quote);
  if (!items.length) return null;
  return (
    <Section id={id} ground={ground} wide labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[20ch] text-section">{heading}</h2>
      <div class="mt-6"><RatingLine /></div>
      {/* a row to swipe on a phone, a grid of one height from 640px */}
      <ul class="-mx-5 mt-lead flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:auto-rows-fr sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3" data-reveal>
        {items.map((r: Record<string, any>) => (
          <li class="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-card border border-line bg-surface p-6 text-ink shadow-lift sm:w-auto">
            <div class="flex items-center gap-3">
              <Avatar name={r.name || r.platform} photo={r.photo} />
              <p class="min-w-0 flex-1 leading-tight">
                <span class="block truncate font-semibold">{r.url ? <a href={r.url}>{[r.name, r.role, r.company].filter(Boolean).join(", ") || r.platform}</a> : [r.name, r.role, r.company].filter(Boolean).join(", ") || r.platform}</span>
                {r.date ? <span class="text-sm text-ink-3">{said(r.date)}</span> : null}
              </p>
              {platformIcon(r.platform) ? <img src={platformIcon(r.platform)} alt={r.platform} class="size-5 shrink-0 self-start" /> : null}
            </div>
            {r.stars ? <Stars value={r.stars} size="size-[18px]" /> : null}
            <blockquote class="line-clamp-5 text-base leading-relaxed">{r.quote}</blockquote>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Every logo of others as one wall, each at one optical height in its own colours. */
export function LogosSection({ id = "logos", heading }: { id?: string; heading?: string }) {
  const items = content.facts.logos;
  if (!items.length) return null;
  return (
    <Section id={id} labelledBy={heading ? `${id}-title` : undefined}>
      {heading ? <h2 id={`${id}-title`} class="text-title">{heading}</h2> : null}
      <ul class="mt-6 flex flex-wrap items-center gap-x-12 gap-y-8">
        {items.map((l) => (
          <li>
            <img src={l.file} alt={l.name} class="h-12 w-auto max-w-48 object-contain" loading="lazy" />
          </li>
        ))}
      </ul>
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
      <ul class="mt-lead grid gap-6 sm:grid-cols-2 md:grid-cols-4">
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
