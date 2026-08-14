/**
 * Apply service worker updates without the user having to know what a service
 * worker is.
 *
 * The PWA precaches the whole build. With `autoUpdate`, a new build installs
 * in the background and takes control on the *next* load — so the page you are
 * looking at keeps serving the old assets. That is how a shipped, verified
 * change can appear not to have happened at all.
 *
 * `skipWaiting` + `clientsClaim` make the new worker take control as soon as
 * it activates, which fires `controllerchange`. Reloading once at that moment
 * swaps the page onto the new build immediately.
 */

export function installUpdateHandler(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  // On a first visit the page starts uncontrolled, so clientsClaim fires
  // controllerchange as the worker takes over for the very first time. That is
  // a registration, not an update, and reloading for it gave every new visitor
  // a pointless reload mid-render.
  const hadController = Boolean(navigator.serviceWorker.controller)
  let reloading = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return
    // The guard matters: without it a slow activation can fire twice and put
    // the tab into a reload loop.
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  // Check for a new build when the tab regains focus, so a long-lived tab
  // does not sit on a stale version indefinitely.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return
    navigator.serviceWorker.getRegistration().then((reg) => reg?.update())
  })
}
