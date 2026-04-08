import { buildStructuredPrompt } from "@/lib/prompts/structured";
import { StructuredFormData } from "@/lib/types";

// Minimal base data shared across tests
const base: StructuredFormData = {
  ambulanceNumber: "A-1",
  transportType: "BLS",
  sceneLocation: "Home",
  sceneLocationCustom: "",
  sceneHospitalSystem: "",
  sceneHospitalName: "",
  sceneHospitalCampus: "",
  sceneHospitalCustom: "",
  sceneFloorRoom: "",
  destination: "Hospital",
  destinationCustom: "",
  destinationHospitalSystem: "Mass General Brigham",
  destinationHospitalName: "Massachusetts General Hospital in Boston, MA",
  destinationHospitalCampus: "",
  destinationHospitalCustom: "",
  destinationRoom: "ED",
  reportReceivedFrom: "Nursing Staff",
  patientAge: "75",
  patientDOB: "",
  patientAddress: "",
  patientGender: "male",
  chiefComplaint: "Hip pain",
  transportReason: "Non-ambulatory",
  transportReasonCustom: "",
  oxygenDelivery: "",
  oxygenLiters: "",
  castType: "",
  sectionType: "",
  mentalStatus: "Alert and oriented x4",
  medicalHistory: "Hip fracture, HTN",
  airway: "Patent",
  breathing: "Unlabored",
  circulation: "Adequate",
  skin: "Warm and dry",
  skinCustom: "",
  bloodPressure: "",
  bloodPressureNote: "",
  heartRate: "",
  heartRateNote: "",
  spo2: "",
  spo2Note: "",
  painScore: "",
  patientHeight: "",
  patientWeight: "",
  patientComplaints: "",
  mobilityLevel: "Non-ambulatory",
  transferType: "2-person assist",
  transportPosition: "Supine",
  transportPositionCustom: "",
  additionalInfo: "",
};

// ─── Hospital resolution ───────────────────────────────────────────────────────

describe("Scene hospital resolution", () => {
  test("BILH — BIDMC with campus", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Beth Israel Lahey Health",
      sceneHospitalName: "__bidmc__",
      sceneHospitalCampus: "East Campus",
      sceneFloorRoom: "Room 412",
    });
    expect(prompt).toContain(
      "Scene: Beth Israel Deaconess Medical Center East Campus in Boston, MA, Room 412"
    );
  });

  test("BILH — non-BIDMC hospital (no campus)", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Beth Israel Lahey Health",
      sceneHospitalName: "Winchester Hospital in Winchester, MA",
      sceneHospitalCampus: "",
    });
    expect(prompt).toContain("Scene: Winchester Hospital in Winchester, MA");
  });

  test("MGB — McLean campus resolves to campus value", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Mass General Brigham",
      sceneHospitalName: "__mclean__",
      sceneHospitalCampus: "McLean Hospital Belmont Campus in Belmont, MA",
    });
    expect(prompt).toContain(
      "Scene: McLean Hospital Belmont Campus in Belmont, MA"
    );
  });

  test("MGB — Spaulding campus resolves to campus value", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Mass General Brigham",
      sceneHospitalName: "__spaulding__",
      sceneHospitalCampus:
        "Spaulding Rehabilitation Hospital in Charlestown, MA",
    });
    expect(prompt).toContain(
      "Scene: Spaulding Rehabilitation Hospital in Charlestown, MA"
    );
  });

  test("MGB — standard hospital (no campus)", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Mass General Brigham",
      sceneHospitalName: "Newton-Wellesley Hospital in Newton, MA",
      sceneHospitalCampus: "",
    });
    expect(prompt).toContain("Scene: Newton-Wellesley Hospital in Newton, MA");
  });

  test("BMC Health System", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Boston Medical Center Health System",
      sceneHospitalName: "Boston Medical Center in Boston, MA",
      sceneHospitalCampus: "",
    });
    expect(prompt).toContain("Scene: Boston Medical Center in Boston, MA");
  });

  test("Cambridge Health Alliance", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Cambridge Health Alliance",
      sceneHospitalName: "CHA Everett Hospital in Everett, MA",
      sceneHospitalCampus: "",
    });
    expect(prompt).toContain("Scene: CHA Everett Hospital in Everett, MA");
  });

  test("UHS Arbour Health", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Universal Health Services (Arbour Health)",
      sceneHospitalName: "Arbour-HRI Hospital in Brookline, MA",
      sceneHospitalCampus: "",
    });
    expect(prompt).toContain("Scene: Arbour-HRI Hospital in Brookline, MA");
  });

  test("DPH network", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "Hospital",
      sceneHospitalSystem: "Massachusetts Department of Public Health (DPH)",
      sceneHospitalName: "Lemuel Shattuck Hospital in Jamaica Plain, MA",
      sceneHospitalCampus: "",
    });
    expect(prompt).toContain(
      "Scene: Lemuel Shattuck Hospital in Jamaica Plain, MA"
    );
  });

  test("Other scene location (custom)", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      sceneLocation: "__other__",
      sceneLocationCustom: "123 Main St, Boston MA",
      sceneFloorRoom: "Apt 2",
    });
    expect(prompt).toContain("Scene: 123 Main St, Boston MA, Apt 2");
  });
});

