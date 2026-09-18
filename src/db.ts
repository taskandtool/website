// The project's database, when this app has one. The Neon serverless HTTP
// driver runs identically on the machine (Node) and at the edge (Workers), on
// the one DATABASE_URL the owner granted this app. Task & Tool delivers it as
// an env var on the machine and as a Worker binding at the edge.
//
//   import { sql } from "./db";
//   const rows = await sql(c.env)`select id, name from leads order by id desc limit 20`;
//
// If sql(env) throws, the app has no database yet: on Task & Tool the owner
// adds one with the Postgres add-on (the AI can ask with request_capability).
import { neon } from "@neondatabase/serverless";

type Env = Record<string, unknown> | undefined;

export function databaseUrl(env?: Env): string | undefined {
  const fromBinding = env && typeof env.DATABASE_URL === "string" ? env.DATABASE_URL : undefined;
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return fromBinding ?? proc?.env?.DATABASE_URL;
}

export function sql(env?: Env) {
  const url = databaseUrl(env);
  if (!url) {
    throw new Error("DATABASE_URL is not set: this app has no database yet.");
  }
  return neon(url);
}
