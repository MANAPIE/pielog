import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: string }) {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    return rss({
        title: '블로그 이름',
        description: '기술과 디자인에 관한 이야기',
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            link: `/${post.id}/`,
        })),
    });
}
