// The style specimen: one made-up business (Harlow Joinery) composed the way
// the luxury preset composes, so presets can be compared on the same words.
// Added by `npm run style -- luxury --specimen`; never published.
import { Button, Eyebrow, Section } from "../components";
import type { Page } from "../site";

const page: Page = {
  path: "/specimen",
  title: "Specimen",
  description: "A specimen page: a made-up workshop, shown in the luxury style so the style can be seen on real components.",
};

const kitchens = [
  { caption: "Southville, painted ash and oak worktop", wide: true },
  { caption: "Clifton, walnut with a brass rail", wide: false },
  { caption: "Bedminster, birch ply, open shelves", wide: false },
];

const steps = [
  { numeral: "I", name: "Visit", text: "We measure the room and talk through how you cook." },
  { numeral: "II", name: "Draw", text: "A drawing you can read, with the price on it." },
  { numeral: "III", name: "Build", text: "Everything is made in the workshop on Cumberland Road." },
  { numeral: "IV", name: "Fit", text: "The people who built it install it, usually in three days." },
];

function Body() {
  return (
    <>
      {/* Hero: quiet and asymmetric. The h1 sits on a hairline baseline; the
          lede is set narrow, to the right, on a lower line. The empty space
          is the point. */}
      <section aria-labelledby="hero-title" class="bg-canvas text-ink">
        <div class="mx-auto max-w-wide px-5 pt-section pb-section sm:px-8">
          <Eyebrow>Specimen: a made-up workshop, to show the style</Eyebrow>
          <h1 id="hero-title" class="mt-16 max-w-[12ch] border-b border-line pb-6 text-display sm:mt-24">
            <em class="italic font-normal">Kitchens</em> built by the people who fit them.
          </h1>
          <div class="grid gap-10 pt-10 lg:grid-cols-12 lg:pt-16">
            <p class="text-lede text-ink-2 lg:col-span-5 lg:col-start-8">
              Harlow Joinery makes fitted kitchens and wardrobes in its own workshop in Bristol, then
              installs them with the same four hands.
            </p>
            <div class="flex flex-wrap items-center gap-x-10 gap-y-4 lg:col-span-5 lg:col-start-8">
              <Button href="#visit">Book a workshop visit</Button>
              <a
                href="#work"
                class="inline-flex min-h-12 items-center text-base font-medium text-accent underline transition-colors duration-200 ease-soft hover:text-accent-hover"
              >
                See recent kitchens
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The work: one wide frame and two small ones, tracked captions inside
          each, and the page's single gilt hairline above the set. */}
      <Section id="work" ground="panel" wide labelledBy="work-title">
        <div class="grid gap-8 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <Eyebrow>The work</Eyebrow>
          </div>
          <h2 id="work-title" class="max-w-[14ch] text-section lg:col-span-8 lg:col-start-5">
            Three kitchens from this year.
          </h2>
        </div>
        <div class="mt-block border-t border-gilt pt-8">
          <ul class="grid gap-8 sm:grid-cols-2">
            {kitchens.map((k) => (
              <li class={k.wide ? "sm:col-span-2" : ""}>
                <figure
                  class={`flex flex-col justify-end rounded-frame border border-line bg-surface p-6 sm:p-8 ${
                    k.wide ? "min-h-96 lg:min-h-144" : "min-h-80 lg:min-h-96"
                  }`}
                >
                  <figcaption class="text-label uppercase text-ink-3">{k.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How it goes: widely spaced rows, roman numerals in the display face. */}
      <Section id="how" labelledBy="how-title">
        <div class="grid gap-8 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <Eyebrow>How it goes</Eyebrow>
          </div>
          <h2 id="how-title" class="max-w-[14ch] text-section lg:col-span-8 lg:col-start-5">
            Four steps, one team.
          </h2>
        </div>
        <ol class="mt-block divide-y divide-line border-y border-line">
          {steps.map((s) => (
            <li class="grid gap-4 py-12 sm:grid-cols-12 sm:gap-8 lg:py-16">
              <span aria-hidden="true" class="font-display text-title text-ink-3 sm:col-span-2 lg:col-span-1">
                {s.numeral}
              </span>
              <h3 class="text-title sm:col-span-3 lg:col-span-3 lg:col-start-5">{s.name}</h3>
              <p class="max-w-md text-ink-2 sm:col-span-7 lg:col-span-4 lg:col-start-8">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* The statement band: night ground, the sentence in Bodoni italic. */}
      <Section ground="night" wide labelledBy="band-title">
        <div class="grid gap-10 lg:grid-cols-12">
          <p id="band-title" class="font-display text-section italic lg:col-span-9">
            We have never fitted a kitchen we did not build.
          </p>
          <p class="lg:col-span-3 lg:col-start-10 lg:self-end lg:text-right">
            <a
              href="#visit"
              class="inline-flex min-h-12 items-center text-base font-medium text-night-ink underline transition-colors duration-200 ease-soft hover:text-night-ink-2"
            >
              Ask us about yours
            </a>
          </p>
        </div>
      </Section>

      {/* Visit: the only centred section. The hours sit on two lines. */}
      <Section id="visit" labelledBy="visit-title">
        <div class="mx-auto max-w-xl text-center">
          <Eyebrow>Visit</Eyebrow>
          <h2 id="visit-title" class="mt-8 text-section">
            Come and see the workshop.
          </h2>
          <p class="mt-8 text-lede text-ink-2">
            Open Tuesday to Saturday, nine to five.
            <br />
            Cumberland Road, Bristol.
          </p>
          <div class="mt-10 flex justify-center">
            <Button href="#visit">Book a workshop visit</Button>
          </div>
        </div>
      </Section>
    </>
  );
}

export const Specimen = { page, Body };
