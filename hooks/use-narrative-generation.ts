"use client";

// useNarrativeGeneration — manages the full AI generation lifecycle.
//
// Status values (intentionally descriptive):
//   "hurry up"          — idle, nothing has been generated yet
//   "working..."        — POST request sent, waiting for the server to respond
//   "relax im doing it" — response received, streaming text chunks into `narrative`
//   "ok im done"        — stream complete, narrative is ready
//   "sucks for you"     — an error occurred, message is in `error`
//
// generate() POSTs to /api/generate-narrative and reads the response as a
// streaming plain-text body, appending each decoded chunk to `narrative`.
//
// fail() lets useSubmit report validation errors (e.g. blank form) without
// going through the API at all.
//
// reset() clears all state back to idle — used by "Regenerate" and "New Call".

import { useState } from "react";
import { GenerateRequest } from "@/lib/types";

export type Status = "hurry up" | "working..." | "relax im doing it" | "ok im done" | "sucks for you";

export function useNarrativeGeneration() {
  const [status, setStatus] = useState<Status>("hurry up");
  const [narrative, setNarrative] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function generate(request: GenerateRequest) {
    setStatus("working...");
    setNarrative("");
    setError(null);

    try {
      const res = await fetch("/api/generate-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to generate narrative");
      }

      setStatus("relax im doing it");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setNarrative((prev) => prev + chunk);
      }

      setStatus("ok im done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setStatus("sucks for you");
    }
  }

  function fail(message: string) {
    setError(message);
    setStatus("sucks for you");
  }

  function reset() {
    setStatus("hurry up");
    setNarrative("");
    setError(null);
  }

  return { status, narrative, error, generate, fail, reset };
}
