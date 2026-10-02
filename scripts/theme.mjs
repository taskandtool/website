// The theme's colours as values: every --color-* token in styles/theme.css
// resolved to its hex (following one var() into the brand block), and the
// WCAG arithmetic over them. Shared by check.mjs (the theme's own pairs) and
// lint.mjs (the pairs a rendered page actually uses).
import { readFileSync } from "node:fs";

const HEX = /^#[0-9a-fA-F]{6}$/;
export const theme = readFileSync("styles/theme.css", "utf8");

const varHex = (name) => theme.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];

/** The hex a colour token resolves to, or undefined (a gradient, a keyword, a missing token). */
export function colour(name) {
  const raw = theme.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!raw) return undefined;
  if (HEX.test(raw)) return raw;
  const ref = raw.match(/^var\(--([a-z0-9-]+)\)$/)?.[1];
  return ref ? varHex(ref) : undefined;
}

/** Every colour token the theme defines, by name, resolved where it can be. */
export const colours = Object.fromEntries(
  [...theme.matchAll(/--color-([a-z0-9-]+):/g)].map((m) => [m[1], colour(m[1])]).filter(([, v]) => v),
);

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
