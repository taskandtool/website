import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { q } from "../db";
import { normalizeEmail } from "../email";
import { additiveProblems, applySchema, SHARED_ROLE, statements } from "../migrate";
import { scratch, why } from "../../shared-data/test/scratch";

test("q numbers the parameters and never splices a value", () => {
  assert.deepEqual(q`select * from t where a = ${1} and b = ${"x'; drop table t; --"}`, {
    text: "select * from t where a = $1 and b = $2",
    values: [1, "x'; drop table t; --"],
  });
});

test("an email is trimmed, lowered, and refused when it is not one", () => {
  assert.equal(normalizeEmail("  Ann@Example.COM "), "ann@example.com");
  assert.equal(normalizeEmail("ann@example"), null);
  assert.equal(normalizeEmail("a b@example.com"), null);
  assert.equal(normalizeEmail(42), null);
  for (const bad of ["Bank<evil@a.b>", "a,b@x.com", '"a"@x.com', "a@x.com\r\nBcc: c@d.e", "a;b@x.com", "a@x.", "a@.com"]) {
    assert.equal(normalizeEmail(bad), null, bad);
  }
  for (const ok of ["ann.lee+tag@sub.example.co.uk", "o'neil@example.ie", "x_y-z@ex-ample.io"]) assert.equal(normalizeEmail(ok), ok);
});

test("a schema file that only grows passes; anything else is refused", () => {
  const ok = `
    -- a comment; with a semicolon
    create table if not exists shared.things (id bigserial primary key, email citext not null);
    create index if not exists things_email on shared.things (email);
    alter table shared.things add column if not exists note text;
    comment on table shared.things is 'Things';`;
  assert.deepEqual(additiveProblems(ok), []);
  assert.equal(statements(ok).length, 4);
  assert.deepEqual(statements("comment on table shared.t is 'a; b -- c ''d''';\ncomment on column shared.t.x is 'y'"), [
    "comment on table shared.t is 'a; b -- c ''d'''",
    "comment on column shared.t.x is 'y'",
  ]);

  for (const bad of [
    "drop table shared.things",
    "alter table shared.things rename column note to notes",
    "alter table shared.things alter column note type int",
    "alter table shared.things add constraint c check (true)",
    "create table shared.things (id int)",
    "create table if not exists things (id int)",
    "alter table shared.things add column if not exists x int, drop column note",
    "do $$ begin end $$",
  ]) {
    assert.notDeepEqual(additiveProblems(bad), [], bad);
  }
});

test("every skill's schema.sql in this repo is additive", () => {
  for (const dir of readdirSync(".", { withFileTypes: true })) {
    const f = `${dir.name}/schema.sql`;
    if (dir.isDirectory() && existsSync(f)) assert.deepEqual(additiveProblems(readFileSync(f, "utf8")), [], f);
  }
});

test("applySchema runs twice cleanly and refuses before running anything", async (t) => {
  const s = await scratch();
  if (!s) return t.skip(why);
  try {
    const v1 = "create table if not exists shared.things (id bigserial primary key, email citext not null)";
    const v2 = v1 + ";\nalter table shared.things add column if not exists note text";
    await applySchema(s.db, v1);
    await applySchema(s.db, v2);
    await applySchema(s.db, v1); // an older app starting again changes nothing
    await s.db.sql`insert into shared.things (email, note) values (${"A@x.com"}, ${"n"})`;
    const [row] = await s.db.sql`select note from shared.things where email = ${"a@X.com"}`;
    assert.equal(row.note, "n");

    await assert.rejects(applySchema(s.db, v2 + ";\ndrop table shared.things"), /refused/);
    assert.equal((await s.db.sql`select count(*)::int as n from shared.things`)[0].n, 1);
  } finally {
    await s.drop();
  }
});

test("a transaction is all or nothing", async (t) => {
  const s = await scratch();
  if (!s) return t.skip(why);
  try {
    await s.db.sql`create table shared.t (id int primary key)`;
    await assert.rejects(s.db.transaction([q`insert into shared.t values (${1})`, q`insert into shared.t values (${1})`]));
    assert.equal((await s.db.sql`select count(*)::int as n from shared.t`)[0].n, 0);
    const [, rows] = await s.db.transaction([q`insert into shared.t values (${2})`, q`select id from shared.t`]);
    assert.deepEqual(rows, [{ id: 2 }]);
  } finally {
    await s.drop();
  }
});

test("as a member of the shared role, tables are created owned by it", async (t) => {
  const s = await scratch();
  if (!s) return t.skip(why);
  try {
    await applySchema(s.db, "create table if not exists shared.owned (id int)");
    const [{ owner }] = await s.db.sql`select tableowner as owner from pg_tables where schemaname = 'shared' and tablename = 'owned'`;
    assert.equal(owner, SHARED_ROLE);
  } finally {
    await s.drop();
  }
});
