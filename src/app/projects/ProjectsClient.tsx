'use client';

import { useState, useMemo } from 'react';
import { Project } from '@/data/projects';
import { ExternalLink, Code2, Search, Sparkles, Filter } from 'lucide-react';

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Featured');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Featured',
    'All',
    'Systems & Compilers',
    'Fullstack & Web',
    'DevOps & Cloud',
    'Embedded & Hardware',
  ];

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // Category filter
      let matchesCategory = true;
      if (activeCategory === 'Featured') {
        matchesCategory = project.featured;
      } else if (activeCategory !== 'All') {
        matchesCategory = project.category === activeCategory;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tech.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeCategory, searchQuery]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-800 dark:text-yellow-400 border border-amber-400/30 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Portfolio & Engineering Work</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
          Featured Projects
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          A collection of software and hardware engineering initiatives spanning compiler frameworks,
          RISC-V processor architectures, low-level tooling, and systems programming.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 mb-8">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by title, keyword, or tech (e.g. Rust, CIRCT, RISC-V, LLVM)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <span>Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}</span>
        {(searchQuery || activeCategory !== 'Featured') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('Featured');
            }}
            className="text-amber-600 dark:text-yellow-400 font-semibold hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <p className="text-base font-medium text-neutral-800 dark:text-neutral-200">No projects match your criteria</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Try loosening your search or selecting &ldquo;All&rdquo; categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col justify-between transition-all hover:border-yellow-400/50 hover:shadow-lg dark:hover:shadow-yellow-950/20 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-yellow-400">
                      {project.category}
                    </span>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition-colors">
                      {project.title}
                    </h2>
                  </div>
                  {project.featured && (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-400/15 text-amber-800 dark:text-yellow-400 border border-yellow-400/30">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-sm">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-yellow-400 hover:underline"
                    >
                      <span>Repository / Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
