// The style specimen: the same made-up workshop every preset renders, so
// styles compare fairly. Applied by `npm run style -- whimsical --specimen`,
// removed by `npm run style -- --remove-specimen`. Never publish it.
import { Button, Eyebrow, Section } from "../components";
import { site, type Page } from "../site";

const page: Page = {
  path: "/specimen",
  title: "Specimen",
  description: "A specimen page: a made-up workshop rendered in the whimsical style so the style can be seen on real components.",
};

// The squiggle underline, the hover lift, and the sticker are the only CSS
// the tokens do not carry. Reduced motion turns the lift off.
const css = `
.specimen .squiggle { position: relative; display: inline-block; }
.specimen .squiggle svg { position: absolute; left: 0; bottom: -0.12em; width: 100%; height: 0.32em; overflow: visible; }
.specimen a.rounded-control { transition: transform 150ms var(--ease-soft), background-color 150ms var(--ease-soft); }
.specimen a.rounded-control:hover { transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) {
  .specimen a.rounded-control { transition: none; }
  .specimen a.rounded-control:hover { transform: none; }
}
`;

const kitchens = [
  { caption: "Southville, painted ash and oak worktop", tint: "bg-pop-sky" },
  { caption: "Clifton, walnut with a brass rail", tint: "bg-pop-mint" },
  { caption: "Bedminster, birch ply, open shelves", tint: "bg-pop-rose" },
];

const steps = [
  { n: "1", title: "Visit", text: "We measure the room and talk through how you cook.", tint: "bg-pop-sun" },
  { n: "2", title: "Draw", text: "A drawing you can read, with the price on it.", tint: "bg-pop-sky" },
  { n: "3", title: "Build", text: "Everything is made in the workshop on Cumberland Road.", tint: "bg-pop-mint" },
  { n: "4", title: "Fit", text: "The people who built it install it, usually in three days.", tint: "bg-pop-rose" },
];

function Squiggle() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none">
      <path
        d="M3 13 C 22 3, 42 3, 60 13 S 98 23, 118 13 S 156 3, 176 13 S 192 19, 197 11"
        stroke="currentColor"
        stroke-width="6"
        stroke-linecap="round"
      />
    </svg>
  );
}

function Body() {
  return (
    <div class="specimen">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section aria-labelledby="hero-title" class="bg-canvas">
        <div class="mx-auto grid max-w-wide items-center gap-14 px-5 py-section sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <Eyebrow>Specimen: a made-up workshop, to show the style</Eyebrow>
            <h1 id="hero-title" class="mt-6 max-w-[12ch] text-display">
              Kitchens built by the people who <span class="squiggle">fit them.<Squiggle /></span>
            </h1>
            <p class="mt-8 max-w-xl text-lede text-ink-2">
              Harlow Joinery makes fitted kitchens and wardrobes in its own workshop in Bristol, then
              installs them with the same four hands.
            </p>
            <div class="mt-10 flex flex-wrap gap-3">
              <Button href="#visit">Book a workshop visit</Button>
              <Button href="#work" secondary>
                See recent kitchens
              </Button>
            </div>
          </div>

          <div class="relative mt-6 lg:mt-0">
            <div
              role="img"
              aria-label="A type specimen: the display face on a sun-yellow frame"
              class="relative overflow-hidden rounded-frame bg-pop-sun p-8 sm:p-10 lg:py-14"
            >
              <p class="font-display text-specimen text-ink" aria-hidden="true">
                Aa
              </p>
              <p class="mt-4 max-w-xs text-ink">
                {site.fonts.display} for headings, {site.fonts.body} for reading.
              </p>
              <span class="absolute -right-8 -bottom-8 h-32 w-32 rounded-control bg-pop-rose" aria-hidden="true"></span>
            </div>
            <span
              class="absolute -top-5 right-6 -rotate-4 rounded-control bg-surface px-5 py-2 font-display text-title text-ink shadow-lift"
              aria-hidden="true"
            >
              Specimen
            </span>
          </div>
        </div>
      </section>

      <Section id="work" ground="panel" wide labelledBy="work-title">
        <h2 id="work-title" class="max-w-[12ch] text-section">Three kitchens from this year.</h2>
        <ol class="mt-block grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {kitchens.map((k, i) => (
            <li class={i === 0 ? "lg:row-span-2" : ""}>
              <figure class={`relative h-full overflow-hidden rounded-frame ${k.tint} ${i === 0 ? "aspect-4/3 lg:aspect-auto" : "aspect-3/2 lg:aspect-auto lg:min-h-64"}`}>
                <figcaption class="absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] rounded-control bg-surface px-4 py-2 text-base font-semibold text-ink">
                  {k.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="how" labelledBy="how-title">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div class="lg:sticky lg:top-8 lg:self-start">
            <h2 id="how-title" class="max-w-[10ch] text-section">Four steps, one team.</h2>
          </div>
          <ol class="divide-y divide-line border-y border-line">
            {steps.map((s) => (
              <li class="grid gap-4 py-8 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
                <span
                  class={`flex h-14 w-14 items-center justify-center rounded-control font-display text-title text-ink ${s.tint}`}
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <div>
                  <h3 class="text-title">{s.title}</h3>
                  <p class="mt-2 max-w-prose text-ink-2">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section ground="night" wide>
        <div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <p class="max-w-[22ch] font-display text-section">We have never fitted a kitchen we did not build.</p>
          <Button href="#visit">Ask us about yours</Button>
        </div>
      </Section>

      <Section id="visit" wide labelledBy="visit-title">
        <div class="grid items-center gap-8 rounded-frame bg-panel px-8 py-12 sm:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-16">
          <h2 id="visit-title" class="max-w-[12ch] text-section">Come and see the workshop.</h2>
          <div>
            <p class="max-w-md text-lede text-ink-2">Open Tuesday to Saturday, nine to five. Cumberland Road, Bristol.</p>
            <div class="mt-8">
              <Button href="#visit">Book a workshop visit</Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export const Specimen = { page, Body };
