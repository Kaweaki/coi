# SKILL.md — Cội

> Working notes for whoever picks this up next (including future me). Read this before touching
> the code; it records the design decisions, not just the file list.
>
> **Last updated:** 2026-10-29 · **Version:** 1.0.0 · **State:** shipped — live on Pages, release published

---

## 1. What this is

Cội is an iPhone-first Vietnamese kinship app. One job done well: given a person’s place in your
family, return the pronoun **you** use for them and the one **they** use for you — plus tone,
pronunciation, a breadcrumb path, and the cultural note that makes it stick.

It is a PWA, installable to the iOS home screen from **https://kaweaki.github.io/coi/**. There is
no `.ipa`: iOS will not install an unsigned bundle, and signing needs macOS + Xcode. That is a
platform constraint, recorded in §9, not an unfinished part.

Stack: Vite 5 + React 18 + TypeScript, hand-written CSS, no UI or icon libraries, no router, no
state manager. Everything is client-side; the only network request is Google Fonts.

---

## 2. Where things stand

**Done and verified**

- `npm run build` passes (tsc `--noEmit` + Vite), locally and from a fresh clone of the repo.
- Ask screen: live search, hero answer, ambiguity list, recents, saved people, editorial empty
  state.
- 46 relations, 85 distinct paths, 4 generations, both sides, in-laws, cousins, nephews/nieces.
- Path parser handles possessives (“my mother’s younger brother”), “X of my Y”, age words,
  sibling ambiguity, Vietnamese tokens, and gives up gracefully on four-way words (uncle/aunt).
- Family map: four generations, nội on the left and ngoại on the right, 23 pressable relation
  buttons, a “Bạn” anchor between the older and younger siblings, seams between generations,
  tap → detail sheet. Verified by headless render (23/23 buttons, anchor present, no missing
  names) and by the id scan in `scripts/check-kinship.ts`.
- Install rail: shows only on iOS Safari when the app is not already on the home screen;
  dismissible, remembered in localStorage (`coi.install.dismissed`).
- Learn (tones + phrases, speech synthesis), detail sheet with drag-to-dismiss.
- PWA: manifest, icons (SVG + 192 PNG for the Apple touch icon), service worker (`coi-v2`),
  standalone display, safe-area insets, no-zoom input.
- Distribution: Pages workflow live, `v1.0.0` release published with install steps.
- Engine checks: 14 parse cases pass, no duplicate ids, no path collisions.

**Known gaps / deliberate omissions**

- No native wrapper (Capacitor/SwiftUI) and no `.ipa` — see §10.
- Audio depends on a vi-VN voice being installed; the Learn screen says so.
- The family map is a *sample* family, not the user’s own tree. Saved people are a flat list.
- Parser does not model half-siblings, step-parents, godparents, or great-uncles/aunts.
- No i18n: UI copy is English with Vietnamese terms, by design for a learner.
- Only the northern standard is asserted; southern variants live in the notes.
- No lockfile is committed; Pages runs `npm install`, so dependency ranges are the pin. Add a
  lockfile if the build ever needs to be bit-reproducible.
- `styles.css` still carries the pre-1.0 `.tree` / `.branch` / `.node` block. It is unused since
  the map rewrite and is superseded by `family-map.css`; delete it whenever that file is next
  edited whole.

---

## 3. Design system (locked — keep it consistent)

**Direction:** *Soft structuralism*, warm paper instead of white, forest instead of black, lime as
the single accent. Editorial serif for the Vietnamese words, grotesk for the interface. The app
should feel like a printed field guide that happens to run at 120fps.

