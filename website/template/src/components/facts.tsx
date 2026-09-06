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

/** Real testimonials from proof.md's items; nothing when there are none. */
export function ProofSection({ id = "proof", heading = "What customers say" }: { id?: string; heading?: string }) {
  const items = content.facts.proof;
  if (!items.length) return null;
  return (
    <Section id={id} labelledBy={`${id}-title`}>
      <h2 id={`${id}-title`} class="max-w-[12ch] text-section">{heading}</h2>
      <ul class="mt-block grid gap-4 md:grid-cols-3">
        {items.map((p) => (
          <li class="rounded-card border border-line bg-surface p-6">
            <blockquote class="font-display text-xl">“{p.quote}”</blockquote>
            <p class="mt-4 text-ink-2">{p.who}{p.date ? `, ${p.date}` : ""}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
