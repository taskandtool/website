---
description: "Direct the visual system of this website: the brief, the style catalogue (six presets with previews the owner picks from), three directions, the design contract, typography, layout, imagery, motion, accessibility, and the rendered review with screenshots. Use before building or redesigning any page, and when the owner says pick a style, change the look, make it feel like, redesign, or it looks generic."
---

# Design

In this app the design system is a contract in files: `DESIGN.md` at the
app root says what every token is for, how sections are composed, what to
refuse, and holds the Identity block this skill fills; `styles/theme.css`
holds the values; the brand itself is the notes in `brand/` (`BRAND.md`),
with `brand/voice.md` as the voice card. Read `DESIGN.md` and the brand
notes before choosing anything below, build with the theme's classes, and
when a direction changes a token, change it there and update the matching
row. The method in this file is how a direction is found; the contract is
where it is recorded.

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

## 3. Explore Three Real Directions

For a new page or a major redesign, develop three directions in one pass before
building. Small changes should continue the selected system instead.

**Start from the style catalogue.** `styles/` beside this file
(`${CLAUDE_SKILL_DIR}/styles`) holds six presets, each a complete design
system with a preview: `editorial`, `brutalist`, `whimsical`, `cinematic`,
`luxury`, `swiss` (`styles/README.md` lists them with a thesis, what each
suits, and what it does not). `npm run style` prints the same list. Before
inventing directions, put the previews in front of the owner and ask which
is closest. Attach them to your reply so they appear in the chat as
thumbnails the owner can click to enlarge and step through:

```python
from tools.taskandtool import attach_files
attach_files([f".claude/skills/design/styles/{s}/preview.png"
              for s in ["editorial", "brutalist", "whimsical", "cinematic", "luxury", "swiss"]],
             "Six starting points, in this order: editorial, brutalist, whimsical, cinematic, luxury, swiss")
```

Then name each in one line (its thesis and what it suits) and ask one
question: which is closest, or what blend. Off the platform (no bridge) the
previews are in the Files tab, or apply one with `npm run style -- <name>
--specimen` and send the owner to `/specimen` on the working copy. Then:

- If one fits, apply it (`npm run style -- <name>`), run "Updating from the
  brand" in `DESIGN.md` so the brand's colours and fonts replace the preset's
  defaults, and make the three directions variations *within* that style
  (composition, signature, imagery), not three styles.
- If the owner wants a blend ("brutalist with our green", "editorial but
  warmer"), apply the closer preset and change the tokens and rules it names,
  with a row in `DESIGN.md` for each change. Keep the preset's refuse list.
- If none fits, write the three directions from scratch as below and record
  the winner in `DESIGN.md` the same way a preset would.

A preset is a starting point, never a finished design: the Identity block is
still to fill, the copy is still the owner's, and the review gate still runs.
`npm run style -- --remove-specimen` takes the specimen page out before
anything is published.

The directions must differ in structure, hierarchy, typography, imagery, and
behavior—not merely in color. Derive them from the subject's real materials,
tools, environment, history, language, or customer behavior. A logistics page
might borrow from shipping labels, route maps, and manifests; a music page
might borrow from sleeves, set lists, and venue ephemera.

Describe each direction with:

- **Name and thesis:** One memorable name and one sentence explaining the idea.
- **Source:** The subject-specific artifact, behavior, or world it comes from.
- **Composition:** Hero model, grid, rhythm, and the way the page unfolds.
- **Type:** Display, body, and utility roles, with a reason for each.
- **Color and material:** A small named palette with exact values and jobs.
- **Signature:** The single moment people should remember.
- **Motion:** What moves, why it moves, and what remains still.
- **Voice consequence:** How this direction changes cadence, headline length,
  labels, and calls to action.
- **Rejection:** The familiar pattern this direction deliberately avoids.

Spend boldness in one place. A page with an animated hero, novelty cursor,
scroll hijacking, loud type, decorative cards, and multiple competing effects
has no focal point.

Select one direction and give a short rationale tied to the brief. If the user
asked to choose, recommend one. Do not make them interpret three unlabeled
moodboards.

## 4. Turn the Direction Into a Buildable Contract

Before implementation, reduce the chosen direction to a compact contract.
Specificity makes the result reproducible; adjective piles do not.

Use this shape:

```text
DESIGN CONTRACT
Subject / audience / one job:
Primary action:
Available evidence and media:

Direction:
Visual thesis:
Voice: [3 traits, each defined as observable writing behavior]

PALETTE
canvas: [name + value + purpose]
surface: [name + value + purpose]
text: [name + value + purpose]
action: [name + value + purpose]
accent: [name + value + purpose]

TYPE
display: [family, weight, scale, line-height, tracking, purpose]
body: [family, weight, size, line-height, measure]
utility: [family, weight, case, tracking, purpose]

LAYOUT
1. [section]: [content job, hierarchy, composition, real source material]
2. ...

SIGNATURE
[appearance, states, trigger/progress, input methods, fallback]

MUST
[the few rules that make the direction recognizable]

DO NOT
[specific defaults or effects that would weaken it]

RESPONSIVE / ACCESSIBILITY
[reflow, tap targets, focus, contrast, reduced motion, no-JS behavior]
```

Avoid loose instructions such as “make it premium,” “use dynamic gradients,” or
“add modern animations.” Name the visual property, its value, its purpose, and
where it appears.

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

The `writing` skill owns the full voice and editing pass. The design contract
records the parts that affect hierarchy, space, labels, and interaction.

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
use Obscura's CDP server with a viewport of 390 wide. Then attach what you
looked at to your reply (`attach_files(["uploads/home-1280.png",
"uploads/home-390.png"], "The home page at desktop and phone width")`) so
the owner sees the same thing you did, and ask:

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

The brief, filled, for the specimen business the catalogue uses (a
cabinetry workshop), after the owner picked the brutalist preset:

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
