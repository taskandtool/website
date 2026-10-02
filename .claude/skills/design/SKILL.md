---
description: "Direct the visual system of this website: references, three real homepages the owner picks from, the system record, type, layout, imagery, motion, accessibility, and the rendered review. Use before building or redesigning any page, and when the owner says change the look or it looks generic."
---

# Design

In this app the design system is one record: `design/system.yaml` holds
every token, the rules with their reasons, and how each kind of content is
laid out; `npm run system` compiles it into `styles/theme.css` (the classes)
and `DESIGN.md` (the readable contract, with the Identity block this skill
fills). Never edit those two by hand. The brand itself is the notes in
`brand/` (`BRAND.md`), with `brand/voice.md` as the voice card. Read
`DESIGN.md` and the brand notes before choosing anything below, and build
with the theme's classes. The method in this file is how a direction is
found; the record is where it is kept.

Make the page unmistakably about this subject, for this audience, doing this
job. A new palette applied to a familiar landing-page template is not a design
direction.

When the user asks for a faithful copy, port, or close adaptation of an
existing design, fidelity wins. Study the reference, preserve what makes it
work, and adapt only what the user's product or medium requires.

Read the `writing` skill with this one. Words, hierarchy, type, imagery, and
interaction are one system. Do not design around placeholder copy and try to
make the real words fit afterward.

Class names and CSS values in examples are illustrative. Use the project's
actual styling system.

## 1. Establish the Brief

For a new page or substantial redesign, write down these facts before choosing
an aesthetic:

- **Subject:** What is being sold, explained, used, or experienced?
- **Audience:** Who is here, and what do they already understand?
- **One job:** What must this page make clear or help someone do?
- **Primary action:** The exact next step, stated as a verb and object.
- **Available material:** Real copy, data, proof, product screens, photography,
  brand assets, and constraints.
- **Context:** Existing site patterns, device priorities, technical limits, and
  accessibility needs.
- **Voice:** Who is speaking, how direct they are, and what they would never say.

Inspect the actual project before inventing an answer. Prefer the owner's
language, real product nouns, and existing assets. If a missing decision would
materially change the result, ask. Otherwise make a conservative assumption
and state it.

Do not fill a gap with fictional customers, testimonials, usage counts, awards,
press logos, prices, dates, or performance claims. Design the honest version of
the page.

## 2. Lock the Content Before the Composition

Make a compact content inventory:

1. Required facts and proof.
2. Required actions and destinations.
3. Existing copy that must remain verbatim.
4. Copy that may be edited.
5. Media that exists and media that still needs sourcing or creation.

Write or revise the real headline, supporting copy, section labels, calls to
action, and navigation before settling the layout. Copy length is an input to
the composition, not an inconvenience to hide with smaller type.

Each section needs a content job. If two sections do the same job, combine
them. If a section exists only because landing pages usually have one, remove
it.

### Marketing-page communication gate

Before exploring visual directions, compress the page until it passes a quick
scan. A marketing page is not a product specification laid out attractively.

- The first viewport gets one headline, one supporting thought, and one primary
  action. Add an eyebrow only when it supplies essential orientation the
  headline cannot.
- Give each later section one claim and one proof or visual. Default to no more
  than two short sentences of support.
- Show the product before explaining the system. Prefer a real screenshot,
  recording, example output, or customer artifact. If the real media does not
  exist yet, reserve an honest media slot instead of inventing a dense fake UI.
- Do not turn internal architecture, folder names, implementation status, or
  process jargon into decorative diagrams. Visualize only relationships the
  buyer needs to make a decision.
- On marketing pages, important body copy should normally be at least 18px.
  Utility text should normally be at least 14px and must never carry the core
  message. Do not shrink copy to save a composition.
- When the brief asks for thick or chunky typography, make that a real system:
  strong weights, short line lengths, plain words, tight display leading, and
  generous space. Tiny monospace captions do not create technical credibility.
- Run a five-second test: can a new visitor name what the product does and why
  it matters without reading every line? If not, cut and enlarge before adding
  another element.

Decorative labels, repeated subtitles, status microcopy, and multiple competing
visualizations all spend the same attention budget. Use that budget on the
single clearest message.

