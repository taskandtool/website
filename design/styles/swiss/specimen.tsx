// The specimen page for the swiss preset: a made-up joinery workshop, set
// on a visible twelve-column grid. It exists so the style can be seen with
// real components on this machine; never publish it
// (npm run style -- --remove-specimen takes it out).
import { Button, Eyebrow, Section } from "../components";
import type { Page } from "../site";

const page: Page = {
  path: "/specimen",
  title: "Specimen",
  description: "A specimen page for the swiss style: a made-up workshop, to show the style on real components.",
};

const index = [
  { n: "01", label: "The work", href: "#work" },
  { n: "02", label: "How it goes", href: "#how" },
  { n: "03", label: "One rule", href: "#rule" },
  { n: "04", label: "Visit", href: "#visit" },
];

const kitchens = [
  { n: "1", place: "Southville,", rest: "painted ash and oak worktop" },
  { n: "2", place: "Clifton,", rest: "walnut with a brass rail" },
  { n: "3", place: "Bedminster,", rest: "birch ply, open shelves" },
];

const steps = [
  { n: "1", title: "Visit", text: "We measure the room and talk through how you cook." },
  { n: "2", title: "Draw", text: "A drawing you can read, with the price on it." },
  { n: "3", title: "Build", text: "Everything is made in the workshop on Cumberland Road." },
  { n: "4", title: "Fit", text: "The people who built it install it, usually in three days." },
];

const hours: { day: string; time: string; num?: boolean }[] = [
  { day: "Tuesday to Saturday", time: "09:00 to 17:00", num: true },
  { day: "Sunday and Monday", time: "Closed" },
  { day: "Workshop", time: "Cumberland Road, Bristol" },
];

/** The running head every section starts with: a rule, the section number, its title. */
function RunningHead({ n, title, night = false }: { n: string; title: string; night?: boolean }) {
  const rule = night ? "border-night-ink" : "border-line-strong";
  const tone = night ? "text-night-ink-2" : "text-ink-3";
  return (
    <div class={`grid grid-cols-12 gap-x-4 border-t ${rule} pt-3`} aria-hidden="true">
      <span class={`col-span-2 text-label uppercase tabular-nums lg:col-span-1 ${tone}`}>{n}</span>
      <span class={`col-span-10 text-label uppercase lg:col-span-11 ${tone}`}>{title}</span>
    </div>
  );
}