**Palette** (`:root` in `src/styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bone` | `#F3F1E7` | app background |
| `--paper` | `#FBFAF3` | card cores |
| `--moss` | `#16342A` | primary green, serif body |
| `--moss-deep` | `#0B1F18` | darkest ink / tab bar |
| `--sage` | `#7E9884` | labels, secondary text, ngoại dot |
| `--lime` | `#D9E9A8` | accent, active pill, hero pair values |
| `--ink` | `#12211A` | text |
| `--hair` | `rgba(18,33,26,.10)` | hairlines (never 1px gray borders) |

**Type**

- `--serif: Lora` — display headings, Vietnamese headwords, numerals in the facts list.
- `--sans: Be Vietnam Pro` — everything else. Both have true Vietnamese subsets; do not swap for
  a font without one (Inter/Geist do not cover the diacritics properly for this use).
- Display: `clamp(33px, 8.6vw, 40px)`, `line-height 1.02`, tracking `-0.025em`.
- Micro labels: 7.5–9.5px, uppercase, tracking `.14–.20em`, `--sage` or `--ink-35`.

**Surfaces** — every major card is a *double bezel*: 5px outer shell with a light gradient and a
hairline ring, inner core with its own radius (`outer − 5px`), inset top highlight, soft ambient
shadow. Never a flat card on the background.

**Motion** — `--spring: cubic-bezier(.32,.72,0,1)`. Entrance is `.rise` (translate 16px + blur 5px
→ settle, 820ms) with `rise(i)` stagger from `lib/motion.ts`. Press states are `scale(.965)`,
nothing instant. Only transform/opacity animate. `prefers-reduced-motion` short-circuits all of it.

**Chrome** — no sticky edge-to-edge nav. A small wordmark top-left, a floating dark pill tab bar
bottom with a lime indicator that slides between three tabs. Content scrolls *inside* the app
shell; the shell is a 432px frame on desktop, full-bleed under 640px.

**Family map** (`src/family-map.css`) — a generational ladder, not a graph drawing:

- Four bands (Ông bà → Bố mẹ → Bạn → Đời sau), each a header (serif Vietnamese + micro English)
  over a hairline rule.
- Two-wing bands split nội left / ngoại right at a 1px centre rail; single-wing bands span the
  width. Nội is marked with a moss dot, ngoại with sage.
- Each node is a **button**, 54px minimum height, paper core, hairline ring, serif word + micro
  English role, `scale(.955)` on press. Parents sit last in their wing so bố and mẹ share a
  baseline above the seam.
- “Bạn” is a full-width dark bar (`--moss-deep` gradient, lime word) spanning both columns — the
  only non-interactive element, between older and younger siblings.
- 26px seam with a 4px sage dot joins each generation; it lines up with the two-wing centre rail.
- Ambiguity is never hidden: the map shows the word families, the sheet explains the variant.

**Install rail** (`src/family-map.css`) — an iOS-only dark strip under the topbar: share glyph in
a 28px lime-tinted circle, one line of instruction, dismiss ×. It is chrome, not content, and it
never appears on desktop or once installed.

**Hard rules** — no emoji in UI, no icon library, no gradients on text, no `backdrop-blur` on
scrolling content (only tab bar and sheet scrim).

---

## 4. Data model (`src/data/kinship.ts`)

A relationship is a **path of steps from you**, each step relative to the previous person:

```ts
type Step =
  | 'father' | 'mother' | 'husband' | 'wife'
  | 'son' | 'daughter'
  | 'elderBrother' | 'elderSister' | 'youngerBrother' | 'youngerSister'

type Kin = {
  id: string          // stable, kebab-case, referenced by tree.ts and localStorage
  paths: Step[][]     // every path this word occupies
  en: string          // "Dad's younger brother"
  vi: string          // "Chú" — display form, with diacritics
  tone?: string       // "sắc · sharp, rising"
  say: string         // "choo" — English respelling for the ear
  you: string         // what you call them
  self: string        // what you call yourself toward them
  them: string        // what they call you
  gloss: string       // one line, plain English
  note?: string       // the cultural part: regional variants, usage beyond family
  keys: string[]      // extra search phrasings
  group: 'up' | 'down' | 'side' | 'inlaw'
}
```

Why paths: `mẹ → em trai` composes “my mother’s younger brother” without inventing a title for
every combination. `PATH_INDEX` maps path strings → entry, so lookup is O(1); `longestKnownPrefix`
powers “closest thing we know” for unmapped branches.

**Adding a relation** (the most common edit):

1. Add the entry to `KINSHIP`, with every path variant (`[father, elderSister]` *and*
   `[father, youngerSister]` for “dad’s sister”).
2. Put the strongest search phrasings in `keys`; include the Vietnamese words people might type.
3. Fill `self`/`them` honestly — they are usually the reciprocal pair (`chú` ↔ `cháu`), except for
   children and nephews where the reverse term depends on *your* gender; write both, e.g.
   `'chú / cô'`, and explain in the note.
4. Add the id to `data/tree.ts` if it belongs on the map.
5. Rebuild; then type three phrasings that should hit it and one that shouldn’t.

**Editorial policy** — assert the northern standard, note real variance instead of flattening it
(a father’s older sister: `cô` in most families, `bác gái` in others). No invented terms, no
“literally” translations that mislead. Notes should teach the *system*, not trivia.

---

## 5. Query parser (`src/lib/parse.ts`)

Pipeline: normalize (strip diacritics, keep apostrophes) → split on possessives → one segment per
generation step → per-segment options → cartesian product (cap 48).

- Age words set the sibling variant: `older/elder/big/eldest` vs `younger/little/baby`.
- `grandfather/grandmother` expand to both `nội` and `ngoại` unless `paternal|noi|maternal|ngoai`
  is present.
- `uncle`, `aunt`, `cousin`, `nephew`, `niece`, `grandson` are **deliberately unparseable** — the
  parser returns `[]` and the index surfaces every reading. This is the ambiguity UX; do not “fix”
  it by picking one.
- “younger brother of my mother” is rewritten to “my mother’s younger brother” before splitting.

`search()` returns `Hit[]` with `exact` (a real path) ranked above scored alias matches. Scores are
cached per normalized query, field-weighted (identity 60, English 30, gloss 6, note 4) with a
single phrase bonus, then ordered closest-relation-first among strong matches. That ordering is
what makes “aunt” open with cô and dì rather than dượng.

---

## 6. Screens

| Screen | File | Notes |
| --- | --- | --- |
| Ask | `components/Ask.tsx` | Search + hero answer + recents/saved + 3 facts |
| Tree | `components/Tree.tsx` | Generational map (`data/tree.ts`), 23 buttons, tap → sheet |
| Learn | `components/Learn.tsx` | 6-tone grid on “ma”, 6 phrases, rule card |
| Detail | `components/Detail.tsx` | Bottom sheet, drag-to-dismiss, path trail, greeting, save |
| Shell | `App.tsx`, `components/TabBar.tsx` | Tab state, recents/saved persistence |
| Install | `components/Install.tsx` | iOS-only add-to-home-screen rail, self-hiding |

Navigation is a single `tab` state plus a `detail: Hit | null` overlay. Adding a screen means a
new tab entry, a `TAB_META` label, and a component that renders sections (no page chrome).

Speech: `lib/speech.ts` picks the first `vi` voice, rate `0.82`. Always allow the no-voice
fallback — buttons disable rather than pretending to speak.

---

## 7. Verify before shipping

```bash
npm run build                      # typecheck + bundle, must be clean
npm run preview                    # or npm run dev

# engine checks (14 parse cases, ambiguity, dataset + map id scans)
npx esbuild scripts/check-kinship.ts --bundle --platform=node --format=esm \
  --outfile=/tmp/check-kinship.mjs && node /tmp/check-kinship.mjs

# map check without a browser: every node becomes a button, the anchor renders
npx esbuild scripts/render-map.tsx --bundle --platform=node --format=esm --jsx=automatic \
  --external:react --external:react-dom --external:react-dom/server \
  --outfile=/tmp/render-map.mjs && node /tmp/render-map.mjs
```

Then, in a browser at iPhone width (390×844), check:

1. Type `my mother's younger brother` → **Cậu**, cháu ↔ cậu.
2. Type `uncle` → four readings (bác, chú, cậu, dượng), not one.
3. Type `dad's brother` → bác + chú (age unknown).
4. Type `my wife's mother` → Mẹ vợ, con ↔ mẹ.
5. Open a result → sheet slides, path trail matches, greeting reads naturally.
6. Save it → appears under “Your people”, survives reload.
7. Tree → four bands, nội left / ngoại right, every name opens a sheet, “Bạn” is not a button,
   nothing overflows at 390px.
8. Install rail → only on iOS Safari, dismisses and stays dismissed.
9. 320px width and desktop 1440px — no clipped text, tab bar still floats.

The GitHub Pages build is the same `npm run build`; a green Actions run plus a 200 at the Pages
URL is the deployment check. There is no browser in this build environment, so visual checks at
iPhone width still need a real device or a desktop browser.

---

## 8. Conventions

- No comments unless they explain *why*. No `any`. No unused exports (`noUnusedLocals` is on).
- Components are named exports except `App`; props typed inline above the component.
- CSS is one design-system file plus `family-map.css` for the map and install rail; add classes
  near their section, use tokens only.
- Anything user-generated or id-based goes through `lib/storage.ts` (fails silently in private
  mode).
- Keep the dataset and the map in sync: `tree.ts` may only reference ids that exist in
  `kinship.ts` (the check script enforces this).

## 9. Distribution

- **Hosting** — GitHub Pages, build type *workflow*. `.github/workflows/pages.yml` runs
  `npm install && npm run build` and publishes `dist/`. Live at
  **https://kaweaki.github.io/coi/**. Vite uses `base: './'`, so the build also works at a domain
  root or any subfolder.
- **Install** — Safari → Share → Add to Home Screen. That is the only install path iOS permits
  without a signed bundle; the in-app rail exists to teach it. Detect iOS Safari + not-standalone
  with `navigator.standalone` and `display-mode`; hide in Chrome/Firefox on iOS, which cannot
  install.
- **Release** — `v1.0.0`, target `main`, release notes repeat the install steps and link to the
  hosted app. GitHub Releases cannot attach binaries through this toolchain, so the release page
  is the install guide rather than a download.
- **Never** claim an `.ipa`: unsigned bundles do not install on iOS, and signing requires macOS,
  Xcode and an Apple identity. A Capacitor shell is the only route there (§10).

## 10. Roadmap (agreed direction, not started)

1. **My people** — name real relatives, store the path, and build a personal tree from them.
2. **Native shell** — Capacitor wrap for a real `.ipa` (signing via Xcode or AltStore/SideStore),
   reusing this exact UI. Only worth it if home-screen PWA limits start to bite (no push, no App
   Store presence).
3. **Deeper kinship** — great-uncles, step and half relations, the `ông bác / ông chú` layer.
4. **Southern mode** — a toggle that swaps `bố/mẹ` for `ba/má` and adjusts notes.
5. **Practice** — recall drills on the pronouns you saved; spaced repetition on ~46 words is
   cheap and useful.
6. **Share** — send a relation card as an image (aunties will love this).
