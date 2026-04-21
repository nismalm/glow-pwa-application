import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Glow — Daily Progress',
        short_name: 'Glow',
        description: 'Your daily progress, beautifully.',
        id: '/',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f5f3ef',
        theme_color: '#cdde3f',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Must match the actual precached file name — vite-plugin-pwa stores it
        // as index.html, not "/", so navigateFallback: '/' causes non-precached-url.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/__\/auth\//,      // Firebase redirect handler — must not be intercepted
          /^\/__\/firebase\//,  // Firebase hosting reserved paths
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'gfonts-webfonts' },
          },
          {
            // Firebase endpoints — network only, no SW interference
            urlPattern: /^https:\/\/(firestore|firebase|identitytoolkit|securetoken)\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Firebase auth handler on the authDomain — never cache, never intercept
            urlPattern: /^https:\/\/[a-z0-9-]+\.firebaseapp\.com\/__\/auth\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
