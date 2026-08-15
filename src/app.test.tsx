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

  it('renders the brew timer with water calculated from the dose', () => {
    renderAt('/brew')
    // Pourover default: 15g at 1:16.7 → 250ml.
    expect(screen.getByText('15g')).toBeTruthy()
    expect(screen.getByText('250ml')).toBeTruthy()
    expect(screen.getByText('Start brewing')).toBeTruthy()
  })

  it('renders the visual guide with all its diagrams', () => {
    renderAt('/explore')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Coffee 101')

    for (const label of [
      /coffee cherry cross-section/i,
      /roast level spectrum/i,
      /coffee flavour wheel/i,
    ]) {
      expect(screen.getByRole('img', { name: label })).toBeTruthy()
    }
  })

  it('renders the brew log empty state with a single call to action', () => {
    renderAt('/log')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Your brews')
    expect(screen.getByText('No brews yet')).toBeTruthy()

    // The empty state carries the CTA, so the standalone button must not also
    // be rendered — that was the same action offered twice.
    expect(screen.getByRole('button', { name: 'Log one now' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Log a brew' })).toBeNull()
  })

  it('opens the log form pre-filled when the timer links into it', () => {
    renderAt('/log?method=espresso&dose=18&seconds=30')
    // 18g espresso at 1:2 → 36ml in the cup.
    expect(screen.getByText('36ml')).toBeTruthy()
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

/**
 * Smoke tests for the pages added in the "one stop" build. These catch the
 * failure mode that matters most for a site of this size: a route that throws
 * on render and takes the whole app down with it.
 */
describe('the learning and buying pages', () => {
  const PAGES: Array<[string, string]> = [
    ['/path', 'Two weeks to decent coffee'],
    ['/fix', "Something's wrong"],
    ['/water', 'Water'],
    ['/shelf', 'Your shelf'],
    ['/tasting', 'Learning to taste'],
    ['/espresso', 'Espresso'],
    ['/glossary', 'Glossary'],
    ['/buy', 'Spending money well'],
    ['/gear', 'The rest of the kit'],
    ['/roasters', 'Indian roasters'],
  ]

  for (const [route, heading] of PAGES) {
    it(`renders ${route}`, () => {
      renderAt(route)
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(heading)
    })
  }

  it('offers the guide hub as the way into everything else', () => {
    renderAt('/guide')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Learn coffee')
    // The hub has to actually link onward, or the nav restructure stranded pages.
    for (const label of [/Two weeks to decent coffee/, /Coffee 101/, /Glossary/]) {
      expect(screen.getByRole('link', { name: label })).toBeTruthy()
    }
  })

  it('picks up the Indian conditions chapter', () => {
    renderAt('/guide/indian-conditions')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Indian conditions/i)
  })

  it('shows the brew log empty state on an untouched shelf', () => {
    renderAt('/shelf')
    expect(screen.getByText('Nothing on the shelf')).toBeTruthy()
  })
})
