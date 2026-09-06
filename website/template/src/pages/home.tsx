// The home page as it ships: an honest first page for a site that has not
// been shaped yet. It shows the brand tokens live, says what is in the box,
// and tells the owner what to say next. Replace it with the business's real
// front door once the brief, voice, and content are settled (see the design
// and writing skills); until then it is the working copy visitors never see.
import { Button, Eyebrow, Section } from "../components";
import { site, type Page } from "../site";

const page: Page = {
  path: "/",
  title: "Home",
  description: site.description,
};

const inside = [
  {
    n: "01",
    title: "Pages",
    text: "Each page is a small Hono component, served from this machine while it is being built and pre-rendered to plain HTML when it is published.",
  },
  {
    n: "02",
    title: "Brand",
    text: "brand/ holds the notes: positioning, voice, audience, visual identity, do and don't. A Company Brain can own that folder; the theme and the pages are set from it.",
  },
  {
    n: "03",
    title: "Rules",
    text: "DESIGN.md says what each colour and size is for, how sections are composed, and what to refuse. The AI reads it before it designs.",
  },
  {
    n: "04",
    title: "Publishing",
    text: "One command builds the site and ships it to the edge, where it stays up for almost nothing. Nothing is on the web until you say so.",
  },
];

const asks = [
  "Make this the website for my roofing company in Leeds. Here is what we do and who we do it for.",
  "Rebuild it in the style of the site I like, but with our name, our photos, and our words.",
  "Add a services page with three services and a contact form that emails me.",
];

const swatches = [
  { cls: "bg-canvas", name: "canvas", role: "the page" },
  { cls: "bg-surface", name: "surface", role: "a raised card" },
  { cls: "bg-panel", name: "panel", role: "a tinted band" },
  { cls: "bg-accent", name: "accent", role: "the one action colour" },
  { cls: "bg-ink", name: "ink", role: "text" },
  { cls: "bg-night", name: "night", role: "the dark ground" },
];

function Body() {
  return (
    <>
      <section aria-labelledby="hero-title" class="bg-canvas">
        <div class="mx-auto grid max-w-wide items-center gap-12 px-5 py-section sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Day one</Eyebrow>
            <h1 id="hero-title" class="mt-5 max-w-[11ch] text-display">
              Your website starts here.
            </h1>
            <p class="mt-8 max-w-xl text-lede text-ink-2">
              This is the working copy of a site that runs on its own machine, with an AI
              that can build every part of it. Tell it about the business and this page
              becomes the front door.
            </p>
            <div class="mt-10 flex flex-wrap gap-3">
              <Button href="#inside">See what is inside</Button>
              <Button href="#brand" secondary>
                The brand so far
              </Button>
            </div>
          </div>

          <div
            role="img"
            aria-label="A specimen of the site's brand: the display face, the palette, and the fonts"
            class="rounded-frame border border-line bg-surface p-6 shadow-lift sm:p-8"
          >
            <div class="flex items-baseline justify-between gap-4 border-b border-line pb-4">
              <span class="text-label uppercase text-ink-3">Brand specimen</span>
              <span class="text-label uppercase text-ink-3">Working copy</span>
            </div>
            <p class="mt-6 font-display text-specimen" aria-hidden="true">
              Aa
            </p>
            <p class="mt-2 text-ink-2">
              {site.fonts.display} for headings, {site.fonts.body} for reading.
            </p>
            <ul class="mt-8 grid grid-cols-6 gap-2" aria-label="Palette">
              {swatches.map((s) => (
                <li class={`aspect-square rounded-control border border-line ${s.cls}`} title={s.name}></li>
              ))}
            </ul>
            <p class="mt-6 text-label uppercase text-ink-3">{site.name}</p>
          </div>
        </div>
      </section>

      <Section id="inside" labelledBy="inside-title">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div class="lg:sticky lg:top-8 lg:self-start">
            <h2 id="inside-title" class="max-w-[10ch] text-section">What is already in the box.</h2>
            <p class="mt-8 max-w-md text-lede text-ink-2">
              A working site, not a template to fill in. Everything below is a file in this
              app that you or the AI can open and change.
            </p>
          </div>
          <ol class="divide-y divide-line border-y border-line">
            {inside.map((row) => (
              <li class="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span class="font-display text-title text-ink-3">{row.n}</span>
                <div>
                  <h3 class="text-title">{row.title}</h3>
                  <p class="mt-3 max-w-prose text-ink-2">{row.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section ground="night" labelledBy="say-title">
        <h2 id="say-title" class="max-w-[16ch] text-section">
          Say what should change. The AI edits the real files. You refresh.
        </h2>
        <p class="mt-6 max-w-2xl text-lede text-night-ink-2">
          Three things people say first.
        </p>
        <ul class="mt-block grid gap-4 md:grid-cols-3">
          {asks.map((ask) => (
            <li class="rounded-card border border-line-on-night p-6">
              <p class="font-display text-xl">“{ask}”</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="brand" ground="panel" labelledBy="brand-title">
        <h2 id="brand-title" class="max-w-[12ch] text-section">The brand, as it stands.</h2>
        <p class="mt-8 max-w-xl text-lede text-ink-2">
          The theme in <code class="text-base">styles/theme.css</code> is set from the notes in{" "}
          <code class="text-base">brand/</code>. Change it and this section changes with it.
        </p>
        <ul class="mt-block grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {swatches.map((s) => (
            <li class="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
              <span class={`h-14 w-14 shrink-0 rounded-control border border-line ${s.cls}`} aria-hidden="true"></span>
              <span>
                <span class="block font-semibold">{s.name}</span>
                <span class="block text-ink-2">{s.role}</span>
              </span>
            </li>
          ))}
        </ul>
        <div class="mt-block grid gap-8 border-t border-line pt-10 md:grid-cols-3">
          <div>
            <p class="text-label uppercase text-ink-3">Display</p>
            <p class="mt-3 font-display text-section">Quiet, then bold.</p>
          </div>
          <div>
            <p class="text-label uppercase text-ink-3">Title</p>
            <p class="mt-3 font-display text-title">The size for a row or a card.</p>
          </div>
          <div>
            <p class="text-label uppercase text-ink-3">Body</p>
            <p class="mt-3 text-ink-2">
              Reading copy stays at eighteen pixels with a line length under seventy characters, so
              a paragraph on a phone reads as easily as on a desk.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

export const Home = { page, Body };
