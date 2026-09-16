import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import ShareButton from './ShareButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Reginald Ojunga',
    };
  }

  return {
    title: `${post.title} | Reginald Ojunga`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-amber-600 dark:text-neutral-400 dark:hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-800 dark:text-yellow-400 border border-amber-400/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
          {post.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
              <span>{post.author || 'Reginald Ojunga'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time>{post.date}</time>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>

          <ShareButton title={post.title} />
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-amber-600 dark:prose-a:text-yellow-400 prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-neutral-800">
        <div>
          <Markdown>{post.content}</Markdown>
        </div>
      </article>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-yellow-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore more engineering articles</span>
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <span>View Reginald&apos;s Projects</span>
          <span>→</span>
        </Link>
      </footer>
    </main>
  );
}
