/**
 * Theme preference.
 *
 * Three states, because "follow my system" is a real preference and not the
 * same as picking light. `system` removes the attribute entirely and lets the
 * prefers-color-scheme media query in index.css decide.
 */

import { useCallback, useEffect, useState } from 'react'

export type Theme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'brew.theme.v1'

export function readTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // ignore
  }
  return 'system'
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

const ORDER: Theme[] = ['system', 'light', 'dark']

export const THEME_LABELS: Record<Theme, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
}

export const THEME_ICONS: Record<Theme, string> = {
  system: '◐',
  light: '☀',
  dark: '☾',
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    const stored = readTheme()
    setThemeState(stored)
    applyTheme(stored)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private browsing. The choice still holds for this session.
    }
  }, [])

  const cycle = useCallback(() => {
    setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length])
  }, [theme, setTheme])

  return { theme, setTheme, cycle }
}
