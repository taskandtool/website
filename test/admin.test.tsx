// The Website's /admin, wired here as src/business.tsx wires it (that file
// reads its database from the env): a booking made at /book becomes a submission, and its page reschedules or cancels it and
// comes back. Needs TEST_DATABASE_URL, like the skills' database tests.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Hono } from "hono";
import { applySchema } from "../src/data/migrate";
import { scratch, why, type Scratch } from "../src/data/test/scratch";
import { makeStamp } from "../src/data/spam";
import { bookingAdmin } from "../src/booking/admin";
import { addWindow, createPerson, createType, setHosts } from "../src/booking/hours";
import { bookingPages } from "../src/booking/public";
import { formsAdmin } from "../src/forms/admin";
import { paymentsAdmin } from "../src/payments/admin";
import { bookingSubmission } from "../src/business";

const schema = (skill: string) => readFileSync(new URL(`../src/${skill}/schema.sql`, import.meta.url), "utf8");
const team = { "x-tasktool-user": "owner@example.com", origin: "http://localhost", host: "localhost" };
const form = (data: Record<string, string>, headers: Record<string, string> = {}) => ({
  method: "POST", body: new URLSearchParams(data), headers: { "Content-Type": "application/x-www-form-urlencoded", ...headers },
});

async function setUp(s: Scratch) {
  await applySchema(s.db, schema("forms"));
  await applySchema(s.db, schema("booking"));
  await applySchema(s.db, schema("payments"));
  await applySchema(s.db, schema("customers"));
  const pat = await createPerson(s.db, { name: "Pat", email: "pat@example.com", time_zone: "UTC" }, "owner@example.com", "website");
  assert.ok(pat.ok);
  for (let d = 0; d < 7; d++) await addWindow(s.db, pat.value.id, String(d), "00:00", "24:00", "owner@example.com");
  const type = await createType(s.db, {
    name: "Intro call", slug: "intro", duration_min: "30", interval_min: "30", buffer_before_min: "0", buffer_after_min: "0",
    min_notice_min: "0", horizon_days: "14", location_kind: "phone",
  }, "owner@example.com", "website");
  assert.ok(type.ok);
  await setHosts(s.db, type.value.id, [pat.value.id]);

  const app = new Hono();
  app.route("/book", bookingPages(() => s.db, {
    base: "/book", domain: "acme.com", css: "/site.css", source: "website",
    onBooked: async (_c, e) => {
      if (e.event === "booked") await bookingSubmission(s.db, e, `/book/${e.type.slug}`);
    },
  }));
  app.route("/admin/schedule", bookingAdmin(() => s.db, {
    base: "/admin/schedule", css: "/site.css", source: "website", timeZone: "UTC",
    sections: { schedule: "/admin/schedule", services: "/admin/services", team: "/admin/team" },
    returnTo: (b) => (b.submission_id ? { href: `/admin/submissions/${b.submission_id}`, label: "Back to the submission" } : null),
  }));
  app.route("/admin/payments", paymentsAdmin(() => s.db, {
    base: "/admin/payments", css: "/site.css", timeZone: "UTC",
    returnTo: (p) => ({ href: `/admin/submissions/${p.ref_id}`, label: "Back to the submission" }),
  }));
  app.route("/admin/submissions", formsAdmin(() => s.db, {
    base: "/admin/submissions", css: "/site.css", timeZone: "UTC",
    links: { booking: (id) => `/admin/schedule/${id}`, payment: (id) => `/admin/payments/${id}` },
  }));
  return app;
}

test("a booking at /book is a submission; its page reschedules and cancels it and comes back", async (t) => {
  const s = await scratch();
  if (!s) return t.skip(why);
  try {
    const app = await setUp(s);
    const html = await (await app.request("/book/intro?tz=UTC")).text();
    const link = /href="(\/book\/intro\/confirm\?start=[^"]+)"/.exec(html)![1].replace(/&amp;/g, "&");
    const start = new URL(link, "http://x").searchParams.get("start")!;
    const _started = await makeStamp("booking:intro", Date.now() - 10_000);
    const res = await app.request("/book/intro", form({ start, tz: "UTC", name: "Ann", email: "ann@example.com", phone: "555 010 0001", notes: "Gate code 12", _started }));
    assert.equal(res.status, 303);

    const [sub] = await s.db.sql`select id::text as id, form_key, name, page, status, data from submissions`;
    assert.deepEqual([sub.form_key, sub.name, sub.page, sub.status], ["book", "Ann", "/book/intro", "new"]);
    assert.deepEqual(sub.data, { service: "Intro call", with: "Pat", notes: "Gate code 12" });
    const [b] = await s.db.sql`select id::text as id, submission_id::text as sid from bookings`;
    assert.equal(b.sid, sub.id);

    // Told twice (a retry), it is still one submission.
    const [raw] = await s.db.sql`select * from bookings`;
    await bookingSubmission(s.db, { event: "booked", booking: { ...raw, id: b.id, answers: {} }, type: { name: "Intro call" }, host: { name: "Pat" } } as never, "/book/intro");
    assert.equal((await s.db.sql`select count(*)::int as n from submissions`)[0].n, 1);

    const inbox = await (await app.request("/admin/submissions", { headers: team })).text();
    assert.match(inbox, /<td[^>]*>Booking<\/td>/);
    assert.match(inbox, /Ann/);
    let page = await (await app.request(`/admin/submissions/${sub.id}`, { headers: team })).text();
    assert.match(page, /Intro call with Pat/);
    assert.match(page, /Notes<\/dt><dd[^>]*>Gate code 12/);
    assert.doesNotMatch(page, />service</, "the service is on the Booking card, not repeated as an answer");
    assert.match(page, new RegExp(`href="/admin/schedule/${b.id}/reschedule"`));

    // Reschedule's way back is the submission.
    page = await (await app.request(`/admin/schedule/${b.id}/reschedule`, { headers: team })).text();
    assert.match(page, new RegExp(`href="/admin/submissions/${sub.id}"`));

    const cancel = await app.request(`/admin/schedule/${b.id}/status`, form({ status: "cancelled" }, team));
    assert.equal(cancel.status, 303);
    assert.equal(cancel.headers.get("location"), `/admin/submissions/${sub.id}?saved=cancelled`);
    page = await (await app.request(`/admin/submissions/${sub.id}?saved=cancelled`, { headers: team })).text();
    assert.match(page, /Booking cancelled\. They have been told\./);
    assert.match(page, /Cancelled/);
    assert.doesNotMatch(page, /Cancel booking/, "nothing left to cancel");

    // A paid submission offers its refund, and the refund page's ways out lead back to it.
    const [pay] = await s.db.sql`
      insert into payments (amount_cents, currency, status, ref_type, ref_id, stripe_payment_intent_id, email)
      values (5000, 'usd', 'paid', 'submission', ${sub.id}, 'pi_1', 'ann@example.com') returning id::text as id`;
    page = await (await app.request(`/admin/submissions/${sub.id}`, { headers: team })).text();
    assert.match(page, /Paid \$50\.00/);
    assert.match(page, new RegExp(`href="/admin/payments/${pay.id}/refund"`));
    page = await (await app.request(`/admin/payments/${pay.id}/refund`, { headers: team })).text();
    assert.equal((page.match(new RegExp(`href="/admin/submissions/${sub.id}"`, "g")) ?? []).length, 2, "the way back and Keep the payment");
  } finally {
    await s.drop();
  }
});
