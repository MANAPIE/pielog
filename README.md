# PIElog

MANAPIE's personal tech blog — thoughts & experiments.

**[pielog.me](https://pielog.me)**

## Tech Stack

- **Framework** — [Astro](https://astro.build) (SSR, MDX)
- **UI** — React, Sass
- **Deploy** — [Vercel](https://vercel.com)
- **Analytics** — Vercel Analytics, Upstash Redis (view counts & visitor tracking)
- **Comments** — [Giscus](https://giscus.app) (GitHub Discussions)

## Features

- MDX posts with syntax highlighting (Shiki `github-dark`)
- Interactive components in posts (e.g. CodePlayground)
- Tag-based filtering
- Table of Contents
- View count & daily/total visitor tracking via Upstash Redis
- RSS feed (`/rss.xml`)
- Sitemap
- SEO-friendly with Open Graph support

## Project Structure

```
src/
├── components/         # Astro & React components
│   └── interactive/    # Client-side interactive components
├── content/
│   └── posts/          # MDX blog posts
├── layouts/            # Page layouts
├── lib/                # Utilities (Redis client, etc.)
├── pages/
│   ├── api/            # API routes (views, top-reads)
│   ├── tags/           # Tag pages
│   ├── [slug].astro    # Post detail page
│   └── index.astro     # Homepage
└── styles/             # Global styles
```

## Getting Started

```bash
# requires Node.js >= 22.12.0
npm install
npm run dev       # http://localhost:4321
```

### Environment Variables

| Variable | Description |
|---|---|
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

## Writing a Post

Create a new directory under `src/content/posts/` with an `index.mdx` file:

```mdx
---
title: "Post Title"
description: "Short description"
summary: "Optional summary for post cards"
date: 2026-04-20
tags: ["tag1", "tag2"]
thumbnail: ./cover.jpg
draft: false
---

Your content here.
```

## License

© MANAPIE. All rights reserved.
