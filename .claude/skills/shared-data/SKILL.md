---
name: shared-data
description: "The project's shared Postgres schema every app reads and writes (shared.* tables, email as the key, additive schema files), and the database handle, settings, gateway calls, email and spam checks for dev and production. Use before writing a shared table or copying another skill. Not for tables only this app uses."
---

# Shared data

Every app in a project can be granted the same Postgres database. Each app has
its own login and its own schema for what is only its own. Next to those is
one schema, `shared`, that every granted app reads and writes. Website form
submissions, bookings and payments live there, so a CRM installed later finds
them already full.

Version: 0.1.0 (taskandtool/skills)

## The rules

- **What another app could want goes in `shared`; what only this app uses goes
  in its own schema.** A submission, a booking, a payment: shared. This app's
  settings, drafts, its own notes: its own schema (unqualified names land there).
- **Always write the schema name**: `shared.bookings`, never `bookings`. The
  app's own schema comes first on its search path, so an unqualified name can
  quietly mean a different table.
- **A person is an email.** Every shared table that names a person has
  `email citext`. Store it through `normalizeEmail` (`email.ts`). Nothing else
  links people across apps: no shared people table, no foreign keys between
  apps' tables.
- **Look before you build.** Before creating anything, list what is there:
  `select table_name from information_schema.tables where table_schema = 'shared'`.
  A table another app made is the one to use. Never make a second
  `shared.leads` beside `shared.submissions`.
- **Shared tables only grow.** Another app may run an older or newer copy of
  the same skill. A `schema.sql` holds only `create table if not exists
  shared.x`, `create [unique] index if not exists … on shared.x`, `alter table
  shared.x add column if not exists …` and `comment on`. Put constraints inline
  in `create table`, or on the column in `add column`. Never drop, rename or
  change a type; add a new column and stop writing the old one.
  `applySchema` refuses anything else before running any of it.
- **A column added in a later version gets its own line**:
  `alter table shared.x add column if not exists y …`, as well as being in
  the `create table`. `create table if not exists` skips a table that is
  already there, so a project whose table an older copy made never gets a
  column that is only inside the `create`.
- **Times are `timestamptz`.** Store the IANA zone next to any time a person
  chose in their own zone (`time_zone text`). Never store a local time without
  its zone.
- **Money is an integer in minor units** with a currency (`amount_cents
  bigint`, `currency text`). Never a float.
- **Rows say who wrote them**: `source text` (the app's slug, e.g. `website`),
  `created_at timestamptz not null default now()`, and `updated_by citext`
  (the team member's email) on anything a person edits.

## The database handle

Snippets take a `Db` (`db.ts`): `db.sql` runs one statement and returns its
rows; `db.transaction([q`…`, q`…`])` runs statements all or nothing. Every value
is a parameter. A transaction is non-interactive: decide inside the SQL
(`insert … select … where not exists`, `returning`), not in JavaScript
between statements. That is the shape the Neon HTTP driver allows, so it is
the only one a snippet assumes.

Every route factory takes a `GetDb`, `(c) => Db`, as its first argument,
then its options (`base`, `css`, `timeZone`, `nav`, `pageSize`, `source` where
they apply). In production the handle is made per request from the
binding; in dev the function returns the app's one handle.

Each app makes its handle from the driver it already uses:

- **The Neon HTTP driver** (the Website): `fromNeon(envVar(c,
  "DATABASE_URL"))` from `neon.ts`, the same in dev and production.
- **`pg`** (the Board, the CRM): `fromPool(pool)` from `pg.ts`. In dev, the
  server's one pool. In production, a pool per request on
  `env.DATABASE_URL`, closed in `ctx.waitUntil`, deployed with
  `--flag nodejs_compat` (the `deploy` skill).

## Settings, the gateway, email, spam

- **Settings** (`env.ts`): `envVar(c, name)` reads a Worker binding in
  production and `process.env` in dev; `envOf(c)` passes them to code that
  takes an `Env`. Never `c.env ?? process.env`: on the machine `c.env` is
  node-server's `{ incoming, outgoing }`, so that reads nothing.
- **A connection** (`gateway.ts`):
  `gatewayFetch(env, slug, path, init)`. The gateway adds the key; it
  serves dev only, and production calls the vendor directly with the key
  the owner bound to it (`delivery="edge"`).
  That key's env name is the connection's `env_name` in `list_connections()`
  (`<SLUG>_API_KEY`); read it there rather than assuming it.
- **Email** (`send.ts`): `sendEmail(env, mail)` through the owner's Resend or
  Postmark, set once by `NOTIFY_FROM` and `NOTIFY_VIA`
  (`resend|postmark[:slug]`); it never throws. Run it with
  `afterResponse(c, …)` so the visitor does not wait and the Worker does not
  stop before it is sent.
- **Spam** (`spam.tsx`): every public form carries `<SpamFields>` and is
  checked with `verdict`; set `SPAM_SECRET` so the stamp is signed.

## Installing a skill's code into this app

A skill's `.ts`/`.tsx` files are snippets: copy them into `src/<skill>/` and
this skill's into `src/shared-data/`, so `../shared-data/db` resolves the same
here as in the skills repo. Copy a skill's `test/` with it. Then:

1. Run its `schema.sql` with `applySchema` from the app's setup or start
   script (machine only, never per request):
   `await applySchema(db, readFileSync("src/booking/schema.sql", "utf8"))`.
2. Add the dependency the handle needs if the app lacks it
   (`@neondatabase/serverless` or `pg`).
3. Run the copied tests and the app's typecheck.

Adapt freely after copying: the copy is this app's code. Keep the rules above,
and keep the tests passing.

## When the database is not there

No `DATABASE_URL` means the app has no database yet: ask the owner with
`request_capability("postgres", why)` from `tools/taskandtool.py`. No `shared`
schema means the platform has not set it up for this project yet: say so
plainly and do not create it.

## Files

| File | What it is |
|---|---|
| `db.ts` | `Db`, `GetDb`, `q` |
| `neon.ts`, `pg.ts` | the two handles: Neon HTTP (edge and machine), node-postgres (machine only) |
| `migrate.ts` | `applySchema`, the additive check |
| `email.ts` | `normalizeEmail` |
| `env.ts` | `envVar`, `envOf`, `setting`, `keyName` |
| `gateway.ts` | `gatewayFetch` (machine only at run time) |
| `send.ts` | `sendEmail`, `afterResponse` |
| `spam.tsx` | `SpamFields`, `makeStamp`, `verdict` |
| `test/` | the additive check, the handles, settings, sending, spam |
