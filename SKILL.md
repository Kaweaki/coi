# SKILL.md — Cội

> Working notes for whoever picks this up next (including future me). Read this before touching
> the code; it records the design decisions, not just the file list.
>
> **Last updated:** 2026-10-29 · **Version:** 1.1.0 · **State:** shipped — live on Pages, v1.1.0 release published

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

- `npm run build` passes (tsc `--noEmit` + Vite) on the current source.
- Ask screen: live search, hero answer, ambiguity list, recents, saved people, editorial empty
  state. All copy and the suggestion chips come from the language table.
- 46 relations, 85 distinct paths, 4 generations, both sides, in-laws, cousins, nephews/nieces.
- Path parser handles possessives (“my mother’s younger brother”), “X of my Y”, age words,
  sibling ambiguity, Vietnamese tokens, and gives up gracefully on four-way words (uncle/aunt).
- **Family map (1.1)** — one 1680×1160 canvas, 24 people over four generations, pan and zoom.
  Nội left, ngoại right, you at the centre of your own row. Pressing a person:
  dims the rest, lights the exact chain from you with a lime glow, and shows the chain
  (`bạn → Bố → Chú`) plus the reciprocal pair in a card under the map. “Open” replaces the card
  with the full detail sheet. The nội / ngoại labels are pinned to the frame corners, not the
  canvas, so orientation survives panning.
- **Language switch (1.1)** — EN / VI segmented control in the topbar. Every interface string
  lives in `lib/i18n.ts` as one typed `Copy` object per language; the choice persists in
  localStorage (`coi.lang`) and sets `<html lang>`. Vietnamese headwords, tone words and the
  English gloss on each relation stay bilingual by design — the gloss is the lesson, not chrome.
- Install rail: shows only on iOS Safari when the app is not already on the home screen; dark
  strip with share glyph, one line of instruction, 34px dismiss, remembered in `coi.install.dismissed`.
- Learn (tones + phrases, speech synthesis; Vietnamese tone glosses and notes in VI mode), detail
  sheet with drag-to-dismiss and localised button labels.
- PWA: manifest, icons (SVG + 192 PNG for the Apple touch icon), service worker (`coi-v3`),
  standalone display, safe-area insets, no-zoom input.
- Distribution: Pages workflow live, **v1.1.0** release published with install steps.
- Engine checks: **18 parse cases** pass (including Vietnamese queries), 46 entries, 85 paths, no
  duplicate ids, no path collisions; every map node resolves to a relation and has a path back to
  you; no node sits outside the canvas.
- Visual pass in Playwright Chromium at 390×844 (iPhone 13 emulation): Ask EN/VI, map EN/VI, a
  selected relation with the path lit, the detail sheet, the install rail. 0 console errors,
  24 map buttons, minimum node hit area 90×44 at the default 75% zoom, 32px language buttons,
  `scrollWidth === clientWidth`. Screenshots land in `artifacts/` (gitignored).

**Known gaps / deliberate omissions**

- No native wrapper (Capacitor/SwiftUI) and no `.ipa` — see §10.
- The map pans by dragging the scroll container and zooms in five steps; there is no pinch
  gesture and no inertial “fly to” animation.
- The family map is a *sample* family, not the user’s own tree. Saved people are a flat list.
- Parser is English-first; Vietnamese input works for common kinship words through the search
  index rather than full Vietnamese syntax.
- No half-siblings, step-parents, godparents, or great-uncles/aunts in the model.
- Only EN and VI interface copy. Adding a third language means adding one object to `COPY` and
  nothing else.
- Only the northern standard is asserted; southern variants live in the notes.
- Audio depends on a vi-VN voice being installed; the Learn screen says so.
- No lockfile is committed; Pages runs `npm install`, so dependency ranges are the pin.
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
- Display: `clamp(33px, 8.6vw, 40px)`, `line-height 1.02`, tracking `-0.025em`. Tree uses the
  tighter `intro--tight` variant (28–34px) so the map reaches the first screen.
- Micro labels: 7.5–9.5px, uppercase, tracking `.14–.20em`, `--sage` or `--ink-35`.

**Surfaces** — every major card is a *double bezel*: 5px outer shell with a light gradient and a
hairline ring, inner core with its own radius (`outer − 5px`), inset top highlight, soft ambient
shadow. Never a flat card on the background.

