// npm run system -- set: a value changes where it stands and a new one goes in
// under its group, so the rest of the record, comments and wrapping included,
// is untouched; a repeat says already; a spacing step named like a display
// value is a problem.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { problems, setValues } from "../scripts/system.mjs";

const RECORD = `identity:
  direction: "to fill" # the thesis
tokens:
  colors:
    accent: "#2f5bea"
  spacing:
    section: 5rem
sections:
  overview: >
    A long paragraph that is wrapped
    by hand and must stay wrapped.
x_declares: []
x_declares_reasons: {}
`;

test("a value already there changes in place, and nothing else does", () => {
  const { text, said } = setValues(RECORD, ["colors.accent=#435331", "identity.direction=Olive and paper"]);
  assert.equal(text, RECORD.replace('"#2f5bea"', '"#435331"').replace('"to fill"', '"Olive and paper"'));
  assert.deepEqual(said, ['  tokens.colors.accent: "#2f5bea" -> "#435331"', '  identity.direction: "to fill" -> "Olive and paper"']);
});

test("a new value goes in under its group, a new group nests, numbers stay numbers", () => {
  const { text } = setValues(RECORD, ["colors.pastry=#e8d9a8", "x_imagery.hero=full-bleed", "spacing.gutter=24"]);
  const rec = YAML.parse(text);
  assert.equal(rec.tokens.colors.pastry, "#e8d9a8");
  assert.deepEqual(rec.x_imagery, { hero: "full-bleed" });
  assert.equal(rec.tokens.spacing.gutter, 24);
  assert.match(text, /wrapped\n    by hand and must stay wrapped\./);
});

test("a list is set whole and an inline group takes a new value", () => {
  const rec = YAML.parse(setValues(RECORD, ['x_declares=["eyebrow"]', "x_declares_reasons.eyebrow=It names the place"]).text);
  assert.deepEqual(rec.x_declares, ["eyebrow"]);
  assert.deepEqual(rec.x_declares_reasons, { eyebrow: "It names the place" });
});

test("setting what is already there says so", () => {
  assert.deepEqual(setValues(RECORD, ["colors.accent=#2f5bea"]).said, ['  tokens.colors.accent: already "#2f5bea"']);
});

test("a spacing step named block would give inline-block a width", () => {
  const rec = { tokens: { colors: {}, typography: { display: { fontFamily: "A" }, copy: { fontFamily: "B" } }, spacing: { block: "2rem" } } };
  assert.match(problems(rec).join(" "), /tokens\.spacing\.block: a display name/);
});

test("set refuses wrong input with exit 2 before any work", async () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  for (const [args, said] of [[["set"], /name what to change/], [["set", "accent"], /is not path=value/], [["sett", "a=1"], /no command "sett"/], [["set", "tokens.colors=1"], /holds several values/]]) {
    const r = await new Promise((done) =>
      execFile(process.execPath, ["scripts/system.mjs", ...args], { cwd: root, encoding: "utf8" }, (err, stdout, stderr) => done({ status: err?.code ?? 0, stdout, stderr })),
    );
    assert.equal(r.status, 2, `${args.join(" ")}: ${r.stderr}`);
    assert.match(r.stderr, said);
    assert.match(r.stderr, /Try: /);
  }
});
