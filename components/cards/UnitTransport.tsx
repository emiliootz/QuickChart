"use client";

// UnitTransport — first card in the PCR form.
// Captures the ambulance unit identifier and the transport priority level.
//
// transportType drives `isEmergent` in use-form-watchers.ts, which unlocks
// additional fields in Patient (DOB, address) and EMSAssessment (pain, height, weight).

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";

interface Props {
  // register — React Hook Form method that wires each input to the form state
  register: UseFormRegister<StructuredFormData>;
}

export default function UnitTransport({ register }: Props) {
  return (
    <Card title="Unit & Transport">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ambulance Number">
          <input
            {...register("ambulanceNumber")}
            type="text"
            placeholder="e.g. BA-042"
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