## 3. Three Homepages, Not Three Moodboards

For a new site or a redesign, show the owner three wildly different
homepages, built for real from the same words, and let them pick. Small
changes continue the chosen system instead.

**References first.** Gather what already exists before inventing anything:

- sites the owner admires: `tt-crawl reference <url>` captures a few pages'
  look and structure, screenshots included, into `raw/external/<host>/`;
- the homepages of the business's main competitors, the same way (the
  `new-site` skill finds them);
- the design library (`references/library.md` beside this file): fourteen
  systems with a preview each. Pick the three to five that fit the business
  and show them as one group, one line each, as that file says.

Ask one question: what do they like in each. Their answer leads the
directions; the library's systems are worked examples to learn from, never
templates to copy.

**One brief, three directions.** Write the homepage's brief once,
`design/briefs/home.md` (the `pages` skill's format and the homepage guide),
so all three variants say the same words and differ only in how. Then a card
per direction in `design/directions/<n>.md`:

- **Name and thesis:** one memorable name and one sentence.
- **Lead reference:** the admired site, competitor gap or library system it
  starts from, and what it takes from it.
- **Source:** the subject-specific artifact, behaviour or world it borrows
  from (a logistics page from shipping labels and manifests).
- **Look:** composition and hero, type roles, a small named palette with
  exact values, material.
- **Signature:** the single moment people remember.
- **Rejection:** the familiar pattern it deliberately avoids.

The three must differ in structure, hierarchy, typography and imagery, not
merely in colour. Spend boldness in one place in each.

**Build each as a real page.** `design/variants/<n>/theme.css` starts as a
copy of `styles/theme.css` with the direction's values; `page.html` is the
whole homepage document using the theme's classes, with real photographs
(the business's own, or hotlinked stock) and the brief's words. Then:

```bash
npm run variant -- design/variants/1        # one standalone index.html, CSS inlined
npm run lint -- design/variants/1/index.html --theme design/variants/1/theme.css
```

Fix every lint error and read every hint as a question about the design.
Screenshot each at desktop and phone width (the review gate below, with
`file://$PWD/design/variants/1/index.html` as the address), look at the
screenshots, and fix what they show before the owner sees anything.

**Show them together.** One group: each variant's `index.html` (it opens and
scrolls in the chat), titled with its direction's name and thesis:

```python
from tools.taskandtool import create_deliverables
create_deliverables(
    [{"path": "design/variants/1/index.html", "title": "Ledger: the job sheet as the page"},
     {"path": "design/variants/2/index.html", "title": "Yard: the work at full width"},
     {"path": "design/variants/3/index.html", "title": "Counter: the phone call, first"}],
    "Three homepages from the same words: pick one, or tell me what to change")
```

Recommend one, with a sentence tied to the brief. **Iterate on the pick**:
change the same folder, run `variant` and `lint` again, and show the revised
page as a new group. When the owner is happy with the look, ask whether they
are ready for the design system and the rest of the pages; that is step 4.

## 4. Harden the Pick Into the Site's System

When the owner says yes to "ready for the design system and the rest of the
pages?", the picked homepage becomes the site:

1. **Write the record.** Rewrite `design/system.yaml` from the picked
   variant's `theme.css` and `page.html`, the brief and its direction card,
   by `references/authoring.md`: the site's colour roles, the type, the
   rules with their reasons, the imagery, the motion, and `x_layout` for
   every shape of content, not only the ones the homepage shows. Fill
   `identity` from the brief. `references/records/` holds two proven library
   records as worked examples. Then `npm run system`.
2. **Rebuild it blind.** Start a sub-agent with a fresh context and give it
   only `design/briefs/home.md`, `public/`, `brand/` and `design/system.yaml`:
   build the homepage the brief describes as `design/rebuild/page.html`,
   in this record's classes. Copy `styles/theme.css` to
   `design/rebuild/theme.css`, run `npm run variant -- design/rebuild`, and
   screenshot it and the pick at desktop and phone width. Where they differ
   in a way the owner would notice (the head, the grounds, the type, how a
   band is arranged), the record left it out: add it to the record and
   rebuild once more. Two rounds at most; say what still differs. Without
   a way to start a sub-agent, skip this and say so.
3. **Make it the site.** The pick's `page.html` (not the rebuild) becomes
   `src/pages/home.tsx` by the website skill's "From an HTML page to a page
   here", every fact moved into `public/` and read back through `content`.
4. **Check it.** `npm run css`, `npm run check`, `npm run build && npm run
   lint`, and the review gate on the real page.

The other pages follow the record (the `pages` skill). The
variants and the rebuild stay in `design/` as the record of what the owner
chose between. A later change to the look is a change to the record, then
`npm run system`.

## 5. Compose From Content

### Hero

The hero is the page's thesis, not a decorated introduction. It should establish
the subject, the primary value, and the next action without needing the rest of
the page to explain it.

A centered headline over an abstract glow is one option, not the default.
Consider split editorial compositions, product-led demonstrations, dense
utility surfaces, controlled asymmetry, or subject-specific artifacts when they
serve the brief.

### Page structure

- Encode relationships in the layout. Sequence, comparison, hierarchy, and
  causality should look different from one another.
- Vary rhythm according to meaning: keep related items close and give changes
  of thought room to breathe.
- Use full bleed, containment, overlap, or asymmetry for a reason that can be
  explained in one sentence.
- Prefer native document flow. Absolute positioning is for deliberate layering,
  not the page skeleton.
- Cards are for discrete, comparable objects or actions—not a reflex for every
  paragraph.

### Typography

- Give display, reading, and utility text distinct jobs. One family can cover
  several roles only when its range makes those roles visibly different.
- Set an explicit scale, line height, tracking, and maximum measure. Large type
  should remain legible; body copy should not become faint or tiny to look chic.
- Default reading copy to a normal weight. Reserve semibold for controls and
  concise emphasis, bold for headings, and the heaviest weight for one display
  moment. A page where supporting copy, labels, and headings are all bold has no
  usable hierarchy.
- Use type personality that belongs to the subject. “Luxury means serif” and
  “technology means geometric sans” are starting clichés, not conclusions.
- Keep heading order semantic even when the visual scale breaks convention.

### Color and material

- Assign every color a job. Do not scatter an accent simply to make the page
  feel designed.
- Pulling a palette from real photography or product material can unify a page,
  but confirm that text and controls still meet contrast requirements.
- Gradients, blur, glass, noise, hard borders, shadows, and texture are material
  choices. Use the few that support the direction and forbid the rest.
- Test important combinations in their real state: default, hover, focus,
  disabled, over media, and in forced or high-contrast settings when relevant.

### Imagery: the visual-description bridge

When a page needs an image, illustration, texture, or generated asset, describe
the visual separately from the typography and layout. Include:

- subject and moment;
- composition and point of view;
- environment, material, lighting, and color;
- crop, focal point, and required negative space;
- mood stated through visible properties;
- exclusions that prevent the wrong visual language.

Keep headlines and interface text as real HTML. Do not bake words into generated
images unless the artifact itself calls for lettering.

### Motion and interaction

Motion should explain state, direct attention, or embody the concept. Specify:

- trigger: load, hover, press, drag, or scroll;
- whether progress is time-based or bound to input;
- start, end, duration, easing, and whether it reverses;
- mouse, keyboard, and touch behavior;
- reduced-motion and no-JavaScript result.

Keep the finished composition visible when motion is unavailable. Do not make
content wait behind a flourish. Avoid scroll hijacking unless the experience
cannot work without it and the user explicitly wants it.

## Voice Is Part of the Interface

Define voice traits as behavior, not adjectives alone. “Direct” might mean the
headline names the product in eight words, labels use verbs, and sentences do
not hedge. “Warm” might mean contractions, concrete reassurance, and no jokes at
the user's expense.

- Use the same noun for the same object everywhere.
- Use the same verb for the same action everywhere.
- Buttons say what happens next: “Review the proposal,” not “Learn more.”
- Headline rhythm should suit the display type; do not force a slogan into an
  attractive line break if it weakens the meaning.
- Decorative microcopy is still copy. It must add orientation, proof, or tone.
- Error, empty, loading, and success states belong to the same voice as the
  marketing page.

The `writing` skill owns the full voice and editing pass. The system record
keeps the parts that affect hierarchy, space, labels, and interaction.

## Defaults to Refuse

Stop and reconsider when the design falls into any of these patterns:

- a generic centered hero followed by logo strip, three feature cards,
  testimonials, pricing, FAQ, and final CTA regardless of the content;
- a “bento” grid whose boxes have no meaningful relationship;
- three concept directions that share the same wireframe;
- vague prestige copy over a large serif and full-screen stock video;
- fake social proof used as decoration;
- low-contrast gray body text, tiny labels, or unclear focus states;
- equal padding and identical containers from top to bottom;
- gradients, blur, glass, or glow used to compensate for a weak idea;
- motion on every element, or motion with no reduced-motion state;
- icons in colored circles as the default visual language;
- a page that could change industries by swapping the logo and headline.

Familiar patterns are allowed when they are the clearest answer. They are not
allowed to make the decisions for you.

## Responsive and Accessibility

Design mobile and desktop as related compositions, not a desktop page that
collapses. Record what reorders, crops, stacks, becomes scrollable, or disappears
and why. Check intermediate widths, long labels, zoom, and realistic copy.

At minimum:

- preserve semantic headings and landmarks;
- keep text readable and contrast sufficient in every state;
- provide visible keyboard focus and logical focus order;
- keep touch targets comfortably tappable (about 44px);
- provide alternatives for hover-only information;
- respect `prefers-reduced-motion`;
- add useful alt text or mark decorative media appropriately;
- make the primary action clear without relying on color alone.

## Review Gate

Render the page and look at it; never judge from the code. On this machine
the working copy serves at `localhost:3000` and the Obscura browser takes
the screenshot (`--allow-private-network` lets it reach localhost):

```bash
mkdir -p uploads
obscura fetch http://localhost:3000/ --allow-private-network --screenshot uploads/home-1280.png
```

Read the PNG. For the phone width, render the page inside a 390px frame
(`uploads/_phone.html`: an `<iframe src="http://localhost:3000/" width="390"
height="2400">` on an otherwise empty page, screenshotted the same way), or
use Obscura's CDP server with a viewport of 390 wide. Then show what you
looked at in your reply (`create_deliverables([{"path":
"uploads/home-1280.png", "status": "info"}, {"path": "uploads/home-390.png",
"status": "info"}], "The home page at desktop and phone width")`) so the
owner sees the same thing you did, and ask:

1. Can someone identify the subject, offer, and next action quickly?
2. Does the composition come from this project, or merely from a design trend?
3. Is the signature moment clear, and is everything else supporting it?
4. Are the real words readable without truncation, haze, or weak contrast?
5. Is every claim supported by the available source material?
6. Do keyboard, touch, reduced motion, and no-JavaScript states still work?
7. Which element is present only to make the page look busier?

Remove the ornamental answer to question seven. Fix the largest generic or
unclear choice, render again, and only then call the design finished. Two
passes is the norm: the first render always shows something the code did
not.

## A worked example

The brief, filled, for a made-up business (a cabinetry workshop), after the
owner picked a poster-like direction:

```text
Subject:            Fitted kitchens and wardrobes, made and installed by Harlow Joinery
Audience:           Homeowners in Bristol renovating a kitchen, comparing three or four makers
One job:            Get a workshop visit booked
Direction:          Poster on a wall: the work said plainly, in heavy type, with black edges
Source:             The workshop's own job sheets and the hand-lettered boards outside it
Signature:          The hero block on a hard shadow with the giant word MADE in its foot
Rejection:          The kitchen-showroom site: soft photos, a centred slogan, three cards of services
Photography:        Three finished kitchens from this year; until the photos arrive, captioned slots
```

Everything on the page follows from those eight lines: the h1 is the
owner's claim in their words, the process is four rows because there are
four steps, the accent is the brand's blue because it clears 4.5:1 on the
off-white, and the one motion is the button press. A brief with "premium"
or "modern" in it has not been written yet.
