import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: string }) {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
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
