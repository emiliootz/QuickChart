"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { useNarrativeGeneration } from "@/hooks/useNarrativeGeneration";
import NarrativeOutput from "@/components/narrative/NarrativeOutput";
import {
  HOSPITAL_SYSTEMS,
  VET_HOSPITALS,
  getCampusOptions,
  type HospitalOption,
} from "@/lib/hospitals";
import MedHistoryInput from "@/components/forms/MedHistoryInput";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";
import UnitTransportCard from "@/components/forms/UnitTransportCard";
import { Card, Field, inputCls } from "@/components/forms/formHelpers";
import { cn } from "@/lib/cn";

// ─── Component ────────────────────────────────────────────────────────────────

export default function StructuredForm() {
  const model = "claude-sonnet-4-6" as const;
  const { status, narrative, error, generate, reset } = useNarrativeGeneration();

  const { register, handleSubmit, watch, setValue, reset: resetForm, getValues } = useForm<StructuredFormData>({
    defaultValues: {
      ambulanceNumber: "",
      transportType: "",
      sceneLocation: "",
      sceneLocationCustom: "",
      sceneHospitalSystem: "",
      sceneHospitalName: "",
      sceneHospitalCampus: "",
      sceneHospitalCustom: "",
      sceneFloorRoom: "",
      destination: "",
      destinationCustom: "",
      destinationHospitalSystem: "",
      destinationHospitalName: "",
      destinationHospitalCampus: "",
      destinationHospitalCustom: "",
      destinationRoom: "",
      reportReceivedFrom: "",
      patientAge: "",
      patientDOB: "",
      patientAddress: "",
      patientGender: "",
      chiefComplaint: "",
      transportReason: "",
      transportReasonCustom: "",
      oxygenDelivery: "",
      oxygenLiters: "",
      castType: "",
      sectionType: "",
      mentalStatus: "",
      medicalHistory: "",
      airway: "",
      breathing: "",
      circulation: "",
      skin: "",
      skinCustom: "",
      bloodPressure: "",
      bloodPressureNote: "",
      heartRate: "",
      heartRateNote: "",
      spo2: "",
      spo2Note: "",
      painScore: "",
      patientHeight: "",
      patientWeight: "",
      patientComplaints: "",
      mobilityLevel: "",
      transferType: "",
      transportPosition: "",
      transportPositionCustom: "",
      additionalInfo: "",
    },
  });

  const sceneLocation = watch("sceneLocation");
  const sceneHospitalSystem = watch("sceneHospitalSystem");
  const sceneHospitalName = watch("sceneHospitalName");
  const destination = watch("destination");
  const destinationHospitalSystem = watch("destinationHospitalSystem");
  const destinationHospitalName = watch("destinationHospitalName");
  const transportPosition = watch("transportPosition");
  const transportReason = watch("transportReason");
  const bloodPressure = watch("bloodPressure");
  const heartRate = watch("heartRate");
  const spo2 = watch("spo2");
  const mobilityLevel = watch("mobilityLevel");
  const transportType = watch("transportType");
  const isEmergent = transportType === "Emergent Priority 1" || transportType === "Emergent Priority 2" || transportType === "Emergent Priority 3";
  const isGenerating = status === "loading" || status === "streaming";

  useEffect(() => {
    if (mobilityLevel === "Non-Ambulatory") setValue("transferType", "Sheet Draw Method");
    else if (mobilityLevel === "Ambulatory") setValue("transferType", "Ambulation");
    else if (mobilityLevel === "Stand and Pivot") setValue("transferType", "");
  }, [mobilityLevel, setValue]);

  const patientDOB = watch("patientDOB");
  useEffect(() => {
    if (!patientDOB) return;
    const birth = new Date(patientDOB);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age >= 0) setValue("patientAge", String(age));
  }, [patientDOB, setValue]);

  async function onSubmit(data: StructuredFormData) {
    await generate({ model, structuredData: data });
    setTimeout(() => {
      document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <UnitTransportCard register={register} />

      {/* Scene */}
      <Card title="Scene">
        <Field label="Scene Location">
          <select {...register("sceneLocation")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Residence">Residence</option>
            <option value="Hospital">Hospital</option>
            <option value="Veterinary Hospital">Veterinary Hospital</option>
            <option value="__other__">Other (enter manually)</option>
          </select>
        </Field>

        {sceneLocation === "Veterinary Hospital" && (
          <Field label="Veterinary Hospital">
            <select {...register("sceneHospitalName")} className={inputCls}>
              <option value="">Select hospital...</option>
              {VET_HOSPITALS.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </Field>
        )}

        {sceneLocation === "__other__" && (
          <Field label="Scene Location (specify)">
            <input
              {...register("sceneLocationCustom")}
              type="text"
              placeholder="e.g. Assisted Living Facility..."
              className={inputCls}
            />
          </Field>
        )}

        {sceneLocation === "Hospital" && (
          <Field label="Hospital Network">
            <select {...register("sceneHospitalSystem")} className={inputCls}>
              <option value="">Select network...</option>
              <option value="Beth Israel Lahey Health">Beth Israel Lahey Health</option>
              <option value="Boston Children's">Boston Children&apos;s</option>
              <option value="Boston Medical Center Health System">Boston Medical Center Health System</option>
              <option value="Cambridge Health Alliance">Cambridge Health Alliance</option>
              <option value="CareOne">CareOne</option>
              <option value="Dana-Farber Cancer Institute">Dana-Farber Cancer Institute</option>
              <option value="Encompass Health">Encompass Health</option>
              <option value="Mass General Brigham">Mass General Brigham</option>
              <option value="Massachusetts Department of Public Health (DPH)">Massachusetts Department of Public Health (DPH)</option>
              <option value="Tufts Medicine">Tufts Medicine</option>
              <option value="Universal Health Services (Arbour Health)">Universal Health Services (Arbour Health)</option>
              <option value="__other__">Other — enter manually</option>
            </select>
          </Field>
        )}

        {sceneLocation === "Hospital" && HOSPITAL_SYSTEMS[sceneHospitalSystem] && (
          <Field label="Hospital">
            <select {...register("sceneHospitalName")} className={inputCls}>
              <option value="">Select hospital...</option>
              {HOSPITAL_SYSTEMS[sceneHospitalSystem].map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </Field>
        )}

        {sceneLocation === "Hospital" && getCampusOptions(sceneHospitalSystem, sceneHospitalName).length > 0 && (
          <Field label="Campus / Location">
            <select {...register("sceneHospitalCampus")} className={inputCls}>
              <option value="">Select...</option>
              {getCampusOptions(sceneHospitalSystem, sceneHospitalName).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
        )}

        {sceneLocation === "Hospital" && sceneHospitalSystem === "__other__" && (
          <Field label="Hospital Name (specify)">
            <input
              {...register("sceneHospitalCustom")}
              type="text"
              placeholder="Enter hospital name and location"
              className={inputCls}
            />
          </Field>
        )}

        <Field label="Floor / Unit / Room">
          <input
            {...register("sceneFloorRoom")}
            type="text"
            placeholder="e.g. Unit 7C, Room 59"
            className={inputCls}
          />
        </Field>

        <Field label="Report Received From">
          <select {...register("reportReceivedFrom")} className={inputCls}>
            <option value="">Select...</option>
            <option value="RN">RN</option>
            <option value="LPN">LPN</option>
            <option value="MD/DO">MD/DO</option>
            <option value="Patient">Patient</option>
            <option value="Family/Caregiver">Family/Caregiver</option>
            <option value="Nursing Staff">Nursing Staff</option>
            <option value="No Report Available">No Report Available</option>
          </select>
        </Field>
      </Card>

      {/* Patient */}
      <Card title="Patient">
        <div className="grid grid-cols-2 gap-4">
          {isEmergent ? (
            <Field label="Date of Birth">
              <input
                {...register("patientDOB")}
                type="date"
                className={cn(inputCls)}
              />
              {watch("patientAge") && (
                <p className="text-xs text-slate-500 mt-1">Age: {watch("patientAge")} years old</p>
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
                onKeyDown={e => { if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"].includes(e.key)) e.preventDefault(); if (/^\d$/.test(e.key) && (e.target as HTMLInputElement).value.length >= 3) e.preventDefault(); }}
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
              value={watch("patientAddress")}
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
            value={watch("medicalHistory")}
            onChange={v => setValue("medicalHistory", v)}
          />
        </Field>
      </Card>

      {/* EMS Assessment */}
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

        {watch("skin") === "__other__" && (
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
              <input {...register("patientWeight")} type="number" min="1" max="999" placeholder="lbs" className={inputCls} onKeyDown={e => { if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"].includes(e.key)) e.preventDefault(); if (/^\d$/.test(e.key) && (e.target as HTMLInputElement).value.length >= 4) e.preventDefault(); }} />
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

      {/* Mobility & Transfer */}
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

      {/* Destination */}
      <Card title="Destination">
        <Field label="Destination">
          <select {...register("destination")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Residence">Residence</option>
            <option value="Hospital">Hospital</option>
            <option value="Veterinary Hospital">Veterinary Hospital</option>
            <option value="__other__">Other (enter manually)</option>
          </select>
        </Field>

        {destination === "Veterinary Hospital" && (
          <Field label="Veterinary Hospital">
            <select {...register("destinationHospitalName")} className={inputCls}>
              <option value="">Select hospital...</option>
              {VET_HOSPITALS.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </Field>
        )}

        {destination === "__other__" && (
          <Field label="Destination (specify)">
            <input
              {...register("destinationCustom")}
              type="text"
              placeholder="e.g. Spaulding Nursing & Therapy Center in Allston, MA"
              className={inputCls}
            />
          </Field>
        )}

        {destination === "Hospital" && (
          <Field label="Hospital Network">
            <select {...register("destinationHospitalSystem")} className={inputCls}>
              <option value="">Select network...</option>
              <option value="Beth Israel Lahey Health">Beth Israel Lahey Health</option>
              <option value="Boston Children's">Boston Children&apos;s</option>
              <option value="Boston Medical Center Health System">Boston Medical Center Health System</option>
              <option value="Cambridge Health Alliance">Cambridge Health Alliance</option>
              <option value="CareOne">CareOne</option>
              <option value="Dana-Farber Cancer Institute">Dana-Farber Cancer Institute</option>
              <option value="Encompass Health">Encompass Health</option>
              <option value="Mass General Brigham">Mass General Brigham</option>
              <option value="Massachusetts Department of Public Health (DPH)">Massachusetts Department of Public Health (DPH)</option>
              <option value="Tufts Medicine">Tufts Medicine</option>
              <option value="Universal Health Services (Arbour Health)">Universal Health Services (Arbour Health)</option>
              <option value="__other__">Other — enter manually</option>
            </select>
          </Field>
        )}

        {destination === "Hospital" && HOSPITAL_SYSTEMS[destinationHospitalSystem] && (
          <Field label="Hospital">
            <select {...register("destinationHospitalName")} className={inputCls}>
              <option value="">Select hospital...</option>
              {HOSPITAL_SYSTEMS[destinationHospitalSystem].map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </Field>
        )}

        {destination === "Hospital" && getCampusOptions(destinationHospitalSystem, destinationHospitalName).length > 0 && (
          <Field label="Campus / Location">
            <select {...register("destinationHospitalCampus")} className={inputCls}>
              <option value="">Select...</option>
              {getCampusOptions(destinationHospitalSystem, destinationHospitalName).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
        )}

        {destination === "Hospital" && destinationHospitalSystem === "__other__" && (
          <Field label="Hospital Name (specify)">
            <input
              {...register("destinationHospitalCustom")}
              type="text"
              placeholder="Enter hospital name and location"
              className={inputCls}
            />
          </Field>
        )}

        <Field label="Destination Room / Area">
          <input
            {...register("destinationRoom")}
            type="text"
            placeholder="e.g. Room 215B, ED Bay 4"
            className={inputCls}
          />
        </Field>
      </Card>

      {/* Additional Information */}
      <Card title="Additional Information">
        <Field label="Anything else to include">
          <textarea
            {...register("additionalInfo")}
            rows={4}
            placeholder="Vital signs, medications, oxygen use, IV access, patient complaints en route, receiving nurse name, etc."
            className={inputCls}
          />
        </Field>
      </Card>

      {/* Model + Submit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <button
          type="submit"
          disabled={isGenerating}
          className={cn(
            "w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors",
            isGenerating
              ? "bg-blue-600 opacity-70 cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-900"
          )}
        >
          {isGenerating ? "Generating narrative..." : "Generate Narrative"}
        </button>

        <div id="narrative-output">
          <NarrativeOutput
            status={status}
            narrative={narrative}
            error={error}
            onRegenerate={reset}
          />
        </div>

        {status === "complete" && (
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                const d = getValues();
                const returnData: StructuredFormData = {
                  ...d,
                  sceneLocation: d.destination,
                  sceneLocationCustom: d.destinationCustom,
                  sceneHospitalSystem: d.destinationHospitalSystem,
                  sceneHospitalName: d.destinationHospitalName,
                  sceneHospitalCampus: d.destinationHospitalCampus,
                  sceneHospitalCustom: d.destinationHospitalCustom,
                  sceneFloorRoom: d.destinationRoom,
                  destination: d.sceneLocation,
                  destinationCustom: d.sceneLocationCustom,
                  destinationHospitalSystem: d.sceneHospitalSystem,
                  destinationHospitalName: d.sceneHospitalName,
                  destinationHospitalCampus: d.sceneHospitalCampus,
                  destinationHospitalCustom: d.sceneHospitalCustom,
                  destinationRoom: d.sceneFloorRoom,
                };
                generate({ model, structuredData: returnData });
                setTimeout(() => {
                  document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
              className="w-full rounded-lg border border-blue-500 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              Generate Return Trip Narrative
            </button>
            <button
              type="button"
              onClick={() => { reset(); resetForm(); }}
              className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              New Call — Clear All Fields
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
