// Opening hours as a visitor reads them: 12-hour times, runs of days named.
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatHours } from "../site";

test("hours read in 12-hour time", () => {
  assert.equal(formatHours("Mo-Fr 08:00-17:00; Sa 09:00-12:30"), "Monday to Friday 8am to 5pm, Saturday 9am to 12:30pm");
  assert.equal(formatHours("Su 07:30-14:30"), "Sunday 7:30am to 2:30pm");
  assert.equal(formatHours("Fr-Sa 18:00-00:00"), "Friday to Saturday 6pm to 12am");
});

test("a part that is not in schema.org form is kept as written", () => {
  assert.equal(formatHours("By appointment"), "By appointment");
});
