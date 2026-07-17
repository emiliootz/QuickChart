"use client";

// Destination — mirrors Scene but for the drop-off location.
//
// The location + hospital picker is handled by LocationPicker (components/ui/LocationPicker.tsx).
// This card adds the only field unique to destination: the room or area within the facility.
//
// destination and destinationHospitalName are watched in use-form-watchers.ts
// and passed down as props.

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";
import LocationPicker from "@/components/ui/LocationPicker";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;
  destination: string;               // drives which sub-fields appear in LocationPicker
  destinationHospitalName: string;   // current selected hospital value
}

export default function Destination({
  register,
  setValue,
  destination,
  destinationHospitalName,
}: Props) {
  return (
    <Card title="Destination">
      <LocationPicker
        register={register}
        setValue={setValue}
        variant="destination"
        location={destination}
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
