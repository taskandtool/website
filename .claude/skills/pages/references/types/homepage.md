<page_type name="homepage" mode="persuasion" goals="many" nav="full">

<job>
The front door for everyone: a first-timer deciding whether this is the right company, a returning
customer after the phone number, someone checking whether they cover their town. It is an elevator
pitch and a router: say what the company does, for whom and where, prove it is real, and send each
reader onward. It is not a long argument; that is a landing page's job.
</job>

<angle>
Decide per page and write in the brief's frontmatter, from this brand's own material.

  reader  the main reader, and the one or two others the page must also serve.
  pain    what the main reader arrives needing to know or fix, in their words.
  offer   the company's strongest reason to choose them: the thing only they can say.
  lead    what the first screen answers first. Almost always what the company does and where,
          unless the name already says it; the best line sits beside it.

The commonest miss is a buried best line: the most useful thing the company says (made while you
wait, open 24 hours, the owner answers the phone) sits halfway down an old page. Find it.
</angle>

<inventory>
Sort every usable item into bins, with its source. Look in `public/` and `brand/` (the facts and the
brand notes), `static/images/` (described in `brand/images.md`), and `raw/` (every crawled page, not just the old homepage, and the
reviews and places the crawl found).

  identity    what they do, named as a customer would search for it; where; who
  offerings   each service or product by its search name, with a real example of it
  proof       ratings with platform and count, named reviews, licences, certifications, team
  places      every area served, and any conflict between statements of it
  contact     phone numbers, hours, address, and which number is the main one
  routes      the pages this homepage sends each reader to
</inventory>

<select>
  - The first screen says what the company does and where, carries the primary action, and shows
    a real photograph of the work if the business's photographs have one that can hold a hero.
  - Which fact leads the first screen follows the industry (industries.md): a restaurant's menu,
    hours and booking; a trade's area and credentials; software's product and price.
  - Examples of the offerings beat category names: a real job, dish or product per offering.
    The homepage samples the site; it does not reproduce it. Sampling means one line per
    offering, not three offerings out of seven: every product line or main service the company
    sells is named on the homepage, with its line and, when the business's photographs have one, its photograph.
  - The old homepage is a floor, not a template. What it carried that still answers a reader (each
    product line, a buying guide, a planning tool, a guarantee, a certification) is carried or
    improved; a drop is a decision named in `omit:`. When the old homepage was thin (a banner and a
    paragraph), don't copy its shape: build from the rest of the old site and the photographs.
  - Third-party proof beats the company's own claims.
  - One statement of coverage and one main phone number.
  - Cut welcome text, announcements and promotions that crowd out what the company does.
  - Each item once; a service is summarised here and described on its own page.
  - At most one lead figure: the number that best answers the reader's pain, with its source,
    named in the brief. The design system decides how it is emphasised; with no such number,
    nothing is emphasised.
  - Reviews: several sit together in their own band; one may also sit beside the claim it
    proves. The design system decides how either looks. Each carries its platform's icon and
    its stars in the brief (the design skill, "Proof, front and centre").
</select>

<sections>
In page order. `core` is on nearly every homepage; everything else is a choice made against the
material. A homepage for a business with one service and little material is short; one for a
company with seven product lines, a guide and a guarantee is long, and should be: leaving its
material out makes the new site look less complete than the old. Each line says what the
band holds, then when it earns its place.

  hero        core      What they do, for whom, where; the primary action; the best line. A real
                        photograph of the work when the business's photographs have one that can hold a hero.
  trust       core      Everything in public/proof.md that is not a review: every logo,
                        ratings with platform and count, people, numbers. All of it, boldly.
  offerings   core      Each service, product line or menu by its search name, with a real example
                        and a link to its page. For a restaurant this is the menu's route: what they
                        cook, a few named dishes, and the link.
  proof       core      Reviews with name and platform, or the strongest named review beside the
                        claim it proves. When there are none, the band is a NEED, not filler.
  work        optional  Photographs of real jobs, dishes, rooms or products, captioned.
                        When: the business's photographs have usable ones. With none, the work is set in type.
  process     optional  Three or four steps from first contact to done.
                        When: the buying process is unfamiliar or feared (legal, medical,
                        remodelling, a first booking). Omit for a purchase everyone understands.
  price       optional  A "from" price or typical-job price, with its unit.
                        When: the brand has one and cost is the reader's first doubt.
  area        optional  The places served, named.
                        When: the business travels to its customers. Core for a service-area trade.
  visit       optional  Address, today's hours, map link, parking.
                        When: customers come to them (restaurant, shop, clinic). Core for those.
  about       optional  Who they are in two or three lines, linking to the about page.
                        When: the people or the story are a reason to choose them.
  latest      optional  The newest posts or events, dated.
                        When: the brand publishes at least quarterly. A stale date costs trust.
  contact     core      How to reach them, hours, and what happens after they get in touch.
</sections>

<phrase>
  - Headline or tagline: literal and specific about what the company does, unless the name says
    it. Clever lines that a stranger cannot repeat back fail.
  - Link labels start with the words that carry the meaning; never "click here" or "learn more"
    alone.
  - Invite, don't instruct. Never spell out what the reader must say when they call.
  - Services are named, then described. A number is never the whole answer: fifteen towns is a
    heading for the list of fifteen.
  - Everything in this file describes a shape. Never reuse its wording, or another page's.
</phrase>

<show>
  - Real photographs that carry information; stock images are ignored or distrusted.
  - No auto-rotating carousel: its later slides are not seen. No autoplaying video.
  - The homepage should look like the homepage, distinct from inner pages.
  - With no usable photographs, set the page in type deliberately rather than leave holes.
</show>

<industry>
What the first screen leads with follows the kind of site (industries.md, <sitemaps>).
Restaurant: today's hours, the address and the two actions (reserve, order), and the menu one click
away. A café with one short menu may carry the whole menu on the homepage. Clinic: booking, whether
new patients are accepted, insurance taken, location. Trade: the service, the area, the phone.
Professional firm: who they serve and the problem they solve, then practice areas and people.
Retail: what they sell and why here, then categories and a few real products. Software: the
category and outcome, the real product, the trial or demo. Nonprofit: the mission in plain words,
where the money goes, and Donate.
</industry>

<links>
To: every main service or product page, about, contact, and each location. From: every page,
through the logo.
</links>

</page_type>
