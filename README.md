# Cội

**Cội** (Vietnamese: *origin, rootstock, the trunk a family grows from*) is a small, fast,
iPhone-first app that answers one question properly:

> Someone in my family — what do I call them, and what do they call me?

Vietnamese pronouns are not vocabulary, they are relationships. Pick the word for the other
person and your own word is already decided: **chú** means you are **cháu**; **anh** means you are
**em**. Cội answers both directions at once.

## What it does

- **Ask** — type the relationship the way you would say it out loud (“my mother’s younger
  brother”), and get the word, its tone, a pronunciation sketch, and the pair you share.
- **46 relations** across four generations: parents and grandparents, aunts and uncles on both
  sides, siblings and their spouses, cousins, nephews and nieces, children and grandchildren,
  and in-laws by marriage.
- **Ambiguity handled** — “uncle” has four answers in Vietnamese. Ask for `uncle` and Cội shows
  all of them instead of guessing.
- **Tree** — a sample family, four generations deep. Tap anyone.
- **Learn** — the six tones on a single syllable, plus the greetings that use these pronouns.
- **Offline** — installed as a PWA, it opens without a network and keeps your recents and saved
  people on the device.

## Install it on an iPhone

The app is a **PWA** (an installable web app), not a signed `.ipa`. That is deliberate: it needs
no App Store, no developer account, no 7-day resigning.

1. Host the built app anywhere with HTTPS (see below), or open a local preview on your phone.
2. Open the URL in **Safari** on the iPhone.
3. Tap **Share → Add to Home Screen**.

It then opens full-screen, with its own icon and a dark green status bar — indistinguishable
from a small native app in daily use. Audio uses the phone’s Vietnamese system voice.

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

- **Cloudflare Pages / Vercel / Netlify** — build command `npm run build`, output directory
  `dist`.
- **GitHub Pages** — push `dist/` to a `gh-pages` branch (or `/docs` on `main`) and enable Pages
  in the repository settings. No further configuration needed.

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

Words are the northern standard, with southern and regional variants noted on each entry. Family
usage varies — where it does (a father’s older sister, for instance, is `cô` in most families and
`bác gái` in others) the note says so rather than pretending there is one right answer.

## Project layout

```
src/
  data/kinship.ts   46 relations, their paths, tones, notes
  data/tree.ts      the sample family on the Tree screen
  data/phrases.ts   tones and greeting phrases
  lib/parse.ts      English/Vietnamese phrase -> kin path
  lib/search.ts     path lookup + fuzzy alias scoring
  lib/speech.ts     vi-VN speech synthesis
  lib/storage.ts    recents and saved people (localStorage)
  components/       Ask, Tree, Learn, Detail sheet, TabBar, Icons
  styles.css        the whole design system
public/             manifest, service worker, icons
scripts/            icon generator (Pillow), kinship engine checks
SKILL.md            design system + working notes, kept current
```

## Notes

- Fonts: Lora and Be Vietnam Pro (SIL Open Font License) via Google Fonts, both with Vietnamese
  subsets.
- Icons are hand-drawn inline SVG at 1.25 stroke width — no icon library.
- The service worker caches the shell for offline use; in development it is not registered, so
  hot reload stays honest.
