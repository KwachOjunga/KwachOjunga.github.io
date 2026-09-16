import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';
import { projects } from '@/data/projects';

export async function GET() {
  const posts = getAllPosts().map(p => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    date: p.date,
  }));

  return NextResponse.json({
    posts,
    projects,
  });
}
