import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Link from "next/link";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/blog";
import { FolderGit2, BookOpen, ArrowRight, ExternalLink, Calendar, Clock } from "lucide-react";

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const recentPosts = getAllPosts().slice(0, 2);

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Skills />

      {/* Featured Projects Highlights Section */}
      <section id="featured-work" className="py-20 px-4 max-w-4xl mx-auto border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-700 dark:text-yellow-400 border border-amber-400/30 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Selected Works</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-yellow-400 hover:underline"
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.title}
              className="p-5 rounded-xl bg-white dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col justify-between hover:border-yellow-400/50 transition-all hover:shadow-md"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-yellow-400 block mb-1">
                  {project.category}
                </span>
                <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                <div className="flex gap-1 text-[10px] text-neutral-500">
                  {project.tech.slice(0, 2).join(' • ')}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-600 dark:text-yellow-400 font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Blog Highlights Section */}
      <section id="recent-articles" className="py-20 px-4 max-w-4xl mx-auto border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-700 dark:text-yellow-400 border border-amber-400/30 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Writing</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Latest Blog Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-yellow-400 hover:underline"
          >
            <span>Browse all articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="p-6 rounded-xl bg-white dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-yellow-400/50 transition-all hover:shadow-md block group"
            >
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                {post.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                <div className="flex gap-1.5">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-yellow-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}
