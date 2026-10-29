# SKILL.md — Cội

> Working notes for whoever picks this up next (including future me). Read this before touching
> the code; it records the design decisions, not just the file list.
>
> **Last updated:** 2026-10-29 · **Version:** 2.0.0 · **State:** built and verified locally —
> live on Pages at the last pushed commit, v2.0.0 release published

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

**Shipped in 1.0 / 1.1**

- Ask screen: live search, hero answer, ambiguity list, recents, saved people, editorial empty
  state. All copy and the suggestion chips come from the language table.
- 46 relations, 85 distinct paths, 4 generations, both sides, in-laws, cousins, nephews/nieces.
- Family map: one 1680×1160 canvas, 24 people, pan + five zoom steps, path lit from you.
- PWA: manifest, icons, service worker (`coi-v4`), standalone display, safe-area insets.
- Pages workflow, install rail for iOS Safari, release pages that explain the install path.

**Shipped in 2.0**

- **Swedish, third language.** `Copy` gains a full `SV` object; the header switch is now
  `EN / VI / SV`, and the account panel lists the three names in full. Language is persisted in
  `coi.lang`, defaults to the browser language when it is `vi` or `sv`, and sets `<html lang>`.
- **Named people.** Every relation can carry a name (`Ông Bảy`, `Mẹ Lan`). Names are stored per
  `kinId`, so a name is a label on a relationship rather than a duplicate record. Typing a saved
  name in Ask returns that person’s pronoun pair, ranked above text matches; the name also shows
  on the map node, in the picked card, in the detail sheet, and in the “Your people” list.
- **Account panel** — a small overlay from the topbar: wordmark, one-line intro, language list,
  named people with counts and per-row remove, a plain statement that names stay on the device,
  and the maker’s mark pinned in the footer: `Cội · Version 2.0.0` over
  `Attributed to Harald Blimark · 2026 · Trademark`.
- **2.0 surface** (`src/skin.css`, loaded last): quieter chrome, hairline rows instead of cards,
  larger reading type, a floating inset tab bar, restyled map frame and nodes, dark hero answer,
  and the account page. The 1.x design system still owns the frame and motion.
- **Swedish parser** — `min mammas yngre bror`, `min pappas äldre syster`, `mormor`, `farfar`,
  `min frus mamma`, `min systers man` all resolve. 25 parse cases now, including 7 Swedish.
- **Answer comes to you.** When a query resolves, the hero card scrolls itself into view — the
  nearest edge only, with room reserved for the tab bar — so typing on a phone never leaves the
  answer below the fold or shoves the search field out of sight.

**Known gaps / deliberate omissions**

- No native wrapper (Capacitor/SwiftUI) and no `.ipa` — see §9.
- Names are one label per relation: you cannot store two people at the same rung (two uncles).
  `People` is `Record<kinId, name>`, capped at 60 entries, 28 characters each, local only.
- The map still shows a *sample* family; saved names are labels on that sample, not your own tree.
- The map pans by dragging and zooms in five steps; no pinch, no inertial fly-to.
- Swedish parsing covers the kin nouns in `SV_WORDS` (parents, grandparents, siblings, aunts and
  uncles by side, children, spouse, in-laws, nieces/nephews). `kusin`, `svärson`, `svärdotter`
  and half/step relations are not modelled.
- English remains the broadest parser; Vietnamese resolves mostly through the scored index.
- No half-siblings, step-parents, godparents, or great-uncles/aunts in the model.
- Only the northern standard is asserted; southern variants live in the notes.
- Audio depends on a vi-VN voice being installed; the Learn screen says so.
- No lockfile is committed; Pages runs `npm install`, so dependency ranges are the pin.
- `styles.css` still carries the pre-1.0 `.tree` / `.branch` / `.node` block. It is unused since
  the map rewrite and is superseded by `family-map.css` + `skin.css`.

---

## 3. Design system (locked — keep it consistent)

**Direction:** *Soft structuralism*, warm paper instead of white, forest instead of black, lime as
the single accent. Editorial serif for the Vietnamese words, grotesk for the interface. 2.0 pushes
it toward an editorial field guide: hairlines, wide margins, one dark object per screen.

