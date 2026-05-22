// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import mermaid from 'astro-mermaid';

// Supports `## Heading {#custom-id}` syntax in Markdown headings.
// Note: this only works for `.md` files — in `.mdx`, `{...}` is parsed as a
// JSX expression and `{#id}` would fail before any remark plugin runs.
function remarkHeadingIds() {
  return (tree) => {
    for (const node of tree.children) {
      if (node.type !== 'heading' || node.children.length === 0) continue;
      const last = node.children[node.children.length - 1];
      if (!last || last.type !== 'text') continue;
      const match = last.value.match(/\s*\{#([\w-]+)\}\s*$/);
      if (!match) continue;
      last.value = last.value.slice(0, match.index).trimEnd();
      node.data = node.data || {};
      node.data.id = match[1];
      node.data.hProperties = { ...(node.data.hProperties || {}), id: match[1] };
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://pielog.me',
  output: 'server',
  integrations: [
    mermaid({ theme: 'default', autoTheme: true }),
    react(),
    sitemap(),
    mdx(),
  ],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  markdown: {
    remarkPlugins: [remarkHeadingIds],
    shikiConfig: { theme: 'github-dark' },
  },
});