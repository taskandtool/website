<page_type name="landing" mode="persuasion" goals="one" nav="exits removed">

<job>
One reader, arriving from one ad, email or search, and one action. The reader has just clicked a
promise and doubts two things: is this what I clicked for, and what's the catch. Every band either
keeps that promise or removes a reason not to act. A catalogue of everything the company does is
the commonest way to fail.
</job>

<angle>
Decide these per page, before choosing any content, and write them in the brief's frontmatter.
Derive them from this brand's own material; nothing here supplies them.

  reader  who this page is for, narrowly. One audience; the page says nothing to anyone else.
  pain    the doubt or problem they arrive with, in words they would use.
  offer   what they get for acting now: the terms that make yes cheap.
  lead    which of reader, pain or offer the headline answers first.
  arrives (when known) the ad, email or search terms that send the traffic. The headline must
          match it: message match is the best-evidenced lever a landing page has.

Two landers for the same company should usually differ in angle. If every page you plan leads the
same way, you are applying a formula, not reading the business.
</angle>

<inventory>
Before selecting, sort every usable item into bins, noting its source. Look in
`public/` and `brand/`, `static/images/` (described in `brand/images.md`), and `raw/` (the crawled pages, reviews and places). What
the owner asked for gives direction, never a fact.

  outcomes    what the reader ends up with
  offer       warranty, financing, free estimate, speed, guarantees
  price       real prices, ranges, or prices for typical jobs
  proof       ratings with platform and count, named reviews, licences, certifications,
              awards, the team, job photographs, customer photographs
  objections  answers to "what's the catch": cost, insurance, disruption, trust, timing
  options     choices the reader makes (types, tiers); never the company's credentials

An item that serves another audience is not in the inventory at all.
</inventory>

<select>
  - The headline keeps the promise that sent the reader, then states what they get. When the
    source is a search for the service ("roof repair near me"), naming the service is correct.
    When it is an offer, the offer leads.
  - The promise is the biggest thing the reader gets, not a step toward it: an estimate or a call
    is a step; the finished result, and what makes getting it easier here, is the promise.
  - Specific beats general: a number, a name, a platform, a place.
  - Third-party proof beats the company's own claims; a claim with a customer saying it beats
    the claim alone.
  - Price, when the brand has it, beats silence: users' first information need is cost, and a
    hidden price reads as expensive and evasive. Where price varies, give typical-job prices.
  - Unique to this company beats true of every competitor.
  - Length follows decision cost: a cheap, reversible yes needs a short page; an expensive,
    hard-to-reverse one needs every objection answered. Cut anything that does not earn its place.
  - Each item appears once. The hero's checks do not repeat its subtext.
  - When two sources disagree, use the one the reader can check, and leave the other out.
  - A fact the owner gives in chat goes into `public/` with its source first (the `brand` skill);
    a suggestion of yours is direction, never a fact.
  - At most one lead figure: the number that best answers the reader's pain, with its source,
    named in the brief. The design system decides how it is emphasised; with no such number,
    nothing is emphasised.
  - Reviews: several sit together in their own band; one may also sit beside the claim it
    proves. The design system decides how either looks.
</select>

