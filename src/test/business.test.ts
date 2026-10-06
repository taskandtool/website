// The business routes' wiring (src/business.tsx) on a site with no database
// yet: its pages serve as before, the business paths do not exist, Stripe is
// told to deliver again, and /admin stays shut to anyone the edge does not
// name. With a database, the flows are the skills' own tests and live_website.
import { test } from "node:test";
import assert from "node:assert/strict";

delete process.env.DATABASE_URL;
delete process.env.ADMIN_DEV_USER;
const { default: app } = await import("../app");

test("without a database the pages serve and the business paths are not there", async () => {
  assert.equal((await app.request("/")).status, 200);
  for (const path of ["/forms/contact", "/forms/order/start", "/book", "/book/intake"]) {
    assert.equal((await app.request(path)).status, 404, path);
  }
  assert.equal((await app.request("/forms/contact", { method: "POST", body: new URLSearchParams({ name: "A" }) })).status, 404);
});

test("Stripe is answered 503 until there is a database, so it delivers again; only a POST is the webhook", async () => {
  const res = await app.request("/hooks/stripe", { method: "POST", body: "{}", headers: { "stripe-signature": "t=1,v1=x" } });
  assert.equal(res.status, 503);
  assert.equal((await app.request("/hooks/stripe")).status, 404);
});

test("/admin is 404 to a visitor, and tells the team there is no database yet", async () => {
  assert.equal((await app.request("/admin/forms")).status, 404);
  assert.equal((await app.request("/admin/forms", { headers: { "x-tasktool-user": "Owner@Example.com" } })).status, 503);
  const res = await app.request("/admin", { headers: { "x-tasktool-user": "owner@example.com" } });
  assert.match(await res.text(), /no database yet/);
});
