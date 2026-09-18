'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { useTheme } from 'next-themes';
import {
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code as CodeIcon,
  Maximize2,
  Minimize2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({
  chart,
  className = '',
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const rawId = useId();

  /*
   * IMPORTANT:
   *
   * useId() is stable across renders.
   *
   * Do NOT use Math.random(), Date.now(), or anything else that
   * generates a new value during render here. diagramId is a
   * dependency of the Mermaid rendering effect.
   */
  const diagramId = `mermaid${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  /*
   * Hydration guard.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /*
   * Render Mermaid whenever the actual diagram inputs change.
   *
   * diagramId is stable, so setSvgContent() will NOT cause this
   * effect to run again merely because the component rerendered.
   */
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    let isCancelled = false;

    setIsLoading(true);
    setError(null);

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

          theme: isDark ? 'dark' : 'default',

          themeVariables: isDark
            ? {
                darkMode: true,
                background: '#18181b',
                primaryColor: '#27272a',
                primaryTextColor: '#f4f4f5',
                primaryBorderColor: '#3f3f46',
                lineColor: '#a1a1aa',
                secondaryColor: '#27272a',
                tertiaryColor: '#18181b',
                fontFamily:
                  'ui-sans-serif, system-ui, sans-serif',
              }
            : {
                darkMode: false,
                background: '#ffffff',
                primaryColor: '#f4f4f5',
                primaryTextColor: '#18181b',
                primaryBorderColor: '#d4d4d8',
                lineColor: '#71717a',
                secondaryColor: '#f4f4f5',
                tertiaryColor: '#ffffff',
                fontFamily:
                  'ui-sans-serif, system-ui, sans-serif',
              },

          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: 'basis',
          },
        });

        /*
         * Mermaid can leave an element with the render ID in the
         * document. Remove it before rendering if necessary.
         */
        const existingEl = document.getElementById(diagramId);

        if (existingEl) {
          existingEl.remove();
        }

        const trimmedChart = chart.trim();

        const { svg } = await mermaid.render(
          diagramId,
          trimmedChart
        );

        if (isCancelled) {
          return;
        }

        setSvgContent(svg);
        setIsLoading(false);
        setError(null);
      } catch (err: unknown) {
        if (isCancelled) {
          return;
        }

        console.error('Mermaid render error:', err);

        const message =
          err instanceof Error
            ? err.message
            : 'Failed to render Mermaid diagram';

        setError(message);
        setIsLoading(false);

        /*
         * Mermaid may create an error element when rendering fails.
         */
        const strayError = document.getElementById(
          `d${diagramId}`
        );

        if (strayError) {
          strayError.remove();
        }
      }
    };

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart, isDark, isMounted, diagramId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart.trim());

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        'Failed to copy diagram source:',
        err
      );
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) =>
      Math.min(prev + 0.2, 2.5)
    );
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) =>
      Math.max(prev - 0.2, 0.5)
    );
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  /*
   * SSR / hydration placeholder.
   */
  if (!isMounted) {
    return (
      <div
        className={`my-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 p-6 flex flex-col items-center justify-center min-h-[180px] ${className}`}
      >
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="w-3.5 h-3.5 border-2 border-amber-500/50 border-t-transparent rounded-full animate-spin" />
          <span>
            Preparing architecture diagram...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`my-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-neutral-50/80 to-white dark:from-neutral-900/80 dark:to-neutral-950 shadow-sm overflow-hidden transition-all ${
          isFullscreen
            ? 'fixed inset-4 z-50 flex flex-col bg-white dark:bg-neutral-950 shadow-2xl border-neutral-300 dark:border-neutral-700 m-0'
            : className
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100/80 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 select-none">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 dark:bg-yellow-400 animate-pulse" />

            <span className="font-semibold tracking-wide uppercase text-[10px] text-neutral-700 dark:text-neutral-300">
              Architecture Diagram
            </span>

            {zoomLevel !== 1 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-200 dark:bg-neutral-800 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!error && !showSource && (
              <div className="hidden sm:flex items-center border-r border-neutral-200 dark:border-neutral-800 pr-1.5 mr-1.5 gap-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  title="Zoom In"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    title="Reset Zoom"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setShowSource((prev) => !prev)
              }
              className={`p-1.5 rounded-lg transition-colors ${
                showSource
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-yellow-400 font-medium'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
              title={
                showSource
                  ? 'Show Diagram'
                  : 'View Source'
              }
              aria-label="Toggle diagram source"
            >
              <CodeIcon className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
              title="Copy Diagram Code"
              aria-label="Copy diagram source"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Copied
                  </span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setIsFullscreen((prev) => !prev)
              }
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              title={
                isFullscreen
                  ? 'Exit Fullscreen'
                  : 'Fullscreen'
              }
              aria-label="Toggle diagram fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className={`relative p-4 sm:p-6 overflow-x-auto ${
            isFullscreen
              ? 'flex-1 overflow-auto'
              : 'min-h-[140px]'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-neutral-950/70 backdrop-blur-[2px] z-10">
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600 dark:text-yellow-400" />
                <span>
                  Rendering diagram...
                </span>
              </div>
            </div>
          )}

          {error ? (
            <div className="flex flex-col gap-3 py-4">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-yellow-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-yellow-400 shrink-0 mt-0.5" />

                <div className="space-y-1">
                  <p className="font-semibold">
                    Mermaid rendering notice
                  </p>

                  <p className="text-neutral-600 dark:text-neutral-400 font-mono text-[11px] break-all">
                    {error}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-neutral-900 text-neutral-200 p-3 text-xs font-mono overflow-x-auto">
                <pre>{chart.trim()}</pre>
              </div>
            </div>
          ) : showSource ? (
            <div className="rounded-xl bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto border border-neutral-800">
              <pre className="m-0 leading-relaxed">
                {chart.trim()}
              </pre>
            </div>
          ) : (
            <div
              ref={containerRef}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition:
                  'transform 0.15s ease-out',
              }}
              className="flex justify-center items-center w-full min-w-max mx-auto py-2 [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto"
              dangerouslySetInnerHTML={{
                __html: svgContent,
              }}
            />
          )}
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
