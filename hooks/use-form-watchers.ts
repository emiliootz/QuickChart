"use client";

// useFormWatchers — subscribes to the specific form fields that drive conditional
// rendering across multiple cards, and derives two boolean flags from them.
//
// All watchers use useWatch (not watch()) for React Compiler compatibility —
// useWatch can be memoized; watch() cannot.
//
// Derived flags:
//   isEmergent   — true when transportType is any Emergent Priority level;
//                  unlocks DOB/address in Patient and pain/height/weight in EMSAssessment
//   isGenerating — true while the AI stream is in progress; disables the submit button

import { Control, useWatch } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Status } from "@/hooks/use-narrative-generation";

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
