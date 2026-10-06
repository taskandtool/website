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
import { done, fail, flag, has, misused } from "../src/data/cli.mjs";
import { imageSizes, start } from "./lib.mjs";

export const MAX_WIDTH = 2400;
const TARGET_BYTES = 300 * 1024;

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
      const [px] = imageSizes([dest]);
      return { path: dest, kb: Math.round(statSync(dest).size / 1024), ...(px || {}) };
    }
  }
  return null;
}

/** True when the picture has transparent pixels (Pillow), so it stays a PNG. */
const transparent = (file) => {
  try {
    const py = "import sys\nfrom PIL import Image\ni = Image.open(sys.argv[1])\nprint(1 if ('A' in i.mode or 'transparency' in i.info) and i.convert('RGBA').getchannel('A').getextrema()[0] < 255 else 0)";
    return execFileSync("python3", ["-c", py, file], { encoding: "utf8" }).trim() === "1";
  } catch {
    return false;
  }
};

/** A transparent picture at most MAX_WIDTH wide, kept as PNG. */
function pngSize(src, dest) {
  try {
    const py = "import sys\nfrom PIL import Image\ni = Image.open(sys.argv[1]).convert('RGBA')\nw = int(sys.argv[3])\nif i.width > w: i = i.resize((w, w * i.height // i.width))\nbox = i.getchannel('A').getbbox()\ni = i.crop(box) if box else i\ni.save(sys.argv[2], optimize=True)\nprint(i.width, i.height)";
    const [width, height] = execFileSync("python3", ["-c", py, src, dest, String(MAX_WIDTH)], { encoding: "utf8" }).trim().split(" ").map(Number);
    return { path: dest, kb: Math.round(statSync(dest).size / 1024), width, height };
  } catch {
    return null;
  }
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const a = start("images", `usage: npm run images -- <file> [<file> …] [--as <name>] [--logo]

Each picture for the web: a photograph as a JPEG in static/images/, at most
2400px wide and under 300 KB where the quality allows; a transparent picture
stays a PNG, trimmed to its edges. Files sent in chat are in uploads/; their
time stamp is dropped from the name. Prints each file's web path, pixels and
size; one already done since the original last changed is left alone.
  --as <name>   the file's name (one file)
  --logo        into static/images/logos/, for public/proof.md's logos`, { flags: ["as"], bools: ["logo"], args: true });
  const as = flag(a, "as") || "";
  const logo = has(a, "logo");
  const files = a._;
  if (!files.length) misused("images: name the picture(s) to prepare", "npm run images -- uploads/<file>");
  if (has(a, "as") && !as) misused("images: --as needs the file's name", "npm run images -- <file> --as hero");
  if (as && files.length > 1) misused("images: --as names one file, and it was given several", "npm run images -- <file> --as <name>");
  const dir = logo ? "static/images/logos" : "static/images";
  mkdirSync(dir, { recursive: true });
  const missed = [];
  const written = new Set();
  const lines = [];
  for (const file of files) {
    if (!existsSync(file)) {
      missed.push(`${file}: not found`);
      continue;
    }
    // a chat upload is <date>-<time>-<nonce>-<name>: keep the name
    let name = as || basename(file).replace(/^\d{8}-\d{6}-[a-z0-9]+-/i, "").replace(/\.[a-z0-9]+$/i, "");
    name = name.replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
    // a.png and a.webp in one call would collide: the second keeps its extension in the name
    if (written.has(name)) name = basename(file).replace(/\./g, "-").toLowerCase();
    written.add(name);
    const keepAlpha = logo || transparent(file);
    const dest = join(dir, `${name}.${keepAlpha ? "png" : "jpg"}`);
    const web = `/${dest.replace(/^static\//, "")}`;
    if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(file).mtimeMs) {
      lines.push(`${web}  already done, left alone`);
      continue;
    }
    const out = keepAlpha ? pngSize(file, dest) : webSize(file, dest);
    if (out) lines.push(`${web}  ${out.width ? `${out.width}x${out.height}` : "size unknown (no Pillow)"}  ${out.kb} KB${keepAlpha ? "  transparent" : ""}`);
    else missed.push(`${file}: neither ffmpeg nor Pillow could resize it; left out`);
  }
  const next = logo
    ? "add each to public/proof.md's logos with its name; the homepage shows them"
    : "describe each in brand/images.md, then use it by path, at no more than the width printed";
  if (missed.length && !lines.length) fail(`images: none prepared\n  ${missed.join("\n  ")}`, "ls uploads/, for the files sent in chat");
  done("images", `${lines.length} of ${files.length} ready in ${dir}/`, { lines: [...lines, ...missed.map((m) => `left out: ${m}`)], next });
  if (missed.length) process.exit(1);
}
