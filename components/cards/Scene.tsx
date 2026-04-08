"use client";

// Scene — captures where the crew picked up the patient.
//
// The location + hospital cascade is handled by LocationPicker (components/ui/LocationPicker.tsx).
// This card adds the fields unique to the scene: floor/room and who gave the handoff report.
//
// sceneLocation, sceneHospitalSystem, and sceneHospitalName are watched in
// use-form-watchers.ts and passed down as props so LocationPicker can drive its
// conditional rendering without any internal useWatch calls.

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";
import LocationPicker from "@/components/ui/LocationPicker";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  // Watched values passed from PCRForm via use-form-watchers.ts
  sceneLocation: string;          // drives which sub-fields appear in LocationPicker
  sceneHospitalSystem: string;    // drives which hospitals appear
  sceneHospitalName: string;      // drives whether a campus sub-dropdown appears
}

export default function Scene({
  register,
  sceneLocation,
  sceneHospitalSystem,
  sceneHospitalName,
}: Props) {
  return (
    <Card title="Scene">
      <LocationPicker
        register={register}
        variant="scene"
        location={sceneLocation}
        hospitalSystem={sceneHospitalSystem}
        hospitalName={sceneHospitalName}
      />

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
          <option value="MD/DO">MD/DO</option>
          <option value="Patient">Patient</option>
          <option value="Family/Caregiver">Family/Caregiver</option>
          <option value="No Report Available">No Report Available</option>
        </select>
      </Field>
    </Card>
  );
}
