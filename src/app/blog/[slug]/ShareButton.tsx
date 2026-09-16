'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.share) {
          await navigator.share({
            title,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch {
        // Ignored if user dismissed share dialog
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors text-xs"
      aria-label="Share this article"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-yellow-500" />
          <span>Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
