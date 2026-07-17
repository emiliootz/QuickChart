"use client";

// HospitalPicker — single-select autocomplete for hospital selection.
//
// Searches ALL_HOSPITALS by label, value, and abbr (abbreviations / aliases).
// Typing an abbreviation like "BI", "MGH", or "BWH Faulkner" will surface the
// right hospital even when the term isn't visible in the label.
//
// If no match is found, an "Add [text]" option lets the user enter a custom
// hospital name — same pattern as ChiefComplaint.
//
// The selected value is displayed as a removable tag. Clearing it brings
// back the search input.

import { useState, useRef } from "react";
import { ALL_HOSPITALS } from "@/lib/hospitals";
import { inputCls } from "@/components/ui/FormPrimitives";

function matches(h: { label: string; value: string; abbr?: string }, query: string): boolean {
  const q = query.toLowerCase();
  return (
    h.label.toLowerCase().includes(q) ||
    h.value.toLowerCase().includes(q) ||
    (!!h.abbr && h.abbr.toLowerCase().includes(q))
  );
}

export default function HospitalPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered =
    query.trim().length > 0
      ? ALL_HOSPITALS.filter((h) => matches(h, query.trim())).slice(0, 8)
      : [];

  const showCustom =
    query.trim().length > 0 &&
    !filtered.some((h) => h.label.toLowerCase() === query.trim().toLowerCase());

  function select(resolved: string) {
    onChange(resolved);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onChange("");
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  if (value) {
    return (
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          {value}
          <button
            type="button"
            onClick={clear}
            className="text-blue-400 hover:text-blue-700 leading-none"
          >
            ×
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            e.preventDefault();
            select(filtered.length > 0 ? filtered[0].value : query.trim());
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type hospital name or abbreviation..."
        className={inputCls}
      />
      {open && (filtered.length > 0 || showCustom) && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.map((h) => (
            <li key={h.value}>
              <button
                type="button"
                onMouseDown={() => select(h.value)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between gap-2"
              >
                <span>{h.label}</span>
                {h.abbr && (
                  <span className="text-slate-400 text-xs shrink-0">{h.abbr.split(",")[0].trim()}</span>
                )}
              </button>
            </li>
          ))}
          {showCustom && (
            <li>
              <button
                type="button"
                onMouseDown={() => select(query.trim())}
                className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 italic border-t border-slate-100"
              >
                Add &ldquo;{query.trim()}&rdquo;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
