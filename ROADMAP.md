# Roadmap

What Brew is for: someone in Delhi NCR who wants to get good at coffee, in one place,
without wading through a hundred blog posts written for a different country.

This file tracks what has been built toward that, what is next, and — as importantly —
what has been deliberately ruled out.

## Built

**Learning**

- **[Two weeks to decent coffee](/#/path)** — the site in order. One idea a day, one
  thing to brew, one variable changed at a time. Progress saved locally.
- **[Coffee 101](/#/explore)** — cherry anatomy, processing, roast spectrum, grind sizes
  drawn to scale, a flavour wheel, milk drinks as to-scale proportions, and India as an
  origin. All interactive.
- **The written guide** — seven chapters, including one on brewing in Indian conditions
  that no Western guide covers: humidity moving your grind, heat and storage, and why
  South Indian filter is not a lesser method.
- **[Glossary](/#/glossary)** — every term the site uses. Nothing is defined using a word
  you would also have to look up, and terms can be defined inline where they appear.
- **[Learning to taste](/#/tasting)** — structured comparison exercises, because palate
  is the one skill you cannot read your way into.

**Tools**

- **[Brew timer](/#/brew)** — six methods, real water amounts calculated from your dose.
- **[Fix a brew](/#/fix)** — symptom to one specific change, with the reasoning.
- **[Water](/#/water)** — the Delhi-specific gap. RO is too empty, tap is too hard;
  the calculator gives a remineralisation recipe in millilitres.
- **[Espresso](/#/espresso)** — dial-in targets and a shot judge that distinguishes a
  channelled puck from a merely fast shot.
- **[Your shelf](/#/shelf)** — roast dates, and whether a bag is resting, at its peak or
  fading. Espresso windows shift about a week later than filter.
- **[Brew log](/#/log)** — what you did, how it tasted, and one thing to change next.

**Buying**

- **Grinders**, ranked by budget and brew method — the purchase that decides your ceiling.
- **[Everything else](/#/gear)** — brewers, kettles, scales, accessories, in buying order
  and including what to skip.
- **Beans**, reordered by your taste profile.
- **[Roasters](/#/roasters)** — who ships nationally, who prints a roast date.

## Next

**1. Cafe finder.** The last major piece of the original plan. Schema and row-level
security are written and ready in `supabase/`, but unapplied — it needs a Supabase
project. Community-submitted Delhi NCR cafes with the detail Google Maps lacks: roaster,
brew methods, whether they do real filter coffee. Seed 30–50 before launch so it is never
empty.

**2. Verify the prices.** Grinder and bean prices in `src/data/` are researched estimates
and flagged as unverified in the UI. They should be checked against current listings.

**3. Depth over breadth in the guide.** Around 3,500 words across seven chapters is thin
for the claim this site makes. Extending existing chapters is worth more than adding new
ones.

**4. One source of truth for recipes.** Chapter 5 and the brew timer both carry recipes.
Two sources will drift; the timer should be canonical and the chapter should point at it.

## Later

- **Compare mode** for grinders and beans, side by side.
- **A brewer chooser** — "which should I buy first", feeding the existing taste profile.
- **Printable recipe cards**, one page per method. Print styles exist; the dedicated
  layout does not.
- **Reviews and comments** on guide and gear entries. Tables and policies already exist in
  the migrations.
- **Photography** — the site is illustration-only, which is a real gap for a sensory
  subject.

## Deliberately not doing

- **Forums or a social feed.** Cold-start problem, permanent moderation burden, and the
  cafe list already carries as much community weight as one person can moderate.
- **Video.** High production cost, poor fit with a text-and-diagram PWA, ages badly.
- **Required accounts.** Everything works signed-out and stays on your device. An account
  will only ever be needed to contribute to shared data.
- **Points, streaks or a "coffee score".** The site's whole premise is giving reasons
  rather than a number. Gamifying it would contradict that.
- **Affiliate links.** Nothing is monetised and nobody has paid to appear. The grinder
  rankings are only worth reading if that stays true.

## Principles

These are the calls that shaped the rest, worth writing down so they are not quietly
reversed later.

1. **Reasons, not scores.** Every recommendation says why, and says what is wrong with it.
2. **One change at a time.** The timer, the troubleshooter and the log all enforce this,
   because it is the only way anyone learns what a variable does.
3. **Tools over articles.** Where a decision tree or a calculator would beat prose, build
   that instead.
4. **Local first.** Taste profile, brew log, shelf and path progress live in your browser.
   No signup wall in front of anything useful.
5. **Honest about limits.** If the grinder is the problem, say so. If a brewer cannot do
   what someone wants, say that too.
