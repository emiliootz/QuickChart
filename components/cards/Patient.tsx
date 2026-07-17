"use client";

// Patient — demographic and clinical context fields.
//
// isEmergent gate:
//   When transportType is any Emergent Priority, an additional field unlocks:
//     - Patient Address (with Google Places autocomplete)
//   Age is always collected as a plain number regardless of transport type.
//
// transportReason cascade:
//   Certain reasons reveal a follow-up field:
//     "On oxygen"     → Oxygen Delivery Method + Liters per Minute
//     "Has a cast"    → Cast Type
//     "Is sectioned"  → Section (12 or 21)
//     "Other"         → free-text reason field

import { UseFormRegister, UseFormSetValue, Control, useWatch } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import MedHistory from "@/components/ui/MedHistory";
import ChiefComplaint from "@/components/ui/ChiefComplaint";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  control: Control<StructuredFormData>;  // needed for internal useWatch calls
  setValue: UseFormSetValue<StructuredFormData>;  // used to write calculated age back to form state
  isEmergent: boolean;      // from use-form-watchers — unlocks DOB and address fields
  transportReason: string;  // from use-form-watchers — drives transport reason sub-fields
}

export default function Patient({
  register,
  control,
  setValue,
  isEmergent,
  transportReason,
}: Props) {
  const patientAddress = useWatch({ control, name: "patientAddress" });
  const chiefComplaint = useWatch({ control, name: "chiefComplaint" });
  const medicalHistory = useWatch({ control, name: "medicalHistory" });

  return (
    <Card title="Patient">
      <div className="grid grid-cols-2 gap-4">
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
        <ChiefComplaint
          value={chiefComplaint}
          onChange={v => setValue("chiefComplaint", v)}
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
          <option value="Is being transfered for higher level of care">Transfer for higher level of care</option>
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
          <option value="Confused">Confused</option>
          <option value="Lethargic">Lethargic</option>
          <option value="Unresponsive">Unresponsive</option>
        </select>
      </Field>

      <Field label="Medical History">
        <MedHistory
          value={medicalHistory}
          onChange={v => setValue("medicalHistory", v)}
        />
      </Field>
    </Card>
  );
}
