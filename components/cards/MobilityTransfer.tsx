"use client";

// MobilityTransfer — how the patient moves and how they'll be positioned during transport.
//
// Mobility → Transfer Method auto-sync (useEffect):
//   Most mobility levels map directly to a single transfer method, so the field
//   is auto-filled and rendered as a read-only input:
//     Non-Ambulatory  → Sheet Draw Method
//     Ambulatory      → Ambulation
//   "Stand and Pivot" is the exception — it has two valid options, so it renders
//   a dropdown instead of the locked read-only input.
//
// Transport Position — "Other" option:
//   Selecting "__other__" reveals a free-text field for positions not in the list
//   (e.g. left lateral recumbent).

import { useEffect } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";
import { cn } from "@/lib/cn";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;  // used to auto-write transferType when mobilityLevel changes
  mobilityLevel: string;       // from use-form-watchers — drives transfer method display
  transportPosition: string;   // from use-form-watchers — reveals free-text field for "Other"
}

export default function MobilityTransfer({
  register,
  setValue,
  mobilityLevel,
  transportPosition,
}: Props) {
  useEffect(() => {
    if (mobilityLevel === "Non-Ambulatory") setValue("transferType", "Sheet Draw Method");
    else if (mobilityLevel === "Ambulatory") setValue("transferType", "Ambulation");
    else if (mobilityLevel === "Stand and Pivot") setValue("transferType", "");
  }, [mobilityLevel, setValue]);

  return (
    <Card title="Mobility & Transfer">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Mobility Level">
          <select {...register("mobilityLevel")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Non-Ambulatory">Non-Ambulatory</option>
            <option value="Ambulatory">Ambulatory</option>
            <option value="Stand and Pivot">Stand and Pivot</option>
          </select>
        </Field>
        <Field label="Transfer Method">
          {mobilityLevel === "Stand and Pivot" ? (
            <select {...register("transferType")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Stand & Pivot 2x Assist">Stand & Pivot 2x Assist</option>
              <option value="Stand & Pivot 1x Assist">Stand & Pivot 1x Assist</option>
            </select>
          ) : (
            <input
              readOnly
              value={mobilityLevel === "Non-Ambulatory" ? "Sheet Draw Method" : mobilityLevel === "Ambulatory" ? "Ambulation" : ""}
              placeholder="Select mobility first..."
              className={cn(inputCls, "bg-slate-50 text-slate-500 cursor-not-allowed")}
            />
          )}
        </Field>
      </div>

      <Field label="Transport Position">
        <select {...register("transportPosition")} className={inputCls}>
          <option value="">Select...</option>
          <option value="Semi-Fowler's">Semi-Fowler&apos;s</option>
          <option value="Supine">Supine</option>
          <option value="Prone">Prone</option>
          <option value="Sitting">Sitting</option>
          <option value="__other__">Other (enter manually)</option>
        </select>
      </Field>

      {transportPosition === "__other__" && (
        <Field label="Transport Position (specify)">
          <input
            {...register("transportPositionCustom")}
            type="text"
            placeholder="e.g. Left lateral recumbent"
            className={inputCls}
          />
        </Field>
      )}
    </Card>
  );
}
