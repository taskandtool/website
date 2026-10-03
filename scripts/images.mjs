#!/usr/bin/env node
// Photographs ready for the web: `npm run images -- <file> [<file> …]`.
// Each becomes a JPEG in static/images/ at most 2400px wide and, where the
// quality allows, under 300 KB (the hero limit), with ffmpeg or else Pillow.
// It prints each file's path, size and pixels. A photograph neither can
// encode is left out rather than shipped as it is. from-site uses it too.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const MAX_WIDTH = 2400;
const TARGET_BYTES = 300 * 1024;

const pixels = (file) => {
  try {
    const [w, h] = execFileSync("python3", ["-c", "import sys\nfrom PIL import Image\nprint(*Image.open(sys.argv[1]).size)", file], { encoding: "utf8" }).trim().split(" ");
    return { width: Number(w), height: Number(h) };
  } catch {
    return null;
  }
};

// One encode at `quality` (ffmpeg's -q:v, 2 best … 31 worst), else Pillow at the matching 0-100.
function encode(src, dest, q) {
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vf", `scale='min(${MAX_WIDTH},iw)':-2`, "-q:v", String(q), dest], { stdio: "ignore" });
    return true;
  } catch {}
  try {
    const py = "import sys\nfrom PIL import Image\ni = Image.open(sys.argv[1]).convert('RGB')\nif i.width > int(sys.argv[3]): i = i.resize((int(sys.argv[3]), int(sys.argv[3]) * i.height // i.width))\ni.save(sys.argv[2], quality=int(sys.argv[4]))";
    execFileSync("python3", ["-c", py, src, dest, String(MAX_WIDTH), String(Math.max(40, 95 - q * 4))], { stdio: "ignore" });
    return true;
  } catch {}
  return false;
}

/** The web copy of `src` at `dest`: { path, kb, width, height } or null when it could not be made. */
export function webSize(src, dest) {
  for (const q of [5, 7, 9, 12]) {
    if (!encode(src, dest, q)) break;
    if (statSync(dest).size <= TARGET_BYTES || q === 12) {
      const px = pixels(dest);
      return { path: dest, kb: Math.round(statSync(dest).size / 1024), ...(px || {}) };
    }
  }
  return null;
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const usage = "usage: npm run images -- <file> [<file> …]\n\nEach photograph as a JPEG in static/images/, at most 2400px wide and under 300 KB where the quality allows.";
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(usage);
    process.exit(0);
  }
  if (!files.length) {
    console.error(usage);
    process.exit(2);
  }
  mkdirSync("static/images", { recursive: true });
  let failed = 0;
  const written = new Set();
  for (const file of files) {
    if (!existsSync(file)) {
      console.error(`  ${file}: not found`);
      failed++;
      continue;
    }
    // a.png and a.webp in one call would both be a.jpg: the second keeps its extension in the name
    let name = basename(file).replace(/\.[a-z0-9]+$/i, "");
    if (written.has(name)) name = basename(file).replace(/\./g, "-");
    written.add(name);
    const dest = join("static/images", `${name}.jpg`);
    const out = webSize(file, dest);
    if (out) console.log(`  /images/${basename(dest)}  ${out.width ? `${out.width}x${out.height}` : "size unknown (no Pillow)"}  ${out.kb} KB`);
    else {
      console.error(`  ${file}: neither ffmpeg nor Pillow could resize it; left out`);
      failed++;
    }
  }
  process.exit(failed ? 1 : 0);
}
