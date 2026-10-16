// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  site: 'https://fpsjago.github.io',
  base: '/overland',
  compressHTML: true,
  build: {
    assets: '_assets',
    // Inline the (small) stylesheet into every page so first paint never
    // waits on a separate render-blocking CSS request.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
