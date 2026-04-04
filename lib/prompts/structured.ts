import { StructuredFormData } from "@/lib/types";

export function buildStructuredPrompt(data: StructuredFormData): string {
  // Resolve hospital name (shared logic for scene and destination)
  function resolveHospital(
    system: string,
    name: string,
    campus: string,
    custom: string
  ): string {
    if (system === "Beth Israel Lahey Health") {
      if (name === "__bidmc__") {
        return `Beth Israel Deaconess Medical Center ${campus} in Boston, MA`;
      }
      return name;
    }
    if (system === "Mass General Brigham") {
      // __mclean__ and __spaulding__ use campus value as the full resolved name
      if (name === "__mclean__" || name === "__spaulding__") {
        return campus;
      }
      return name;
    }
    // For all other networks (BMC, CHA, UHS, DPH, etc.), the hospital name
    // is stored directly in `name`; fall back to `custom` only for manual entry.
    return name || custom;
  }

  // Resolve scene
  let resolvedScene = "";
  if (data.sceneLocation === "Hospital") {
    resolvedScene = resolveHospital(
      data.sceneHospitalSystem,
      data.sceneHospitalName,
      data.sceneHospitalCampus,
      data.sceneHospitalCustom
    );
    if (data.sceneFloorRoom) resolvedScene += `, ${data.sceneFloorRoom}`;
  } else if (data.sceneLocation === "Veterinary Hospital") {
    resolvedScene = data.sceneHospitalName || "Veterinary Hospital";
    if (data.sceneFloorRoom) resolvedScene += `, ${data.sceneFloorRoom}`;
  } else if (data.sceneLocation === "__other__") {
    resolvedScene = data.sceneLocationCustom;
    if (data.sceneFloorRoom) resolvedScene += `, ${data.sceneFloorRoom}`;
  } else {
    resolvedScene = data.sceneLocation;
    if (data.sceneFloorRoom) resolvedScene += `, ${data.sceneFloorRoom}`;
  }

  // Resolve destination
  let resolvedDestination = "";
  if (data.destination === "Hospital") {
    resolvedDestination = resolveHospital(
      data.destinationHospitalSystem,
      data.destinationHospitalName,
      data.destinationHospitalCampus,
      data.destinationHospitalCustom
    );
    if (data.destinationRoom) resolvedDestination += `, ${data.destinationRoom}`;
  } else if (data.destination === "Veterinary Hospital") {
    resolvedDestination = data.destinationHospitalName || "Veterinary Hospital";
    if (data.destinationRoom) resolvedDestination += `, ${data.destinationRoom}`;
  } else if (data.destination === "__other__") {
    resolvedDestination = data.destinationCustom;
    if (data.destinationRoom) resolvedDestination += `, ${data.destinationRoom}`;
  } else {
    resolvedDestination = data.destination;
    if (data.destinationRoom) resolvedDestination += `, ${data.destinationRoom}`;
  }

  // Resolve transport position
  const resolvedPosition =
    data.transportPosition === "__other__"
      ? data.transportPositionCustom
      : data.transportPosition;

  const resolvedSkin =
    data.skin === "__other__" ? data.skinCustom : data.skin;

  function resolveVital(value: string, note: string, abnormalLabel: string): string {
    if (!value) return "";
    if (value === "Normal (at Baseline)") return "within normal limits / at patient's baseline";
    return note ? `${abnormalLabel} — ${note}` : abnormalLabel;
  }

  const resolvedBP = resolveVital(data.bloodPressure, data.bloodPressureNote, data.bloodPressure);
  const resolvedHR = resolveVital(data.heartRate, data.heartRateNote, data.heartRate);
  const resolvedSPO2 = resolveVital(data.spo2, data.spo2Note, data.spo2);

  // Resolve transport reason with conditional details
  let resolvedTransportReason = "";
  if (data.transportReason === "Other") {
    resolvedTransportReason = data.transportReasonCustom || "Other";
  } else if (data.transportReason === "On oxygen") {
    resolvedTransportReason = `On oxygen via ${data.oxygenDelivery} at ${data.oxygenLiters} L/min`;
  } else if (data.transportReason === "Has a cast") {
    resolvedTransportReason = `Has a cast (${data.castType})`;
  } else if (data.transportReason === "Is sectioned") {
    resolvedTransportReason = `Is sectioned (${data.sectionType})`;
  } else {
    resolvedTransportReason = data.transportReason;
  }

  const lines = [
    `Write the PCR narrative using the following call data:`,
    ``,
    `Unit: ${data.ambulanceNumber}`,
    `Transport Type: ${data.transportType}`,
    `Scene: ${resolvedScene}`,
    `Destination: ${resolvedDestination}`,
    `Report Received From: ${data.reportReceivedFrom}`,
    `Patient: ${data.patientAge}-year-old ${data.patientGender}`,
    `Chief Complaint: ${data.chiefComplaint}`,
    `Reason for Transport (Medical Necessity): ${resolvedTransportReason}`,
    `Mental Status: ${data.mentalStatus}`,
    `Medical History: ${data.medicalHistory}`,
    `EMS Assessment — Airway: ${data.airway}`,
    `EMS Assessment — Breathing: ${data.breathing}`,
    `EMS Assessment — Circulation: ${data.circulation}`,
    `EMS Assessment — Skin: ${resolvedSkin}`,
    `EMS Assessment — Blood Pressure: ${resolvedBP}`,
    `EMS Assessment — Heart Rate: ${resolvedHR}`,
    `EMS Assessment — SPO2: ${resolvedSPO2}`,
    `Mobility Level: ${data.mobilityLevel}`,
    `Transfer Method: ${data.transferType}`,
    `Transport Position: ${resolvedPosition}`,
  ];

  if (data.patientComplaints && data.patientComplaints.trim()) {
    lines.push(`Patient Complaints: ${data.patientComplaints.trim()}`);
  }

  if (data.additionalInfo && data.additionalInfo.trim()) {
    lines.push(`Additional Details: ${data.additionalInfo.trim()}`);
  }

  lines.push(``);
  lines.push(`Write the full narrative now.`);

  return lines.join("\n");
}
