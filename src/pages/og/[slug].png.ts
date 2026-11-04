export const prerender = true;

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import { renderCoverPng } from '../../lib/coverPng';
import { getVisiblePosts, hasSvgCover } from '../../lib/posts';

export async function getStaticPaths() {
    const posts = await getVisiblePosts();
    return posts.filter(hasSvgCover).map((post) => ({
        params: { slug: post.id },
    }));
}

export const GET: APIRoute = async ({ params }) => {
    const coverPath = join('src/content/posts', params.slug!, 'cover.svg');
    try {
        const png = renderCoverPng(await readFile(coverPath, 'utf8'));
        return new Response(png, { headers: { 'Content-Type': 'image/png' } });
    } catch (cause) {
        throw new Error(`${coverPath}를 PNG로 변환하지 못했습니다`, { cause });
    }
};
