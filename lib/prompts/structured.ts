import { StructuredFormData } from "@/lib/types";

export function buildStructuredPrompt(data: StructuredFormData): string {
  // Resolve scene
  let resolvedScene = "";
  if (data.sceneLocation === "Hospital") {
    const hospitalName =
      data.sceneHospitalName === "__other__"
        ? data.sceneHospitalCustom
        : data.sceneHospitalName;
    resolvedScene = hospitalName;
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
    const hospitalName =
      data.destinationHospitalName === "__other__"
        ? data.destinationHospitalCustom
        : data.destinationHospitalName;
    resolvedDestination = hospitalName;
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

  const lines = [
    `Write the PCR narrative using the following call data:`,
    ``,
    `Unit: ${data.ambulanceNumber}`,
    `Transport Type: ${data.transportType}`,
    `Scene: ${resolvedScene}`,
    `Destination: ${resolvedDestination}`,
    `Report Received From: ${data.reportReceivedFrom}`,
    `Patient: ${data.patientAge}-year-old ${data.patientGender}`,
    `Chief Complaint / Reason for Transport: ${data.chiefComplaint}`,
    `Mental Status: ${data.mentalStatus}`,
    `Medical History: ${data.medicalHistory}`,
    `Mobility Level: ${data.mobilityLevel}`,
    `Transfer Method: ${data.transferType}`,
    `Transport Position: ${resolvedPosition}`,
  ];

  if (data.additionalInfo && data.additionalInfo.trim()) {
    lines.push(`Additional Details: ${data.additionalInfo.trim()}`);
  }

  lines.push(``);
  lines.push(`Write the full narrative now.`);

  return lines.join("\n");
}
