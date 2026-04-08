"use client";

import { StructuredFormData } from "@/lib/types";
import { BLANK_FORM_MESSAGE } from "@/components/cards/Generate";

const MODEL = "claude-sonnet-4-6" as const;

interface Params {
  generate: (req: { model: typeof MODEL; structuredData: StructuredFormData }) => Promise<void>;
  fail: (message: string) => void;
}

export function useSubmit({ generate, fail }: Params) {
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
    await generate({ model: MODEL, structuredData: data });
    setTimeout(() => {
      document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  function onReturnTrip(d: StructuredFormData) {
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
    generate({ model: MODEL, structuredData: returnData });
    setTimeout(() => {
      document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  return { onSubmit, onReturnTrip, model: MODEL };
}
