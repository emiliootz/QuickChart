"use client";

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/forms/formHelpers";

interface Props {
  register: UseFormRegister<StructuredFormData>;
}

export default function UnitTransportCard({ register }: Props) {
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
