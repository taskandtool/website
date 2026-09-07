// The specimen page of the editorial style: one made-up workshop, composed
// the way this style composes. It exists so the style can be seen with real
// components on this machine. Never publish it (npm run style -- --remove-specimen).
import { Button, Eyebrow, Section } from "../components";
import type { Page } from "../site";

const page: Page = {
  path: "/specimen",
  title: "Specimen",
  description: "A specimen page: a made-up workshop, to show the editorial style with real components.",
};

const kitchens = [
  { n: "01", caption: "Southville, painted ash and oak worktop" },
  { n: "02", caption: "Clifton, walnut with a brass rail" },
  { n: "03", caption: "Bedminster, birch ply, open shelves" },
];

const steps = [
  { n: "1", title: "Visit", text: "We measure the room and talk through how you cook." },
  { n: "2", title: "Draw", text: "A drawing you can read, with the price on it." },
  { n: "3", title: "Build", text: "Everything is made in the workshop on Cumberland Road." },
  { n: "4", title: "Fit", text: "The people who built it install it, usually in three days." },
];

function Body() {
  return (
    <>
      {/* The front page: a masthead rule, the headline across most of the
          grid, the lede and actions in the narrow column beside it. */}
      <section aria-labelledby="hero-title" class="bg-canvas text-ink">
        <div class="mx-auto max-w-wide px-5 sm:px-8">
          <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-3 pb-3">
            <Eyebrow>Specimen: a made-up workshop, to show the style</Eyebrow>
            <p class="text-label uppercase text-ink-3">Harlow Joinery, Bristol</p>
          </div>
          <div class="grid gap-y-10 border-t border-line pt-10 pb-section lg:grid-cols-12 lg:gap-x-10 lg:pt-14">
            <h1 id="hero-title" class="text-display lg:col-span-8">
              Kitchens built by the people who <em class="italic">fit</em> them.
            </h1>
            <div class="border-t border-line pt-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-1 lg:pl-10">
              <p class="text-lede text-ink-2">
                Harlow Joinery makes fitted kitchens and wardrobes in its own workshop in Bristol,
                then installs them with the same four hands.
              </p>
              <div class="mt-10 flex flex-col items-start gap-3">
                <Button href="#visit">Book a workshop visit</Button>
                <Button href="#work" secondary>
                  See recent kitchens
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The work: a numbered contact sheet. Three equal frames because the
          three kitchens are comparable objects; a caption bar and a rule,
          not a card. */}
      <Section id="work" ground="panel" wide labelledBy="work-title">
        <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-line pb-6">
          <h2 id="work-title" class="max-w-[14ch] text-section">
            Three kitchens from this year.
          </h2>
          <p class="text-label uppercase text-ink-3">The work, 01 to 03</p>
        </div>
        <ol class="mt-block grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {kitchens.map((k) => (
            <li class="flex flex-col border border-line-strong bg-surface">
              <div
                role="img"
                aria-label={`Photograph to follow: ${k.caption}`}
                class="flex aspect-[4/5] items-start p-4"
              >
                <span class="text-label uppercase text-ink-3" aria-hidden="true">
                  Photograph to follow
                </span>
              </div>
              <div class="grid grid-cols-[3rem_1fr] items-baseline gap-3 border-t border-line-strong px-4 py-4">
                <span class="font-display text-title text-ink-3">{k.n}</span>
                <p class="text-base text-ink">{k.caption}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* How it goes: a ruled, numbered list with big serif numerals. */}
      <Section id="how" labelledBy="how-title">
        <div class="grid gap-y-6 border-b border-line pb-6 lg:grid-cols-12 lg:gap-x-10">
          <p class="text-label uppercase text-ink-3 lg:col-span-3">How it goes</p>
          <h2 id="how-title" class="max-w-[14ch] text-section lg:col-span-9">
            Four steps, one team.
          </h2>
        </div>
        <ol class="divide-y divide-line">
          {steps.map((s) => (
            <li class="grid gap-x-10 gap-y-2 py-8 sm:grid-cols-[5rem_1fr] lg:grid-cols-12">
              <span class="font-display text-numeral text-ink lg:col-span-3" aria-hidden="true">
                {s.n}.
              </span>
              <div class="lg:col-span-9 lg:grid lg:grid-cols-9 lg:gap-x-10">
                <h3 class="text-title lg:col-span-3">
                  <span class="sr-only">Step {s.n}: </span>
                  {s.title}
                </h3>
                <p class="mt-2 max-w-prose text-ink-2 lg:col-span-6 lg:mt-1">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* The statement band: one sentence in the serif italic on night. */}
      <Section ground="night" wide labelledBy="band-title">
        <div class="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <h2 id="band-title" class="max-w-[22ch] font-display text-section italic lg:col-span-9">
            We have never fitted a kitchen we did not build.
          </h2>
          <div class="border-t border-line-on-night pt-6 lg:col-span-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <a
              href="#visit"
              class="inline-flex min-h-12 items-center justify-center rounded-control border border-night-ink px-5 text-base font-semibold text-night-ink no-underline transition-colors duration-150 ease-soft hover:bg-night-ink hover:text-night"
            >
              Ask us about yours
            </a>
          </div>
        </div>
      </Section>

      {/* Visit: a two-column colophon. */}
      <Section id="visit" ground="panel" labelledBy="visit-title">
        <div class="grid gap-y-8 border-t-2 border-ink pt-8 lg:grid-cols-12 lg:gap-x-10">
          <div class="lg:col-span-6">
            <p class="text-label uppercase text-ink-3">Visit</p>
            <h2 id="visit-title" class="mt-4 max-w-[12ch] text-section">
              Come and see the workshop.
            </h2>
          </div>
          <div class="border-t border-line pt-8 lg:col-span-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p class="max-w-prose text-lede text-ink-2">
              Open Tuesday to Saturday, nine to five. Cumberland Road, Bristol.
            </p>
            <div class="mt-10">
              <Button href="#visit">Book a workshop visit</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export const Specimen = { page, Body };
