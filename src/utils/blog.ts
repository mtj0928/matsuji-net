import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPublishedTags(posts?: BlogPost[]): Promise<string[]> {
  const sourcePosts = posts ?? (await getPublishedPosts());
  return [...new Set(sourcePosts.flatMap((post) => post.data.tags ?? []))].sort();
}
