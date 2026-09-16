'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { Search, Calendar, Clock, PlusCircle, Copy, Check, BookOpen, ArrowRight, X, FileCode } from 'lucide-react';

interface BlogClientProps {
  initialPosts: BlogPost[];
  tags: string[];
}

export default function BlogClient({ initialPosts, tags }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Template state for quick helper
  const [newTitle, setNewTitle] = useState('Deep Dive into Rust Concurrency');
  const [newDesc, setNewDesc] = useState('Exploring fearless concurrency, atomic primitives, and async runtimes.');
  const [newTags, setNewTags] = useState('Rust, Systems, Concurrency');

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesTag && matchesSearch;
    });
  }, [initialPosts, selectedTag, searchQuery]);

  const generatedSlug = newTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const sampleFrontmatter = `---
title: "${newTitle}"
date: "${new Date().toISOString().split('T')[0]}"
description: "${newDesc}"
tags: [${newTags.split(',').map(t => `"${t.trim()}"`).join(', ')}]
author: "Reginald Ojunga"
---

# ${newTitle}

Write your introductory paragraph here...

## Section 1: Overview
Explain key concepts, architecture, or benchmark details.

\`\`\`rust
// Sample code snippet
fn main() {
    println!("Hello from ${newTitle}!");
}
\`\`\`

## Conclusion
Wrap up with takeaways.
`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(sampleFrontmatter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-800 dark:text-yellow-400 border border-amber-400/30 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles, Compilers & Systems Notes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
            Engineering Blog
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Thoughts, technical deep dives, and architectural explorations in systems programming,
            compilers, hardware architectures, and cloud DevOps.
          </p>
        </div>

        {/* Action Button: How to Add Blog Posts */}
        {/*<button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-semibold text-xs shadow-sm transition-all active:scale-[0.98] shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>How to Add a Post</span>
        </button>*/}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, description, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === 'All'
                ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
          >
            All Topics ({initialPosts.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Post List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <p className="text-base font-medium text-neutral-800 dark:text-neutral-200">No blog posts found</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Try searching for something else or clear the selected tag.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 transition-all hover:border-yellow-400/50 hover:shadow-lg dark:hover:shadow-yellow-950/20 group"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <time>{post.date}</time>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </span>
                {post.author && (
                  <>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </>
                )}
              </div>

              <Link href={`/blog/${post.slug}`} className="block group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition-colors">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                      }}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-yellow-400 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-yellow-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* "How to Add a Blog" Interactive Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
                <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                  How to Add a Blog Post
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div className="bg-amber-500/10 dark:bg-yellow-400/10 border border-amber-400/30 rounded-xl p-4 text-amber-900 dark:text-yellow-200 space-y-2">
                <p className="font-medium">It&apos;s 100% file-based and effortless!</p>
                <ol className="list-decimal list-inside space-y-1 text-xs opacity-90">
                  <li>Create a file inside <code className="bg-amber-100 dark:bg-yellow-950/60 px-1 py-0.5 rounded font-mono text-[11px] text-amber-900 dark:text-yellow-200">src/content/blog/</code> named <code className="bg-amber-100 dark:bg-yellow-950/60 px-1 py-0.5 rounded font-mono text-[11px] text-amber-900 dark:text-yellow-200">{generatedSlug || 'my-article'}.mdx</code></li>
                  <li>Paste the frontmatter header (title, date, description, tags).</li>
                  <li>Write your markdown content and save. Next.js instantly parses and publishes it!</li>
                </ol>
              </div>

              {/* Quick Template Generator */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Interactive Post Generator
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Post Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Ready to copy snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    Target path: src/content/blog/{generatedSlug || 'my-article'}.mdx
                  </span>
                  <button
                    onClick={copyTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-yellow-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-100 text-xs font-mono overflow-x-auto border border-neutral-800 leading-relaxed max-h-48">
                  {sampleFrontmatter}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