// ─── Transport reason resolution ──────────────────────────────────────────────

describe("Transport reason resolution", () => {
  test("On oxygen — includes delivery method and liters", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportReason: "On oxygen",
      oxygenDelivery: "Nasal Cannula",
      oxygenLiters: "2",
    });
    expect(prompt).toContain(
      "Reason for Transport (Medical Necessity): On oxygen via Nasal Cannula at 2 L/min"
    );
  });

  test("Has a cast — includes cast type", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportReason: "Has a cast",
      castType: "Long leg cast",
    });
    expect(prompt).toContain(
      "Reason for Transport (Medical Necessity): Has a cast (Long leg cast)"
    );
  });

  test("Is sectioned — includes section type", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportReason: "Is sectioned",
      sectionType: "Section 12",
    });
    expect(prompt).toContain(
      "Reason for Transport (Medical Necessity): Is sectioned (Section 12)"
    );
  });

  test("Other — uses custom text", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportReason: "Other",
      transportReasonCustom: "Requires continuous cardiac monitoring",
    });
    expect(prompt).toContain(
      "Reason for Transport (Medical Necessity): Requires continuous cardiac monitoring"
    );
  });

  test("Standard reason passes through unchanged", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportReason: "Non-ambulatory",
    });
    expect(prompt).toContain(
      "Reason for Transport (Medical Necessity): Non-ambulatory"
    );
  });
});

// ─── Transport position ───────────────────────────────────────────────────────

describe("Transport position resolution", () => {
  test("Custom position", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportPosition: "__other__",
      transportPositionCustom: "Semi-recumbent",
    });
    expect(prompt).toContain("Transport Position: Semi-recumbent");
  });

  test("Standard position", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      transportPosition: "Supine",
    });
    expect(prompt).toContain("Transport Position: Supine");
  });
});

// ─── Skin resolution ──────────────────────────────────────────────────────────

describe("Skin resolution", () => {
  test("Custom skin", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      skin: "__other__",
      skinCustom: "Diaphoretic",
    });
    expect(prompt).toContain("EMS Assessment — Skin: Diaphoretic");
  });

  test("Standard skin", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      skin: "Warm and dry",
    });
    expect(prompt).toContain("EMS Assessment — Skin: Warm and dry");
  });
});

// ─── Optional fields ──────────────────────────────────────────────────────────

describe("Optional fields", () => {
  test("Patient complaints included when provided", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      patientComplaints: "Pain 7/10 in right hip",
    });
    expect(prompt).toContain("Patient Complaints: Pain 7/10 in right hip");
  });

  test("Patient complaints omitted when empty", () => {
    const prompt = buildStructuredPrompt({ ...base, patientComplaints: "" });
    expect(prompt).not.toContain("Patient Complaints:");
  });

  test("Additional info included when provided", () => {
    const prompt = buildStructuredPrompt({
      ...base,
      additionalInfo: "Patient has latex allergy",
    });
    expect(prompt).toContain("Additional Details: Patient has latex allergy");
  });

  test("Additional info omitted when empty", () => {
    const prompt = buildStructuredPrompt({ ...base, additionalInfo: "" });
    expect(prompt).not.toContain("Additional Details:");
  });
});

// ─── Prompt structure ─────────────────────────────────────────────────────────

describe("Prompt structure", () => {
  test("Starts with instruction line", () => {
    const prompt = buildStructuredPrompt(base);
    expect(prompt.startsWith("Write the PCR narrative")).toBe(true);
  });

  test("Ends with write instruction", () => {
    const prompt = buildStructuredPrompt(base);
    expect(prompt.trimEnd().endsWith("Write the full narrative now.")).toBe(
      true
    );
  });

  test("Contains all required fields", () => {
    const prompt = buildStructuredPrompt(base);
    expect(prompt).toContain("Unit: A-1");
    expect(prompt).toContain("Transport Type: BLS");
    expect(prompt).toContain("Report Received From: Nursing Staff");
    expect(prompt).toContain("Patient: 75-year-old male");
    expect(prompt).toContain("Chief Complaint: Hip pain");
    expect(prompt).toContain("Mental Status: Alert and oriented x4");
    expect(prompt).toContain("Medical History: Hip fracture, HTN");
    expect(prompt).toContain("EMS Assessment — Airway: Patent");
    expect(prompt).toContain("EMS Assessment — Breathing: Unlabored");
    expect(prompt).toContain("EMS Assessment — Circulation: Adequate");
    expect(prompt).toContain("Mobility Level: Non-ambulatory");
    expect(prompt).toContain("Transfer Method: 2-person assist");
  });
});
