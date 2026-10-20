// The project database's tables for this site's forms, bookings, payments and customers
// (and the data skill's: the business, email opt-outs):
// the skills' schema.sql files through applySchema (safe to re-run, behind
// the lock every app on the project shares). Machine only.
//
//   npm run db:setup        `npm run dev` runs it before the server starts; `npm run deploy` before the build
//
// It also fills in what the project's business row (data/business.ts: the
// name texts, quotes and the texting box use, set in the CRM's Settings,
// Business) lacks, from this site's notes: the name and address
// (public/business.md) and, once the site has its address, its privacy and
// terms pages (legal/). Only what is empty: the row is the owner's.
//
// Without DATABASE_URL (this shell's or ~/.env's) it says so and
// exits 0: a site with no database is a site of pages.
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { done, fail, machineEnv } from "../src/data/cli.mjs";
import type { Db } from "../src/data/db";
import { businessOf, saveBusiness, type Business } from "../src/data/business";
import { applySchema } from "../src/data/migrate";
import { fromPool } from "../src/data/pg";
import { start } from "./lib.mjs";

/** data first (the business, email opt-outs), then forms: a booking and a payment name a submission. */
const SCHEMAS = ["data", "forms", "booking", "payments", "customers"];

async function setupDb(db: Db): Promise<void> {
  // The two extensions every project database has, made here too for a
  // Postgres off Task & Tool. On Neon the app's login may not create them, and
  // IF NOT EXISTS returns before asking; a missing one fails below, by name.
  await db.sql`create extension if not exists citext`.catch(() => {});
  await db.sql`create extension if not exists pg_trgm`.catch(() => {});
  for (const s of SCHEMAS) await applySchema(db, readFileSync(fileURLToPath(new URL(`../src/${s}/schema.sql`, import.meta.url)), "utf8"));
}

/** What this site's notes say of the business, for the row's empty parts: nothing before `npm run content` has run. */
async function fromNotes(): Promise<Partial<Business>> {
  const { site } = await import("../src/site").catch(() => ({ site: null }));
  const { content } = await import("../src/content").catch(() => ({ content: null }));
  const b = content?.facts.business;
  if (!site || !b) return {};
  const origin = /^https:\/\//.test(site.url) ? new URL(site.url).origin : null;
  const page = (re: RegExp) => {
    const l = content.legal.find((x) => re.test(x.path) || re.test(x.title));
    return origin && l ? `${origin}${l.path}` : undefined;
  };
  return { name: b.name, address: site.contact.address || undefined, privacyUrl: page(/privacy/i), termsUrl: page(/terms/i) };
}

/** Fill the business row's empty parts from the notes; what differs is said, never changed. What it did, in lines. */
export async function fillBusiness(db: Db, notes: Partial<Business>): Promise<string[]> {
  const had = await businessOf(db);
  const empty = Object.fromEntries(Object.entries(notes).filter(([k, v]) => v && !had[k as keyof Business]));
  const said: string[] = [];
  if (Object.keys(empty).length) {
    const r = await saveBusiness(db, empty, "website");
    said.push(r.ok ? `the business row was missing ${Object.keys(empty).join(", ")}: filled from this site's notes` : `note: the business row's empty parts were not filled from this site's notes: ${r.why}`);
  }
  if (had.name && notes.name && had.name !== notes.name) {
    said.push(`note: texts, quotes and the texting box say "${had.name}" (Settings, Business in the CRM); this site's header says "${notes.name}" (public/business.md). Make them the same, in one or the other.`);
  }
  return said;
}

const databaseUrl = () => machineEnv().DATABASE_URL || undefined;

/** The database for a script, its tables set up first, so a script works on a fresh project too. */
export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const url = databaseUrl();
  if (!url) fail("database: DATABASE_URL is not set, so this site has no database yet", "python3 ~/tools/taskandtool.py request-capability postgres");
  if (!/^postgres(ql)?:\/\//.test(url)) fail("database: DATABASE_URL is not a postgres:// address", "grep DATABASE_URL ~/.env");
  // A database that never answers fails in seconds, so `npm run dev` still starts the pages.
  const pool = new pg.Pool({ connectionString: url, max: 2, connectionTimeoutMillis: 20_000, query_timeout: 120_000 });
  // A refused connection is an AggregateError with no message of its own, only a code.
  const why = (e: unknown) => (e instanceof Error && (e.message || (e as { code?: string }).code)) || String(e);
  const db = fromPool(pool);
  try {
    try {
      await setupDb(db);
    } catch (e) {
      return fail(`database: ${why(e)}`, "npm run db:setup, which says whether the database answers");
    }
    // the command's own failure, named for the script that ran it, never a stack trace
    try {
      return await fn(db);
    } catch (e) {
      return fail(`${basename(process.argv[1] ?? "db", ".ts")}: ${why(e)}`, "npm run db:setup, then the same command again");
    }
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  start("db", `usage: npm run db:setup

Brings the project database's forms, booking, payments and customers
tables up to date, and fills the business row's empty parts (name,
address, privacy and terms pages) from this site's notes. Safe to re-run;
without DATABASE_URL it says so and exits 0.`, { tryHelp: "npm run db:setup -- --help" });
  if (!databaseUrl()) {
    done("db", "no DATABASE_URL, nothing to set up", { lines: ["until there is one, the forms and booking pages answer 404 and /admin says so"] });
    process.exit(0);
  }
  const notes = await fromNotes();
  const lines = await withDb((db) => fillBusiness(db, notes));
  done("db", `tables up to date (${SCHEMAS.join(", ")})`, { lines });
}
