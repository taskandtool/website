// The starter brand: what the site falls back to for anything brand.json
// leaves out. scripts/brand.mjs carries the same colour and font defaults
// for the CSS side; keep the two in step.
export const brandDefaults = {
  schema: "taskandtool/brand/1",
  name: "Your business",
  tagline: "",
  description: "",
  locale: "en",
  url: "",
  contact: { phone: "", email: "", address: "", hours: "" },
  social: {} as Record<string, string>,
  logo: { file: "", alt: "" },
  colors: { primary: "#2f5bea", dark: "#14110d", light: "#f6f3ec", neutral: "#57514a" } as Record<string, string>,
  fonts: {
    display: "Bricolage Grotesque",
    body: "Inter",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600&display=swap",
  },
};

export type Brand = typeof brandDefaults;

/** brand.json over the defaults, one level deep, so a partial file still renders. */
export function withDefaults(json: Record<string, unknown>): Brand {
  const out: Record<string, unknown> = { ...brandDefaults };
  for (const [key, def] of Object.entries(brandDefaults)) {
    const given = json[key];
    if (given === undefined || given === null) continue;
    out[key] =
      typeof def === "object" && def !== null && typeof given === "object" && !Array.isArray(given)
        ? { ...def, ...(given as Record<string, unknown>) }
        : given;
  }
  return out as Brand;
}
