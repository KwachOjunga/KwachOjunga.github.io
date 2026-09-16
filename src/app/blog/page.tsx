import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getAllPosts, getAllTags } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog & Engineering Notes | Reginald Ojunga',
  description: 'Technical articles, compiler notes, architectural insights, and software engineering practices by Reginald Ojunga.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <BlogClient initialPosts={posts} tags={tags} />
    </main>
  );
}