**Motion** — `--spring: cubic-bezier(.32,.72,0,1)`. Entrance is `.rise` (translate 16px + blur 5px
→ settle, 820ms) with `rise(i)` stagger from `lib/motion.ts`. Press states are `scale(.965)`,
nothing instant. Only transform/opacity animate. `prefers-reduced-motion` short-circuits all of it.

**Chrome** — no sticky edge-to-edge nav. Wordmark top-left, tab meta plus the language switch
at top-right, floating dark tab bar bottom with a lime indicator sliding between three tabs. Content
scrolls *inside* the app shell; the shell is a 432px frame on desktop, full-bleed under 640px.

**Language switch** (`src/shell.css`) — a 3px-padded pill with a hairline ring; two 38×32 buttons,
the active one forest with lime text. It is chrome: small, quiet, always in the topbar, never a
settings screen. It persists immediately; there is no apply button.

**Family map** (`src/family-map.css`, `src/data/map.ts`)

- A real diagram, not a list: a 1680×1160 dotted canvas with SVG cubic trunks from each couple’s
  midpoint down to each child, dashed spouse lines, and sibling rows implied by shared parents.
- Frame is `clamp(380px, 56vh, 500px)`, rounded 24px, radial paper wash, hairline ring; the canvas
  pans inside it. Five zoom steps (55–105%), default **75%**.
- On open and on any zoom change: you are horizontally centred and sit at **66% of the frame
  height**, so your parents’ row is visible above you instead of blank canvas.
- Each node is a 120×58 button: paper core, hairline ring, serif Vietnamese word over a micro
  English role. Pressed → lime; on the path → darker ring; off the path → 34% opacity; you →
  forest bar with a lime word and “the point of view” as its gloss.
- Path finding is BFS over parents, children, spouses and siblings (`pathTo` in `map.ts`),
  returning the shortest chain of people. The chain drives both the lit edges and the card text.
- `bên nội` / `bên ngoại` are pinned pills at the top corners of the frame. They are truthful
  because the canvas is anchored: left is always nội, right is always ngoại.
- Zoom bar is a dark pill bottom-right of the frame: −, %, +, recentre. All buttons have labels.

**Install rail** (`src/family-map.css`) — an iOS-only dark strip under the topbar: share glyph in
a 26px lime-tinted circle, title plus hint, 34px dismiss target. It is chrome, not content, and it
never appears on desktop or once installed.

**Hard rules** — no emoji in UI, no icon library, no gradients on text, no `backdrop-blur` on
scrolling content (only tab bar and sheet scrim).

---

## 4. Data model

### Relations (`src/data/kinship.ts`)

A relationship is a **path of steps from you**, each step relative to the previous person:

