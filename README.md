# Cội

**Cội** (Vietnamese: *origin, rootstock, the trunk a family grows from*) is a small, fast,
iPhone-first app that answers one question properly:

> Someone in my family — what do I call them, and what do they call me?

Vietnamese pronouns are not vocabulary, they are relationships. Pick the word for the other
person and your own word is already decided: **chú** means you are **cháu**; **anh** means you are
**em**. Cội answers both directions at once.

**Live: [kaweaki.github.io/coi](https://kaweaki.github.io/coi/)**

## What it does

- **Ask** — type the relationship the way you would say it out loud (“my mother’s younger
  brother”), and get the word, its tone, a pronunciation sketch, and the pair you share.
- **46 relations** across four generations: parents and grandparents, aunts and uncles on both
  sides, siblings and their spouses, cousins, nephews and nieces, children and grandchildren,
  and in-laws by marriage.
- **Ambiguity handled** — “uncle” has four answers in Vietnamese. Ask for `uncle` and Cội shows
  all of them instead of guessing.
- **Tree** — one large map of a sample family: 24 people across four generations, nội on the
  left and ngoại on the right, you at the centre of your own row. Drag to move, zoom with ±, and
  press anyone: every line from you to them lights up and the pair appears, both directions.
- **Three languages** — an EN / VI / SV switch retranslates the whole interface and remembers
  the choice. Swedish input works too (`min mammas yngre bror`). The Vietnamese headwords stay
  Vietnamese, as they should.
- **Your people** — give a relative their real name (`Ông Bảy`, `Mẹ Lan`) on the detail sheet. The
  name then appears on the map, in the answer, and in search: type `ông bảy` and Cội answers with
  the pronoun pair you use, not with a generic rule. Names stay on the device.
- **Account** — a small panel behind the top-right button: language, every named person with a
  remove control, and the attribution.
- **Learn** — the six tones on a single syllable, plus the greetings that use these pronouns.
- **Offline** — installed as a PWA, it opens without a network and keeps your recents and saved
  people on the device.

## Install it on an iPhone

**Live: [kaweaki.github.io/coi](https://kaweaki.github.io/coi/)**

1. Open that URL in **Safari** on the iPhone (Chrome cannot install web apps on iOS).
2. Tap **Share → Add to Home Screen**.
3. Name it Cội → **Add**.

It then opens full-screen with its own icon and a dark green status bar. On the first visit the app
shows the same three steps in a rail above the content, then remembers being dismissed.

The [v2.0.0 release](https://github.com/Kaweaki/coi/releases/tag/v2.0.0) repeats this for anyone
arriving from the repository.

### Why there is no `.ipa`

An `.ipa` is a zip of a **signed** app bundle. iOS refuses unsigned binaries — not through
GitHub, not over AirDrop — and signing one needs macOS, Xcode and an Apple signing identity.
That build cannot be produced from a Linux CI runner. The PWA route buys the same home-screen
icon, full-screen window and offline shell without an App Store review or a 7-day resigning cycle.
A Capacitor shell is the only path to a real `.ipa`; §10 of `SKILL.md` records it.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # typecheck + production build into dist/
npm run preview  # serve the built app
```

Requires Node 18+.

## Host it

The build is fully static and uses relative asset paths (`base: './'`), so it works at a domain
root or in a subfolder.

- **GitHub Pages** — already wired: `.github/workflows/pages.yml` runs `npm install && npm run
  build` and publishes `dist/` on every push to `main`. Pages is set to build from GitHub Actions,
  so there is nothing to configure.
- **Cloudflare Pages / Vercel / Netlify** — build command `npm run build`, output directory
  `dist`.

## How the kinship model works

Every relationship is a **path of steps** away from you, not a title:

```
"my mother's younger brother" -> ['mother', 'youngerBrother']
```

Each step is relative to the person before it, which is exactly how Vietnamese composes
relationships. `src/data/kinship.ts` holds the entries; every entry lists the paths it occupies,
so a path can be resolved in one lookup. `src/lib/parse.ts` turns free text into paths,
`src/lib/search.ts` matches those against the dataset and falls back to a scored alias search
when a phrase is too ambiguous to parse (“uncle”, “cousin”).

Names you save are stored as `kinId -> name`, so a name is a label on a relationship rather than a
second copy of it. `src/lib/people.ts` normalises them (diacritics ignored, so `bjorn` finds
`Björn`) and ranks exact, prefix and partial matches; Ask puts a name hit above any text hit.

Words are the northern standard, with southern and regional variants noted on each entry. Family
usage varies — where it does (a father’s older sister, for instance, is `cô` in most families and
`bác gái` in others) the note says so rather than pretending there is one right answer.

## Project layout

```
src/
  data/kinship.ts   46 relations, their paths, tones, notes
  data/map.ts       the family map: nodes, trunk lines, couples, path finder
  data/phrases.ts   tones and greeting phrases
  lib/parse.ts      English/Vietnamese/Swedish phrase -> kin path
  lib/search.ts     path lookup + fuzzy alias scoring
  lib/i18n.ts       every interface string, in English, Vietnamese and Swedish
  lib/lang.tsx      language context, persisted to localStorage
  lib/people.ts     names you give your relatives + name search
  lib/speech.ts     vi-VN speech synthesis
  lib/storage.ts    recents and saved people (localStorage)
  components/       Ask, Tree, Learn, Detail sheet, Account, TabBar, LangSwitch, Install, Icons
  styles.css        the design system (frame + motion)
  family-map.css    the family map + install rail (loaded after styles.css)
  shell.css         shell chrome: the language switch
  skin.css          the 2.0 surface (loaded last)
public/             manifest, service worker, icons
scripts/            icon generator (Pillow), kinship + map checks
.github/workflows/  Pages build + deploy
SKILL.md            design system + working notes, kept current
```

## Notes

- Fonts: Lora and Be Vietnam Pro (SIL Open Font License) via Google Fonts, both with Vietnamese
  subsets.
- Icons are hand-drawn inline SVG at 1.25 stroke width — no icon library.
- The service worker caches the shell for offline use; in development it is not registered, so
  hot reload stays honest.
