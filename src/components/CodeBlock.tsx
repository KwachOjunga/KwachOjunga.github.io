'use client';

import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';

import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-llvm';
import 'prismjs/components/prism-nasm';
import 'prismjs/components/prism-verilog';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';

import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const LANGUAGE_MAP: Record<
  string,
  {
    prism: string;
    label: string;
  }
> = {
  rust: {
    prism: 'rust',
    label: 'Rust',
  },
  rs: {
    prism: 'rust',
    label: 'Rust',
  },

  c: {
    prism: 'c',
    label: 'C',
  },
  cpp: {
    prism: 'c',
    label: 'C++',
  },

  llvm: {
    prism: 'llvm',
    label: 'LLVM IR',
  },

  asm: {
    prism: 'nasm',
    label: 'Assembly',
  },
  assembly: {
    prism: 'nasm',
    label: 'Assembly',
  },
  nasm: {
    prism: 'nasm',
    label: 'x86-64 ASM',
  },

  verilog: {
    prism: 'verilog',
    label: 'Verilog',
  },
  systemverilog: {
    prism: 'verilog',
    label: 'SystemVerilog',
  },

  yaml: {
    prism: 'yaml',
    label: 'YAML',
  },
  yml: {
    prism: 'yaml',
    label: 'YAML',
  },
  hcl: {
    prism: 'yaml',
    label: 'HCL / Terraform',
  },

  bash: {
    prism: 'bash',
    label: 'Bash',
  },
  sh: {
    prism: 'bash',
    label: 'Shell',
  },

  json: {
    prism: 'json',
    label: 'JSON',
  },

  markdown: {
    prism: 'markdown',
    label: 'Markdown',
  },
  md: {
    prism: 'markdown',
    label: 'Markdown',
  },

  text: {
    prism: 'text',
    label: 'Plain Text',
  },
};

export default function CodeBlock({
  code,
  language = 'text',
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState('');

  const cleanLang = language
    .toLowerCase()
    .replace(/^language-/, '')
    .trim();

  const langConfig =
    LANGUAGE_MAP[cleanLang] ?? {
      prism: cleanLang,
      label: cleanLang
        ? cleanLang.toUpperCase()
        : 'CODE',
    };

  const rawCode = code.replace(/\n$/, '');

  useEffect(() => {
    const grammar = Prism.languages[langConfig.prism];

    if (!grammar) {
      setHighlightedHtml(
        rawCode
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      );

      return;
    }

    try {
      const html = Prism.highlight(
        rawCode,
        grammar,
        langConfig.prism
      );

      setHighlightedHtml(html);
    } catch (error) {
      console.warn(
        `Prism highlighting failed for "${langConfig.prism}"`,
        error
      );

      setHighlightedHtml(
        rawCode
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      );
    }
  }, [rawCode, langConfig.prism]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div
      className={`my-6 rounded-xl border border-neutral-800/80 bg-neutral-950 text-neutral-100 shadow-md overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs text-neutral-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>

          <span className="ml-2 font-mono text-[11px] font-semibold text-neutral-300">
            {langConfig.label}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-medium">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">
                Copy
              </span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <pre
          className="!bg-transparent !p-0 !m-0 !border-0 !overflow-visible font-mono"
          dangerouslySetInnerHTML={{
            __html: highlightedHtml,
          }}
        />
      </div>
    </div>
  );
}
