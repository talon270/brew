import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Served from a subpath on GitHub Pages; override with BASE_PATH when deploying
// elsewhere. Paired with HashRouter so no server rewrites are needed.
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Brew — specialty coffee in Delhi NCR',
        short_name: 'Brew',
        description:
          'A beginner guide, grinder finder, and taste-matched coffee recommendations for Delhi NCR.',
        theme_color: '#a2542a',
        background_color: '#faf6f0',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // The guide is bundled JS, so precaching the build makes the whole
        // reading experience work offline.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Take control as soon as a new build activates instead of waiting
        // for every tab to close. Paired with the controllerchange reload in
        // src/lib/sw-update.ts, this is what stops the app serving a stale
        // build after a deploy.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
