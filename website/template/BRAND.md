# BRAND.md

What `brand/` holds, who owns it, and how it reaches the site. `brand/` is
a **portable brand folder**: a small contract that any app in the project
can write and any app can read. The website ships a starter version; a
Company Brain in the same project can take it over.

## The folder

```
brand/
  brand.json     the facts: name, tagline, description, contact, social, logo, colours, fonts
  voice.md       the voice card and three example sentences
  logo/          logo files (svg preferred), referenced from brand.json
  notes/         optional: longer notes in markdown (positioning, audience, do and don't)
  _mirror.md     present only when the folder is a mirror from another app (read-only here)
```

### brand.json (`"schema": "taskandtool/brand/1"`)

| Field | Type | Meaning |
|---|---|---|
| `name` | string, required | The business name as it should appear |
| `tagline`, `description` | string | One line, and one or two sentences, in the brand's own words |
| `locale`, `url` | string | Language tag (`en`, `en-GB`); the canonical site URL once it has one |
| `contact.phone/email/address/hours` | string | Shown in the footer and on contact pages when set |
| `social` | object of name → URL | `{"instagram": "https://..."}` |
| `logo.file`, `logo.alt` | string | A file under `brand/logo/`, e.g. `logo/wordmark.svg`; the site serves it at `/brand/logo/wordmark.svg`. Empty: the name is set as text |
| `colors.primary` | hex, required | The one action colour of the brand |
| `colors.dark`, `colors.light` | hex | The brand's darkest and lightest grounds |
| `colors.neutral` | hex | A mid tone for secondary text |
| `colors.<anything>` | hex | Further named brand colours (`"sun"`, `"forest"`) the design may map to a role |
| `fonts.display`, `fonts.body` | string | Family names |
| `fonts.googleFontsUrl` | string | The Google Fonts stylesheet URL loading them, or empty for self-hosted or system fonts |

Every field but `name` and `colors.primary` may be missing or empty; the
site falls back to its starter values for what is absent
(`src/brand-defaults.ts`). Extra fields are allowed and ignored.

## How the site uses it

- `scripts/brand.mjs` turns `brand.json` into `styles/brand.css`: one CSS
  variable per colour (`--brand-primary`) and per font (`--brand-font-display`).
  It runs before every CSS build and whenever `brand.json` changes under
  `npm run dev`. The generated file is not committed.
- `styles/theme.css` is the **website's** design system: the role tokens
  (`--color-accent`, `--color-canvas`, the type scale, edges, rhythm)
  mapped onto the brand variables (`--color-accent: var(--brand-primary)`).
  `DESIGN.md` explains those roles. Brand says what the colours *are*;
  theme says what they are *for*.
- `src/site.ts` reads the facts for the head, header, and footer;
  `voice.md` and `notes/` are read by the AI, not by the site.

## Who owns it

- **No Company Brain in the project:** the website owns `brand/`. The AI
  fills it from the owner, or from a captured site (`clone-site`), and edits
  it directly.
- **A Company Brain in the project:** the brain is the source of truth.
  The owner mirrors the brain's `brain/brand` folder onto this app's
  `brand` folder (Settings → Mirrored folders, target path exactly
  `brand`). The mirror **replaces** the starter folder and keeps it
  current; `brand/_mirror.md` marks it read-only here. From then on the
  AI changes brand facts by asking the owner to change them in the brain,
  never by editing `brand/` in this app. The theme, the pages, and
  `DESIGN.md` stay the website's to edit.

Nothing in `brand/` is secret. Credentials never belong here.
