"use client";

import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/cn";

type Status = "hurry up" | "working..." | "relax im doing it" | "ok im done" | "sucks for you";

interface NarrativeOutputProps {
  status: Status;
  narrative: string;
  error: string | null;
  onRegenerate: () => void;
}

export default function NarrativeOutput({
  status,
  narrative,
  error,
  onRegenerate,
}: NarrativeOutputProps) {
  const { copied, copy } = useClipboard();

  if (status === "hurry up") return null;

  const isStreaming = status === "relax im doing it";
  const isComplete = status === "ok im done";
  const isLoading = status === "working...";
  const isError = status === "sucks for you";

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Generated Narrative</span>
          {isStreaming && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Writing...
            </span>
          )}
          {isComplete && (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              Complete
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isComplete && (
            <button
              type="button"
              onClick={onRegenerate}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              Regenerate
            </button>
          )}
          {(isStreaming || isComplete) && (
            <button
              type="button"
              onClick={() => copy(narrative)}
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded transition-colors",
                copied
                  ? "text-green-700 bg-green-100"
                  : "text-slate-600 bg-slate-100 hover:bg-slate-200"
              )}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            {[100, 90, 95, 80, 85].map((w, i) => (
              <div
                key={i}
                className="h-4 bg-slate-200 rounded"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {(isStreaming || isComplete) && (
          <div className="relative">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
              {narrative}
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle animate-pulse" />
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
