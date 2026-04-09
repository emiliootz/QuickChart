// complaints.ts — master list of chief complaints for the ChiefComplaint autocomplete.
//
// Each entry has a `full` name (displayed in the dropdown and used as the tag label)
// and an `abbr` abbreviation (shown as a hint and also searchable).
// Follows the same shape as diagnoses.ts so the same autocomplete component can be reused.
//
// Complaints are phrased from the patient's perspective / as stated on scene —
// not as clinical diagnoses. Keep them concise and dispatch-friendly.

export type Complaint = { full: string; abbr: string };

export const COMPLAINTS: Complaint[] = [
  { full: "Abdominal pain", abbr: "Abd pain" },
  { full: "Altered mental status", abbr: "AMS" },
  { full: "Anxiety / panic attack", abbr: "Anxiety" },
  { full: "Back pain", abbr: "Back pain" },
  { full: "Chest pain", abbr: "CP" },
  { full: "Confusion", abbr: "Confusion" },
  { full: "Dehydration", abbr: "Dehydration" },
  { full: "Dialysis transport", abbr: "Dialysis" },
  { full: "Difficulty breathing", abbr: "SOB" },
  { full: "Dizziness", abbr: "Dizziness" },
  { full: "Fall", abbr: "Fall" },
  { full: "Fatigue / generalized weakness", abbr: "Weakness" },
  { full: "Fever", abbr: "Fever" },
  { full: "Flank pain", abbr: "Flank pain" },
  { full: "Fracture", abbr: "Fx" },
  { full: "Headache", abbr: "HA" },
  { full: "Hip pain", abbr: "Hip pain" },
  { full: "Hypoglycemia", abbr: "Low blood sugar" },
  { full: "Hypotension", abbr: "Low BP" },
  { full: "Infection / wound care", abbr: "Infection" },
  { full: "Knee pain", abbr: "Knee pain" },
  { full: "Leg pain / swelling", abbr: "Leg pain" },
  { full: "Medication management", abbr: "Med mgmt" },
  { full: "Nausea / vomiting", abbr: "N/V" },
  { full: "Neck pain", abbr: "Neck pain" },
  { full: "Non-healing wound", abbr: "Wound" },
  { full: "Pain management", abbr: "Pain mgmt" },
  { full: "Palpitations", abbr: "Palpitations" },
  { full: "Post-operative care", abbr: "Post-op" },
  { full: "Psychiatric evaluation", abbr: "Psych eval" },
  { full: "Radiation / chemotherapy", abbr: "Chemo/RT" },
  { full: "Rehabilitation", abbr: "Rehab" },
  { full: "Respiratory distress", abbr: "Resp distress" },
  { full: "Scheduled procedure", abbr: "Procedure" },
  { full: "Seizure", abbr: "Seizure" },
  { full: "Sepsis", abbr: "Sepsis" },
  { full: "Shoulder pain", abbr: "Shoulder pain" },
  { full: "Skin breakdown / pressure ulcer", abbr: "Pressure ulcer" },
  { full: "Stroke / CVA symptoms", abbr: "CVA" },
  { full: "Syncope / near-syncope", abbr: "Syncope" },
  { full: "Trauma", abbr: "Trauma" },
  { full: "Urinary tract infection", abbr: "UTI" },
  { full: "Urinary retention", abbr: "Urinary retention" },
  { full: "Vomiting blood", abbr: "Hematemesis" },
  { full: "Weakness / inability to ambulate", abbr: "Non-ambulatory" },
];
