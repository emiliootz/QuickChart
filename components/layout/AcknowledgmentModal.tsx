"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "quickchart_ack";

export default function AcknowledgmentModal() {
  // Start hidden to avoid flash — we'll show it after checking sessionStorage
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only show the modal if the user hasn't accepted this session
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    sessionStorage.setItem(SESSION_KEY, "true");
    setVisible(false);
  }

  // Not visible — render nothing (avoids any layout impact)
  if (!visible) return null;

  return (
    // Full-screen backdrop — blocks interaction with the app behind it
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        {/* Header */}
        <div className="bg-blue-800 rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">
            Please Read Carefully
          </p>
          <h1 className="text-xl font-bold text-white">
            AI Narrative Review Statement
          </h1>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            This application may generate a suggested PCR narrative using
            artificial intelligence. The generated narrative is a{" "}
            <strong>draft only</strong> and must be carefully reviewed by the
            user before it is saved, submitted, printed, or shared.
          </p>

          <p className="font-semibold text-slate-800">
            By continuing, you acknowledge and agree that:
          </p>

          <ol className="list-decimal list-outside pl-5 space-y-3">
            <li>
              The AI-generated narrative may contain errors, omissions,
              incorrect wording, or statements that do not accurately reflect
              the patient&apos;s condition, assessment, treatment, transport,
              or destination.
            </li>
            <li>
              You are solely responsible for reviewing, editing, and confirming
              that all documentation is complete, accurate, truthful, and
              consistent with the actual call, your clinical findings, and your
              agency&apos;s documentation requirements.
            </li>
            <li>
              The AI-generated narrative does not replace your professional
              judgment, clinical decision-making, or legal documentation
              responsibilities.
            </li>
            <li>
              You must verify all patient care details, including but not
              limited to chief complaint, history, assessment findings,
              interventions, response to treatment, transport details, and
              medical necessity.
            </li>
            <li>
              Do not submit or rely on any narrative that you have not
              personally reviewed and approved for accuracy.
            </li>
            <li>
              Use of this tool does not guarantee compliance with agency
              policy, payer requirements, state regulations, or legal standards
              for EMS documentation.
            </li>
          </ol>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mx-6" />

        {/* Checkbox + Accept */}
        <div className="px-6 py-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-400 text-blue-700 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 leading-snug">
              I understand that AI-generated narratives are drafts only and
              must be personally reviewed for accuracy, completeness, and legal
              documentation compliance before use.
            </span>
          </label>

          <button
            type="button"
            onClick={handleAccept}
            disabled={!checked}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors ${
              checked
                ? "bg-blue-800 hover:bg-blue-900"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
