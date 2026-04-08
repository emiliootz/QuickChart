"use client";

import { useForm } from "react-hook-form";
import { useFormWatchers } from "@/hooks/use-form-watchers";
import { StructuredFormData } from "@/lib/types";
import { DEFAULT_FORM_VALUES } from "@/lib/defaults";
import { useNarrativeGeneration } from "@/hooks/use-narrative-generation";
import { useSubmit } from "@/hooks/use-submit";
import Generate from "@/components/cards/Generate";
import UnitTransport from "@/components/cards/UnitTransport";
import Scene from "@/components/cards/Scene";
import Patient from "@/components/cards/Patient";
import EMSAssessment from "@/components/cards/EMSAssessment";
import MobilityTransfer from "@/components/cards/MobilityTransfer";
import Destination from "@/components/cards/Destination";
import AdditionalInfo from "@/components/cards/AdditionalInfo";

// ─── Component ────────────────────────────────────────────────────────────────

export default function PCRForm() {
  const { status, narrative, error, generate, fail, reset } = useNarrativeGeneration();
  const { onSubmit, onReturnTrip } = useSubmit({ generate, fail });

  const { register, handleSubmit, control, setValue, reset: resetForm, getValues } = useForm<StructuredFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const {
    sceneLocation, sceneHospitalSystem, sceneHospitalName,
    destination, destinationHospitalSystem, destinationHospitalName,
    transportPosition, transportReason,
    bloodPressure, heartRate, spo2,
    mobilityLevel, isEmergent, isGenerating,
  } = useFormWatchers(control, status);

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
        setValue={setValue}
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

      <Generate
        isGenerating={isGenerating}
        status={status}
        narrative={narrative}
        error={error}
        onReset={reset}
        onResetForm={resetForm}
        onReturnTrip={() => onReturnTrip(getValues())}
      />
    </form>
  );
}
