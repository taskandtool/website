// The specimen page for the brutalist preset: a made-up workshop, composed
// the way this style composes. It exists so the owner can see the style on
// real components before the brand is applied; `npm run style -- --remove-specimen`
// takes it out, and it is never published.
import { Eyebrow, Section } from "../components";
import type { Page } from "../site";

const page: Page = {
  path: "/specimen",
  title: "Specimen",
  description: "A specimen page: a made-up workshop, to show the brutalist style on real components.",
};

const kitchens = [
  { n: "01", caption: "Southville, painted ash and oak worktop" },
  { n: "02", caption: "Clifton, walnut with a brass rail" },
  { n: "03", caption: "Bedminster, birch ply, open shelves" },
];

const steps = [
  { n: "01", title: "Visit", text: "We measure the room and talk through how you cook." },
  { n: "02", title: "Draw", text: "A drawing you can read, with the price on it." },
  { n: "03", title: "Build", text: "Everything is made in the workshop on Cumberland Road." },
  { n: "04", title: "Fit", text: "The people who built it install it, usually in three days." },
];

/** The action this style wants: a bordered rectangle on a hard shadow that
 *  shifts on hover and presses flat on active. This is the look `Button` in
 *  src/components takes when the preset is applied (DESIGN.md: Component
 *  Stylings); the specimen carries it inline so it renders before that edit. */
function Action({
  href,
  children,
  secondary = false,
  onNight = false,
}: {
  href: string;
  children?: string;
  secondary?: boolean;
  onNight?: boolean;
}) {
  const fill = secondary
    ? "bg-surface text-ink hover:bg-panel"
    : "bg-accent text-accent-ink hover:bg-accent-hover";
  const edge = onNight ? "border-line-on-night shadow-hard-on-night" : "border-line shadow-hard";
  return (
    <a
      href={href}
      class={`inline-flex min-h-12 items-center justify-center border-2 px-6 font-mono text-base font-medium uppercase no-underline transition-all duration-150 ease-soft hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-hard-sm active:translate-x-1.5 active:translate-y-1.5 active:shadow-none ${fill} ${edge}`}
    >
      {children}
    </a>
  );
}

function Body() {
  return (
    <>
      {/* Hero: one heavy bordered block on a hard shadow. The h1 runs to the
          edge; the giant word in the bottom frame is the page's signature. */}
      <section aria-labelledby="hero-title" class="bg-canvas">
        <div class="mx-auto max-w-wide px-5 py-section sm:px-8">
          <div class="border-2 border-line bg-surface shadow-hard">
            <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-line px-5 py-3 font-mono sm:px-8">
              <Eyebrow>Specimen: a made-up workshop, to show the style</Eyebrow>
              <p class="text-label uppercase text-ink-3">Harlow Joinery</p>
            </div>
            <div class="px-5 py-8 sm:px-8 sm:py-12">
              <h1 id="hero-title" class="font-stretch-expanded text-display uppercase">
                Kitchens built by the people who fit them.
              </h1>
              <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
                <p class="max-w-2xl text-lede text-ink-2">
                  Harlow Joinery makes fitted kitchens and wardrobes in its own workshop in
                  Bristol, then installs them with the same four hands.
                </p>
                <div class="flex flex-wrap gap-4 pb-1.5 pr-1.5">
                  <Action href="#visit">Book a workshop visit</Action>
                  <Action href="#work" secondary>
                    See recent kitchens
                  </Action>
                </div>
              </div>
            </div>
            <div
              role="img"
              aria-label="The word MADE set very large in the display face"
              class="flex flex-wrap items-end justify-between gap-6 border-t-2 border-line bg-panel px-5 pb-4 pt-6 sm:px-8"
            >
              <p class="font-display font-stretch-expanded text-specimen uppercase" aria-hidden="true">
                Made
              </p>
              <p class="pb-2 font-mono text-label uppercase text-ink-3">Fitted kitchens and wardrobes</p>
            </div>
          </div>
        </div>
      </section>

      {/* The work: three bordered strips stacked into one table, a big mono
          index on the left and the photo slot with its caption on the right. */}
      <Section id="work" ground="panel" labelledBy="work-title">
        <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 id="work-title" class="max-w-[16ch] text-section uppercase">
            Three kitchens from this year.
          </h2>
          <p class="font-mono text-label uppercase text-ink-3">Photos to come, one per strip</p>
        </div>
        <ol class="mt-block divide-y-2 divide-line border-2 border-line bg-surface">
          {kitchens.map((k) => (
            <li class="grid sm:grid-cols-[7rem_minmax(0,1fr)]">
              <p class="border-line bg-canvas px-5 py-5 font-mono text-section sm:border-r-2" aria-hidden="true">
                {k.n}
              </p>
              <div class="flex min-h-64 flex-col justify-between gap-10 px-5 py-5 sm:px-8">
                <p class="font-mono text-label uppercase text-ink-3">Photo slot, kitchen {k.n}</p>
                <p class="font-mono text-lede text-ink">{k.caption}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* How it goes: a numbered grid; the black lines between the cells are
          the grid's gap showing the line colour through. */}
      <Section id="how" labelledBy="how-title">
        <h2 id="how-title" class="max-w-[12ch] text-section uppercase">
          Four steps, one team.
        </h2>
        <ol class="mt-block grid gap-0.5 border-2 border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li class="flex flex-col bg-canvas px-5 py-6 sm:px-6">
              <p class="font-mono text-section text-ink" aria-hidden="true">
                {s.n}
              </p>
              <h3 class="mt-8 text-title uppercase">{s.title}</h3>
              <p class="mt-3 max-w-prose text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* The band: inverted, one sentence, the accent as a solid bar. */}
      <Section ground="night">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <span class="block h-3 w-28 bg-accent" aria-hidden="true"></span>
            <p class="mt-8 max-w-[16ch] font-display text-section uppercase">
              We have never fitted a kitchen we did not build.
            </p>
          </div>
          <div class="pb-1.5 pr-1.5">
            <Action href="#visit" onNight>
              Ask us about yours
            </Action>
          </div>
        </div>
      </Section>

      {/* Visit: the contact block as a bordered ticket with a dashed stub. */}
      <Section id="visit" labelledBy="visit-title">
        <div class="grid border-2 border-line bg-surface shadow-hard lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div class="px-5 py-8 sm:px-8 sm:py-10">
            <p class="font-mono text-label uppercase text-ink-3">Workshop visit</p>
            <h2 id="visit-title" class="mt-5 max-w-[12ch] text-section uppercase">
              Come and see the workshop.
            </h2>
            <p class="mt-8 max-w-xl text-lede text-ink-2">
              Open Tuesday to Saturday, nine to five. Cumberland Road, Bristol.
            </p>
          </div>
          <div class="flex flex-col justify-between gap-10 border-t-2 border-dashed border-line bg-panel px-5 py-8 sm:px-8 lg:border-l-2 lg:border-t-0">
            <div>
              <p class="font-mono text-label uppercase text-ink-3">Open</p>
              <p class="mt-2 font-mono text-title">Tue to Sat</p>
            </div>
            <div class="pb-1.5 pr-1.5">
              <Action href="#visit">Book a workshop visit</Action>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export const Specimen = { page, Body };
