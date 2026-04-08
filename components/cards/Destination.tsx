"use client";

// Destination — mirrors Scene but for the drop-off location.
//
// The location + hospital cascade is handled by LocationPicker (components/ui/LocationPicker.tsx).
// This card adds the only field unique to destination: the room or area within the facility.
//
// destination, destinationHospitalSystem, and destinationHospitalName are watched in
// use-form-watchers.ts and passed down as props.

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";
import LocationPicker from "@/components/ui/LocationPicker";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  // Watched values passed from PCRForm via use-form-watchers.ts
  destination: string;                  // drives which sub-fields appear in LocationPicker
  destinationHospitalSystem: string;    // drives which hospitals appear
  destinationHospitalName: string;      // drives whether a campus sub-dropdown appears
}

export default function Destination({
  register,
  destination,
  destinationHospitalSystem,
  destinationHospitalName,
}: Props) {
  return (
    <Card title="Destination">
      <LocationPicker
        register={register}
        variant="destination"
        location={destination}
        hospitalSystem={destinationHospitalSystem}
        hospitalName={destinationHospitalName}
      />

      <Field label="Destination Room / Area">
        <input
          {...register("destinationRoom")}
          type="text"
          placeholder="e.g. Room 215B, ED Bay 4"
          className={inputCls}
        />
      </Field>
    </Card>
  );
}
