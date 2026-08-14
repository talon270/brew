import { useCallback, useEffect, useState } from 'react'
import { PATH } from '../data/path'

/**
 * Progress through the guided path.
 *
 * Stored as a set of completed step ids rather than an index, so the sequence
 * can be reordered or extended later without invalidating anyone's progress,
 * and so steps can be done out of order without the whole thing breaking.
 */

const KEY = 'brew.path.v1'

export function loadProgress(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

function save(done: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(done))
  } catch {
    // Progress is a convenience; losing it must never break the page.
  }
}

/** The first step not yet done — what the home page should point at. */
export function nextStep(done: string[]) {
  return PATH.find((s) => !done.includes(s.id)) ?? null
}

export function progressPercent(done: string[]): number {
  const valid = done.filter((id) => PATH.some((s) => s.id === id))
  return Math.round((valid.length / PATH.length) * 100)
}

export function usePath() {
  const [done, setDone] = useState<string[]>([])

  useEffect(() => {
    setDone(loadProgress())
  }, [])

  const toggle = useCallback((id: string) => {
    const current = loadProgress()
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    save(next)
    setDone(next)
  }, [])

  const reset = useCallback(() => {
    save([])
    setDone([])
  }, [])

  return { done, toggle, reset, next: nextStep(done), percent: progressPercent(done) }
}
