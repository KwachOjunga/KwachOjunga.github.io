'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Home, FolderGit2, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchModal, { SearchPostItem } from './SearchModal';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPosts, setSearchPosts] = useState<SearchPostItem[]>([]);

  // Fetch search data on first interaction or mount
  useEffect(() => {
    fetch('/api/search')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setSearchPosts(data.posts);
      })
      .catch(err => console.error('Failed to load search index:', err));
  }, []);

  // Global keyboard shortcut for Search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Blog', path: '/blog', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Avatar */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform hover:opacity-90 shrink-0"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-yellow-400/40 group-hover:ring-yellow-400/80 transition-all">
              <Image
                src="/avatar.jpg"
                alt="Reginald Ojunga avatar"
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </div>
            <div className="font-semibold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-neutral-100">
              Reginald Ojunga
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/70 dark:bg-neutral-900/70 p-1 rounded-full border border-neutral-200/60 dark:border-neutral-800/60">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-yellow-400 text-neutral-950 font-semibold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Bar (Search + Theme + Mobile Menu Toggle) */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search website"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-amber-400/15 text-amber-800 dark:text-yellow-400 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={searchPosts}
      />
    </>
  );
}
