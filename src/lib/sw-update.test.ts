import { afterEach, describe, expect, it, vi } from 'vitest'
import { installUpdateHandler } from './sw-update'

/**
 * Getting this backwards is invisible in development and annoying in
 * production: reload on the wrong event and every first-time visitor gets a
 * reload mid-render; skip the right one and they sit on a stale build.
 */

function stubServiceWorker({ controller }: { controller: boolean }) {
  const listeners: Record<string, Array<() => void>> = {}
  const reload = vi.fn()

  vi.stubGlobal('navigator', {
    serviceWorker: {
      controller: controller ? {} : null,
      addEventListener: (type: string, fn: () => void) => {
        ;(listeners[type] ??= []).push(fn)
      },
      getRegistration: () => Promise.resolve(undefined),
    },
  })
  vi.stubGlobal('location', { reload })

  return {
    reload,
    fireControllerChange: () => listeners.controllerchange?.forEach((fn) => fn()),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('service worker update handler', () => {
  it('does not reload on the first registration', () => {
    // No existing controller: the worker is taking over for the first time.
    const sw = stubServiceWorker({ controller: false })
    installUpdateHandler()

    sw.fireControllerChange()
    expect(sw.reload).not.toHaveBeenCalled()
  })

  it('reloads once when a new build takes over', () => {
    const sw = stubServiceWorker({ controller: true })
    installUpdateHandler()

    sw.fireControllerChange()
    expect(sw.reload).toHaveBeenCalledTimes(1)
  })

  it('never reloads twice, even if the event fires again', () => {
    const sw = stubServiceWorker({ controller: true })
    installUpdateHandler()

    sw.fireControllerChange()
    sw.fireControllerChange()
    expect(sw.reload).toHaveBeenCalledTimes(1)
  })

  it('does nothing where service workers are unsupported', () => {
    vi.stubGlobal('navigator', {})
    expect(() => installUpdateHandler()).not.toThrow()
  })
})