<sections>
In page order. `core` is on nearly every page of this type; everything else is a choice made
against the material. Each line says what the band holds, then when it earns its place.
"Costly" means an expensive or hard-to-reverse decision.

  hero          core      The promise, kept: headline, subtext, a few checks, the action. Who the
                          company is and where it works are visible here.
  proof strip   core      Front and centre, directly under the hero: the ratings the brand holds,
                          each with its platform's own icon (Google,
                          Facebook) and the count, then the certification, manufacturer and
                          membership logos as the logos themselves. When there are no ratings,
                          the band is a NEED, not filler.
  what you get  core      The features, each titled as what the reader gets, with its benefits
                          beneath as checks. Prefer one photograph per feature, showing that
                          feature. Features the brand has no photograph for go in a second
                          band of their own: a title and a one-line subtitle each.
  guarantees    optional  The promises the company stands behind (warranty, satisfaction, price,
                          clean-up, timing), each a check with its terms as the brand states them.
                          When: the brand states any. Core for costly decisions.
  price         optional  Prices, ranges or typical-job prices, with units.
                          When: the brand has them. Price beats silence.
  options       optional  The choices the reader makes (types, materials, tiers), each framed by
                          what it is good for. When: the reader must choose before acting.
  included      optional  The concrete list of what the reader receives, each item a check, with
                          a photograph of the item or the step where the brand has one.
                          When: the decision is costly, or "what exactly do I get" is the doubt.
  reviews       core      Several named, on-audience reviews together. Each carries its source's
                          square icon (Google's G, Facebook's f) and its star rating as star
                          graphics, and a review that came with the customer's own photograph is
                          shown with it. Without review photographs, photographs of finished
                          jobs sit in the same band, beside or alternating with the reviews.
                          When there are no reviews, the band is a NEED, not filler.
  work          optional  Photographs of finished jobs, the more local the better ("what we did
                          for your neighbours"), each captioned with the job and the place. Best
                          from reviews and the Google profile, where a customer can be named.
                          When: the brand has job photographs. Near-core for trades.
  objections    optional  Money, insurance, disruption, trust, timing: whichever this reader holds,
                          answered from the company's own text. When: the decision is costly.
  credentials   optional  What a certification or programme means for the reader (a manufacturer
                          warranty tier, factory-trained crews), beyond the logos already in the
                          proof strip. When: the brand says what it means.
  team          optional  The actual people, with a photograph of them.
                          When: the brand has the photograph. Never names over stock.
  questions     optional  The company's own FAQ answers for this offer, shortened.
                          When: real questions exist. Never invented ones.
  area          optional  The places, named. When: the business travels to customers.
  close         core      The last chance to act, with the action itself on screen.
  footer        core      The company's name, address and phone, and every contractor licence
                          number, always, as text, when the work is licensed. Nothing that
                          leads away from the page.

A lander is carried by features, benefits, guarantees and proof, and it shows more than it tells:
photographs of the work and of what the reader gets, checks rather than paragraphs. The proof bands
(proof strip, reviews, work) belong on the page whatever the design system; the system decides how
they look, never whether they appear.

When the action is a form (a quote, a booking), the form is on the first screen, beside the promise.
Where the action repeats further down, the form itself repeats, never a button that scrolls back to
it: the reader is convinced where they are, and sending them back up adds a decision and loses
their place. A form that asks choices asks one per step. On a phone, when the brand has a phone
number, the action and the number can stay reachable at the foot of the screen.

A form is on the page only when the brief gives its fields and where it sends. Without them the
action is a button to the brand's own form (the booking or quote link the crawl found), and the missing form is a NEED;
never a form a builder made up, which submits nowhere and loses the lead.

Beside every form: what happens after it is sent (who replies, how soon), when the brand says.
Keep the form fields that describe the reader's job; cut the administrative ones.
Remove links that lead away from the action. Keep who the company is, its phone and address,
and cost information: removing those costs trust and ad quality, not just exits.
</sections>

<phrase>
  - Headline: the words that sent the reader, then what they get, as a person would say it aloud.
  - Subtext: carries the offer or the proof the headline did not.
  - Band and card titles name what the reader gets, briefly; how it is done goes in the specifics
    beneath. A title is not an action the company takes and not a sentence.
  - A check or benefit line is a claim, under ten words, with a number or a proper noun where
    the brand has one.
  - Plain words at a conversational reading level: plainer copy converts better on landing pages.
  - No full stop on a headline or title. Sentence case. Spell for the site's country.
  - Supplier brand names appear where they are the benefit (a certification), not in the options
    the reader chooses between.
  - Everything in this file describes a shape. Never reuse its wording, or another page's.
</phrase>

<show>
  - Photographs of this company's finished work and of the work being done; real people over
    any stock. A picture with no evidence in it is decoration.
  - Each feature and each included item is proven by a photograph where the brand has one that
    shows it: one photograph per feature is the aim, and the brief names which.
  - Customers' own photographs from reviews and the Google profile, named where the review is.
  - Every review shows its source's square icon and its rating as star graphics, one per star,
    taken from the review itself (the design skill, "Proof, front and centre"); a rating nobody
    recorded is not assumed. The platform icons and gold stars need a ground they read on:
    a light one or a card (`ReviewsSection`), never a strong colour of the stars' own hue.
  - Finished jobs, captioned by job and place; before and after only as real pairs of one job.
  - Ratings are prominent, each with its platform's own icon beside it, so the reader sees whose
    stars they are. Certification and manufacturer logos appear as the logos, near the top.
  - Licence numbers appear as text in the footer, on every page of a licensed trade.
</show>

<industry>
The page is the same shape everywhere; the doubt and the proof change (industries.md). Trades:
licence, local jobs, service area. Clinics: practitioner, insurance accepted, what the
appointment involves. Professional services: what they handle, fees, representative cases.
Software: the real product and the price. Regulated industries carry what the law requires on
the page (industries.md).
</industry>

</page_type>
