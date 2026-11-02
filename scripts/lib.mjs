// What several scripts share: reading their arguments, walking a folder, the
// page paths, a note's frontmatter and image sizes.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, plain } from "../src/data/cli.mjs";

/**
 * A script's arguments, checked before it does anything: --help or -h prints
 * `help` and exits 0; a flag it does not take, or an argument when it takes
 * none, exits 2 with a Try line. `flags` are the flags with a value, `bools`
 * the ones without (so `--first-screen /about` keeps /about as an argument);
 * `tryHelp` is how a script with no .mjs launcher is asked for its usage.
 */
export function start(script, help, { flags = [], bools = [], args = false, tryHelp = `node scripts/${script}.mjs --help` } = {}) {
  const a = parseArgs(process.argv.slice(2), { bare: bools });
  plain(a, help, script, { flags: [...flags, ...bools], args, tryCmd: tryHelp });
  return a;
}

/** Every file under a folder, node_modules left out. */
export const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return e === "node_modules" ? [] : statSync(p).isDirectory() ? walk(p) : [p];
  });

/** Every page module's path, `{ file, path }`, from src/pages/. */
export const pagePaths = () =>
  walk("src/pages")
    .filter((f) => f.endsWith(".tsx"))
    .flatMap((file) => [...readFileSync(file, "utf8").matchAll(/path:\s*["']([^"']+)["']/g)].map((m) => ({ file, path: m[1] })));

/** A note split at its frontmatter: `{ front, body }`, or null when it has none. */
export const frontmatter = (raw) => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { front: m[1], body: m[2] } : null;
};

/** Each image's pixels, `{ width, height }`, or null for one Pillow cannot read (all null without Pillow). */
export const imageSizes = (files) => {
  try {
    const py = "import sys\nfrom PIL import Image\nfor f in sys.argv[1:]:\n    try:\n        print(*Image.open(f).size)\n    except Exception:\n        print('-')";
    const lines = execFileSync("python3", ["-c", py, ...files], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n");
    return files.map((_, i) => {
      const [w, h] = (lines[i] || "-").split(" ").map(Number);
      return w && h ? { width: w, height: h } : null;
    });
  } catch {
    return files.map(() => null);
  }
};
