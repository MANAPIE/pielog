import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string()).optional(),
        cover: image().optional(),
        ogImage: image().optional(),
        draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
