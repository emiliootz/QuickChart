export type AIModel = "claude-sonnet-4-6" | "claude-haiku-4-5-20251001";

export interface StructuredFormData {
  ambulanceNumber: string;
  transportType: string;
  sceneLocation: string;
  sceneLocationCustom: string;
  sceneHospitalSystem: string;
  sceneHospitalName: string;
  sceneHospitalCampus: string;
  sceneHospitalCustom: string;
  sceneFloorRoom: string;
  destination: string;
  destinationCustom: string;
  destinationHospitalSystem: string;
  destinationHospitalName: string;
  destinationHospitalCampus: string;
  destinationHospitalCustom: string;
  destinationRoom: string;
  reportReceivedFrom: string;
  patientAge: string;
  patientDOB: string;
  patientAddress: string;
  patientGender: string;
  chiefComplaint: string;
  transportReason: string;
  transportReasonCustom: string;
  oxygenDelivery: string;
  oxygenLiters: string;
  castType: string;
  sectionType: string;
  mentalStatus: string;
  medicalHistory: string;
  airway: string;
  breathing: string;
  circulation: string;
  skin: string;
  skinCustom: string;
  bloodPressure: string;
  bloodPressureNote: string;
  heartRate: string;
  heartRateNote: string;
  spo2: string;
  spo2Note: string;
  painScore: string;
  patientHeight: string;
  patientWeight: string;
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
