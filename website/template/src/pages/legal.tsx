// Legal pages render the owner's text verbatim (legal/*.md) inside the
// page shell. The AI never rewrites them; it may point out gaps.
import { raw } from "hono/html";
import { Section } from "../components";
import type { content } from "../content";
import { site, type Page } from "../site";

export function legalPage(doc: (typeof content.legal)[number]): { page: Page; Body: () => any } {
  const page: Page = {
    path: doc.path,
    title: doc.title,
    description: `${doc.title} for ${site.name}: the full text as it applies to this website and its services.`,
  };
  const Body = () => (
    <Section labelledBy="legal-title">
      <h1 id="legal-title" class="max-w-[16ch] text-section">{doc.title}</h1>
      {doc.updated ? <p class="mt-4 text-label uppercase text-ink-3">Updated {doc.updated}</p> : null}
      <div class="prose mt-block max-w-prose">{raw(doc.html)}</div>
    </Section>
  );
  return { page, Body };
}
