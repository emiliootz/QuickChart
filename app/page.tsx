// Home — the single page of the app.
// Renders a page header and the PCRForm component.
// All application logic lives in PCRForm and its hooks.

import PCRForm from "@/components/forms/PCRForm";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">PCR Narrative Generator</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Fill in the fields below to generate a Medicare-compliant transport narrative.
        </p>
      </div>
      <PCRForm />
    </main>
  );
}
