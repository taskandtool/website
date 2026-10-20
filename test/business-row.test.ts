// The project's business row (data/business.ts) gets its empty parts from
// this site's notes at `npm run db:setup`, and only those: the owner's
// name, set in the CRM, stays, and a name that differs is said.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { applySchema } from "../src/data/migrate";
import { businessOf, saveBusiness } from "../src/data/business";
import { scratch, why } from "../src/data/test/scratch";
import { fillBusiness } from "../scripts/db";

test("db:setup fills the business row's empty parts from the notes, and never overwrites the owner's", async (t) => {
  const s = await scratch();
  if (!s) return t.skip(why);
  try {
    await applySchema(s.db, readFileSync(new URL("../src/data/schema.sql", import.meta.url), "utf8"));
    const notes = { name: "Harlow Joinery", address: "4 Mead Street, Bristol, BS3 4RP", privacyUrl: "https://harlow.example/privacy-policy" };
    assert.deepEqual(await fillBusiness(s.db, notes), ["the business row was missing name, address, privacyUrl: filled from this site's notes"]);
    assert.deepEqual(await businessOf(s.db), { name: "Harlow Joinery", address: "4 Mead Street, Bristol, BS3 4RP", privacyUrl: "https://harlow.example/privacy-policy", termsUrl: null });
    assert.deepEqual(await fillBusiness(s.db, notes), [], "nothing empty: nothing to say");

    await saveBusiness(s.db, { name: "Harlow Joinery Ltd" }, "owner@harlow.example");
    const said = await fillBusiness(s.db, { ...notes, termsUrl: "https://harlow.example/terms" });
    assert.equal(said[0], "the business row was missing termsUrl: filled from this site's notes");
    assert.match(said[1], /^note: texts, quotes and the texting box say "Harlow Joinery Ltd" .* this site's header says "Harlow Joinery"/);
    assert.equal((await businessOf(s.db)).name, "Harlow Joinery Ltd", "the owner's name stays");
  } finally {
    await s.drop();
  }
});
