"use client";

// LocationPicker — reusable location + hospital picker used by both Scene and Destination.
//
// Renders a "location type" dropdown and conditionally shows:
//   Hospital          → HospitalPicker autocomplete (searches all networks at once)
//   Veterinary Hospital → vet-specific hospital list
//   Other             → free-text field
//
// Field names differ between scene and destination, so the component uses a
// `variant` prop to look up the correct StructuredFormData keys from FIELDS.
// setValue is required so HospitalPicker can write the resolved hospital name
// directly into the hospitalName field.

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Path } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Field, inputCls } from "@/components/ui/FormPrimitives";
import { VET_HOSPITALS } from "@/lib/hospitals";
import HospitalPicker from "@/components/ui/HospitalPicker";

// ─── Field name map ────────────────────────────────────────────────────────────

const FIELDS = {
  scene: {
    location:             "sceneLocation"        as Path<StructuredFormData>,
    locationCustom:       "sceneLocationCustom"  as Path<StructuredFormData>,
    hospitalName:         "sceneHospitalName"    as Path<StructuredFormData>,
    hospitalSystem:       "sceneHospitalSystem"  as Path<StructuredFormData>,
    hospitalCampus:       "sceneHospitalCampus"  as Path<StructuredFormData>,
    hospitalCustom:       "sceneHospitalCustom"  as Path<StructuredFormData>,
    locationLabel:        "Scene Location",
    locationCustomPlaceholder: "e.g. Assisted Living Facility...",
  },
  destination: {
    location:             "destination"               as Path<StructuredFormData>,
    locationCustom:       "destinationCustom"          as Path<StructuredFormData>,
    hospitalName:         "destinationHospitalName"    as Path<StructuredFormData>,
    hospitalSystem:       "destinationHospitalSystem"  as Path<StructuredFormData>,
    hospitalCampus:       "destinationHospitalCampus"  as Path<StructuredFormData>,
    hospitalCustom:       "destinationHospitalCustom"  as Path<StructuredFormData>,
    locationLabel:        "Destination",
    locationCustomPlaceholder: "e.g. Spaulding Nursing & Therapy Center in Allston, MA",
  },
} as const;

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  register: UseFormRegister<StructuredFormData>;
  setValue: UseFormSetValue<StructuredFormData>;
  variant: "scene" | "destination";
  // Watched values — passed from the parent card (via use-form-watchers)
  location: string;       // drives which sub-fields appear
  hospitalName: string;   // current selected hospital (drives HospitalPicker value)
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function LocationPicker({
  register,
  setValue,
  variant,
  location,
  hospitalName,
}: Props) {
  const f = FIELDS[variant];

  function handleHospitalChange(resolved: string) {
    setValue(f.hospitalName, resolved);
    setValue(f.hospitalSystem, "");
    setValue(f.hospitalCampus, "");
    setValue(f.hospitalCustom, "");
  }

  return (
    <>
      {/* Location type */}
      <Field label={f.locationLabel}>
        <select {...register(f.location)} className={inputCls}>
          <option value="">Select...</option>
          <option value="Residence">Residence</option>
          <option value="Hospital">Hospital</option>
          <option value="Veterinary Hospital">Veterinary Hospital</option>
          <option value="__other__">Other (enter manually)</option>
        </select>
      </Field>

      {/* Hospital search — replaces the old Network → Hospital → Campus cascade */}
      {location === "Hospital" && (
        <Field label="Hospital">
          <HospitalPicker value={hospitalName} onChange={handleHospitalChange} />
        </Field>
      )}

      {/* Vet hospital list */}
      {location === "Veterinary Hospital" && (
        <Field label="Veterinary Hospital">
          <select {...register(f.hospitalName)} className={inputCls}>
            <option value="">Select hospital...</option>
            {VET_HOSPITALS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </Field>
      )}

      {/* Free-text for unlisted location types */}
      {location === "__other__" && (
        <Field label={`${f.locationLabel} (specify)`}>
          <input
            {...register(f.locationCustom)}
            type="text"
            placeholder={f.locationCustomPlaceholder}
            className={inputCls}
          />
        </Field>
      )}
    </>
  );
}
