---
description: "Direct the look of this website: references, the first screen, the homepage built for real and shown, the design system record as the site grows, type, layout, imagery, motion, accessibility, and the rendered review. Use before building or redesigning a page, and when the owner says change the look or it looks generic."
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

## 3. The Homepage First

Prefer one homepage, built for real and shown, over planning the whole
site. Most owners judge a design by looking at it; show them one worth
looking at, then follow what they say.

**Look before choosing.** Their current site (`raw/site/`, its screenshot
in `shots/`), anything they linked or said they like (`tt-crawl reference
<url>` captures a site's look into `raw/external/<host>/`), and the design
library (`references/library.md`: fourteen systems, a preview each). Open
the previews and find the one or two closest to what this business needs;
take what works from them. The site's system is always its own, never a
library system restyled.

**Make it theirs.** Write the homepage's brief, `design/briefs/home.md` (the
`pages` skill's format, kept short for a first page). Then the look, in
`design/system.yaml`: overwrite the starter's tokens with this business's
colours by role, its fonts, sizes and radii, and run `npm run system`. The
tokens are all a first page needs; the rest of the record waits for step 4.

**Build the real page.** `src/pages/home.tsx` (the website skill's "How a
page is written"), its facts read from `public/`. Then `npm run build &&
npm run lint`: fix what is a mistake. When the owner asked for something
the lint flags, put `data-lint-allow="<rule>"` on that element and say so
in one line; the owner's ask wins.

**Look, fix, commit, show.** The review gate below: screenshot, look, fix
what the screenshots show. Then commit (one plain line), so any version the
owner has seen can come back with one `git checkout`; the screenshots in
the chat show which is which. Show the page at desktop and phone width.

**Then follow the owner.** A small change ("bigger photo", "add a section")
is an edit to the same page. When they want options, or a change big enough
that they should compare (a different direction, not a tweak), build each
option as the real page in turn, commit each, show them side by side, and
keep the one they pick.

## 4. When the Site Grows

When the owner wants more than the homepage, the record has to carry the
look to every page:

1. **Fill the rest of the record.** `design/system.yaml` already holds the
   tokens; add the rules with their reasons, the imagery, the motion, and
   `x_layout` for every shape of content, not only what the homepage shows,
   by `references/authoring.md`. Fill `identity` from the brief.
   `references/records/` holds two proven library records as worked
   examples. Then `npm run system`.
2. **Rebuild it blind.** Start a sub-agent with a fresh context and give it
   only `design/briefs/home.md`, `public/`, `brand/` and `design/system.yaml`:
   it builds the homepage in a scratch module, `src/pages/rebuild.tsx` at
   `/rebuild`. Screenshot it and the homepage at desktop and phone width.
   Where they differ in a way the owner would notice (the head, the grounds,
   the type, how a band is arranged), the record left it out: add it to the
   record and rebuild once more. Two rounds at most; say what still
   differs. Then delete the scratch page. Without a way to start a
   sub-agent, skip this and say so.
3. **Check it.** `npm run check`, `npm run build && npm run lint`.

The other pages then follow the record (the `pages` skill). A later change
to the look is a change to the record, then `npm run system`.

## 5. Compose From Content

### The first screen

The owner judges the whole site by the first screen, so it is where the
work goes. It states the subject, the offer and the next action in a short
headline at scale (the h1 says what the business does; a hero with no
headline fails), and it should make the owner proud to send the link.

- **Lead with an image when there is a good one.** The business's own best
  photograph of the work, the place or the product, crisp and large. A
  photograph runs full-bleed only when it is at least 2000px wide; never
  enlarge one past its own width. A phone snapshot that would blur is set
  at its own size, framed, or left out, and the head becomes type-led.
- **No good photograph of theirs:** a striking stock photograph of the same
  subject, hotlinked from Pexels at full width
  (`https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=2400`),
  as atmosphere, never as proof of their work. Say in one line that their
  own photographs would be better.
- **Words over a photograph stay readable:** a fade, a scrim, a band, or
  placement beside the subject, and contrast checked over the image itself.
- **Commit to a colour world:** a saturated field, black, or the
  photograph. A warm off-white ground is a choice, not a default.
- **One signature move** that belongs to this business: an oversized word,
  a numeral crossing a photograph's edge, the product lit on black, a
  live detail (today's hours, the next opening). One, not five.
- **Refuse the named defaults** unless the brief gives a reason: a centred
  headline over a glow, a split hero with a form, a small tracked-caps label
  above the headline, cream with a soft serif, Inter with Playfair.
- **The form is not the hero.** The first screen is the promise and one
  action; a form sits beside it only when booking on the first screen is
  the page's whole job.

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

8. Put the first screen beside their current homepage's (`raw/site/<host>/shots/`):
   is it clearly better, and would the owner be impressed enough to send it
   to someone?

Remove the ornamental answer to question seven, and if the answer to
question eight is no, the first screen is not done. Fix the largest generic or
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
