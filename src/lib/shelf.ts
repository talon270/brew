import { useCallback, useEffect, useState } from 'react'

/**
 * The bean shelf.
 *
 * The brew log knows what you did but nothing about what you did it *with*.
 * Roast date is the piece beginners most reliably get wrong: coffee does not
 * spoil, it fades, and the window where it is at its best is narrower and
 * earlier than most people expect.
 *
 * Local only, like the rest of the app's state — no account, no sync.
 */

const KEY = 'brew.shelf.v1'

export interface Bag {
  id: string
  name: string
  roaster: string
  /** ISO date (yyyy-mm-dd) the coffee was roasted. */
  roastedOn: string
  /** 0–100, same scale as the taste profile's roast axis. */
  roastLevel: number
  notes?: string
  /** Marked when the bag is used up, so it drops out of the active list. */
  finished?: boolean
}

export type Freshness = 'too-fresh' | 'peak' | 'good' | 'fading' | 'stale'

export interface FreshnessRead {
  stage: Freshness
  daysOld: number
  label: string
  detail: string
}

export function daysSince(iso: string, now = Date.now()): number {
  const then = Date.parse(`${iso}T00:00:00`)
  if (Number.isNaN(then)) return 0
  return Math.floor((now - then) / 86_400_000)
}

/**
 * Windows are for filter brewing. Espresso wants roughly a week longer at every
 * stage, because the pressure makes trapped carbon dioxide far more disruptive.
 */
export function readFreshness(bag: Bag, now = Date.now(), forEspresso = false): FreshnessRead {
  const daysOld = daysSince(bag.roastedOn, now)
  const shift = forEspresso ? 6 : 0

  if (daysOld < 3 + shift) {
    return {
      stage: 'too-fresh',
      daysOld,
      label: 'Still resting',
      detail:
        'Too fresh to brew well. It is still releasing carbon dioxide, which pushes water away from the grounds and extracts unevenly — often tasting sour however you brew it.',
    }
  }
  if (daysOld <= 12 + shift) {
    return {
      stage: 'peak',
      daysOld,
      label: 'At its best',
      detail: 'The window. Aromatics are fully developed and the gas has settled. Brew it now.',
    }
  }
  if (daysOld <= 25 + shift) {
    return {
      stage: 'good',
      daysOld,
      label: 'Still good',
      detail: 'Past the peak but perfectly good. Expect slightly less aroma and a little less acidity.',
    }
  }
  if (daysOld <= 50 + shift) {
    return {
      stage: 'fading',
      daysOld,
      label: 'Fading',
      detail:
        'Noticeably flatter — the top notes go first, leaving the heavier, duller flavours. Fine for milk drinks, disappointing black.',
    }
  }
  return {
    stage: 'stale',
    daysOld,
    label: 'Past it',
    detail:
      'Stale. Not unsafe, just papery and dull. No grind adjustment recovers this; the volatile compounds are simply gone.',
  }
}

/** Methods that suit a given roast level, so a bag suggests what to do with it. */
export function suggestMethods(roastLevel: number): string[] {
  if (roastLevel < 35) return ['Pourover / V60', 'AeroPress']
  if (roastLevel < 60) return ['Pourover / V60', 'AeroPress', 'French press']
  if (roastLevel < 80) return ['French press', 'Espresso', 'Moka pot']
  return ['Espresso', 'Moka pot', 'South Indian filter']
}

// ------------------------------------------------------------------ storage

export function loadShelf(): Bag[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Bag[]) : []
  } catch {
    return []
  }
}

function saveShelf(bags: Bag[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(bags))
  } catch {
    // Storage full or blocked; the shelf is a convenience, not critical state.
  }
}

export function useShelf() {
  const [bags, setBags] = useState<Bag[]>([])

  useEffect(() => {
    setBags(loadShelf())
  }, [])

  const persist = useCallback((next: Bag[]) => {
    setBags(next)
    saveShelf(next)
  }, [])

  const add = useCallback(
    (bag: Omit<Bag, 'id'>) => {
      persist([{ ...bag, id: crypto.randomUUID() }, ...loadShelf()])
    },
    [persist],
  )

  const remove = useCallback(
    (id: string) => persist(loadShelf().filter((b) => b.id !== id)),
    [persist],
  )

  const finish = useCallback(
    (id: string) =>
      persist(loadShelf().map((b) => (b.id === id ? { ...b, finished: !b.finished } : b))),
    [persist],
  )

  return { bags, add, remove, finish }
}
