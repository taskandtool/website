// The document around every page: head, header, footer. Pages supply the
// <main> content. Name, fonts, logo, and contact details come from src/site.ts.
import { html, raw } from "hono/html";
import type { Child } from "hono/jsx";
import { site, pageTitle, logoUrl, type Page } from "./site";

export function Layout({ page, children }: { page: Page; children?: Child }) {
  return (
    <html lang={site.locale || "en"}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle(page)}</title>
        <meta name="description" content={page.description} />
        <meta property="og:title" content={pageTitle(page)} />
        <meta property="og:description" content={page.description} />
        <meta property="og:type" content="website" />
        {site.fonts.googleFontsUrl ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
            <link rel="stylesheet" href={site.fonts.googleFontsUrl} />
          </>
        ) : null}
        <link rel="stylesheet" href="/site.css" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body class="min-h-screen bg-canvas text-ink font-body">
        <a
          href="#main"
          class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Header current={page.path} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header({ current }: { current: string }) {
  return (
    <header class="border-b border-line">
      <div class="mx-auto flex max-w-wide items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <a href="/" class="no-underline" aria-label={`${site.name} home`}>
          <Wordmark />
        </a>
        <nav aria-label="Main">
          <ul class="flex items-center gap-x-6 gap-y-2 text-base font-medium">
            {site.nav.map((item) => (
              <li>
                <a
                  href={item.href}
                  class="no-underline text-ink-2 hover:text-ink"
                  aria-current={item.href === current ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function Wordmark() {
  const logo = logoUrl();
  if (logo) {
    return <img src={logo} alt={site.logo.alt || site.name} class="h-8 w-auto" />;
  }
  return <span class="font-display text-xl font-semibold">{site.name}</span>;
}

function Footer() {
  const { contact } = site;
  const hasContact = contact.phone || contact.email || contact.address || contact.hours;
  return (
    <footer class="bg-night text-night-ink">
      <div class="mx-auto grid max-w-wide gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto]">
        <div>
          <p class="font-display text-title">{site.name}</p>
          {site.tagline ? <p class="mt-2 max-w-md text-night-ink-2">{site.tagline}</p> : null}
        </div>
        {hasContact ? (
          <address class="not-italic text-night-ink-2">
            {contact.phone ? <p><a href={`tel:${contact.phone}`} class="no-underline hover:text-night-ink">{contact.phone}</a></p> : null}
            {contact.email ? <p><a href={`mailto:${contact.email}`} class="no-underline hover:text-night-ink">{contact.email}</a></p> : null}
            {contact.address ? <p>{contact.address}</p> : null}
            {contact.hours ? <p>{contact.hours}</p> : null}
          </address>
        ) : null}
      </div>
      <div class="border-t border-line-on-night">
        <p class="mx-auto max-w-wide px-5 py-5 text-sm text-night-ink-2 sm:px-8">
          © {site.year} {site.name}
        </p>
      </div>
    </footer>
  );
}

/** A full document for a page: the doctype plus the layout. */
export function render(page: Page, body: Child) {
  return html`<!doctype html>${raw(String(<Layout page={page}>{body}</Layout>))}`;
}
