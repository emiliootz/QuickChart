"use client";

import { useForm } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { useNarrativeGeneration } from "@/hooks/useNarrativeGeneration";
import NarrativeOutput from "@/components/narrative/NarrativeOutput";
import { cn } from "@/lib/cn";

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white";

// ─── Hospital list ────────────────────────────────────────────────────────────

const HOSPITALS: { value: string; label: string }[] = [
  {
    value: "Massachusetts General Hospital in Boston, MA",
    label: "MGH — Boston",
  },
  {
    value: "Brigham and Women's Hospital in Boston, MA",
    label: "BWH — Boston",
  },
  {
    value: "Beth Israel Deaconess Medical Center East Campus in Boston, MA",
    label: "Beth Israel Deaconess — East Campus",
  },
  {
    value: "Beth Israel Deaconess Medical Center West Campus in Boston, MA",
    label: "Beth Israel Deaconess — West Campus",
  },
  {
    value: "Beth Israel Deaconess Medical Center in Needham, MA",
    label: "Beth Israel Deaconess — Needham",
  },
  { value: "Boston Medical Center in Boston, MA", label: "BMC — Boston" },
  {
    value: "Boston Medical Center Brighton campus in Brighton, MA",
    label: "BMC Brighton",
  },
  {
    value: "Tufts Medical Center in Boston, MA",
    label: "Tufts Medical Center — Boston",
  },
  {
    value: "Dana-Farber Cancer Institute in Boston, MA",
    label: "Dana-Farber Cancer Institute",
  },
  {
    value: "Massachusetts Eye and Ear in Boston, MA",
    label: "Massachusetts Eye and Ear",
  },
  {
    value: "New England Baptist Hospital in Boston, MA",
    label: "New England Baptist Hospital",
  },
  {
    value: "Brigham and Women's Faulkner Hospital in Jamaica Plain, MA",
    label: "Faulkner Hospital — Jamaica Plain",
  },
  {
    value: "Mount Auburn Hospital in Cambridge, MA",
    label: "Mount Auburn — Cambridge",
  },
  {
    value: "Newton-Wellesley Hospital in Newton, MA",
    label: "Newton-Wellesley Hospital",
  },
  {
    value: "Boston Children's Hospital in Boston, MA",
    label: "Boston Children's Hospital",
  },
  { value: "__other__", label: "Other — enter manually" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StructuredForm() {
  const model = "claude-sonnet-4-6" as const;
  const { status, narrative, error, generate, reset } = useNarrativeGeneration();

  const { register, handleSubmit, watch } = useForm<StructuredFormData>({
    defaultValues: {
      ambulanceNumber: "",
      transportType: "",
      sceneLocation: "",
      sceneLocationCustom: "",
      sceneHospitalName: "",
      sceneHospitalCustom: "",
      sceneFloorRoom: "",
      destination: "",
      destinationCustom: "",
      destinationHospitalName: "",
      destinationHospitalCustom: "",
      destinationRoom: "",
      reportReceivedFrom: "",
      patientAge: "",
      patientGender: "",
      chiefComplaint: "",
      mentalStatus: "",
      medicalHistory: "",
      airway: "Patent",
      breathing: "Unlabored",
      circulation: "Adequate",
      skin: "",
      skinCustom: "",
      patientComplaints: "",
      mobilityLevel: "",
      transferType: "",
      transportPosition: "",
      transportPositionCustom: "",
      additionalInfo: "",
    },
  });

  const sceneLocation = watch("sceneLocation");
  const sceneHospitalName = watch("sceneHospitalName");
  const destination = watch("destination");
  const destinationHospitalName = watch("destinationHospitalName");
  const transportPosition = watch("transportPosition");
  const isGenerating = status === "loading" || status === "streaming";

  async function onSubmit(data: StructuredFormData) {
    await generate({ model, structuredData: data });
    setTimeout(() => {
      document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Unit & Transport */}
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

      {/* Scene */}
      <Card title="Scene">
        <Field label="Scene Location">
          <select {...register("sceneLocation")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Residence">Residence</option>
            <option value="Hospital">Hospital</option>
            <option value="__other__">Other (enter manually)</option>
          </select>
        </Field>

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
          <Field label="Hospital Name">
            <select {...register("sceneHospitalName")} className={inputCls}>
              <option value="">Select hospital...</option>
              {HOSPITALS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {sceneLocation === "Hospital" && sceneHospitalName === "__other__" && (
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
          <Field label="Age">
            <input
              {...register("patientAge")}
              type="number"
              placeholder="e.g. 75"
              className={inputCls}
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

        <Field label="Chief Complaint / Reason for Transport">
          <input
            {...register("chiefComplaint")}
            type="text"
            placeholder="e.g. failure to thrive, frequent falls"
            className={inputCls}
          />
        </Field>

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
          <textarea
            {...register("medicalHistory")}
            rows={2}
            placeholder="e.g. atrial fibrillation, hypertension, COPD"
            className={inputCls}
          />
        </Field>
      </Card>

      {/* EMS Assessment */}
      <Card title="EMS Assessment">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Airway">
            <select {...register("airway")} className={inputCls}>
              <option value="Patent">Patent</option>
              <option value="Compromised">Compromised</option>
              <option value="Obstructed">Obstructed</option>
            </select>
          </Field>
          <Field label="Breathing">
            <select {...register("breathing")} className={inputCls}>
              <option value="Unlabored">Unlabored</option>
              <option value="Labored">Labored</option>
              <option value="Shallow">Shallow</option>
              <option value="Absent">Absent</option>
            </select>
          </Field>
          <Field label="Circulation">
            <select {...register("circulation")} className={inputCls}>
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
            <select {...register("transferType")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Stand & Pivot 2x Assist">Stand & Pivot 2x Assist</option>
              <option value="Stand & Pivot 1x Assist">Stand & Pivot 1x Assist</option>
              <option value="Ambulation">Ambulation</option>
              <option value="Sheet Draw Method">Sheet Draw Method</option>
            </select>
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
            <option value="__other__">Other (enter manually)</option>
          </select>
        </Field>

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
          <Field label="Hospital Name">
            <select {...register("destinationHospitalName")} className={inputCls}>
              <option value="">Select hospital...</option>
              {HOSPITALS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {destination === "Hospital" && destinationHospitalName === "__other__" && (
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
      </div>
    </form>
  );
}
