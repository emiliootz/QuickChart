"use client";

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/forms/formHelpers";
import { HOSPITAL_SYSTEMS, VET_HOSPITALS, getCampusOptions } from "@/lib/hospitals";

interface Props {
  register: UseFormRegister<StructuredFormData>;
  sceneLocation: string;
  sceneHospitalSystem: string;
  sceneHospitalName: string;
}

export default function Scene({
  register,
  sceneLocation,
  sceneHospitalSystem,
  sceneHospitalName,
}: Props) {
  return (
    <Card title="Scene">
      <Field label="Scene Location">
        <select {...register("sceneLocation")} className={inputCls}>
          <option value="">Select...</option>
          <option value="Residence">Residence</option>
          <option value="Hospital">Hospital</option>
          <option value="Veterinary Hospital">Veterinary Hospital</option>
          <option value="__other__">Other (enter manually)</option>
        </select>
      </Field>

      {sceneLocation === "Veterinary Hospital" && (
        <Field label="Veterinary Hospital">
          <select {...register("sceneHospitalName")} className={inputCls}>
            <option value="">Select hospital...</option>
            {VET_HOSPITALS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </Field>
      )}

      {sceneLocation === "__other__" && (
        <Field label="Scene Location (specify)">
          <input
            {...register("sceneLocationCustom")}
            type="text"
            placeholder="e.g. Assisted Living Facility..."
            className={inputCls}
          />
        </Field>
      )}

      {sceneLocation === "Hospital" && (
        <Field label="Hospital Network">
          <select {...register("sceneHospitalSystem")} className={inputCls}>
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

      {sceneLocation === "Hospital" && HOSPITAL_SYSTEMS[sceneHospitalSystem] && (
        <Field label="Hospital">
          <select {...register("sceneHospitalName")} className={inputCls}>
            <option value="">Select hospital...</option>
            {HOSPITAL_SYSTEMS[sceneHospitalSystem].map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </Field>
      )}

      {sceneLocation === "Hospital" && getCampusOptions(sceneHospitalSystem, sceneHospitalName).length > 0 && (
        <Field label="Campus / Location">
          <select {...register("sceneHospitalCampus")} className={inputCls}>
            <option value="">Select...</option>
            {getCampusOptions(sceneHospitalSystem, sceneHospitalName).map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      )}

      {sceneLocation === "Hospital" && sceneHospitalSystem === "__other__" && (
        <Field label="Hospital Name (specify)">
          <input
            {...register("sceneHospitalCustom")}
            type="text"
            placeholder="Enter hospital name and location"
            className={inputCls}
          />
        </Field>
      )}

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
          <option value="LPN">LPN</option>
          <option value="MD/DO">MD/DO</option>
          <option value="Patient">Patient</option>
          <option value="Family/Caregiver">Family/Caregiver</option>
          <option value="Nursing Staff">Nursing Staff</option>
          <option value="No Report Available">No Report Available</option>
        </select>
      </Field>
    </Card>
  );
}
