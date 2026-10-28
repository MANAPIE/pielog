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

const SITE = 'https://pielog.me';

// Opens external links in the post body in a new tab.
// Note: a raw `<a>` written in `.mdx` is a JSX node, not a hast `element`, so
// it is left as written — only Markdown `[label](url)` links are rewritten.
function rehypeExternalLinks() {
  const { hostname: siteHost } = new URL(SITE);
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string' && /^https?:\/\//i.test(href) && URL.canParse(href)
        && new URL(href).hostname !== siteHost) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener'];
      }
    }
    node.children?.forEach(visit);
  };
  return visit;
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
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
    rehypePlugins: [rehypeExternalLinks],
    shikiConfig: { theme: 'github-dark' },
  },
});