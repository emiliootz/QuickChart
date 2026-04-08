"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { useNarrativeGeneration } from "@/hooks/useNarrativeGeneration";
import NarrativeOutput from "@/components/narrative/NarrativeOutput";
import UnitTransport from "@/components/cards/UnitTransport";
import Scene from "@/components/cards/Scene";
import Patient from "@/components/cards/Patient";
import EMSAssessment from "@/components/cards/EMSAssessment";
import MobilityTransfer from "@/components/cards/MobilityTransfer";
import Destination from "@/components/cards/Destination";
import AdditionalInfo from "@/components/cards/AdditionalInfo";
import { cn } from "@/lib/cn";

// ─── Component ────────────────────────────────────────────────────────────────

export default function StructuredForm() {
  const model = "claude-sonnet-4-6" as const;
  const { status, narrative, error, generate, fail, reset } = useNarrativeGeneration();

  const BLANK_FORM_MESSAGE =
    "Congratulations, you just wasted both our time by sending a completely blank form.\n" +
    "Did you think I was a magician who could pull a PCR narrative out of nothing?\n" +
    "Next time try actually doing your job and filling out the fields before hitting submit.";

  const { register, handleSubmit, control, setValue, reset: resetForm, getValues } = useForm<StructuredFormData>({
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

  const sceneLocation = useWatch({ control, name: "sceneLocation" });
  const sceneHospitalSystem = useWatch({ control, name: "sceneHospitalSystem" });
  const sceneHospitalName = useWatch({ control, name: "sceneHospitalName" });
  const destination = useWatch({ control, name: "destination" });
  const destinationHospitalSystem = useWatch({ control, name: "destinationHospitalSystem" });
  const destinationHospitalName = useWatch({ control, name: "destinationHospitalName" });
  const transportPosition = useWatch({ control, name: "transportPosition" });
  const transportReason = useWatch({ control, name: "transportReason" });
  const bloodPressure = useWatch({ control, name: "bloodPressure" });
  const heartRate = useWatch({ control, name: "heartRate" });
  const spo2 = useWatch({ control, name: "spo2" });
  const mobilityLevel = useWatch({ control, name: "mobilityLevel" });
  const transportType = useWatch({ control, name: "transportType" });
  const isEmergent = transportType === "Emergent Priority 1" || transportType === "Emergent Priority 2" || transportType === "Emergent Priority 3";
  const isGenerating = status === "working..." || status === "relax im doing it";

  useEffect(() => {
    if (mobilityLevel === "Non-Ambulatory") setValue("transferType", "Sheet Draw Method");
    else if (mobilityLevel === "Ambulatory") setValue("transferType", "Ambulation");
    else if (mobilityLevel === "Stand and Pivot") setValue("transferType", "");
  }, [mobilityLevel, setValue]);

  const patientDOB = useWatch({ control, name: "patientDOB" });
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
    const isBlank = !data.transportType && !data.sceneLocation && !data.destination &&
      !data.chiefComplaint && !data.patientGender;
    if (isBlank) {
      fail(BLANK_FORM_MESSAGE);
      setTimeout(() => {
        document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    await generate({ model, structuredData: data });
    setTimeout(() => {
      document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <UnitTransport register={register} />

      <Scene
        register={register}
        sceneLocation={sceneLocation}
        sceneHospitalSystem={sceneHospitalSystem}
        sceneHospitalName={sceneHospitalName}
      />

      <Patient
        register={register}
        control={control}
        setValue={setValue}
        isEmergent={isEmergent}
        transportReason={transportReason}
      />

      <EMSAssessment
        register={register}
        control={control}
        setValue={setValue}
        isEmergent={isEmergent}
        bloodPressure={bloodPressure}
        heartRate={heartRate}
        spo2={spo2}
      />

      <MobilityTransfer
        register={register}
        mobilityLevel={mobilityLevel}
        transportPosition={transportPosition}
      />

      <Destination
        register={register}
        destination={destination}
        destinationHospitalSystem={destinationHospitalSystem}
        destinationHospitalName={destinationHospitalName}
      />

      <AdditionalInfo register={register} />

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

        {status === "ok im done" && (
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
