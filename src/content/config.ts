import { defineCollection, z } from 'astro:content';

// ブログコレクション
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// 作品コレクション
const worksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    link: z.string().url(),
    category: z.enum(['oss', 'app', 'presentation', 'article']),
    tags: z.array(z.string()).default([]),
    order: z.number(),
    size: z.enum(['small', 'medium', 'large']),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
  works: worksCollection,
};
