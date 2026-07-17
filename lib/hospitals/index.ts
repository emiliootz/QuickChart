export type { HospitalOption } from "./types";

export { BILH_HOSPITALS } from "./beth-israel";
export { MGB_HOSPITALS } from "./mass-general-brigham";
export { BMC_HOSPITALS } from "./boston-medical-center";
export { BCH_HOSPITALS } from "./boston-childrens";
export { CHA_HOSPITALS } from "./cambridge-health-alliance";
export { CAREONE_HOSPITALS } from "./care-one";
export { DFCI_HOSPITALS } from "./dana-farber";
export { ENCOMPASS_HOSPITALS } from "./encompass-health";
export { DPH_HOSPITALS } from "./mass-dph";
export { TUFTS_HOSPITALS } from "./tufts";
export { UHS_HOSPITALS } from "./universal-health";
export { VET_HOSPITALS } from "./veterinary";

import { BILH_HOSPITALS } from "./beth-israel";
import { MGB_HOSPITALS } from "./mass-general-brigham";
import { BCH_HOSPITALS } from "./boston-childrens";
import { BMC_HOSPITALS } from "./boston-medical-center";
import { CHA_HOSPITALS } from "./cambridge-health-alliance";
import { CAREONE_HOSPITALS } from "./care-one";
import { DFCI_HOSPITALS } from "./dana-farber";
import { ENCOMPASS_HOSPITALS } from "./encompass-health";
import { DPH_HOSPITALS } from "./mass-dph";
import { TUFTS_HOSPITALS } from "./tufts";
import { UHS_HOSPITALS } from "./universal-health";
import type { HospitalOption } from "./types";

export const HOSPITAL_SYSTEMS: Record<string, HospitalOption[]> = {
  "Beth Israel Lahey Health": BILH_HOSPITALS,
  "Mass General Brigham": MGB_HOSPITALS,
  "Boston Children's": BCH_HOSPITALS,
  "Boston Medical Center Health System": BMC_HOSPITALS,
  "Cambridge Health Alliance": CHA_HOSPITALS,
  "CareOne": CAREONE_HOSPITALS,
  "Dana-Farber Cancer Institute": DFCI_HOSPITALS,
  "Encompass Health": ENCOMPASS_HOSPITALS,
  "Massachusetts Department of Public Health (DPH)": DPH_HOSPITALS,
  "Tufts Medicine": TUFTS_HOSPITALS,
  "Universal Health Services (Arbour Health)": UHS_HOSPITALS,
};

// Flat list of every hospital with fully-resolved names — used by HospitalPicker autocomplete.
// Special IDs (__bidmc__, __mclean__, __spaulding__) are expanded to their individual locations.
export const ALL_HOSPITALS: HospitalOption[] = [
  ...BILH_HOSPITALS.flatMap((h) => {
    if (h.value === "__bidmc__") {
      return [
        { label: "Beth Israel — Boston (East Campus)", value: "Beth Israel Deaconess Medical Center East Campus in Boston, MA", abbr: "BIDMC East, BI East, BI Boston" },
        { label: "Beth Israel — Boston (West Campus)", value: "Beth Israel Deaconess Medical Center West Campus in Boston, MA", abbr: "BIDMC West, BI West, BI Boston" },
      ];
    }
    return [h];
  }),
  ...MGB_HOSPITALS.flatMap((h) => {
    if (h.value === "__mclean__") {
      return [
        { label: "McLean Hospital — Belmont Campus", value: "McLean Hospital Belmont Campus in Belmont, MA", abbr: "McLean Belmont" },
        { label: "McLean Hospital — SouthEast (Middleborough)", value: "McLean SouthEast in Middleborough, MA", abbr: "McLean SouthEast, McLean Middleborough" },
        { label: "McLean Hospital — SouthEast at Oak Street (Middleborough)", value: "McLean SouthEast at Oak Street in Middleborough, MA", abbr: "McLean Oak Street, McLean SouthEast" },
        { label: "McLean Hospital — Arlington Campus", value: "McLean Hospital Arlington Campus in Arlington, MA", abbr: "McLean Arlington" },
      ];
    }
    if (h.value === "__spaulding__") {
      return [
        { label: "Spaulding Rehab Hospital — Charlestown", value: "Spaulding Rehabilitation Hospital in Charlestown, MA", abbr: "Spaulding Charlestown, SRH" },
        { label: "Spaulding Nursing & Therapy Center — Brighton", value: "Spaulding Nursing and Therapy Center-Brighton in Brighton, MA", abbr: "Spaulding Brighton, Spaulding Nursing Brighton" },
        { label: "Spaulding Hospital for Continued Medical Care — Cambridge", value: "Spaulding Hospital for Continued Medical Care Cambridge in Cambridge, MA", abbr: "Spaulding Cambridge, Spaulding Continued Care" },
        { label: "Spaulding Rehab Hospital — Cape Cod", value: "Spaulding Rehabilitation Hospital-Cape Cod in East Sandwich, MA", abbr: "Spaulding Cape Cod" },
        { label: "Spaulding Rehab Center for Children — Lexington", value: "Spaulding Rehabilitation Center for Children in Lexington, MA", abbr: "Spaulding Children, Spaulding Lexington" },
      ];
    }
    return [h];
  }),
  ...BCH_HOSPITALS,
  ...BMC_HOSPITALS,
  ...CHA_HOSPITALS,
  ...CAREONE_HOSPITALS,
  ...DFCI_HOSPITALS,
  ...ENCOMPASS_HOSPITALS,
  ...DPH_HOSPITALS,
  ...TUFTS_HOSPITALS,
  ...UHS_HOSPITALS,
];

export function getCampusOptions(system: string, name: string): HospitalOption[] {
  if (system === "Beth Israel Lahey Health" && name === "__bidmc__") {
    return [
      { value: "East Campus", label: "East Campus" },
      { value: "West Campus", label: "West Campus" },
    ];
  }
  if (system === "Mass General Brigham" && name === "__mclean__") {
    return [
      { value: "McLean Hospital Belmont Campus in Belmont, MA", label: "Belmont Campus" },
      { value: "McLean SouthEast in Middleborough, MA", label: "McLean SouthEast — Middleborough" },
      { value: "McLean SouthEast at Oak Street in Middleborough, MA", label: "McLean SouthEast at Oak Street — Middleborough" },
      { value: "McLean Hospital Arlington Campus in Arlington, MA", label: "Arlington Campus" },
    ];
  }
  if (system === "Mass General Brigham" && name === "__spaulding__") {
    return [
      { value: "Spaulding Rehabilitation Hospital in Charlestown, MA", label: "Spaulding Rehab Hospital — Charlestown" },
      { value: "Spaulding Nursing and Therapy Center-Brighton in Brighton, MA", label: "Spaulding Nursing & Therapy Center — Brighton" },
      { value: "Spaulding Hospital for Continued Medical Care Cambridge in Cambridge, MA", label: "Spaulding Hospital for Continued Medical Care — Cambridge" },
      { value: "Spaulding Rehabilitation Hospital-Cape Cod in East Sandwich, MA", label: "Spaulding Rehab Hospital — Cape Cod" },
      { value: "Spaulding Rehabilitation Center for Children in Lexington, MA", label: "Spaulding Rehab Center for Children — Lexington" },
    ];
  }
  return [];
}
