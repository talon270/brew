import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import Companion from './Companion'

/**
 * Two things matter here: he walks to where you are and then *stops*, and he
 * stays out of the way entirely where he does not belong.
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

async function frames(n: number) {
  for (let i = 0; i < n; i++) await nextFrame()
}

/**
 * Run until he stops walking. Waiting on the condition rather than guessing a
 * frame count keeps this stable across machines — a fixed count passed locally
 * and failed in CI purely on frame timing.
 */
async function settle(container: HTMLElement, cap = 240) {
  for (let i = 0; i < cap; i++) {
    if (!container.querySelector('.mascot.is-walking')) return true
    await nextFrame()
  }
  return false
}

function pointAt(x: number, y: number) {
  return act(async () => {
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }))
  })
}

const posOf = (el: HTMLElement) => {
  const m = el.style.transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/)
  return { x: Number(m?.[1] ?? 0), y: Number(m?.[2] ?? 0) }
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
    expect(el.classList.contains('visible')).toBe(true)
    expect(el.style.transform).toMatch(/translate3d/)
  })

  it('heads for the reading position, not the origin, before the mouse is used', async () => {
    // A zero pointer timestamp used to read as a fresh pointer at (0,0), so he
    // set off for the top-left corner the moment the page loaded.
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement
    const start = posOf(el)
    await frames(10)
    const now = posOf(el)

    // Viewport centre is below and right of where he starts, so both grow.
    expect(now.y).toBeGreaterThanOrEqual(start.y)
    expect(now.x).toBeGreaterThanOrEqual(start.x)
  })

  it('walks toward where the pointer is', async () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement
    const start = posOf(el)

    // Point well below and to the right of where he starts.
    await pointAt(900, 700)
    await frames(8)

    const now = posOf(el)
    expect(now.y).toBeGreaterThan(start.y)
    expect(now.x).toBeGreaterThan(start.x)
  })

  it('stops once it arrives instead of orbiting', async () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement

    // A short stroll from where he starts, then let him settle.
    await pointAt(170, 190)
    await frames(3)
    expect(container.querySelector('.mascot.is-walking')).not.toBeNull()
    expect(await settle(container)).toBe(true)

    const settled = posOf(el)
    await frames(20)
    const later = posOf(el)

    expect(Math.abs(later.x - settled.x)).toBeLessThan(1)
    expect(Math.abs(later.y - settled.y)).toBeLessThan(1)
    // Standing still means the walk cycle is off.
    expect(container.querySelector('.mascot.is-walking')).toBeNull()
  })

  it('sets off again when you move somewhere else', async () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement

    await pointAt(170, 190)
    await frames(3)
    expect(await settle(container)).toBe(true)
    const settled = posOf(el)

    await pointAt(170, 640)
    await frames(10)

    expect(posOf(el).y).toBeGreaterThan(settled.y)
    expect(container.querySelector('.mascot.is-walking')).not.toBeNull()
  })

  it('is hidden from assistive technology', () => {
    stubMedia({ width: 1200, reduced: false })
    const { container } = render(<Companion />)
    expect(container.querySelector('.companion')!.getAttribute('aria-hidden')).toBe('true')
  })
})