```ts
type Step =
  | 'father' | 'mother' | 'husband' | 'wife'
  | 'son' | 'daughter'
  | 'elderBrother' | 'elderSister' | 'youngerBrother' | 'youngerSister'

type Kin = {
  id: string          // stable, kebab-case, referenced by map.ts and localStorage
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
every combination. `PATH_INDEX` maps path strings → entry, so lookup is O(1).

### The map (`src/data/map.ts`)

`MAP_NODES` places a curated sample family on the 1680×1160 canvas; `kinId` points at an entry in
`KINSHIP` (or `self` for the “Bạn” anchor). `MAP_FAMILIES` drives the blood trunks
(`parents` → `children`), `MAP_SPOUSES` the dashed marriage lines, and a private `SIBLINGS` list
adds only the edges needed for path finding. `pathTo(key)` is a BFS returning the shortest chain of
people from you, inclusive; `kinFor(key)` resolves a node to its relation.

**Adding a relation** (the most common edit):

1. Add the entry to `KINSHIP`, with every path variant (`[father, elderSister]` *and*
   `[father, youngerSister]` for “dad’s sister”).
2. Put the strongest search phrasings in `keys`; include the Vietnamese words people might type.
3. Fill `self`/`them` honestly — usually the reciprocal pair (`chú` ↔ `cháu`), except for children
   and nephews where the reverse term depends on *your* gender; write both, e.g. `'chú / cô'`, and
   explain in the note.
4. If it belongs on the map, add a node in `data/map.ts` with coordinates inside the canvas and
   then rebuild — the check script fails on a missing id, an unreachable node, or one off-canvas.
5. If it needs an interface string, add it to both `EN` and `VI` in `lib/i18n.ts` (the `Copy` type
   makes forgetting one a compile error).

**Editorial policy** — assert the northern standard, note real variance instead of flattening it
(a father’s older sister: `cô` in most families, `bác gái` in others). No invented terms, no
“literally” translations that mislead. Notes teach the *system*, not trivia.

---

## 5. Query parser (`src/lib/parse.ts`)

Pipeline: normalize (strip diacritics, keep apostrophes) → split on possessives → one segment per
generation step → per-segment options → cartesian product (cap 48).

- Age words set the sibling variant: `older/elder/big/eldest` vs `younger/little/baby`.
- `grandfather/grandmother` expand to both `nội` and `ngoại` unless `paternal|noi|maternal|ngoai`
  is present.
- `uncle`, `aunt`, `cousin`, `nephew`, `niece`, `grandson` are **deliberately unparseable** — the
  parser returns `[]` and the index surfaces every reading. That is the ambiguity UX; do not
  “fix” it by picking one.
- “younger brother of my mother” is rewritten to “my mother’s younger brother” before splitting.
- Vietnamese queries (`mẹ của tôi`, `ông nội`, `chị dâu`) generally resolve through the scored
  index, not the parser. Both paths land in the same `Hit[]`.

`search()` returns `Hit[]` with `exact` (a real path) ranked above scored alias matches. Scores are
cached per normalized query, field-weighted (identity 60, English 30, gloss 6, note 4) with a
single phrase bonus, then ordered closest-relation-first among strong matches.

---

## 6. Screens and shell

| Screen | File | Notes |
| --- | --- | --- |
| Ask | `components/Ask.tsx` | Search + hero answer + recents/saved + 3 facts |
| Tree | `components/Tree.tsx` | Pan/zoom map (`data/map.ts`), 24 nodes, path card → sheet |
| Learn | `components/Learn.tsx` | 6-tone grid on “ma”, 6 phrases, rule card |
| Detail | `components/Detail.tsx` | Bottom sheet, drag-to-dismiss, path trail, greeting, save |
| Shell | `App.tsx`, `components/TabBar.tsx` | Language provider, tab state, recents/saved |
| Language | `lib/lang.tsx`, `lib/i18n.ts`, `components/LangToggle.tsx` | Context, string tables, EN/VI pill |
| Install | `components/Install.tsx` | iOS-only add-to-home-screen rail, self-hiding |

Navigation is a single `tab` state plus a `detail: Hit | null` overlay. `App` is only the
`LangProvider` wrapper; `Shell` consumes it. Adding a screen means a tab entry, three strings
(`tabX` and `metaX` are separate), and a component that renders sections (no page chrome).

Speech: `lib/speech.ts` picks the first `vi` voice, rate `0.82`. Always allow the no-voice
fallback — buttons disable rather than pretending to speak.

---

## 7. Verify before shipping

```bash
npm run build                      # typecheck + bundle, must be clean
npm run preview                    # or npm run dev

# engine checks (18 parse cases, ambiguity, dataset + map id/path scans)
npx esbuild scripts/check-kinship.ts --bundle --platform=node --format=esm \
  --outfile=node_modules/.cache/check-kinship.mjs && node node_modules/.cache/check-kinship.mjs

# map check without a browser: every node becomes a button, the anchor renders
npx esbuild scripts/render-map.tsx --bundle --platform=node --format=esm --jsx=automatic \
  --external:react --external:react-dom --external:react-dom/server \
  --outfile=node_modules/.cache/render-map.mjs && node node_modules/.cache/render-map.mjs
```

Then at iPhone width (390×844):

1. Type `my mother's younger brother` → **Cậu**, cháu ↔ cậu. Type `mẹ của tôi` → **Mẹ**.
2. Type `uncle` → four readings (bác, chú, cậu, dượng), not one.
3. Type `grandfather` → Ông nội above Ông ngoại, both shown.
4. Open a result → sheet slides, path trail matches, greeting reads naturally. Save it → survives reload.
5. Tree → map opens on Bố/Mẹ above and your row, `bên nội` left / `bên ngoại` right; press Chú →
   only the Bạn→Bố→Chú chain stays lit, card shows `chú` / `cháu`, “Open” opens the sheet.
6. Zoom out to 55% and in to 105% → the frame re-centres on you, nothing clips outside the canvas.
7. Switch to VI → tab labels (Hỏi/Cây/Học), headings, chips, facts and sheet buttons all change;
   reload → still VI; `<html lang="vi">`.
8. Install rail → only on iOS Safari, dismisses and stays dismissed.
9. 320px width and desktop 1440px — no clipped text, tab bar still floats.

