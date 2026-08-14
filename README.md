# Brew

**Live at [talon270.github.io/brew](https://talon270.github.io/brew/)**

A specialty coffee app for Delhi NCR. A beginner's guide, a grinder finder, and bean
recommendations — all driven by a short taste quiz, so the advice is personal rather than
generic.

Built as an installable PWA. No account needed; nothing leaves your device.

## Why it exists

Google Maps and Zomato know where cafes are but not whether they roast light or will pull a
proper pourover. A thousand blogs explain brew ratios but none know what *you* like. And the
grinder — the single highest-leverage purchase in coffee — is buried in scattered forum
threads.

The taste profile is the spine. One quiz drives everything:

- **Beans** — matched on roast, acidity, body, and how adventurous you are.
- **Grinders** — filtered by budget, then ranked by how you actually brew. Espresso demands
  far more grind precision than French press, so "best grinder under ₹10,000" has a genuinely
  different answer depending on your method. That's the whole point of the finder.
- **Cafes** — planned, see below.

Every recommendation shows *why*, plus its caveats. No opaque match scores.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # matching logic + render smoke tests
npm run build    # type-check and bundle to dist/
npm run preview  # serve the production build (needed to test the service worker)
```

## Deploying

Pushing to `main` deploys. `.github/workflows/deploy.yml` runs the tests, builds with
`BASE_PATH=/brew/` (Pages serves from a subpath, not the domain root), and publishes to
GitHub Pages. A failing test blocks the deploy rather than shipping over it.

To host elsewhere, set `BASE_PATH` accordingly, or `/` for a domain root. Routing uses
`HashRouter`, so no server-side rewrite rules are needed anywhere.

## Layout

```
content/guide/*.md      Beginner's guide. Numbered files; number sets order,
                        the first `# heading` becomes the title.
src/data/grinders.ts    Grinder catalogue (editorial)
src/data/beans.ts       Bean catalogue (editorial)
src/lib/types.ts        Domain model
src/lib/matching.ts     Scoring. Pure functions — no React, no network.
src/lib/quiz.ts         Quiz questions and profile construction
src/lib/profile.ts      localStorage persistence + React hook
src/lib/guide.ts        Markdown loader
src/routes/             Pages
```

### Editing content

Guide, grinders, and beans are author-controlled editorial content, so they live **in git**
rather than a database — version history for free, no admin UI to build, and it all works
offline. Edit the Markdown or the TypeScript arrays and rebuild.

Note this deviates from the original plan, which put editorial content in Supabase. Keeping
it in the repo means Phases 1–2 need no backend at all and deploy as a static site. Supabase
comes in at Phase 3, where it's genuinely needed: community-submitted cafes require auth,
writes, and moderation. `@supabase/supabase-js` is installed but not yet used.

## ⚠️ Seed data needs verifying

Grinder and bean **prices are approximate** and drift constantly with import duty and stock.
Specs (burr type, size, espresso capability) are stable and reliable.

Before launch: verify every `priceInr` in `src/data/`, and add `sourceUrl` to grinder entries
so the source threads get credited.

## What's in it

| Route | What it does |
|---|---|
| `/path` | Two weeks to decent coffee — the whole site in order |
| `/guide` | Learning hub: chapters, plus every deep dive and tool |
| `/explore` | Coffee 101 — interactive diagrams, no prior knowledge assumed |
| `/glossary` | Every term, defined without jargon |
| `/brew` | Brew timer and ratio calculator for six methods |
| `/fix` | Troubleshooter: symptom to one specific change |
| `/water` | Remineralisation calculator for RO and Delhi tap water |
| `/espresso` | Dial-in targets and a shot judge |
| `/tasting` | Palate training exercises |
| `/log` | Brew tracker: what you did, how it tasted, what to change |
| `/shelf` | Roast dates and freshness for the bags you own |
| `/buy` | Grinders, gear, beans and roasters |
| `/quiz` → `/you` | Taste profile, and the recommendations it drives |

See [ROADMAP.md](ROADMAP.md) for what is next and what has been ruled out.

## Roadmap

- **Phase 1 — guide, grinders, beans** ✅ done
- **Phase 2 — taste quiz and matching** ✅ done
- **Phase 2.5 — visual guide, brew timer, brew tracker** ✅ done
- **Phase 3 — cafe finder.** Schema and RLS are written and ready in `supabase/` — see
  [supabase/README.md](supabase/README.md) for how to apply them. Still to build: the cafe
  browser, submission form, moderation queue, and MapLibre map. Cafe scoring plugs into the
  existing matcher in `src/lib/matching.ts`.
- **Phase 4 — community.** Reviews, comments on guide and grinder entries, flagging. Tables
  and policies for these already exist in the migrations.

The cold-start problem is the real risk in Phase 3: an empty cafe list attracts no
contributors. Seed it with 30–50 verified cafes before opening submissions.
