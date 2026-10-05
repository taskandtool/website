<page_type name="service" mode="persuasion" goals="one per service" nav="full">

<job>
One service, for someone who searched for it by name. They doubt: is this the right place, do they
do this well here, what will it involve and cost. The page confirms, proves and prices it, and gets
them to act. One page per service is the strongest local-search signal there is.
</job>

<angle>
Decide per page and write in the brief's frontmatter, from this brand's own material.

  reader  the person who searched for this service, and their situation.
  pain    the problem that sent them looking, in their words.
  offer   why this company for this service: speed, warranty, method, price, coverage.
  lead    usually the pain: a service page opens on the problem, then the fix.
</angle>

<inventory>
Sort every usable item for THIS service into bins, with its source. An old site often spreads one
service across several pages; gather from all of them.

  problem     the signs and situations that mean a reader needs this service
  included    what the service involves and what the customer gets
  price       prices, ranges, or prices for typical jobs
  options     types, materials, tiers the customer chooses between
  proof       reviews about this service, photographs of this work (being done and finished),
              certifications relevant to it, logos of clients, partners and associations
              (public/proof.md marks)
  objections  cost, insurance, timing, disruption, repair versus replace
  area        where this service is offered, and any local proof per place
</inventory>

<select>
  - Only material about this service. A review praising a different job goes elsewhere.
  - Problem first: the reader recognises their situation on the first screen.
  - What's included is concrete and complete; an incomplete description breeds doubt.
  - A price or typical-job price beats silence, when the brand has one.
  - The company's own FAQ answers for this service beat anything you could write.
  - Photographs of this service, being done and finished, beat any other picture.
  - Each item once; the homepage summary is not repeated word for word.
  - At most one lead figure: the number that best answers the reader's pain, with its source,
    named in the brief. The design system decides how it is emphasised; with no such number,
    nothing is emphasised.
  - Reviews: several sit together in their own band; one may also sit beside the claim it
    proves. The design system decides how either looks. Each carries its platform's mark and
    its stars in the brief (SKILL.md, "Reviews, on any page").
</select>

<sections>
In page order. `core` is on nearly every page of this type; everything else is a choice made
against the material. Each line says what the band holds, then when it earns its place.

  hero        core      The service by its search name, the problem it fixes, where, the action.
  included    core      What the customer gets, as named items.
  proof       core      A review about this service, a job photograph, or a result, and their
                        logos of clients, partners and associations whenever public/proof.md
                        holds any. The strongest one sits beside the claim it proves. When
                        there is none, a NEED.
  price       optional  Prices, ranges or typical-job prices, with units.
                        When: the brand has them.
  work        optional  Photographs of this service being done and finished; before-and-after pairs.
                        When: the business's photographs have photographs of THIS service.
  process     optional  What happens, in order, and how long it takes.
                        When: the job takes several visits or days, or the reader fears disruption.
  options     optional  The choices, each framed by what it is good for.
                        When: the reader must choose (materials, types, tiers).
  credentials  optional  Certifications, manufacturer approvals, licences that apply to this service.
                        When: the brand holds ones specific to it.
  objections  optional  The company's own answers: cost, timing, insurance, repair or replace.
                        When: their own text answers them.
  questions   optional  The company's FAQ for this service. When: real questions exist.
  area        optional  One line or a short list of the places this service covers, named.
                        When: the business travels to customers. A map is not needed; a list is.
                        A storefront business leaves this to its location page.
  related     optional  Two or three services a customer of this one often needs next, in context.
                        When: the site has them.
  action      core      The action, with what happens after.
</sections>

<phrase>
  - Headline: the service by the name a customer searches for, and where; its benefit or the
    problem it solves in the subtext.
  - Included items are named things, not adjectives.
  - Invite, don't instruct. What happens after they get in touch in one line.
  - Everything in this file describes a shape. Never reuse its wording, or another page's.
</phrase>

<show>
  - Photographs of the service being done and of the result; before-and-after pairs where the
    brand has them. A photograph about another service is not used because it is pretty.
</show>

<links>
Up to the services index (or home). Across, in context, to two or three services a customer of
this one often needs next. Out to area pages where this service's local proof lives. In context,
not as a list dumped in the footer.
</links>

<variant name="index" label="services index" mode="retrieval">
The list of every service, so a reader finds theirs in one click. Each entry: the search name, one
line on what it involves, one distinguishing fact where the brand has it (a "from" price, a typical
duration, who it is for), a photograph of that work, and a link. Every service represented evenly,
in the same structure. A line or two of context at the top; no proof or long copy (that lives on
the service pages). Skip the index when there are only a few services and the nav lists them all.
Area pages are `location.md`, and exist only where `public/` and `brand/` holds local proof for that
place; otherwise the places are named on the service page.
</variant>

<industry>
The shape holds everywhere; proof density follows decision cost (industries.md). Trades: licence,
insurance, local jobs. Clinics: the practitioner, what the appointment involves, insurance
accepted. Professional services: representative matters and typical fees. Software: the real
interface. Catering: menus and prices for common party sizes.
</industry>

</page_type>
