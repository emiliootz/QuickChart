"use client";

import { UseFormRegister, UseFormSetValue, Control, useWatch } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/forms/FormLayout";
import { cn } from "@/lib/cn";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";
import MedHistoryInput from "@/components/forms/MedHistoryInput";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  control: Control<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;
  isEmergent: boolean;
  transportReason: string;
}

export default function Patient({
  register,
  control,
  setValue,
  isEmergent,
  transportReason,
}: Props) {
  const patientAge = useWatch({ control, name: "patientAge" });
  const patientAddress = useWatch({ control, name: "patientAddress" });
  const medicalHistory = useWatch({ control, name: "medicalHistory" });
  return (
    <Card title="Patient">
      <div className="grid grid-cols-2 gap-4">
        {isEmergent ? (
          <Field label="Date of Birth">
            <input
              {...register("patientDOB")}
              type="date"
              className={cn(inputCls)}
            />
            {patientAge && (
              <p className="text-xs text-slate-500 mt-1">Age: {patientAge} years old</p>
            )}
          </Field>
        ) : (
          <Field label="Age">
            <input
              {...register("patientAge")}
              type="number"
              placeholder="e.g. 75"
              className={inputCls}
              maxLength={3}
              onKeyDown={e => {
                if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"].includes(e.key)) e.preventDefault();
                if (/^\d$/.test(e.key) && (e.target as HTMLInputElement).value.length >= 3) e.preventDefault();
              }}
            />
          </Field>
        )}
        <Field label="Gender">
          <select {...register("patientGender")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>
      </div>

      {isEmergent && (
        <Field label="Patient Address">
          <AddressAutocomplete
            value={patientAddress}
            onChange={v => setValue("patientAddress", v)}
          />
        </Field>
      )}

      <Field label="Chief Complaint">
        <input
          {...register("chiefComplaint")}
          type="text"
          placeholder="e.g. failure to thrive, frequent falls"
          className={inputCls}
        />
      </Field>

      <Field label="Reason for Transport">
        <select {...register("transportReason")} className={inputCls}>
          <option value="">Select reason...</option>
          <option value="On oxygen">On oxygen</option>
          <option value="Has symptoms of heart failure at rest">Has symptoms of heart failure at rest</option>
          <option value="Is receiving IV fluids">Is receiving IV fluids</option>
          <option value="Transporting after cardiac catheterization">Transporting after cardiac catheterization</option>
          <option value="Has uncontrolled epilepsy">Has uncontrolled epilepsy</option>
          <option value="Has a cast">Has a cast</option>
          <option value="Is in a neonatal incubator">Is in a neonatal incubator</option>
          <option value="Is sectioned">Is sectioned</option>
          <option value="Is sedated">Is sedated</option>
          <option value="Is in a coma">Is in a coma</option>
          <option value="Is unable to safely sit upright">Is unable to safely sit upright</option>
          <option value="Requires two-person assist for all transfers">Requires two-person assist for all transfers</option>
          <option value="Has severe dementia">Has severe dementia</option>
          <option value="Is altered mental status">Is altered mental status</option>
          <option value="Is paralyzed">Is paralyzed</option>
          <option value="Other">Other</option>
        </select>
      </Field>

      {transportReason === "On oxygen" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Oxygen Delivery Method">
            <select {...register("oxygenDelivery")} className={inputCls}>
              <option value="">Select...</option>
              <option value="nasal cannula">Nasal Cannula</option>
              <option value="non-rebreather mask">Non-Rebreather Mask</option>
            </select>
          </Field>
          <Field label="Liters per Minute">
            <input
              {...register("oxygenLiters")}
              type="number"
              placeholder="e.g. 2"
              className={inputCls}
            />
          </Field>
        </div>
      )}

      {transportReason === "Has a cast" && (
        <Field label="Cast Type">
          <select {...register("castType")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Total body cast">Total body cast</option>
            <option value="Hip cast">Hip cast</option>
          </select>
        </Field>
      )}

      {transportReason === "Is sectioned" && (
        <Field label="Section">
          <select {...register("sectionType")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Section 12">Section 12</option>
            <option value="Section 21">Section 21</option>
          </select>
        </Field>
      )}

      {transportReason === "Other" && (
        <Field label="Reason for Transport (specify)">
          <input
            {...register("transportReasonCustom")}
            type="text"
            placeholder="Describe reason for transport"
            className={inputCls}
          />
        </Field>
      )}

      <Field label="Mental Status">
        <select {...register("mentalStatus")} className={inputCls}>
          <option value="">Select...</option>
          <option value="A&Ox4">A&Ox4</option>
          <option value="A&Ox3">A&Ox3</option>
          <option value="A&Ox2">A&Ox2</option>
          <option value="A&Ox1">A&Ox1</option>
          <option value="Alert with Intermittent Confusion">Alert w/ Intermittent Confusion</option>
          <option value="Confused">Confused</option>
          <option value="Lethargic">Lethargic</option>
          <option value="Obtunded">Obtunded</option>
          <option value="Unresponsive">Unresponsive</option>
        </select>
      </Field>

      <Field label="Medical History">
        <MedHistoryInput
          value={medicalHistory}
          onChange={v => setValue("medicalHistory", v)}
        />
      </Field>
    </Card>
  );
}
