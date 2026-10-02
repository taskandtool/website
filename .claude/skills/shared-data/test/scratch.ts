// A throwaway database for the snippet tests, made from TEST_DATABASE_URL (a
// role that may create databases) and dropped after. It has what every
// project database has: the shared schema, owned by the platform's group role,
// and the platform's extensions. Roles are cluster-wide, so the group role is
// made once and kept.
//
//   const t = await scratch();          // null when TEST_DATABASE_URL is unset
//   ... t.db.sql`...` ...
//   await t.drop();
import pg from "pg";
import { fromPool } from "../pg";
import { SHARED_ROLE } from "../migrate";
import type { Db } from "../db";

export type Scratch = { db: Db; pool: pg.Pool; url: string; drop: () => Promise<void> };

export const why = "TEST_DATABASE_URL is not set (e.g. postgres://postgres:postgres@localhost/postgres)"; // secret-scan: allow (the local default)

export async function scratch(): Promise<Scratch | null> {
  const admin = process.env.TEST_DATABASE_URL;
  if (!admin) return null;
  const name = "skills_test_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const root = new pg.Client({ connectionString: admin });
  await root.connect();
  await root.query(`create database ${name}`);
  await root.end();

  const u = new URL(admin);
  u.pathname = "/" + name;
  const url = u.toString();
  const pool = new pg.Pool({ connectionString: url, max: 4 });
  await pool.query(`
    create extension if not exists citext;
    create extension if not exists pg_trgm;
    create extension if not exists pgcrypto;
    create schema if not exists shared;
    do $$ begin create role ${SHARED_ROLE} nologin; exception when duplicate_object then null; end $$;
    grant usage, create on schema shared to ${SHARED_ROLE};`);

  return {
    db: fromPool(pool),
    pool,
    url,
    drop: async () => {
      await pool.end();
      const c = new pg.Client({ connectionString: admin });
      await c.connect();
      await c.query(`drop database if exists ${name} with (force)`);
      await c.end();
    },
  };
}
