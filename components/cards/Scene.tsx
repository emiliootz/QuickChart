"use client";

// Scene — captures where the crew picked up the patient.
//
// The location + hospital picker is handled by LocationPicker (components/ui/LocationPicker.tsx).
// This card adds the fields unique to the scene: floor/room and who gave the handoff report.
//
// sceneLocation and sceneHospitalName are watched in use-form-watchers.ts and
// passed down as props so LocationPicker can drive its conditional rendering
// without any internal useWatch calls.

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";
import LocationPicker from "@/components/ui/LocationPicker";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;
  sceneLocation: string;       // drives which sub-fields appear in LocationPicker
  sceneHospitalName: string;   // current selected hospital value
}

export default function Scene({
  register,
  setValue,
  sceneLocation,
  sceneHospitalName,
}: Props) {
  return (
    <Card title="Scene">
      <LocationPicker
        register={register}
        setValue={setValue}
        variant="scene"
        location={sceneLocation}
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
