// The project database's tables for this site's forms, bookings and payments:
// the skills' schema.sql files through applySchema (additive only, safe to
// re-run, behind the lock every app on the project shares). Machine only.
//
//   npm run db:setup        `npm run dev` runs it before the server starts; `npm run deploy` before the build
//
// Without DATABASE_URL (this shell's or /home/sprite/.env's) it says so and
// exits 0: a site with no database is a site of pages.
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { done, fail, machineEnv } from "../src/data/cli.mjs";
import type { Db } from "../src/data/db";
import { applySchema } from "../src/data/migrate";
import { fromPool } from "../src/data/pg";
import { start } from "./lib.mjs";

/** forms first: a booking and a payment name a submission. */
const SCHEMAS = ["forms", "booking", "payments"];

async function setupDb(db: Db): Promise<void> {
  // The two extensions every project database has, made here too for a
  // Postgres off Task & Tool. On Neon the app's login may not create them, and
  // IF NOT EXISTS returns before asking; a missing one fails below, by name.
  await db.sql`create extension if not exists citext`.catch(() => {});
  await db.sql`create extension if not exists pg_trgm`.catch(() => {});
  for (const s of SCHEMAS) await applySchema(db, readFileSync(fileURLToPath(new URL(`../src/${s}/schema.sql`, import.meta.url)), "utf8"));
}

const databaseUrl = () => machineEnv().DATABASE_URL || undefined;

/** The database for a script, its tables set up first, so a script works on a fresh project too. */
export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const url = databaseUrl();
  if (!url) fail("database: DATABASE_URL is not set, so this site has no database yet", "python3 ~/tools/taskandtool.py request-capability postgres");
  if (!/^postgres(ql)?:\/\//.test(url)) fail("database: DATABASE_URL is not a postgres:// address", "grep DATABASE_URL /home/sprite/.env");
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

Brings the project database's forms, booking and payments tables up to date
and prints which. Safe to re-run; without DATABASE_URL it says so and exits 0.`, { tryHelp: "npm run db:setup -- --help" });
  if (!databaseUrl()) {
    done("db", "no DATABASE_URL, nothing to set up", { lines: ["the forms, booking and admin paths answer 404 until there is one"] });
    process.exit(0);
  }
  await withDb(async () => {});
  done("db", `tables up to date (${SCHEMAS.join(", ")})`);
}
