"use client";

// LocationPicker — reusable location + hospital cascade used by both Scene and Destination.
//
// Renders a "location type" dropdown and conditionally shows:
//   Hospital  → Network → Hospital → Campus (or free-text if system is "__other__")
//   Veterinary Hospital → vet-specific hospital list
//   Other     → free-text field
//
// Field names differ between scene and destination, so the component uses a
// `variant` prop to look up the correct StructuredFormData keys from FIELDS.

import { UseFormRegister } from "react-hook-form";
import { Path } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Field, inputCls } from "@/components/ui/FormPrimitives";
import { HOSPITAL_SYSTEMS, VET_HOSPITALS, getCampusOptions } from "@/lib/hospitals";

// ─── Field name map ────────────────────────────────────────────────────────────

const FIELDS = {
  scene: {
    location:             "sceneLocation"        as Path<StructuredFormData>,
    locationCustom:       "sceneLocationCustom"  as Path<StructuredFormData>,
    hospitalSystem:       "sceneHospitalSystem"  as Path<StructuredFormData>,
    hospitalName:         "sceneHospitalName"    as Path<StructuredFormData>,
    hospitalCampus:       "sceneHospitalCampus"  as Path<StructuredFormData>,
    hospitalCustom:       "sceneHospitalCustom"  as Path<StructuredFormData>,
    locationLabel:        "Scene Location",
    locationCustomPlaceholder: "e.g. Assisted Living Facility...",
  },
  destination: {
    location:             "destination"               as Path<StructuredFormData>,
    locationCustom:       "destinationCustom"          as Path<StructuredFormData>,
    hospitalSystem:       "destinationHospitalSystem"  as Path<StructuredFormData>,
    hospitalName:         "destinationHospitalName"    as Path<StructuredFormData>,
    hospitalCampus:       "destinationHospitalCampus"  as Path<StructuredFormData>,
    hospitalCustom:       "destinationHospitalCustom"  as Path<StructuredFormData>,
    locationLabel:        "Destination",
    locationCustomPlaceholder: "e.g. Spaulding Nursing & Therapy Center in Allston, MA",
  },
} as const;

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  register: UseFormRegister<StructuredFormData>;
  variant: "scene" | "destination";
  // Watched values — passed from the parent card (via use-form-watchers)
  location: string;        // drives which sub-fields appear
  hospitalSystem: string;  // drives which hospitals appear
  hospitalName: string;    // drives whether a campus sub-dropdown appears
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function LocationPicker({
  register,
  variant,
  location,
  hospitalSystem,
  hospitalName,
}: Props) {
  const f = FIELDS[variant];

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

      {/* Hospital network */}
      {location === "Hospital" && (
        <Field label="Hospital Network">
          <select {...register(f.hospitalSystem)} className={inputCls}>
            <option value="">Select network...</option>
            <option value="Beth Israel Lahey Health">Beth Israel Lahey Health</option>
            <option value="Boston Children's">Boston Children&apos;s</option>
            <option value="Boston Medical Center Health System">Boston Medical Center Health System</option>
            <option value="Cambridge Health Alliance">Cambridge Health Alliance</option>
            <option value="CareOne">CareOne</option>
            <option value="Dana-Farber Cancer Institute">Dana-Farber Cancer Institute</option>
            <option value="Encompass Health">Encompass Health</option>
            <option value="Mass General Brigham">Mass General Brigham</option>
            <option value="Massachusetts Department of Public Health (DPH)">Massachusetts Department of Public Health (DPH)</option>
            <option value="Tufts Medicine">Tufts Medicine</option>
            <option value="Universal Health Services (Arbour Health)">Universal Health Services (Arbour Health)</option>
            <option value="__other__">Other — enter manually</option>
          </select>
        </Field>
      )}

      {/* Hospital list for known systems */}
      {location === "Hospital" && HOSPITAL_SYSTEMS[hospitalSystem] && (
        <Field label="Hospital">
          <select {...register(f.hospitalName)} className={inputCls}>
            <option value="">Select hospital...</option>
            {HOSPITAL_SYSTEMS[hospitalSystem].map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </Field>
      )}

      {/* Campus sub-dropdown when the selected hospital has multiple campuses */}
      {location === "Hospital" && getCampusOptions(hospitalSystem, hospitalName).length > 0 && (
        <Field label="Campus / Location">
          <select {...register(f.hospitalCampus)} className={inputCls}>
            <option value="">Select...</option>
            {getCampusOptions(hospitalSystem, hospitalName).map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      )}

      {/* Free-text for unlisted hospital systems */}
      {location === "Hospital" && hospitalSystem === "__other__" && (
        <Field label="Hospital Name (specify)">
          <input
            {...register(f.hospitalCustom)}
            type="text"
            placeholder="Enter hospital name and location"
            className={inputCls}
          />
        </Field>
      )}
    </>
  );
}
