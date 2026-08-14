/**
 * Taste profile persistence.
 *
 * Anonymous users are first-class here: the profile lives in localStorage and
 * the whole app works signed-out. When accounts arrive (Phase 3, alongside
 * community cafes) this is the module that gains a Supabase sync — nothing
 * else needs to change.
 */

import { useCallback, useEffect, useState } from 'react'
import type { TasteProfile } from './types'
import { DEFAULT_PROFILE } from './quiz'

const STORAGE_KEY = 'brew.taste-profile.v1'

export function loadProfile(): TasteProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TasteProfile>
    // Merge over the default so a profile saved by an older version that
    // lacks a newly added axis still loads instead of rendering NaN.
    return { ...DEFAULT_PROFILE, ...parsed }
  } catch {
    return null
  }
}

export function saveProfile(profile: TasteProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Private browsing or a full quota. The app still works for this session.
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** React binding over the stored profile. */
export function useProfile() {
  const [profile, setProfileState] = useState<TasteProfile | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProfileState(loadProfile())
    setLoaded(true)
  }, [])

  const setProfile = useCallback((next: TasteProfile) => {
    saveProfile(next)
    setProfileState(next)
  }, [])

  const reset = useCallback(() => {
    clearProfile()
    setProfileState(null)
  }, [])

  return { profile, setProfile, reset, loaded }
}
