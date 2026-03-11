"use client";

import { useState } from "react";
import { GenerateRequest } from "@/lib/types";

type Status = "idle" | "loading" | "streaming" | "complete" | "error";

export function useNarrativeGeneration() {
  const [status, setStatus] = useState<Status>("idle");
  const [narrative, setNarrative] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function generate(request: GenerateRequest) {
    setStatus("loading");
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

      setStatus("streaming");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setNarrative((prev) => prev + chunk);
      }

      setStatus("complete");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setNarrative("");
    setError(null);
  }

  return { status, narrative, error, generate, reset };
}
