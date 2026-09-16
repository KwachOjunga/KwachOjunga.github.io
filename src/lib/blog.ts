import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readTime: string;
  author?: string;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const posts: BlogPost[] = [];

  for (const filename of files) {
    if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) continue;
    if (filename.toLowerCase().startsWith('readme')) continue;

    const slug = filename.replace(/\.(mdx|md)$/, '');
    const fullPath = path.join(BLOG_DIR, filename);
    const rawContent = fs.readFileSync(fullPath, 'utf8');

    try {
      const { data, content } = matter(rawContent);

      posts.push({
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        date: data.date ? String(data.date) : 'Recently',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        readTime: data.readTime || estimateReadTime(content),
        author: data.author || 'Reginald Ojunga',
        content,
      });
    } catch (err) {
      console.error(`Error parsing blog post ${filename}:`, err);
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
}
