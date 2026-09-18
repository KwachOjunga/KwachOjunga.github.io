'use client';

import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidDiagram from './MermaidDiagram';
import CodeBlock from './CodeBlock';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface MDXRendererProps {
  content: string;
  className?: string;
}

export default function MDXRenderer({
  content,
  className = '',
}: MDXRendererProps) {
  return (
    <div className={`mdx-content ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          /*
           * react-markdown renders fenced code as:
           *
           * <pre>
           *   <code class="language-rust">...</code>
           * </pre>
           *
           * CodeBlock already owns its own <pre>, so unwrap the
           * react-markdown <pre> and let the code renderer handle it.
           */
          pre: ({ children }) => {
            return <>{children}</>;
          },

          /*
           * Handles both inline code and fenced code blocks.
           *
           * Block code arrives through the <pre> renderer above.
           * Inline code does not.
           */
          code: ({ className, children, ...props }) => {
            const codeString = String(children);
            const match = /language-([\w-]+)/.exec(className || '');
            const language = match?.[1]?.toLowerCase() || '';

            /*
             * Mermaid must be explicitly declared:
             *
             * ```mermaid
             * flowchart TD
             *   A --> B
             * ```
             *
             * Do not infer Mermaid from the contents of the code.
             */
            if (language === 'mermaid') {
              return (
                <MermaidDiagram
                  chart={codeString.replace(/\n$/, '')}
                />
              );
            }

            /*
             * A code element without a language class and without
             * newlines is normally inline Markdown code:
             *
             * `foo`
             *
             * Block code is handled by CodeBlock below.
             */
            const isInline =
              !className && !codeString.includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 mx-0.5 rounded-md bg-neutral-200/70 dark:bg-neutral-800/80 text-amber-800 dark:text-yellow-300 font-mono text-[0.875em] border border-neutral-300/60 dark:border-neutral-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                code={codeString}
                language={language || 'text'}
              />
            );
          },

          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <table
                className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-sm"
                {...props}
              >
                {children}
              </table>
            </div>
          ),

          thead: ({ children, ...props }) => (
            <thead
              className="bg-neutral-100 dark:bg-neutral-800/70 text-neutral-900 dark:text-neutral-100"
              {...props}
            >
              {children}
            </thead>
          ),

          th: ({ children, ...props }) => (
            <th
              className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              {...props}
            >
              {children}
            </th>
          ),

          td: ({ children, ...props }) => (
            <td
              className="px-4 py-3 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200/60 dark:border-neutral-800/60"
              {...props}
            >
              {children}
            </td>
          ),

          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-6 border-l-4 border-amber-500 pl-4 py-1.5 italic bg-amber-500/5 dark:bg-yellow-500/5 rounded-r-xl text-neutral-700 dark:text-neutral-300 prose-p:my-1"
              {...props}
            >
              {children}
            </blockquote>
          ),

          a: ({ href, children, ...props }) => {
            const isExternal =
              href?.startsWith('http') ||
              href?.startsWith('//');

            if (isExternal && href) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-amber-600 dark:text-yellow-400 hover:underline font-medium"
                  {...props}
                >
                  <span>{children}</span>
                  <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70 ml-0.5" />
                </a>
              );
            }

            if (href) {
              return (
                <Link
                  href={href}
                  className="text-amber-600 dark:text-yellow-400 hover:underline font-medium"
                  {...props}
                >
                  {children}
                </Link>
              );
            }

            return <a {...props}>{children}</a>;
          },

          h1: ({ children, ...props }) => (
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mt-10 mb-4"
              {...props}
            >
              {children}
            </h1>
          ),

          h2: ({ children, ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-8 mb-3"
              {...props}
            >
              {children}
            </h2>
          ),

          h3: ({ children, ...props }) => (
            <h3
              className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-6 mb-2.5"
              {...props}
            >
              {children}
            </h3>
          ),

          hr: (props) => (
            <hr
              className="my-10 border-t border-neutral-200 dark:border-neutral-800"
              {...props}
            />
          ),

          section: ({ node, ...props }: any) => {
            if (props['data-footnotes']) {
              return (
                <section
                  {...props}
                  className="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400"
                />
              );
            }

            return <section {...props} />;
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
