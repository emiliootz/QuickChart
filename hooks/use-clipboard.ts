"use client";

// useClipboard — copies text to the clipboard and briefly shows a "Copied!" confirmation.
//
// Uses the modern navigator.clipboard API with a fallback for older browsers that
// don't support it (creates a hidden textarea, selects it, and runs execCommand("copy")).
// The `copied` flag resets to false after 2 seconds.

import { useState } from "react";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return { copied, copy };
}
