// A theme's colours as values: every --color-* token in a theme file resolved
// to its hex (following one var() to another token), and the WCAG
// arithmetic over them. Shared by check.mjs (the site's own pairs), lint.mjs
// (the pairs a rendered page actually uses) and from-site.mjs.
import { readFileSync } from "node:fs";

const HEX = /^#[0-9a-fA-F]{6}$/;

/** A theme file read once: its source, a resolver for one token, and every colour token it defines. */
export function readTheme(file = "styles/theme.css") {
  const source = readFileSync(file, "utf8");
  const varHex = (name) => source.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  const colour = (name) => {
    const raw = source.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]?.trim();
    if (!raw) return undefined;
    if (HEX.test(raw)) return raw;
    const ref = raw.match(/^var\(--([a-z0-9-]+)\)$/)?.[1];
    return ref ? varHex(ref) : undefined;
  };
  const colours = Object.fromEntries(
    [...source.matchAll(/--color-([a-z0-9-]+):/g)].map((m) => [m[1], colour(m[1])]).filter(([, v]) => v),
  );
  return { source, colour, colours };
}

const channels = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export function luminance(h) {
  const c = channels(h).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Chroma (0 to 1) and hue (degrees) of a hex, for telling a tint from a neutral. */
export function chromaHue(h) {
  const [r, g, b] = channels(h);
  const mx = Math.max(r, g, b);
  const d = mx - Math.min(r, g, b);
  if (!d) return { chroma: 0, hue: 0 };
  const hue = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { chroma: d, hue: (hue * 60 + 360) % 360 };
}

export const isHex = (v) => HEX.test(v || "");

// The role pairs the layout and components put text on (WCAG 2.x, 4.5:1):
// npm run check measures them, from-site seeds colours that pass them.
export const TEXT_PAIRS = [
  ["ink", "canvas"], ["ink", "surface"], ["ink", "panel"],
  ["ink-2", "canvas"], ["ink-2", "panel"], ["ink-3", "canvas"], ["ink-3", "panel"],
  ["accent", "canvas"], ["accent-ink", "accent"],
  ["night-ink", "night"], ["night-ink-2", "night"],
];
