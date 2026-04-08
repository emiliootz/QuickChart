"use client";

import { Control, useWatch } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Status } from "@/hooks/useNarrativeGeneration";

export function useFormWatchers(control: Control<StructuredFormData>, status: Status) {
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

  return {
    sceneLocation,
    sceneHospitalSystem,
    sceneHospitalName,
    destination,
    destinationHospitalSystem,
    destinationHospitalName,
    transportPosition,
    transportReason,
    bloodPressure,
    heartRate,
    spo2,
    mobilityLevel,
    isEmergent,
    isGenerating,
  };
}
