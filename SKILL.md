# SKILL.md — Cội

> Working notes for whoever picks this up next (including future me). Read this before touching
> the code; it records the design decisions, not just the file list.
>
> **Last updated:** 2026-10-29 · **Version:** 0.1.0 · **State:** shipped, verified, installable PWA

---

## 1. What this is

Cội is an iPhone-first Vietnamese kinship app. One job done well: given a person’s place in your
family, return the pronoun **you** use for them and the one **they** use for you — plus tone,
pronunciation, a breadcrumb path, and the cultural note that makes it stick.

It is a PWA, installable to the iOS home screen. There is no App Store build and no `.ipa`; that
is a product decision, not an unfinished part (see §9).

Stack: Vite 5 + React 18 + TypeScript, hand-written CSS, no UI or icon libraries, no router, no
state manager. Everything is client-side; the only network request is Google Fonts.

---

## 2. Where things stand

**Done and verified**

- `npm run build` passes (tsc `--noEmit` + Vite), including from a fresh clone of the repo.
- Ask screen: live search, hero answer, ambiguity list, recents, saved people, editorial empty
  state.
- 46 relations, 85 distinct paths, 4 generations, both sides, in-laws, cousins, nephews/nieces.
- Path parser handles possessives (“my mother’s younger brother”), “X of my Y”, age words,
  sibling ambiguity, Vietnamese tokens, and gives up gracefully on four-way words (uncle/aunt).
- Tree, Learn (tones + phrases, speech synthesis), detail sheet with drag-to-dismiss.
- PWA: manifest, icons (SVG + 192 PNG for the Apple touch icon), service worker, standalone
  display, safe-area insets, no-zoom input.
- Engine checks: 14 parse cases pass, no duplicate ids, no path collisions.

**Known gaps / deliberate omissions**

- No native wrapper (Capacitor/SwiftUI) — see §9.
- Audio depends on a vi-VN voice being installed; the Learn screen says so.
- The Tree is a *sample* family, not the user’s own tree. Saved people are a flat list.
- Parser does not model half-siblings, step-parents, godparents, or great-uncles/aunts.
- No i18n: UI copy is English with Vietnamese terms, by design for a learner.
- Only the northern standard is asserted; southern variants live in the notes.
- Dependencies are not pinned by a lockfile yet (run `npm install` to generate one).

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
| `--sage` | `#7E9884` | labels, secondary text |
| `--lime` | `#D9E9A8` | accent, active pill, hero pair values |
| `--ink` | `#12211A` | text |
| `--hair` | `rgba(18,33,26,.10)` | hairlines (never 1px gray borders) |

**Type**

- `--serif: Lora` — display headings, Vietnamese headwords, numerals in the facts list.
- `--sans: Be Vietnam Pro` — everything else. Both have true Vietnamese subsets; do not swap for
  a font without one (Inter/Geist do not cover the diacritics properly for this use).
- Display: `clamp(33px, 8.6vw, 40px)`, `line-height 1.02`, tracking `-0.025em`.
- Micro labels: 9–9.5px, uppercase, tracking `.16–.20em`, `--sage` or `--ink-35`.

**Surfaces** — every major card is a *double bezel*: 5px outer shell with a light gradient and a
hairline ring, inner core with its own radius (`outer − 5px`), inset top highlight, soft ambient
shadow. Never a flat card on the background.

**Motion** — `--spring: cubic-bezier(.32,.72,0,1)`. Entrance is `.rise` (translate 16px + blur 5px
→ settle, 820ms) with `rise(i)` stagger from `lib/motion.ts`. Press states are `scale(.965)`,
nothing instant. Only transform/opacity animate. `prefers-reduced-motion` short-circuits all of it.

**Chrome** — no sticky edge-to-edge nav. A small wordmark top-left, a floating dark pill tab bar
bottom with a lime indicator that slides between three tabs. Content scrolls *inside* the app
shell; the shell is a 432px frame on desktop, full-bleed under 640px.

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
4. Add the id to `data/tree.ts` if it belongs on the tree.
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
| Tree | `components/Tree.tsx` | 4 horizontal branches, sample family, tap → sheet |
| Learn | `components/Learn.tsx` | 6-tone grid on “ma”, 6 phrases, rule card |
| Detail | `components/Detail.tsx` | Bottom sheet, drag-to-dismiss, path trail, greeting, save |
| Shell | `App.tsx`, `components/TabBar.tsx` | Tab state, recents/saved persistence |

Navigation is a single `tab` state plus a `detail: Hit | null` overlay. Adding a screen means a
new tab entry, a `TAB_META` label, and a component that renders sections (no page chrome).

Speech: `lib/speech.ts` picks the first `vi` voice, rate `0.82`. Always allow the no-voice
fallback — buttons disable rather than pretending to speak.

---

## 7. Verify before shipping

```bash
npm run build                      # typecheck + bundle, must be clean
npm run preview                    # or npm run dev

# engine checks (14 parse cases, ambiguity, duplicate/collision scan)
npx esbuild scripts/check-kinship.ts --bundle --platform=node --format=esm \
  --outfile=/tmp/check-kinship.mjs && node /tmp/check-kinship.mjs
```

Then, in a browser at iPhone width (390×844), check:

1. Type `my mother's younger brother` → **Cậu**, cháu ↔ cậu.
2. Type `uncle` → four readings (bác, chú, cậu, dượng), not one.
3. Type `dad's brother` → bác + chú (age unknown).
4. Type `my wife's mother` → Mẹ vợ, con ↔ mẹ.
5. Open a result → sheet slides, path trail matches, greeting reads naturally.
6. Save it → appears under “Your people”, survives reload.
7. Tree → every node opens a sheet; the “Bạn” node is not a button.
8. 320px width and desktop 1440px — no clipped text, tab bar still floats.

---

## 8. Conventions

- No comments unless they explain *why*. No `any`. No unused exports (`noUnusedLocals` is on).
- Components are named exports except `App`; props typed inline above the component.
- CSS is one file with section banners; add classes near their section, use tokens only.
- Anything user-generated or id-based goes through `lib/storage.ts` (fails silently in private
  mode).
- Keep the dataset and the tree in sync: `tree.ts` may only reference ids that exist in
  `kinship.ts`.

## 9. Roadmap (agreed direction, not started)

1. **My people** — name real relatives, store the path, and build a personal tree from them.
2. **Native shell** — Capacitor wrap for a real `.ipa` (signing via Xcode or AltStore/SideStore),
   reusing this exact UI. Only worth it if home-screen PWA limits start to bite (no push, no App
   Store presence).
3. **Deeper kinship** — great-uncles, step and half relations, the `ông bác / ông chú` layer.
4. **Southern mode** — a toggle that swaps `bố/mẹ` for `ba/má` and adjusts notes.
5. **Practice** — recall drills on the pronouns you saved; spaced repetition on ~46 words is
   cheap and useful.
6. **Share** — send a relation card as an image (aunties will love this).
