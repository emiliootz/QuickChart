export type AIModel = "claude-sonnet-4-6" | "claude-haiku-4-5-20251001";

export interface StructuredFormData {
  ambulanceNumber: string;
  transportType: string;
  sceneLocation: string;
  sceneLocationCustom: string;
  sceneHospitalName: string;
  sceneHospitalCustom: string;
  sceneFloorRoom: string;
  destination: string;
  destinationCustom: string;
  destinationHospitalName: string;
  destinationHospitalCustom: string;
  destinationRoom: string;
  reportReceivedFrom: string;
  patientAge: string;
  patientGender: string;
  chiefComplaint: string;
  mentalStatus: string;
  medicalHistory: string;
  airway: string;
  breathing: string;
  circulation: string;
  skin: string;
  skinCustom: string;
  patientComplaints: string;
  mobilityLevel: string;
  transferType: string;
  transportPosition: string;
  transportPositionCustom: string;
  additionalInfo: string;
}

export interface GenerateRequest {
  model: AIModel;
  structuredData: StructuredFormData;
}