function Body() {
  return (
    <>
      {/* 00 Hero: the twelve columns are drawn once, here, behind the composition */}
      <section aria-labelledby="specimen-title" class="relative bg-canvas text-ink">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 mx-auto hidden max-w-wide grid-cols-12 gap-x-4 px-5 sm:px-8 lg:grid"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div class={i === 11 ? "border-x border-line" : "border-l border-line"}></div>
          ))}
        </div>
        <div class="relative mx-auto max-w-wide px-5 pt-6 pb-section sm:px-8">
          <div class="grid grid-cols-12 gap-x-4 border-t border-line-strong pt-3">
            <span class="col-span-2 text-label uppercase tabular-nums text-ink-3 lg:col-span-1" aria-hidden="true">
              00
            </span>
            <div class="col-span-10 lg:col-span-11">
              <Eyebrow>Specimen: a made-up workshop, to show the style</Eyebrow>
            </div>
          </div>
          <div class="mt-16 grid grid-cols-12 gap-x-4 gap-y-10 lg:mt-24 lg:gap-y-12">
            <h1 id="specimen-title" class="col-span-12 text-display lg:col-span-8">
              Kitchens built by the people who fit them.
            </h1>
            <p class="col-span-12 text-lede text-ink-2 lg:col-span-6">
              Harlow Joinery makes fitted kitchens and wardrobes in its own workshop in Bristol, then installs
              them with the same four hands.
            </p>
            <div class="col-span-12 flex flex-wrap gap-3 lg:col-span-8">
              <Button href="#visit">Book a workshop visit</Button>
              <Button href="#work" secondary>
                See recent kitchens
              </Button>
            </div>
            <nav
              aria-label="Sections"
              class="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-3 lg:self-start"
            >
              <p class="text-label uppercase text-ink-3">Contents</p>
              <ol class="mt-3 border-b border-line">
                {index.map((item) => (
                  <li class="border-t border-line">
                    <a
                      href={item.href}
                      class="flex min-h-11 items-center gap-4 py-2 text-base font-medium no-underline hover:text-accent"
                    >
                      <span class="text-label tabular-nums text-ink-3">{item.n}</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* 01 The work: three columns under one rule, index number, frame, caption in two lines */}
      <section id="work" aria-labelledby="work-title" class="bg-surface text-ink">
        <div class="mx-auto max-w-wide px-5 pt-6 pb-section sm:px-8">
          <RunningHead n="01" title="The work" />
          <h2 id="work-title" class="mt-10 max-w-[14ch] text-section">
            Three kitchens from this year.
          </h2>
          <ol class="mt-block grid grid-cols-1 gap-x-4 gap-y-10 border-t border-line pt-4 sm:grid-cols-3">
            {kitchens.map((k) => (
              <li>
                <span class="block text-label tabular-nums text-ink-3" aria-hidden="true">
                  {k.n}
                </span>
                <figure class="mt-4">
                  <div
                    role="img"
                    aria-label={`Photo to follow: ${k.place} ${k.rest}`}
                    class="flex aspect-4/3 flex-col justify-between border border-line bg-panel p-4"
                  >
                    <span class="text-label uppercase text-ink-3">Photo to follow</span>
                    <figcaption class="text-base font-medium">
                      {k.place}
                      <br />
                      {k.rest}
                    </figcaption>
                  </div>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 02 How it goes: a four-column spread with vertical hairlines and the step number at the top */}
      <Section id="how" wide labelledBy="how-title">
        <div class="-mt-section pt-6">
          <RunningHead n="02" title="How it goes" />
        </div>
        <h2 id="how-title" class="mt-10 max-w-[12ch] text-section">
          Four steps, one team.
        </h2>
        <ol class="mt-block grid grid-cols-1 divide-y divide-line border-y border-line lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {steps.map((s) => (
            <li class="grid grid-cols-[3rem_1fr] gap-x-4 py-6 lg:block lg:py-0 lg:pr-6 lg:pl-4 lg:first:pl-0">
              <span class="font-display text-section tabular-nums text-ink-3 lg:block lg:pt-4" aria-hidden="true">
                {s.n}
              </span>
              <div class="lg:mt-16 lg:min-h-40 lg:pb-6">
                <h3 class="text-title">
                  <span class="sr-only">Step {s.n}: </span>
                  {s.title}
                </h3>
                <p class="mt-2 max-w-prose text-ink-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* 03 One rule: night band, the sentence across eight columns, the action in column ten */}
      <Section id="rule" ground="night" wide labelledBy="rule-title">
        <div class="-mt-section pt-6">
          <RunningHead n="03" title="One rule" night />
        </div>
        <div class="mt-10 grid grid-cols-12 gap-x-4 gap-y-10">
          <p id="rule-title" class="col-span-12 max-w-[18ch] font-display text-section lg:col-span-8">
            We have never fitted a kitchen we did not build.
          </p>
          <div class="col-span-12 lg:col-span-3 lg:col-start-10">
            <Button href="#visit">Ask us about yours</Button>
          </div>
        </div>
      </Section>

      {/* 04 Visit: two columns, the hours as a small table */}
      <Section id="visit" ground="panel" wide labelledBy="visit-title">
        <div class="-mt-section pt-6">
          <RunningHead n="04" title="Visit" />
        </div>
        <div class="mt-10 grid grid-cols-12 gap-x-4 gap-y-12">
          <div class="col-span-12 lg:col-span-6">
            <h2 id="visit-title" class="max-w-[14ch] text-section">
              Come and see the workshop.
            </h2>
            <p class="mt-8 max-w-xl text-lede text-ink-2">
              Open Tuesday to Saturday, nine to five. Cumberland Road, Bristol.
            </p>
            <div class="mt-10">
              <Button href="#visit">Book a workshop visit</Button>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-5 lg:col-start-8">
            <table class="w-full border-y border-line-strong text-base">
              <caption class="sr-only">Opening hours and address</caption>
              <tbody class="divide-y divide-line">
                {hours.map((h) => (
                  <tr>
                    <th scope="row" class="w-1/2 py-3 pr-4 text-left align-top font-medium lg:w-auto">
                      {h.day}
                    </th>
                    <td class={`py-3 text-left align-top text-ink-2 ${h.num ? "tabular-nums" : ""}`}>{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </>
  );
}

export const Specimen = { page, Body };
