#!/usr/bin/env node
// Entry point: runs scripts/forms.ts under tsx so it can share the site's own
// TypeScript (the forms skill, src/site.ts) without a build step. --help for usage. The site root is the working directory;
// CALLER_CWD keeps where it was run from, for file arguments.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const r = spawnSync(join(here, "..", "node_modules", ".bin", "tsx"), [join(here, "forms.ts"), ...process.argv.slice(2)], { stdio: "inherit", cwd: join(here, ".."), env: { ...process.env, CALLER_CWD: process.cwd() } });
process.exit(r.status ?? 1);
