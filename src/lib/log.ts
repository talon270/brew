/**
 * Brew log.
 *
 * Local-only, like the taste profile. The point is not record-keeping for its
 * own sake — it is that "what did I change last time?" is the question every
 * dial-in depends on, and nobody remembers.
 */

import { useCallback, useEffect, useState } from 'react'
import type { BrewMethod } from './types'

export type Taste = 'sour' | 'balanced' | 'bitter'

export interface BrewEntry {
  id: string
  /** ISO timestamp. */
  at: string
  method: BrewMethod
  /** Catalogue id when picked from the bean list, else undefined. */
  beanId?: string
  beanName?: string
  doseG: number
  waterMl: number
  /** Free text — grinder settings are "18 clicks" or "3.5", never a number. */
  grindSetting?: string
  seconds?: number
  rating: number
  taste?: Taste
  notes?: string
}

const STORAGE_KEY = 'brew.log.v1'

export function loadLog(): BrewEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as BrewEntry[]
  } catch {
    return []
  }
}

function persist(entries: BrewEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Quota or private browsing. Keep working for this session.
  }
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * What to change next time, based on how it tasted.
 *
 * Deliberately gives one instruction, not a list. Changing several variables
 * at once is exactly how people fail to learn anything from a brew.
 */
export function nextStepAdvice(taste: Taste | undefined): string | null {
  switch (taste) {
    case 'sour':
      return 'Sour means under-extracted. Grind one step finer next time — nothing else.'
    case 'bitter':
      return 'Bitter means over-extracted. Grind one step coarser next time — nothing else.'
    case 'balanced':
      return 'Balanced. Write the grind setting down and change nothing.'
    default:
      return null
  }
}

export interface LogStats {
  total: number
  last7Days: number
  averageRating: number | null
  favouriteMethod: BrewMethod | null
  /** Rating trend: mean of the most recent 5 minus mean of the 5 before. */
  trend: number | null
}

export function computeStats(entries: BrewEntry[], now = Date.now()): LogStats {
  if (entries.length === 0) {
    return { total: 0, last7Days: 0, averageRating: null, favouriteMethod: null, trend: null }
  }

  const weekAgo = now - 7 * 86_400_000
  const last7Days = entries.filter((e) => Date.parse(e.at) >= weekAgo).length

  const averageRating =
    entries.reduce((sum, e) => sum + e.rating, 0) / entries.length

  const counts = new Map<BrewMethod, number>()
  for (const e of entries) counts.set(e.method, (counts.get(e.method) ?? 0) + 1)
  const favouriteMethod =
    [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  // Entries are stored newest-first.
  let trend: number | null = null
  if (entries.length >= 6) {
    const mean = (xs: BrewEntry[]) => xs.reduce((s, e) => s + e.rating, 0) / xs.length
    trend = mean(entries.slice(0, 5)) - mean(entries.slice(5, 10))
  }

  return { total: entries.length, last7Days, averageRating, favouriteMethod, trend }
}

export function useBrewLog() {
  const [entries, setEntries] = useState<BrewEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEntries(loadLog())
    setLoaded(true)
  }, [])

  const add = useCallback((entry: Omit<BrewEntry, 'id' | 'at'>) => {
    setEntries((prev) => {
      const next = [{ ...entry, id: newId(), at: new Date().toISOString() }, ...prev]
      persist(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      persist(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setEntries([])
    persist([])
  }, [])

  return { entries, add, remove, clear, loaded }
}
