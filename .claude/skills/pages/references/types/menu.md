<page_type name="menu" mode="retrieval" goals="find and compare" nav="full">

<job>
Diners come for three things: the menu, the hours and the location. The menu is the most-visited
page of a restaurant site and often the one that decides the visit; most menu reading is on a phone
and is sequential, like reading a book.
</job>

<reader>
Someone deciding whether to come, what they will eat and what it costs; often on a phone, often
with a dietary need.
</reader>

<inventory>
  services    each menu (lunch, dinner, drinks, brunch) and when it is served
  items       every item: name, price, description, marks, as the source gives them
  marks       dietary and allergen marks and what they mean, only as stated
  notes       service charge, allergen policy, substitutions, as the restaurant words them
  logistics   hours with exceptions, address, booking, ordering
</inventory>

<select>
  - An HTML page, never a PDF or an image of a menu.
  - Every item verbatim with its price. Nothing the menu does not itself say.
  - Dietary and allergen marks only where the brand states them, with their key. Where food is
    sold for delivery or collection, allergen information before ordering can be a legal duty
    (UK), so it is correctness, not decoration.
  - Hours are current, with exceptions.
</select>

<sections>
In page order. `core` is on nearly every page of this type; everything else is a choice made
against the material. Each line says what the band holds, then when it earns its place.

  services    core      Each menu (lunch, dinner, drinks, brunch) with when it is served, and a way to
                        jump between them.
  items       core      Sections in the restaurant's own order; each item with its name, description
                        and price, verbatim.
  key         optional  What each dietary or allergen mark means. When: marks are used; then core.
  notes       optional  Service charge, allergen policy, substitutions, as the restaurant words them.
                        When: the restaurant has them.
  photographs  optional  A few dishes, captioned with the dish's menu name.
                        When: the business's photographs have good ones. The menu stays dense; pictures do not
                        push the items apart.
  specials    optional  Seasonal or set menus, dated. When: current ones exist.
  download    optional  A PDF for printing, as an addition to the HTML menu, never instead of it.
                        When: the restaurant supplies one.
  action      core      Booking or ordering, inline, not a button leading to another button.
</sections>

<phrase>
  - The restaurant's own dish names and descriptions, verbatim. Consistent price formatting.
  - Everything in this file describes a shape. Never reuse its wording, or another page's.
</phrase>

<show>
  - The menu page itself needs few pictures; density is the service. The room and the food carry
    the rest of the site: a restaurant is a place.
</show>

<variant name="site" label="the rest of a restaurant site">
Hours and location on every page or in the site shell. Reservations as the booking itself. Private
events: each space with capacity per layout, how pricing works (minimum spend or per-head, what is
included), a photograph of every space, a short inquiry form.
</variant>

</page_type>
