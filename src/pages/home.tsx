// The home page as it ships: one line that says the site is waiting to be
// made, so a site deployed on day one shows a clean page. The AI replaces it
// with the business's homepage (the new-site and design skills).
import { content, faqJsonLd, localBusinessJsonLd } from "../content";
import { site, type Page } from "../site";

const page: Page = {
  path: "/",
  title: "Home",
  description: site.description,
  // The structured data the home page carries, from the notes (FACTS.md):
  // nothing renders until the business note has a name.
  jsonLd: [
    ...(content.facts.business ? [localBusinessJsonLd(content.facts.business, site.url)] : []),
    ...(content.facts.faq.length ? [faqJsonLd(content.facts.faq)!] : []),
  ],
};

function Body() {
  return (
    <section aria-labelledby="welcome-title" class="bg-canvas">
      <div class="mx-auto flex min-h-[70vh] max-w-wide flex-col justify-center px-5 py-section sm:px-8">
        <h1 id="welcome-title" class="text-display">
          Welcome.
        </h1>
        <p class="mt-6 max-w-xl text-lede text-ink-2">
          Chat with AI to get this site up and running.
        </p>
      </div>
    </section>
  );
}

export const Home = { page, Body };
