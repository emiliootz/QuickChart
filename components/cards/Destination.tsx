"use client";

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/forms/formHelpers";
import { HOSPITAL_SYSTEMS, VET_HOSPITALS, getCampusOptions } from "@/lib/hospitals";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  destination: string;
  destinationHospitalSystem: string;
  destinationHospitalName: string;
}

export default function Destination({
  register,
  destination,
  destinationHospitalSystem,
  destinationHospitalName,
}: Props) {
  return (
    <Card title="Destination">
      <Field label="Destination">
        <select {...register("destination")} className={inputCls}>
          <option value="">Select...</option>
          <option value="Residence">Residence</option>
          <option value="Hospital">Hospital</option>
          <option value="Veterinary Hospital">Veterinary Hospital</option>
          <option value="__other__">Other (enter manually)</option>
        </select>
      </Field>

      {destination === "Veterinary Hospital" && (
        <Field label="Veterinary Hospital">
          <select {...register("destinationHospitalName")} className={inputCls}>
            <option value="">Select hospital...</option>
            {VET_HOSPITALS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </Field>
      )}

      {destination === "__other__" && (
        <Field label="Destination (specify)">
          <input
            {...register("destinationCustom")}
            type="text"
            placeholder="e.g. Spaulding Nursing & Therapy Center in Allston, MA"
            className={inputCls}
          />
        </Field>
      )}

      {destination === "Hospital" && (
        <Field label="Hospital Network">
          <select {...register("destinationHospitalSystem")} className={inputCls}>
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

      {destination === "Hospital" && HOSPITAL_SYSTEMS[destinationHospitalSystem] && (
        <Field label="Hospital">
          <select {...register("destinationHospitalName")} className={inputCls}>
            <option value="">Select hospital...</option>
            {HOSPITAL_SYSTEMS[destinationHospitalSystem].map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </Field>
      )}

      {destination === "Hospital" && getCampusOptions(destinationHospitalSystem, destinationHospitalName).length > 0 && (
        <Field label="Campus / Location">
          <select {...register("destinationHospitalCampus")} className={inputCls}>
            <option value="">Select...</option>
            {getCampusOptions(destinationHospitalSystem, destinationHospitalName).map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      )}

      {destination === "Hospital" && destinationHospitalSystem === "__other__" && (
        <Field label="Hospital Name (specify)">
          <input
            {...register("destinationHospitalCustom")}
            type="text"
            placeholder="Enter hospital name and location"
            className={inputCls}
          />
        </Field>
      )}

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
