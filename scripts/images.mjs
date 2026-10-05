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
  const args = process.argv.slice(2);
  const as = args.includes("--as") ? args[args.indexOf("--as") + 1] : "";
  const logo = args.includes("--logo");
  const files = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--as");
  const usage = `usage: npm run images -- <file> [<file> …] [--as <name>] [--logo]

Each picture for the web: a photograph as a JPEG in static/images/, at most
2400px wide and under 300 KB where the quality allows; a transparent picture
stays a PNG, trimmed to its edges. Files sent in chat are in uploads/; their
time stamp is dropped from the name.
  --as <name>   the file's name (one file)
  --logo        into static/images/logos/, for public/proof.md's logos`;
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage);
    process.exit(0);
  }
  if (!files.length || (as && files.length > 1)) {
    console.error(usage);
    process.exit(2);
  }
  const dir = logo ? "static/images/logos" : "static/images";
  mkdirSync(dir, { recursive: true });
  let failed = 0;
  const written = new Set();
  const shipped = [];
  for (const file of files) {
    if (!existsSync(file)) {
      console.error(`  ${file}: not found`);
      failed++;
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
      console.log(`  ${web}  already done`);
      shipped.push(web);
      continue;
    }
    const out = keepAlpha ? pngSize(file, dest) : webSize(file, dest);
    if (out) {
      console.log(`  ${web}  ${out.width ? `${out.width}x${out.height}` : "size unknown (no Pillow)"}  ${out.kb} KB${keepAlpha ? "  transparent" : ""}`);
      shipped.push(web);
    } else {
      console.error(`  ${file}: neither ffmpeg nor Pillow could resize it; left out`);
      failed++;
    }
  }
  if (shipped.length)
    console.log(logo
      ? "Next: add each to public/proof.md's logos with its name; the homepage shows them."
      : "Next: describe each in brand/images.md, then use it by path, at no more than the width printed.");
  process.exit(failed ? 1 : 0);
}
