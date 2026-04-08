"use client";

import { useEffect } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/forms/FormLayout";
import { cn } from "@/lib/cn";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;
  mobilityLevel: string;
  transportPosition: string;
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
