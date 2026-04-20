import type { APIRoute } from 'astro';
import { redis } from '../../lib/redis';

// POST: 조회수 증가 + 반환
export const POST: APIRoute = async ({ request }) => {
  const { slug } = await request.json();
  if (!slug || typeof slug !== 'string') {
    return new Response(JSON.stringify({ error: 'slug is required' }), { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [views, todayVisitors, totalVisitors] = await Promise.all([
    redis.incr(`views:${slug}`),
    redis.pfadd(`visitors:daily:${today}`, slug + ':' + Date.now()),
    redis.pfadd('visitors:total', slug + ':' + Date.now()),
  ]);

  const [todayCount, totalCount] = await Promise.all([
    redis.pfcount(`visitors:daily:${today}`),
    redis.pfcount('visitors:total'),
  ]);

  return new Response(JSON.stringify({ views, todayVisitors: todayCount, totalVisitors: totalCount }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// GET: 방문자 수 + 특정 slug 조회수 조회
export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  const today = new Date().toISOString().slice(0, 10);

  const [todayCount, totalCount] = await Promise.all([
    redis.pfcount(`visitors:daily:${today}`),
    redis.pfcount('visitors:total'),
  ]);

  let views = 0;
  if (slug) {
    views = (await redis.get<number>(`views:${slug}`)) ?? 0;
  }

  return new Response(JSON.stringify({ views, todayVisitors: todayCount, totalVisitors: totalCount }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
