/**
 * Render smoke tests. These catch the things a type-check cannot: the guide
 * Markdown glob resolving, routes mounting, and the profile round-tripping
 * through localStorage.
 */

import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import GuideSection from './routes/GuideSection'
import { GUIDE_SECTIONS } from './lib/guide'
import { saveProfile, loadProfile, clearProfile } from './lib/profile'
import { buildProfile } from './lib/quiz'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  clearProfile()
})

describe('guide content', () => {
  it('loads every Markdown section with a title and body', () => {
    expect(GUIDE_SECTIONS.length).toBeGreaterThan(0)

    for (const s of GUIDE_SECTIONS) {
      expect(s.title).not.toBe('')
      expect(s.html).toContain('<')
      // The H1 is rendered by the page, so it must not be duplicated in the body.
      expect(s.html).not.toContain('<h1>')
    }
  })

  it('orders sections by their filename number', () => {
    const orders = GUIDE_SECTIONS.map((s) => s.order)
    expect([...orders].sort((a, b) => a - b)).toEqual(orders)
  })

  it('renders a guide section page', () => {
    const section = GUIDE_SECTIONS[0]
    render(
      <MemoryRouter initialEntries={[`/guide/${section.slug}`]}>
        <Routes>
          <Route path="/guide/:slug" element={<GuideSection />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(section.title)
  })
})

describe('routes', () => {
  it('renders the home page', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })

  it('renders the quiz with its first question', () => {
    renderAt('/quiz')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/drink your coffee/i)
  })

  it('renders the grinder finder with the catalogue', () => {
    renderAt('/grinders')
    expect(screen.getByText(/Which grinder should you buy/i)).toBeTruthy()
    expect(screen.getByText(/Timemore Chestnut C3$/)).toBeTruthy()
  })

  it('does not suggest stretching to a grinder far beyond the budget', () => {
    // Default budget is ₹6,000; a ₹34,000 grinder is not a near miss.
    renderAt('/grinders')
    expect(screen.queryByText(/Fellow Ode Gen 2/)).toBeNull()
  })

  it('does still suggest stretching to a grinder just over the budget', () => {
    // ₹25,000 budget: the ₹31,000 Comandante is a genuine 1.24x stretch.
    saveProfile(buildProfile({}, ['pourover'], 25000))
    renderAt('/grinders')
    expect(screen.getByText('Worth stretching for')).toBeTruthy()
  })

  it('renders the beans page', () => {
    renderAt('/beans')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Beans')
  })

  it('prompts for the quiz on /you when no profile is saved', () => {
    renderAt('/you')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/haven't taken/i)
  })
})

describe('saved profile', () => {
  it('round-trips through localStorage', () => {
    const p = buildProfile({ milk: 0, roast: 2 }, ['pourover'], 12000)
    saveProfile(p)
    expect(loadProfile()).toEqual(p)
  })

  it('shows recommendations on /you once a profile exists', () => {
    saveProfile(buildProfile({ milk: 0, roast: 2 }, ['pourover'], 12000))
    renderAt('/you')

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Your taste')
    expect(screen.getByText('Beans to try')).toBeTruthy()

    // A light-roast pourover drinker must not be led with a dark roast.
    const beans = screen.getByText('Beans to try').parentElement!
    expect(within(beans).queryByText(/Vienna Roast/)).toBeNull()
  })
})
