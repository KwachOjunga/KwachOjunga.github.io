import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-secondary mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-lg border border-secondary text-secondary hover:text-primary transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
