import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects | Reginald Ojunga',
  description: 'A curated showcase of engineering projects spanning systems programming, compilers, full-stack web platforms, and DevOps infrastructure.',
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <ProjectsClient initialProjects={projects} />
    </main>
  );
}
