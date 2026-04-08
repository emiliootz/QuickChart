"use client";

// EMSAssessment — clinical findings documented by the EMS crew at the scene.
//
// "Set Normal" button:
//   One-click shortcut that fills airway/breathing/circulation/skin and all three
//   vitals with their normal baseline values. Useful for stable, routine transports.
//
// Vital sign note fields:
//   BP, heart rate, and SpO2 each reveal a free-text note field when an abnormal
//   value is selected (Hypertensive, Hypotensive, Tachycardic, Bradycardic, Hypoxic).
//   This lets the crew record the actual reading and suspected cause.
//
// Skin — "Other" option:
//   Selecting "__other__" in the skin dropdown reveals a free-text field for
//   skin conditions not covered by the preset list.
//
// isEmergent gate:
//   Emergent transports unlock three additional fields: Pain score (0–10),
//   patient height, and patient weight. Not collected for routine transports.

import { UseFormRegister, UseFormSetValue, Control, useWatch } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  control: Control<StructuredFormData>;  // needed for internal useWatch (skin field)
  setValue: UseFormSetValue<StructuredFormData>;  // used by the "Set Normal" button
  isEmergent: boolean;      // from use-form-watchers — unlocks pain, height, weight
  bloodPressure: string;    // from use-form-watchers — shows BP note field when abnormal
  heartRate: string;        // from use-form-watchers — shows HR note field when abnormal
  spo2: string;             // from use-form-watchers — shows SpO2 note field when hypoxic
}

export default function EMSAssessment({
  register,
  control,
  setValue,
  isEmergent,
  bloodPressure,
  heartRate,
  spo2,
}: Props) {
  const skin = useWatch({ control, name: "skin" });
  return (
    <Card title="EMS Assessment">
      <button
        type="button"
        onClick={() => {
          setValue("airway", "Patent");
          setValue("breathing", "Unlabored");
          setValue("circulation", "Adequate");
          setValue("skin", "warm and dry");
          setValue("bloodPressure", "Normal (at Baseline)");
          setValue("heartRate", "Normal (at Baseline)");
          setValue("spo2", "Normal (at Baseline)");
        }}
        className="w-full rounded-lg border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 active:bg-green-100 transition-colors"
      >
        Set Normal
      </button>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Airway">
          <select {...register("airway")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Patent">Patent</option>
            <option value="Compromised">Compromised</option>
            <option value="Obstructed">Obstructed</option>
          </select>
        </Field>
        <Field label="Breathing">
          <select {...register("breathing")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Unlabored">Unlabored</option>
            <option value="Labored">Labored</option>
            <option value="Shallow">Shallow</option>
            <option value="Absent">Absent</option>
          </select>
        </Field>
        <Field label="Circulation">
          <select {...register("circulation")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Adequate">Adequate</option>
            <option value="Inadequate">Inadequate</option>
          </select>
        </Field>
      </div>

      <Field label="Skin">
        <select {...register("skin")} className={inputCls}>
          <option value="">Select...</option>
          <option value="warm and dry">Warm and dry</option>
          <option value="cool and diaphoretic">Cool and diaphoretic</option>
          <option value="warm and diaphoretic">Warm and diaphoretic</option>
          <option value="cool and dry">Cool and dry</option>
          <option value="pale and diaphoretic">Pale and diaphoretic</option>
          <option value="pale and dry">Pale and dry</option>
          <option value="flushed and warm">Flushed and warm</option>
          <option value="cyanotic">Cyanotic</option>
          <option value="__other__">Other (enter manually)</option>
        </select>
      </Field>

      {skin === "__other__" && (
        <Field label="Skin (specify)">
          <input
            {...register("skinCustom")}
            type="text"
            placeholder="Describe skin condition"
            className={inputCls}
          />
        </Field>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Field label="BP">
          <select {...register("bloodPressure")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Normal (at Baseline)">Normal (at Baseline)</option>
            <option value="Hypertensive">Hypertensive</option>
            <option value="Hypotensive">Hypotensive</option>
          </select>
        </Field>
        <Field label="Heart Rate">
          <select {...register("heartRate")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Normal (at Baseline)">Normal (at Baseline)</option>
            <option value="Tachycardic">Tachycardic</option>
            <option value="Bradycardic">Bradycardic</option>
          </select>
        </Field>
        <Field label="SPO2">
          <select {...register("spo2")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Normal (at Baseline)">Normal (at Baseline)</option>
            <option value="Hypoxic">Hypoxic</option>
          </select>
        </Field>
      </div>

      {bloodPressure === "Hypertensive" && (
        <Field label="BP — specify">
          <input {...register("bloodPressureNote")} type="text" placeholder="e.g. 180/110 mmHg, history of hypertension" className={inputCls} />
        </Field>
      )}
      {bloodPressure === "Hypotensive" && (
        <Field label="BP — specify">
          <input {...register("bloodPressureNote")} type="text" placeholder="e.g. 88/50 mmHg, suspected dehydration" className={inputCls} />
        </Field>
      )}
      {heartRate === "Tachycardic" && (
        <Field label="Heart Rate — specify">
          <input {...register("heartRateNote")} type="text" placeholder="e.g. HR 130 bpm, anxiety / pain" className={inputCls} />
        </Field>
      )}
      {heartRate === "Bradycardic" && (
        <Field label="Heart Rate — specify">
          <input {...register("heartRateNote")} type="text" placeholder="e.g. HR 42 bpm, on beta-blockers" className={inputCls} />
        </Field>
      )}
      {spo2 === "Hypoxic" && (
        <Field label="SPO2 — specify">
          <input {...register("spo2Note")} type="text" placeholder="e.g. SpO2 88% on room air" className={inputCls} />
        </Field>
      )}

      {isEmergent && (
        <div className="grid grid-cols-3 gap-4">
          <Field label="Pain (0–10)">
            <select {...register("painScore")} className={inputCls}>
              <option value="">Select...</option>
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={String(i)}>{i}</option>
              ))}
            </select>
          </Field>
          <Field label="Height">
            <select {...register("patientHeight")} className={inputCls}>
              <option value="">Select...</option>
              {Array.from({ length: 49 }, (_, i) => {
                const totalIn = 30 + i;
                const ft = Math.floor(totalIn / 12);
                const inches = totalIn % 12;
                return (
                  <option key={totalIn} value={`${ft}ft ${inches}in (${totalIn} in)`}>
                    {ft}ft {inches}in ({totalIn} in)
                  </option>
                );
              })}
            </select>
          </Field>
          <Field label="Weight">
            <input
              {...register("patientWeight")}
              type="number"
              min="1"
              max="999"
              placeholder="lbs"
              className={inputCls}
              onKeyDown={e => {
                if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"].includes(e.key)) e.preventDefault();
                if (/^\d$/.test(e.key) && (e.target as HTMLInputElement).value.length >= 4) e.preventDefault();
              }}
            />
          </Field>
        </div>
      )}

      <Field label="Patient Complaints">
        <input
          {...register("patientComplaints")}
          type="text"
          placeholder="e.g. pain 6/10 right hip, shortness of breath (leave blank if none)"
          className={inputCls}
        />
      </Field>
    </Card>
  );
}
