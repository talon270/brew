import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import Companion from './Companion'

/**
 * The companion's contract is mostly about restraint: it should not appear on
 * devices where it makes no sense, and it must never get between the user and
 * the page.
 */

function stubMedia({ width, reduced }: { width: number; reduced: boolean }) {
  vi.stubGlobal('innerWidth', width)
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: query.includes('prefers-reduced-motion') ? reduced : false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  )
}

function nextFrame() {
  return act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('walking companion', () => {
  it('does not render when the viewport is too narrow to walk in', () => {
    stubMedia({ width: 480, reduced: false })
    const { container } = render(<Companion />)
    expect(container.querySelector('.companion')).toBeNull()
  })

  it('does not render when reduced motion is requested', () => {
    stubMedia({ width: 1200, reduced: true })
    const { container } = render(<Companion />)
    expect(container.querySelector('.companion')).toBeNull()
  })

  it('renders and positions itself on the first frame', async () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement
    expect(el).not.toBeNull()
    expect(el.classList.contains('visible')).toBe(true)
    expect(el.style.transform).toMatch(/translate3d/)
  })

  it('walks downward over time', async () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement
    const yOf = (s: string) => Number(s.match(/translate3d\([^,]+,\s*([-\d.]+)px/)?.[1] ?? 0)
    const first = yOf(el.style.transform)

    for (let i = 0; i < 6; i++) await nextFrame()

    expect(yOf(el.style.transform)).toBeGreaterThan(first)
  })

  it('plays the walk cycle', async () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    expect(container.querySelector('.mascot.is-walking')).not.toBeNull()
    expect(container.querySelectorAll('.leg')).toHaveLength(2)
  })

  it('is hidden from assistive technology', () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    expect(container.querySelector('.companion')!.getAttribute('aria-hidden')).toBe('true')
  })
})