**Palette** (2.0 values live in `:root` of `src/skin.css`, which loads after `styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bone` | `#F1EDDF` | app background |
| `--paper` | `#FCFAF2` | sheet, account, node cores |
| `--moss` | `#14352A` | primary green, labels, buttons |
| `--moss-deep` | `#081B13` | darkest ink / tab bar / hero |
| `--sage` | `#6F8A76` | labels, secondary text, ngoại dot |
| `--lime` | `#DDF0A3` | accent, active pill, hero pair values |
| `--ink` | `#101B15` | text |
| `--hair` | `rgba(16,27,21,.12)` | hairlines (never 1px gray borders) |
| `--rust` | `#8A4A36` | destructive only (remove a name) |

**Type**

- `--serif: Lora` — display headings, Vietnamese headwords, names, numerals.
- `--sans: Be Vietnam Pro` — everything else. Both have true Vietnamese subsets; do not swap for
  a font without one (Inter/Geist do not cover the diacritics properly for this use).
- Display: `clamp(37px, 10.8vw, 52px)`, `line-height .96`, tracking `-.035em`, `text-wrap:
  balance`. The Tree uses `intro--tight` (31–40px) so the map reaches the first screen.
- Reading copy: lede 14.5px/1.68, glosses 13.5px/1.65, facts 12.8px/1.65. Nothing instructional
  below 11px.
- Micro labels: 8–9.5px, uppercase, tracking `.14–.2em`, `--sage` or `--ink-35`.

**Surfaces** — the shell is paper with a radial wash; the sheet and account panel are `--paper`.
Cards are quiet: hairline ring plus a soft shadow, radius 14–30px. The only heavy object on the
Ask screen is the answer itself (dark forest gradient, 30px radius, lime headword).

**Motion** — `--spring: cubic-bezier(.32,.72,0,1)`. Entrance is `.rise` (translate 16px + blur 5px
→ settle) with `rise(i)` stagger from `lib/motion.ts`. Press states are `scale(.965–.975)`.
Only transform/opacity animate. `prefers-reduced-motion` short-circuits it.

**Chrome** — no sticky edge-to-edge nav. Wordmark top-left, language switch + account button
at top-right, floating dark tab bar bottom (`left/right: 18px`, 62px, lime indicator). Content
scrolls *inside* the shell; 432px frame on desktop, full-bleed under 640px.

**Language switch** (`src/skin.css`, `components/LangSwitch.tsx`) — a 3px-padded pill with a
hairline ring; 33×28 buttons, the active one forest with lime text. `variant="list"` renders the
same choice as full-width hairline rows with a check, for the account panel. It is chrome: always
in the topbar, never a settings screen.

**Family map** (`src/family-map.css`, `src/data/map.ts`)

- A real diagram: 1680×1160 dotted canvas, SVG cubic trunks from each couple’s midpoint, dashed
  spouse lines, sibling rows implied by shared parents.
- Frame `clamp(400px, 58vh, 520px)`, radius 26px, radial paper wash, hairline ring.
- On open and on any zoom change: you are horizontally centred and sit at **66% of the frame
  height**, so your parents’ row is visible above you instead of blank canvas.
- Each node is a 120×58 button: paper core, serif Vietnamese word over a micro English role.
  A named node swaps the role for the name (single line, ellipsis) and gets a sage ring.
- Path finding is BFS over parents, children, spouses and siblings (`pathTo`), returning the
  shortest chain of people; the chain drives the lit edges and the card under the map.
- `bên nội` / `bên ngoại` are pinned to the frame corners, not the canvas.

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

### Named people (`src/lib/people.ts`)

```ts
type People = Record<string, string>   // kinId -> name
```

- Persisted whole under `coi.people`; read defensively (non-object, non-string values, blanks
  dropped). `cleanName` collapses whitespace and caps at 28 chars; `withName` refuses a 61st entry.
- `nameFor(people, id)` is the only read used by components; `namedPeople()` returns the sorted
  list for the account panel.
- `findPeople(people, query)` ranks **exact 100 → prefix 80 → contains 60 → all-tokens 40**, with
  diacritics stripped and query length < 2 ignored. Ask maps those hits to score `2000`, above any
  text hit, and `Ask.withNames` dedupes by `kin.id` so a name never appears twice.
- A name is a label, not a new relation: it moves with the `kinId`, survives copy changes, and
  disappears cleanly with `onName(id, '')`.

### The map (`src/data/map.ts`)

`MAP_NODES` places the sample family on the canvas; `kinId` points at a `KINSHIP` entry (or
`self` for the “Bạn” anchor). `MAP_FAMILIES` drives blood trunks, `MAP_SPOUSES` the dashed
marriages, and a private `SIBLINGS` list adds only the edges needed for path finding.

**Adding a relation:**

1. Add the entry to `KINSHIP`, with every path variant.
2. Put the strongest search phrasings in `keys`; include Vietnamese words people might type.
3. Fill `self`/`them` honestly — usually the reciprocal pair (`chú` ↔ `cháu`), except where the
   reverse depends on *your* gender; write both and explain in the note.
4. If it belongs on the map, add a node inside the canvas; the check script fails on a missing id,
   an unreachable node, or one off-canvas.
5. Add interface strings to **all three** objects in `lib/i18n.ts` — the `Copy` type makes a
   missing language a compile error.
6. If it is a common Swedish word, add it to `SV_WORDS` (and `SV_CUES` when the word alone marks
   the query as Swedish) and add a case to `scripts/check-kinship.ts`.

**Editorial policy** — assert the northern standard, note real variance instead of flattening it
(a father’s older sister: `cô` in most families, `bác gái` in others). No invented terms, no
“literally” translations that mislead. Notes teach the *system*, not trivia.

---

## 5. Query parser (`src/lib/parse.ts`)

Pipeline: normalize (strip diacritics, keep apostrophes) → choose a language path → split into one
segment per generation step → per-segment options → cartesian product (cap 48).

- If the query contains a Swedish cue (`min`, `mamma`, `mormor`, `fru`, `bror`, …), the Swedish
  pass runs first. If it produces nothing, English still runs — `son` and `man` read as English
  too, so the cue list only decides precedence, never correctness.
- Swedish is segmented by nouns rather than possessives: each kin noun is one step, a preceding
  age adjective (`äldre`, `yngre`, `stora`, `lilla`) picks the sibling variant, and a trailing
  genitive `s` is stripped **only when the stripped word is itself a noun** (`mammas` → `mamma`,
  but `barn` stays `barn`). Age state is consumed by the next noun, so `min äldre brors son`
  resolves to elder brother → son instead of stopping at `son`.
- English age words: `older/elder/big/eldest` vs `younger/little/baby`.
- `grandfather/grandmother` expand to both nội and ngoại unless `paternal|noi|maternal|ngoai`.
- `uncle`, `aunt`, `cousin`, `nephew`, `niece`, `grandson` are **deliberately unparseable** — the
  index surfaces every reading. That is the ambiguity UX; do not “fix” it by picking one.
- “younger brother of my mother” is rewritten to “my mother’s younger brother” before splitting.

`search()` returns `Hit[]` with `exact` (a real path) ranked above scored alias matches. Scores are
cached per normalized query, field-weighted (identity 60, English 30, gloss 6, note 4) with a
single phrase bonus, then ordered closest-relation-first among strong matches.

---

## 6. Screens and shell

| Screen | File | Notes |
| --- | --- | --- |
| Ask | `components/Ask.tsx` | Search + hero answer (auto-scrolled in) + recents/named people + 3 facts |
| Tree | `components/Tree.tsx` | Pan/zoom map, 24 nodes, named labels, path card → sheet |
| Learn | `components/Learn.tsx` | 6-tone grid on “ma”, 6 phrases, rule card |
| Detail | `components/Detail.tsx` | Bottom sheet, drag-to-dismiss, path trail, name editor, save |
| Account | `components/Account.tsx` | Language list, named people, attribution footer |
| Shell | `App.tsx`, `components/TabBar.tsx` | Language provider, tab state, recents/saved, overlays |
| Language | `lib/lang.tsx`, `lib/i18n.ts`, `components/LangSwitch.tsx` | Context, three string tables, pill or list |
| Install | `components/Install.tsx` | iOS-only add-to-home-screen rail, self-hiding |

Navigation is a single `tab` state plus `detail: Hit | null` and `account: boolean` overlays.
`App` is only the `LangProvider` wrapper; `Shell` consumes it. Adding a screen means a tab entry,
three strings, and a component that renders sections (no page chrome).

The account panel is `position: absolute; inset: 0` inside the shell, with a scrolling body and a
fixed footer — the attribution is always visible without being loud.

Speech: `lib/speech.ts` picks the first `vi` voice, rate `0.82`. Buttons disable rather than
pretending to speak.

---

## 7. Verify before shipping

```bash
npm run build                      # typecheck + bundle, must be clean
npm run preview                    # or npm run dev

# engine checks: 25 parse cases (incl. 7 Swedish), names, ambiguity, dataset + map scans
npx esbuild scripts/check-kinship.ts --bundle --platform=node --format=esm \
  --outfile=node_modules/.cache/check-kinship.mjs && node node_modules/.cache/check-kinship.mjs

# map check without a browser: every node becomes a button, saved labels render
npx esbuild scripts/render-map.tsx --bundle --platform=node --format=esm --jsx=automatic \
  --external:react --external:react-dom --external:react-dom/server \
  --outfile=node_modules/.cache/render-map.mjs && node node_modules/.cache/render-map.mjs
```

Then at iPhone width (390×844):

1. Type `my mother's younger brother` → **Cậu**, cháu ↔ cậu. `mẹ của tôi` → **Mẹ**.
   `min mammas yngre bror` → **Cậu**. `mormor` → **Bà ngoại**.
2. `uncle` → four readings, not one. `grandfather` → Ông nội above Ông ngoại.
3. Open a relative → **Their name** → save `Ông Bảy`. Search `ông bảy` → that relation answers with
   the name on the hero and in “Your people”. Reload → still there. Account → remove → gone.
4. Resolved answers must start above the tab bar without scrolling (the auto-scroll).
5. Tree → press Chú → only the Bạn→Bố→Chú chain stays lit, card shows `chú` / `cháu`.
6. Switch to SV → `Fråga / Träd / Lär`, headings, chips, facts, sheet buttons all Swedish;
   reload → still SV; `<html lang="sv">`. Account lists English / Tiếng Việt / Svenska.
7. Account footer reads `Attributed to Harald Blimark · 2026 · Trademark` at 9px, never clipped.
8. 320px and desktop 1440px — no clipped text, tab bar still floats, no horizontal scroll.

Deployment check: a green Pages Actions run plus a 200 at the Pages URL. The 2.0 visual pass was
done headlessly with Playwright Chromium at 390×844; §11 records how to bring the browser up.

---

## 8. Conventions

- No comments unless they explain *why*. No `any`. No unused exports (`noUnusedLocals` is on).
- Components are named exports except `App`; props typed inline above the component.
- CSS layers, in load order: `styles.css` (frame + motion), `family-map.css` (map, install rail),
  `shell.css` (1.1 language switch), `skin.css` (**2.0 surface — new visual work goes here**, not
  into the older layers).
- Every user-facing string goes through `useLang().t`; never hard-code copy in a component. The
  only deliberate exceptions are Vietnamese headwords and the attribution line.
- Anything user-generated or id-based goes through `lib/storage.ts` / `lib/people.ts` (both fail
  silently in private mode).
- Keep dataset and map in sync: `map.ts` may only reference ids that exist in `kinship.ts`, and
  every node must be reachable from you (the check script enforces both).

## 9. Distribution

- **Hosting** — GitHub Pages, build type *workflow*. `.github/workflows/pages.yml` runs
  `npm install && npm run build` and publishes `dist/`. Live at
  **https://kaweaki.github.io/coi/**. Vite uses `base: './'`, so the build also works at a domain
  root or any subfolder.
- **Install** — Safari → Share → Add to Home Screen. That is the only install path iOS permits
  without a signed bundle; the in-app rail teaches it. Detect iOS Safari + not-standalone with
  `navigator.standalone` and `display-mode`; hide in Chrome/Firefox on iOS, which cannot install.
- **Release** — `v2.0.0`, target `main`; notes cover Swedish, named people, the account panel and
  the reskin, and repeat the install steps. GitHub Releases cannot attach a working installer
  through this toolchain, so the release page is the install guide, not a download.
- **Never** claim an `.ipa`: unsigned bundles do not install on iOS, and signing requires macOS,
  Xcode and an Apple identity. A Capacitor shell is the only route there (§10).

## 10. Roadmap (agreed direction, not started)

1. **Personal tree** — named people become real nodes, not labels on the sample family.
2. **Several people per relation** — replace `Record<kinId, name>` with a list of saved people,
   so two uncles can both be stored and told apart.
3. **Pinch + inertia** on the map, and a “fit the whole family” first-open step.
4. **Native shell** — Capacitor wrap for a real `.ipa` (signing via Xcode or AltStore/SideStore),
   reusing this exact UI.
5. **Deeper kinship** — great-uncles, step and half relations, the `ông bác / ông chú` layer.
6. **Southern mode** — swap `bố/mẹ` for `ba/má` and adjust notes.
7. **Practice** — recall drills on saved people; spaced repetition on ~46 words is cheap.
8. **Share** — send a relation card as an image.

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

Serve the build on its own port with `node_modules/.bin/vite preview --port 4179 --host 127.0.0.1`,
then run a script from `/tmp/pw` (so bare `playwright` resolves) with `OUT` set to `artifacts/`.
`artifacts/shots20.mjs` (gitignored, like all artifacts) takes the 2.0 set — Ask EN/SV, the name
search, a Swedish answer, both map states, the sheet with a saved name, and the account panel —
then prints node sizes, language-button heights, overflow, `<html lang>`, the saved-name count,
the attribution text and console errors. Copy it into `/tmp/pw` before every run; editing it in
`artifacts/` alone changes nothing.

Two traps: kill the preview by its recorded PID (`pkill -f "vite preview"` matches the shell
running it and kills your session), and note that neither the libraries nor the browser survive an
archive — rerun the recipe before the next visual pass. Web fonts load from Google, so screenshots
render properly even though the image has no system fonts (fontconfig complains — harmless).
