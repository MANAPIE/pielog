import type { APIRoute } from 'astro';
import { getVisiblePosts } from '../../lib/posts';
import { redis } from '../../lib/redis';

export const GET: APIRoute = async () => {
  const posts = await getVisiblePosts();
  const slugs = posts.map((p) => p.id);

  if (slugs.length === 0) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const keys = slugs.map((s) => `views:${s}`);
  const counts = await redis.mget<(number | null)[]>(...keys);

  const ranked = slugs
    .map((slug, i) => ({
      slug,
      title: posts[i].data.title,
      views: counts[i] ?? 0,
    }))
    .filter((p) => p.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return new Response(JSON.stringify(ranked), {
    headers: { 'Content-Type': 'application/json' },
  });
};
