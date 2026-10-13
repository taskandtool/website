// The record's problems: a spacing step named like a display value is one.
import { test } from "node:test";
import assert from "node:assert/strict";
import { problems } from "../scripts/system.mjs";

test("a spacing step named block would give inline-block a width", () => {
  const rec = { tokens: { colors: {}, typography: { display: { fontFamily: "A" }, copy: { fontFamily: "B" } }, spacing: { block: "2rem" } } };
  assert.match(problems(rec).join(" "), /tokens\.spacing\.block: a display name/);
});
