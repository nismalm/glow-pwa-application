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
        // Exclude Firebase API calls from precache — Firestore handles its own offline cache
        navigateFallback: '/',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'gfonts-webfonts' },
          },
          {
            // Firebase remote config / auth endpoints — network only, no SW interference
            urlPattern: /^https:\/\/(firestore|firebase|identitytoolkit)\.googleapis\.com\/.*/i,
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
