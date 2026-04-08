"use client";

// Generate — the submit + output card at the bottom of the PCR form.
//
// Responsibilities:
//   1. Renders the "Generate Narrative" submit button (disabled + label swap while generating).
//   2. Displays the NarrativeOutput component, which shows streaming text, errors, or nothing
//      depending on the current Status from use-narrative-generation.ts.
//   3. Once status reaches "ok im done", reveals two follow-up actions:
//        - "Generate Return Trip Narrative" — swaps scene/destination and re-runs generation
//        - "New Call — Clear All Fields" — resets both the narrative state and the entire form
//
// BLANK_FORM_MESSAGE is shown by use-submit.ts when the user submits with no fields filled.
// It's defined here (and exported) so it stays co-located with the Generate UI that displays it.

export const BLANK_FORM_MESSAGE =
  "Congratulations, you just wasted both our time by sending a completely blank form.\n" +
  "Did you think I was a magician who could pull a PCR narrative out of nothing?\n" +
  "Next time try actually doing your job and filling out the fields before hitting submit.";

import { Status } from "@/hooks/use-narrative-generation";
import NarrativeOutput from "@/components/narrative/NarrativeOutput";
import { cn } from "@/lib/cn";

interface Props {
  isGenerating: boolean;    // true while status is "working..." or "relax im doing it"
  status: Status;           // current generation state from use-narrative-generation
  narrative: string;        // streamed narrative text to display
  error: string | null;     // error message if generation failed
  onReset: () => void;      // clears narrative state (used by Regenerate and Return Trip)
  onResetForm: () => void;  // resets all form fields to default values (New Call button)
  onReturnTrip: () => void; // triggers return trip generation with swapped scene/destination
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
