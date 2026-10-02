<page_type name="events" mode="retrieval" goals="find a date, then book" nav="full">

<job>
What is on, when, where, and how to go. It covers a venue's calendar, a restaurant's evenings, and a
nonprofit's fundraisers. A past event still listed as upcoming, or a date with no year, costs more
trust than an empty calendar. The same type covers private hire, where the reader is booking a space
rather than a ticket.
</job>

<reader>
Someone deciding whether to go and whether they can get in: the date, the time, the cost, whether
it is still on. For private hire, someone planning an occasion, who compares capacity, price and
what is included.
</reader>

<exists>
Make the page only when `public/` and `brand/` holds upcoming dates, or a private-hire offer, and someone
keeps them current. A calendar that goes stale is worse than none. Leave the events off, and name
the kind of events on the homepage instead.
</exists>

<inventory>
  events      each event's name, date and time with the year, place, price, ticket or booking link, status
  about       what happens, who hosts or performs, age limits, accessibility
  series      recurring events and their pattern
  spaces      for private hire: each space, capacity per layout, how pricing works, what is included
</inventory>

<select>
  - Upcoming only, in date order. Past events are archived or removed.
  - Every date carries its day, date, year and time. A cancelled or postponed event is marked as such.
  - For private hire: the price structure stated (minimum spend or per head, what is included), a
    photograph of every space, and capacity for each layout.
</select>

<sections>
In page order. `core` is on nearly every events page; everything else is a choice made against the
material. Each line says what the band holds, then when it earns its place.

  upcoming    core      Each event: name, date and time, place, price, status, and how to book.
  regular     optional  Recurring nights or series and their pattern. When: the brand has them.
  spaces      optional  Each space for hire: photograph, capacity per layout, pricing, what is included.
                        When: the business takes private hire.
  enquire     optional  A short enquiry form for private hire, with what happens next.
                        When: private hire is offered.
  past        optional  A few past events, clearly labelled as past. When: they prove the venue's range.
  action      core      Book, buy a ticket, or enquire.
</sections>

<phrase>
  - Labels and values. The event's name as the brand gives it; no invented descriptions.
  - Everything in this file describes a shape. Never reuse its wording, or another page's.
</phrase>

<show>
  - The room, the stage or the table as it will be; a photograph of every space for hire.
</show>

<links>
From: the homepage's latest band. To: ticketing or booking, and the location page.
</links>

<variant name="event" label="one event's page" mode="retrieval">
The name, date and time with timezone, place and address, what happens, who hosts, price and the
booking link, status. Add-to-calendar where the builder can provide it. One page per event only
when events are big enough to need it; otherwise the list carries them.
</variant>

</page_type>
