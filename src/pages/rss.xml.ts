export const prerender = true;

import rss from '@astrojs/rss';
import { getVisiblePosts } from '../lib/posts';

export async function GET(context: { site: string }) {
    const posts = await getVisiblePosts();
    return rss({
        title: 'PIElog',
        description: 'MANAPIE\'s thoughts & experiments',
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            link: `/${post.id}/`,
        })),
    });
}