Deployment check: a green Pages Actions run plus a 200 at the Pages URL. The 1.1 visual pass was
done headlessly with Playwright Chromium at 390×844; §11 records how to bring that browser up in a
fresh workspace.

---

## 8. Conventions

- No comments unless they explain *why*. No `any`. No unused exports (`noUnusedLocals` is on).
- Components are named exports except `App`; props typed inline above the component.
- CSS is the design-system file plus `family-map.css` (map + install rail) and `shell.css` (language
  switch); add classes near their section, use tokens only.
- Every user-facing string goes through `useLang().t`; never hard-code copy in a component.
- Anything user-generated or id-based goes through `lib/storage.ts` (fails silently in private mode).
- Keep dataset and map in sync: `map.ts` may only reference ids that exist in `kinship.ts`, and
  every node must be reachable from you (the check script enforces both).

## 9. Distribution

- **Hosting** — GitHub Pages, build type *workflow*. `.github/workflows/pages.yml` runs
  `npm install && npm run build` and publishes `dist/`. Live at
  **https://kaweaki.github.io/coi/**. Vite uses `base: './'`, so the build also works at a domain
  root or any subfolder.
- **Install** — Safari → Share → Add to Home Screen. That is the only install path iOS permits
  without a signed bundle; the in-app rail exists to teach it. Detect iOS Safari + not-standalone
  with `navigator.standalone` and `display-mode`; hide in Chrome/Firefox on iOS, which cannot install.
- **Release** — `v1.1.0`, target `main`; the notes repeat the install steps, the live link, and
  what changed in 1.1. GitHub Releases cannot attach a working installer through this toolchain,
  so the release page is the install guide rather than a download.
- **Never** claim an `.ipa`: unsigned bundles do not install on iOS, and signing requires macOS,
  Xcode and an Apple identity. A Capacitor shell is the only route there (§10).

## 10. Roadmap (agreed direction, not started)

1. **My people** — name real relatives, store the path, and build a personal tree from them.
2. **Pinch + inertia** on the map, and a “fit the whole family” zoom step for the first open.
3. **Native shell** — Capacitor wrap for a real `.ipa` (signing via Xcode or AltStore/SideStore),
   reusing this exact UI. Only worth it if home-screen PWA limits start to bite.
4. **Deeper kinship** — great-uncles, step and half relations, the `ông bác / ông chú` layer.
5. **Southern mode** — swap `bố/mẹ` for `ba/má` and adjust notes; the language switch is the
   natural place for it.
6. **Practice** — recall drills on the pronouns you saved; spaced repetition on ~46 words is
   cheap and useful.
7. **Share** — send a relation card as an image (aunties will love this).

## 11. Headless browser and preview

The container ships no browser libraries and there is no root. `apt-get` still works when its
state is redirected, and the `.deb`s can be unpacked into a prefix:

```bash
mkdir -p /tmp/apt/lists/partial /tmp/libs && cd /tmp/libs
apt-get -o Dir::State::lists=/tmp/apt/lists -o Dir::Cache=/tmp/apt update
apt-get -o Dir::State::lists=/tmp/apt/lists -o Dir::Cache=/tmp/apt download \
  libnspr4 libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libatspi2.0-0t64 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxrender1 libxkbcommon0 \
  libasound2t64 libsqlite3-0 libdbus-1-3 libxi6 libxtst6
for f in *.deb; do dpkg-deb -x "$f" root; done
export LD_LIBRARY_PATH=/tmp/libs/root/usr/lib/x86_64-linux-gnu:/tmp/libs/root/lib/x86_64-linux-gnu

npm install --prefix /tmp/pw playwright@1.64.1
/tmp/pw/node_modules/.bin/playwright install chromium
```

Serve the build on its own port with `node_modules/.bin/vite preview --port 4174 --host 127.0.0.1`,
then run a screenshot script from `/tmp/pw` (so bare `playwright` resolves) with `OUT` pointing at
`artifacts/`. `artifacts/shots11.mjs` takes the 1.1 set: Ask EN/VI, map EN/VI, a selected relation,
the sheet, and reports node size, language-button size, overflow and console errors.

Two traps: kill the preview by its recorded PID (a `pkill -f "vite preview"` matches the command
line of the shell running it, and kills your own session), and note that neither the libraries nor
the browser survive an archive — rerun the recipe before the next visual pass. Web fonts load from
Google, so screenshots render properly even though the image has no system fonts (fontconfig will
complain — harmless).
