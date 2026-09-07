// The specimen page for the cinematic style: a made-up joinery workshop,
// rendered with the real components so the style can be seen on this
// machine. Added by `npm run style -- cinematic --specimen`, removed by
// `npm run style -- --remove-specimen`. Never published.
import { raw } from "hono/html";
import { Button, Eyebrow, Section } from "../components";
import type { Page } from "../site";

const page: Page = {
  path: "/specimen",
  title: "Specimen",
  description:
    "A specimen page for the cinematic style: a made-up workshop, shown with the real components so the style can be judged. Not a real business.",
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

// The signature: the hero's text rises 24px and fades in on load, one line
// after another, 60ms apart. Nothing else on the page moves except hover
// and focus. Reduced motion shows the finished state and animates nothing.
const css = `
@keyframes rise { from { opacity: 0; translate: 0 24px; } to { opacity: 1; translate: 0 0; } }
.rise { animation: rise 800ms cubic-bezier(0.2, 0, 0, 1) both; }
.rise-2 { animation-delay: 60ms; }
.rise-3 { animation-delay: 120ms; }
.rise-4 { animation-delay: 180ms; }
.strip { scroll-snap-type: x mandatory; scrollbar-width: none; }
.strip > li { scroll-snap-align: start; }
@media (prefers-reduced-motion: reduce) {
  .rise { animation: none; opacity: 1; translate: none; }
}
`;

function Body() {
  return (
    <>
      <style>{raw(css)}</style>

      <section aria-labelledby="hero-title" class="bg-canvas text-ink">
        <div class="mx-auto max-w-wide px-5 pt-14 pb-section sm:px-8 lg:pt-24">
          <div class="rise">
            <Eyebrow>Specimen: a made-up workshop, to show the style</Eyebrow>
          </div>
          <h1 id="hero-title" class="rise rise-2 mt-6 max-w-[14ch] text-display">
            Kitchens built by the people who fit them.
          </h1>
          <div
            role="img"
            aria-label="Photo slot: the workshop floor on Cumberland Road, wide, lit from one window"
            class="mt-block flex aspect-[4/3] items-end rounded-frame border border-line bg-surface p-5 shadow-lift sm:aspect-[21/9] sm:p-8"
          >
            <p class="text-label uppercase text-ink-3">Photo: the workshop floor, wide, one window of light</p>
          </div>
          <div class="mt-block grid gap-8 lg:grid-cols-2 lg:gap-16">
            <p class="rise rise-3 max-w-xl text-lede text-ink-2 lg:col-start-2">
              Harlow Joinery makes fitted kitchens and wardrobes in its own workshop in Bristol, then
              installs them with the same four hands.
            </p>
            <div class="rise rise-4 flex flex-wrap gap-3 lg:col-start-2">
              <Button href="#visit">Book a workshop visit</Button>
              <Button href="#work" secondary>
                See recent kitchens
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section id="work" ground="panel" wide labelledBy="work-title">
        <h2 id="work-title" class="max-w-[12ch] text-section">
          Three kitchens from this year.
        </h2>
        <ul
          class="strip mt-block flex gap-5 overflow-x-auto border-y border-line py-6 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:py-8"
          aria-label="Three kitchens"
        >
          {kitchens.map((k) => (
            <li class="w-[78vw] shrink-0 sm:w-auto">
              <div
                role="img"
                aria-label={`Photo slot: ${k.caption}`}
                class="flex aspect-video flex-col justify-between rounded-card border border-line bg-surface p-4"
              >
                <span class="font-display text-title text-ink-3">{k.n}</span>
                <span class="text-label uppercase text-ink-3">Photo</span>
              </div>
              <p class="mt-4 text-ink-2">{k.caption}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how" labelledBy="how-title">
        <h2 id="how-title" class="max-w-[12ch] text-section">
          Four steps, one team.
        </h2>
        <ol class="mt-block divide-y divide-line border-y border-line">
          {steps.map((s) => (
            <li class="grid gap-4 py-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] sm:items-end sm:gap-10">
              <span class="font-display text-display text-ink-3" aria-hidden="true">
                {s.n}
              </span>
              <div class="sm:pb-3">
                <h3 class="text-title">{s.title}</h3>
                <p class="mt-3 max-w-prose text-ink-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <section aria-labelledby="band-title" class="bg-night text-night-ink">
        <div class="mx-auto max-w-wide px-5 py-section sm:px-8 lg:py-48">
          <h2 id="band-title" class="max-w-[18ch] text-display">
            We have never fitted a kitchen we did not build.
          </h2>
          <div class="mt-12">
            <Button href="#visit">Ask us about yours</Button>
          </div>
        </div>
      </section>

      <Section id="visit" labelledBy="visit-title">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <h2 id="visit-title" class="max-w-[12ch] text-section">
              Come and see the workshop.
            </h2>
            <div class="mt-10">
              <Button href="#visit">Book a workshop visit</Button>
            </div>
          </div>
          <div class="rounded-card border border-line bg-surface p-6 shadow-lift sm:p-8">
            <p class="text-label uppercase text-ink-3">Hours and where</p>
            <p class="mt-4 text-lede">Open Tuesday to Saturday, nine to five. Cumberland Road, Bristol.</p>
          </div>
        </div>
      </Section>
    </>
  );
}

export const Specimen = { page, Body };
