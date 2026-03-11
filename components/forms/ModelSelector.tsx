"use client";

import { AIModel } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ModelSelectorProps {
  model: AIModel;
  onModelChange: (m: AIModel) => void;
}

const MODELS: { value: AIModel; label: string }[] = [
  { value: "claude-sonnet-4-6", label: "Sonnet — Quality" },
  { value: "claude-haiku-4-5-20251001", label: "Haiku — Speed" },
];

export default function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <div className="flex rounded-lg border border-slate-300 overflow-hidden">
      {MODELS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onModelChange(m.value)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium transition-colors",
            model === m.value
              ? "bg-blue-800 text-white"
              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
