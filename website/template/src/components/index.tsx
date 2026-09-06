// The site's small set of shared pieces (the sections that render from the
// notes are in facts.tsx: ServicesSection, FaqSection, ContactSection, ProofSection). Add to this file as pages need
// them; keep each one a plain function that returns markup. DESIGN.md says
// how each should look and behave.
import type { Child } from "hono/jsx";

/** A section with the standard vertical rhythm and a ground. */
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
      <div class={`mx-auto px-5 py-section sm:px-8 ${wide ? "max-w-wide" : "max-w-content"}`}>
        {children}
      </div>
    </section>
  );
}

/** The small line above a heading. Use it only when it adds orientation. */
export function Eyebrow({ children }: { children?: Child }) {
  return <p class="text-label uppercase text-ink-3">{children}</p>;
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
