import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import Companion from './Companion'

/**
 * The companion's contract is mostly about when it should NOT appear:
 * touch devices have no cursor to chase, and a visitor asking for reduced
 * motion should not get an animated character following them.
 */

function stubMedia({ fine, reduced }: { fine: boolean; reduced: boolean }) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: query.includes('pointer: fine')
          ? fine
          : query.includes('prefers-reduced-motion')
            ? reduced
            : false,
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

describe('cursor companion', () => {
  it('does not render on a touch device', () => {
    stubMedia({ fine: false, reduced: false })
    const { container } = render(<Companion />)
    expect(container.querySelector('.companion')).toBeNull()
  })

  it('does not render when reduced motion is requested', () => {
    stubMedia({ fine: true, reduced: true })
    const { container } = render(<Companion />)
    expect(container.querySelector('.companion')).toBeNull()
  })

  it('renders with a fine pointer, but stays hidden until the mouse moves', () => {
    stubMedia({ fine: true, reduced: false })
    const { container } = render(<Companion />)

    const el = container.querySelector('.companion')
    expect(el).not.toBeNull()
    // No cursor position known yet, so he must not flash in at the origin.
    expect(el!.classList.contains('visible')).toBe(false)
  })

  it('appears and positions itself once the mouse moves', async () => {
    stubMedia({ fine: true, reduced: false })
    const { container } = render(<Companion />)

    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 400, clientY: 300 }))
    })
    await nextFrame()

    const el = container.querySelector('.companion') as HTMLElement
    expect(el.classList.contains('visible')).toBe(true)
    expect(el.style.transform).toMatch(/translate3d/)
  })

  it('is hidden from assistive technology and never intercepts clicks', () => {
    stubMedia({ fine: true, reduced: false })
    const { container } = render(<Companion />)

    const el = container.querySelector('.companion') as HTMLElement
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
