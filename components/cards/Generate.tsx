"use client";

export const BLANK_FORM_MESSAGE =
  "Congratulations, you just wasted both our time by sending a completely blank form.\n" +
  "Did you think I was a magician who could pull a PCR narrative out of nothing?\n" +
  "Next time try actually doing your job and filling out the fields before hitting submit.";

import { Status } from "@/hooks/use-narrative-generation";
import NarrativeOutput from "@/components/narrative/NarrativeOutput";
import { cn } from "@/lib/cn";

interface Props {
  isGenerating: boolean;
  status: Status;
  narrative: string;
  error: string | null;
  onReset: () => void;
  onResetForm: () => void;
  onReturnTrip: () => void;
}

export default function Generate({
  isGenerating,
  status,
  narrative,
  error,
  onReset,
  onResetForm,
  onReturnTrip,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <button
        type="submit"
        disabled={isGenerating}
        className={cn(
          "w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors",
          isGenerating
            ? "bg-blue-600 opacity-70 cursor-not-allowed"
            : "bg-blue-800 hover:bg-blue-900"
        )}
      >
        {isGenerating ? "Generating narrative..." : "Generate Narrative"}
      </button>

      <div id="narrative-output">
        <NarrativeOutput
          status={status}
          narrative={narrative}
          error={error}
          onRegenerate={onReset}
        />
      </div>

      {status === "ok im done" && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={onReturnTrip}
            className="w-full rounded-lg border border-blue-500 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
          >
            Generate Return Trip Narrative
          </button>
          <button
            type="button"
            onClick={() => { onReset(); onResetForm(); }}
            className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            New Call — Clear All Fields
          </button>
        </div>
      )}
    </div>
  );
}
