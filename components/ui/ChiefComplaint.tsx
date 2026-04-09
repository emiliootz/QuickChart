"use client";

// ChiefComplaint — tag-style autocomplete input for selecting chief complaints.
//
// Mirrors MedHistory exactly, but filters COMPLAINTS (lib/complaints.ts) instead
// of DIAGNOSES. The same rules apply:
//   - Typing filters by full name or abbreviation; up to 8 results shown.
//   - Selecting adds a tag; if no match, an "Add [text]" custom option appears.
//   - Backspace on empty input removes the last tag.
//   - Tags are joined into a comma-separated string passed up via onChange,
//     which writes the value back to the React Hook Form state.

import { useState, useRef } from "react";
import { COMPLAINTS } from "@/lib/complaints";
import { inputCls } from "@/components/ui/FormPrimitives";

export default function ChiefComplaint({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(() =>
    value ? value.split(", ").filter(Boolean) : []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered =
    query.trim().length > 0
      ? COMPLAINTS.filter(
          (c) =>
            c.full.toLowerCase().includes(query.toLowerCase()) ||
            c.abbr.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
      : [];

  const showCustom =
    query.trim().length > 0 &&
    !filtered.some((c) => c.full.toLowerCase() === query.trim().toLowerCase());

  function addTag(label: string) {
    if (!tags.includes(label)) {
      const next = [...tags, label];
      setTags(next);
      onChange(next.join(", "));
    }
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeTag(label: string) {
    const next = tags.filter((t) => t !== label);
    setTags(next);
    onChange(next.join(", "));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      addTag(filtered.length > 0 ? filtered[0].full : query.trim());
    }
    if (e.key === "Backspace" && !query && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="text-blue-400 hover:text-blue-700 leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Type complaint or abbreviation to add..."
          className={inputCls}
        />
        {open && (filtered.length > 0 || showCustom) && (
          <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.full}>
                <button
                  type="button"
                  onMouseDown={() => addTag(c.full)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between gap-2"
                >
                  <span>{c.full}</span>
                  {c.abbr !== c.full && (
                    <span className="text-slate-400 text-xs shrink-0">
                      {c.abbr}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {showCustom && (
              <li>
                <button
                  type="button"
                  onMouseDown={() => addTag(query.trim())}
                  className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 italic border-t border-slate-100"
                >
                  Add &ldquo;{query.trim()}&rdquo;
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
