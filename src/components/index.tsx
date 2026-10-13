// The site's small set of shared pieces (the first screen is Hero; the sections that render from the
// notes are in facts.tsx: ServicesSection, FaqSection, ContactSection, and the
// proof: RatingLine, Stars, ReviewsSection, LogosSection, PeopleSection,
// NumbersSection). Add to this file as pages need
// them; keep each one a plain function that returns markup. DESIGN.md says
// how each should look and behave.
import type { Child } from "hono/jsx";

/** A section with the standard vertical rhythm and a ground, on the site's one frame (its left edge lines up with the header's). */
export function Section({
  id,
  ground = "canvas",
  wide = false,
  labelledBy,
  children,
}: {
  id?: string;
  ground?: "canvas" | "panel" | "night";
  wide?: boolean;
  labelledBy?: string;
  children?: Child;
}) {
  const grounds = {
    canvas: "bg-canvas text-ink",
    panel: "bg-panel text-ink",
    night: "bg-night text-night-ink",
  };
  return (
    <section id={id} class={grounds[ground]} aria-labelledby={labelledBy}>
      {/* every band shares the header's and footer's frame, so their left edges line up; a reading section narrows its column inside it */}
      <div class="mx-auto max-w-wide px-5 py-section sm:px-8">
        {wide ? children : <div class="max-w-content">{children}</div>}
      </div>
    </section>
  );
}

/**
 * The first screen: a photograph (or a short muted video) full-bleed behind
 * the words, under a scrim so they read; `focal` is its object-position.
 * Without either, the words on the night ground.
 */
export function Hero({
  image,
  alt = "",
  video,
  focal = "center",
  labelledBy,
  children,
}: {
  image?: string;
  alt?: string;
  video?: string;
  focal?: string;
  labelledBy?: string;
  children?: Child;
}) {
  const media = video ? (
    <video class="absolute inset-0 -z-20 size-full object-cover" src={video} poster={image} autoplay muted loop playsinline />
  ) : image ? (
    <img class="absolute inset-0 -z-20 size-full object-cover" src={image} alt={alt} style={`object-position: ${focal}`} fetchpriority="high" />
  ) : null;
  return (
    <section aria-labelledby={labelledBy} class="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-night text-night-ink">
      {media}
      {media ? (
        <>
          <div aria-hidden="true" class="scrim-up absolute inset-0 -z-10 lg:hidden" />
          <div aria-hidden="true" class="scrim absolute inset-0 -z-10 hidden lg:block" />
        </>
      ) : null}
      <div class="mx-auto w-full max-w-wide px-5 py-section sm:px-8">
        <div class="max-w-2xl" data-rise>{children}</div>
      </div>
    </section>
  );
}

/** The primary action: one per section at most. */
export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children?: Child;
  secondary?: boolean;
}) {
  const look = secondary
    ? "border border-line-strong text-ink hover:bg-panel"
    : "bg-accent text-accent-ink hover:bg-accent-hover";
  return (
    <a
      href={href}
      class={`inline-flex min-h-12 items-center justify-center rounded-control px-5 text-base font-semibold no-underline transition-colors duration-150 ease-soft ${look}`}
    >
      {children}
    </a>
  );
}
