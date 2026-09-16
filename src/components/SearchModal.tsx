'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, FolderGit2, Compass, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { projects } from '@/data/projects';

export interface SearchPostItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts?: SearchPostItem[];
}

const STATIC_SECTIONS = [
  { title: "Home Page", path: "/", description: "Profile overview, bio, and main summary", icon: Compass },
  { title: "About Reginald", path: "/#about", description: "Background in Medical Engineering and systems design", icon: Compass },
  { title: "Technical Skills", path: "/#skills", description: "Languages, Compilers, RISC-V, and Hardware toolkits", icon: Compass },
  { title: "Contact & Socials", path: "/#contact", description: "GitHub, LinkedIn, email, and consultation inquiry", icon: Compass },
  { title: "Featured Projects Page", path: "/projects", description: "Explore full projects portfolio and demos", icon: FolderGit2 },
  { title: "Blog & Notes", path: "/blog", description: "Technical articles on compilers, architecture, and engineering", icon: FileText },
];

export default function SearchModal({ isOpen, onClose, posts = [] }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        posts: posts.slice(0, 3),
        projects: projects.filter(p => p.featured).slice(0, 3),
        sections: STATIC_SECTIONS.slice(0, 3),
      };
    }

    const matchedPosts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );

    const matchedProjects = projects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tech.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );

    const matchedSections = STATIC_SECTIONS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );

    return {
      posts: matchedPosts,
      projects: matchedProjects,
      sections: matchedSections,
    };
  }, [query, posts]);

  const totalResultsCount =
    filteredResults.posts.length +
    filteredResults.projects.length +
    filteredResults.sections.length;

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-amber-600 dark:text-yellow-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, projects, skills, or topics..."
            className="w-full bg-transparent text-base outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {totalResultsCount === 0 ? (
            <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
              <p className="text-base font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try searching for &quot;compiler&quot;, &quot;RISC-V&quot;, &quot;DevOps&quot;, or &quot;Rust&quot;.</p>
            </div>
          ) : (
            <>
              {/* Blog Posts */}
              {filteredResults.posts.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-yellow-400 mb-3">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Blog Articles ({filteredResults.posts.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredResults.posts.map((post) => (
                      <button
                        key={post.slug}
                        onClick={() => handleSelect(`/blog/${post.slug}`)}
                        className="w-full text-left p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors flex items-start justify-between group"
                      >
                        <div className="space-y-1 pr-4">
                          <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition-colors">
                            {post.title}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {post.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {post.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {filteredResults.projects.length > 0 && (
                <div className="pt-4 first:pt-0">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-yellow-400 mb-3">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Projects ({filteredResults.projects.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredResults.projects.map((proj) => (
                      <button
                        key={proj.title}
                        onClick={() => handleSelect('/projects')}
                        className="w-full text-left p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors flex items-start justify-between group"
                      >
                        <div className="space-y-1 pr-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition-colors">
                              {proj.title}
                            </p>
                            {proj.featured && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-amber-800 dark:text-yellow-400 font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.tech.slice(0, 4).map((tech) => (
                              <span key={tech} className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Site Sections */}
              {filteredResults.sections.length > 0 && (
                <div className="pt-4 first:pt-0">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Navigation ({filteredResults.sections.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredResults.sections.map((sec) => (
                      <button
                        key={sec.title}
                        onClick={() => handleSelect(sec.path)}
                        className="text-left p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-yellow-400">
                            {sec.title}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {sec.description}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> Select</span>
            <span>•</span>
            <span>ESC to close</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-yellow-400 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Instant Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
