// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://pielog.me',
  output: 'server',
  integrations: [react(), sitemap(), mdx()],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});