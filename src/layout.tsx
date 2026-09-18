// The document around every page: head, header, footer. Pages supply the
// <main> content. Name, fonts, logo, and contact details come from src/site.ts.
import { html, raw } from "hono/html";
import type { Child } from "hono/jsx";
import { site, pageTitle, logoUrl, canonicalUrl, formatHours, type Page } from "./site";

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
        {canonicalUrl(page.path) ? <link rel="canonical" href={canonicalUrl(page.path)!} /> : null}
        {(page.jsonLd ?? []).map((obj) => (
          <script type="application/ld+json">{raw(JSON.stringify(obj))}</script>
        ))}
        <Tracking />
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

// Analytics and verification carried over from the old site (src/site.ts,
// `tracking`). Nothing renders when the IDs are empty.
function Tracking() {
  const t = site.tracking;
  const id = (v: string) => /^[A-Za-z0-9_-]+$/.test(v) ? v : "";
  return (
    <>
      {id(t.searchConsole) ? <meta name="google-site-verification" content={id(t.searchConsole)} /> : null}
      {id(t.ga4) ? (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${id(t.ga4)}`}></script>
          <script>{raw(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id(t.ga4)}');`)}</script>
        </>
      ) : null}
      {id(t.metaPixel) ? (
        <script>{raw(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id(t.metaPixel)}');fbq('track','PageView');`)}</script>
      ) : null}
    </>
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
            {contact.hours ? <p>{formatHours(contact.hours)}</p> : null}
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
