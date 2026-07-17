"use client";

// UnitTransport — first card in the PCR form.
// Captures the ambulance unit identifier and the transport priority level.
//
// transportType drives `isEmergent` in use-form-watchers.ts, which unlocks
// additional fields in Patient (address) and EMSAssessment (pain, height, weight).
//
// Ambulance Number: user types 1–250; stored as "Brewster Ambulance-XX"
// (single digits zero-padded: 1 → "Brewster Ambulance-01").

import { useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;
}

export default function UnitTransport({ register, setValue }: Props) {
  const [unitNum, setUnitNum] = useState("");

  function handleUnitChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 3);
    setUnitNum(digits);
    const n = parseInt(digits, 10);
    if (digits && n >= 1 && n <= 250) {
      setValue("ambulanceNumber", `Brewster Ambulance-${String(n).padStart(2, "0")}`);
    } else {
      setValue("ambulanceNumber", "");
    }
  }

  return (
    <Card title="Unit & Transport">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ambulance Number">
          <input
            type="text"
            inputMode="numeric"
            value={unitNum}
            onChange={e => handleUnitChange(e.target.value)}
            onKeyDown={e => {
              if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) e.preventDefault();
            }}
            placeholder="e.g. 42"
            className={inputCls}
          />
        </Field>
        <Field label="Transport Type">
          <select {...register("transportType")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Emergent Priority 1">Emergent Priority 1</option>
            <option value="Emergent Priority 2">Emergent Priority 2</option>
            <option value="Emergent Priority 3">Emergent Priority 3</option>
            <option value="Non-Emergent">Non-Emergent</option>
          </select>
        </Field>
      </div>
    </Card>
  );
}
