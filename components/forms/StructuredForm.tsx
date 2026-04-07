"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { useNarrativeGeneration } from "@/hooks/useNarrativeGeneration";
import NarrativeOutput from "@/components/narrative/NarrativeOutput";
import { cn } from "@/lib/cn";

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white";

// ─── Medical History autocomplete ────────────────────────────────────────────

const DIAGNOSES: { full: string; abbr: string }[] = [
  { full: "Alzheimer's disease", abbr: "Alzheimer's dz" },
  { full: "Anemia", abbr: "Anemia" },
  { full: "Angina", abbr: "Angina" },
  { full: "Anxiety", abbr: "Anxiety" },
  { full: "Aphasia", abbr: "Aphasia" },
  { full: "Asthma", abbr: "Asthma" },
  { full: "Atrial fibrillation", abbr: "A-fib" },
  { full: "Bipolar disorder", abbr: "Bipolar d/o" },
  { full: "Bladder disorder", abbr: "Bladder d/o" },
  { full: "Cancer", abbr: "CA" },
  { full: "Cardiomyopathy", abbr: "Cardiomyopathy" },
  { full: "Chronic kidney disease", abbr: "CKD" },
  { full: "Chronic obstructive pulmonary disease", abbr: "COPD" },
  { full: "Congestive heart failure", abbr: "CHF" },
  { full: "Constipation", abbr: "Constipation" },
  { full: "Coronavirus disease 2019", abbr: "COVID-19" },
  { full: "Coronary artery disease", abbr: "CAD" },
  { full: "Crohn's disease", abbr: "Crohn's dz" },
  { full: "Dementia", abbr: "Dementia" },
  { full: "Depression", abbr: "Depression" },
  { full: "Type 1 Diabetes", abbr: "T1D" },
  { full: "Type 2 Diabetes", abbr: "T2D" },
  { full: "Dysphasia", abbr: "Dysphasia" },
  { full: "End-stage renal disease", abbr: "ESRD" },
  { full: "Esophagitis", abbr: "Esophagitis" },
  { full: "Fecal impaction", abbr: "Fecal impaction" },
  { full: "Gastritis", abbr: "Gastritis" },
  { full: "Gastroesophageal reflux disease", abbr: "GERD" },
  { full: "Glaucoma", abbr: "Glaucoma" },
  { full: "Heart failure", abbr: "HF" },
  { full: "Hearing loss", abbr: "Hearing loss" },
  { full: "Hemiparesis", abbr: "Hemiparesis" },
  { full: "Hemiplegia", abbr: "Hemiplegia" },
  { full: "Hepatitis", abbr: "Hepatitis" },
  { full: "Human immunodeficiency virus infection", abbr: "HIV" },
  { full: "Hyperlipidemia", abbr: "HLD" },
  { full: "Hypertension", abbr: "HTN" },
  { full: "Hypothyroidism", abbr: "Hypothyroidism" },
  { full: "Intracranial hemorrhage", abbr: "ICH" },
  { full: "Irritable bowel syndrome", abbr: "IBS" },
  { full: "Liver disease", abbr: "Liver dz" },
  { full: "Obstructive sleep apnea", abbr: "OSA" },
  { full: "Osteomyelitis", abbr: "Osteomyelitis" },
  { full: "Overactive bladder", abbr: "OAB" },
  { full: "Paraplegia", abbr: "Paraplegia" },
  { full: "Parkinson's disease", abbr: "Parkinson's dz" },
  { full: "Peptic ulcer disease", abbr: "PUD" },
  { full: "Pneumonia", abbr: "PNA" },
  { full: "Polio", abbr: "Polio" },
  { full: "Post-traumatic stress disorder", abbr: "PTSD" },
  { full: "Prior heart attack", abbr: "Prior MI" },
  { full: "Pulmonary hypertension", abbr: "Pulm HTN" },
  { full: "Quadriplegia", abbr: "Quadriplegia" },
  { full: "Radiculopathy", abbr: "Radiculopathy" },
  { full: "Respiratory syncytial virus infection", abbr: "RSV" },
  { full: "Sciatica", abbr: "Sciatica" },
  { full: "Seizure disorder", abbr: "Seizure d/o" },
  { full: "Sepsis", abbr: "Sepsis" },
  { full: "Sleep apnea", abbr: "OSA" },
  { full: "Spinal stenosis", abbr: "Spinal stenosis" },
  { full: "Stroke", abbr: "CVA" },
  { full: "Substance use disorder", abbr: "SUD" },
  { full: "Supraventricular tachycardia", abbr: "SVT" },
  { full: "Thrombocytopenia", abbr: "Thrombocytopenia" },
  { full: "Tuberculosis", abbr: "TB" },
  { full: "Ulcerative colitis", abbr: "UC" },
  { full: "Valvular heart disease", abbr: "Valvular heart dz" },
  { full: "Ventricular tachycardia", abbr: "VT" },
  { full: "Blindness", abbr: "Blindness" },
];

function MedHistoryInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(() =>
    value ? value.split(", ").filter(Boolean) : []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim().length > 0
    ? DIAGNOSES.filter(d =>
        d.full.toLowerCase().includes(query.toLowerCase()) ||
        d.abbr.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const showCustom =
    query.trim().length > 0 &&
    !filtered.some(d => d.full.toLowerCase() === query.trim().toLowerCase());

  function addTag(label: string) {
    if (!tags.includes(label)) {
      const next = [...tags, label];
      setTags(next);
      onChange(next.join(", "));
    }
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeTag(label: string) {
    const next = tags.filter(t => t !== label);
    setTags(next);
    onChange(next.join(", "));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      addTag(filtered.length > 0 ? filtered[0].full : query.trim());
    }
    if (e.key === "Backspace" && !query && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(t => (
            <span key={t} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {t}
              <button type="button" onClick={() => removeTag(t)} className="text-blue-400 hover:text-blue-700 leading-none">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Type diagnosis or abbreviation to add..."
          className={inputCls}
        />
        {open && (filtered.length > 0 || showCustom) && (
          <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {filtered.map(d => (
              <li key={d.full}>
                <button
                  type="button"
                  onMouseDown={() => addTag(d.full)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between gap-2"
                >
                  <span>{d.full}</span>
                  {d.abbr !== d.full && (
                    <span className="text-slate-400 text-xs shrink-0">{d.abbr}</span>
                  )}
                </button>
              </li>
            ))}
            {showCustom && (
              <li>
                <button
                  type="button"
                  onMouseDown={() => addTag(query.trim())}
                  className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 italic border-t border-slate-100"
                >
                  Add &ldquo;{query.trim()}&rdquo;
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Address Autocomplete ────────────────────────────────────────────────────

function AddressAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !inputRef.current) return;

    let autocomplete: google.maps.places.Autocomplete;

    import("@googlemaps/js-api-loader").then(async ({ setOptions, importLibrary }) => {
      setOptions({ key: apiKey });
      await importLibrary("places");
      if (!inputRef.current) return;
      autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) onChange(place.formatted_address);
      });
    });

    return () => {
      if (autocomplete) google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      placeholder="Start typing an address..."
      className={inputCls}
    />
  );
}

// ─── Hospital lists ───────────────────────────────────────────────────────────

type HospitalOption = { value: string; label: string };

const BILH_HOSPITALS: HospitalOption[] = [
  { value: "Addison Gilbert Hospital in Gloucester, MA", label: "Addison Gilbert Hospital — Gloucester" },
  { value: "Anna Jaques Hospital in Newburyport, MA", label: "Anna Jaques Hospital — Newburyport" },
  { value: "BayRidge Hospital in Lynn, MA", label: "BayRidge Hospital — Lynn" },
  { value: "Beth Israel Deaconess Hospital-Milton in Milton, MA", label: "Beth Israel — Milton" },
  { value: "Beth Israel Deaconess Hospital-Needham in Needham, MA", label: "Beth Israel — Needham" },
  { value: "Beth Israel Deaconess Hospital-Plymouth in Plymouth, MA", label: "Beth Israel — Plymouth" },
  { value: "__bidmc__", label: "Beth Israel — Boston" },
  { value: "Beverly Hospital in Beverly, MA", label: "Beverly Hospital — Beverly" },
  { value: "Exeter Hospital in Exeter, NH", label: "Exeter Hospital — Exeter, NH" },
  { value: "Lahey Hospital & Medical Center in Burlington, MA", label: "Lahey Hospital & Medical Center — Burlington" },
  { value: "Lahey Medical Center-Peabody in Peabody, MA", label: "Lahey Medical Center — Peabody" },
  { value: "Mount Auburn Hospital in Cambridge, MA", label: "Mount Auburn Hospital — Cambridge" },
  { value: "New England Baptist Hospital in Boston, MA", label: "New England Baptist Hospital — Boston" },
  { value: "Winchester Hospital in Winchester, MA", label: "Winchester Hospital — Winchester" },
];

const MGB_HOSPITALS: HospitalOption[] = [
  { value: "Brigham and Women's Hospital in Boston, MA", label: "Brigham and Women's — Boston" },
  { value: "Massachusetts General Hospital in Boston, MA", label: "Mass General — Boston" },
  { value: "Brigham and Women's Faulkner Hospital in Jamaica Plain, MA", label: "Faulkner — Jamaica Plain" },
  { value: "Cooley Dickinson Hospital in Northampton, MA", label: "Cooley Dickinson Hospital — Northampton" },
  { value: "Martha's Vineyard Hospital in Oak Bluffs, MA", label: "Martha's Vineyard Hospital — Oak Bluffs" },
  { value: "Massachusetts Eye and Ear in Boston, MA", label: "Mass Eye and Ear — Boston" },
  { value: "__mclean__", label: "McLean Hospital (choose campus)" },
  { value: "Nantucket Cottage Hospital in Nantucket, MA", label: "Nantucket Cottage Hospital — Nantucket" },
  { value: "Newton-Wellesley Hospital in Newton, MA", label: "Newton-Wellesley Hospital — Newton" },
  { value: "Salem Hospital in Salem, MA", label: "Salem Hospital — Salem" },
  { value: "__spaulding__", label: "Spaulding Rehabilitation (choose location)" },
  { value: "Wentworth-Douglass Hospital in Dover, NH", label: "Wentworth-Douglass Hospital — Dover, NH" },
];

const BMC_HOSPITALS: HospitalOption[] = [
  { value: "Boston Medical Center in Boston, MA", label: "Boston Medical Center — Boston" },
  { value: "Boston Medical Center-Brighton in Brighton, MA", label: "Boston Medical Center — Brighton" },
  { value: "Boston Medical Center-South in Brockton, MA", label: "Boston Medical Center — South (Brockton)" },
];

const CHA_HOSPITALS: HospitalOption[] = [
  { value: "CHA Cambridge Hospital in Cambridge, MA", label: "CHA Cambridge Hospital — Cambridge" },
  { value: "CHA Everett Hospital in Everett, MA", label: "CHA Everett Hospital — Everett" },
  { value: "CHA Somerville Campus in Somerville, MA", label: "CHA Somerville Campus — Somerville" },
];

const UHS_HOSPITALS: HospitalOption[] = [
  { value: "Arbour Hospital in Jamaica Plain, MA", label: "Arbour Hospital — Jamaica Plain" },
  { value: "Arbour-HRI Hospital in Brookline, MA", label: "Arbour-HRI Hospital — Brookline" },
  { value: "Pembroke Hospital in Pembroke, MA", label: "Pembroke Hospital — Pembroke" },
  { value: "Westwood Lodge in Westwood, MA", label: "Westwood Lodge — Westwood" },
];

const DPH_HOSPITALS: HospitalOption[] = [
  { value: "Lemuel Shattuck Hospital in Jamaica Plain, MA", label: "Lemuel Shattuck Hospital — Jamaica Plain" },
  { value: "Pappas Rehabilitation Hospital for Children in Canton, MA", label: "Pappas Rehab Hospital — Canton" },
  { value: "Tewksbury Hospital in Tewksbury, MA", label: "Tewksbury Hospital — Tewksbury" },
  { value: "Western Massachusetts Hospital in Westfield, MA", label: "Western Massachusetts Hospital — Westfield" },
];

const VET_HOSPITALS: HospitalOption[] = [
  { value: "BluePearl Pet Hospital in Boston, MA", label: "BluePearl Pet Hospital — Boston" },
  { value: "BluePearl Pet Hospital in Framingham, MA", label: "BluePearl Pet Hospital — Framingham" },
  { value: "Bulger Veterinary Hospital in Lawrence, MA", label: "Bulger Veterinary Hospital — Lawrence" },
  { value: "Cape Cod Veterinary Specialists in Bourne, MA", label: "Cape Cod Veterinary Specialists — Bourne" },
  { value: "Cummings Veterinary Medical Center, Tufts University in North Grafton, MA", label: "Cummings Veterinary Medical Center (Tufts) — North Grafton" },
  { value: "Massachusetts Veterinary Referral Hospital in Woburn, MA", label: "Massachusetts Veterinary Referral Hospital — Woburn" },
  { value: "MSPCA Angell-West in Waltham, MA", label: "MSPCA Angell-West — Waltham" },
  { value: "MSPCA-Angell Animal Medical Center in Boston, MA", label: "MSPCA-Angell Animal Medical Center — Boston" },
  { value: "Tufts Veterinary Emergency Treatment & Specialties in Walpole, MA", label: "Tufts Veterinary Emergency Treatment & Specialties — Walpole" },
  { value: "VCA South Shore Animal Hospital in Weymouth, MA", label: "VCA South Shore Animal Hospital — Weymouth" },
  { value: "Veterinary Emergency & Specialty Hospital in South Deerfield, MA", label: "Veterinary Emergency & Specialty Hospital — South Deerfield" },
  { value: "Veterinary Emergency and Specialty Hospital (VESH) in West Springfield, MA", label: "VESH — West Springfield" },
  { value: "Westford Veterinary Emergency Referral Center in Westford, MA", label: "Westford Veterinary Emergency Referral Center — Westford" },
];

const CAREONE_HOSPITALS: HospitalOption[] = [
  { value: "CareOne at Brookline in Brookline, MA", label: "CareOne at Brookline — Brookline" },
  { value: "CareOne at Concord in Concord, MA", label: "CareOne at Concord — Concord" },
  { value: "CareOne at Essex Park in Beverly, MA", label: "CareOne at Essex Park — Beverly" },
  { value: "CareOne at Holyoke in Holyoke, MA", label: "CareOne at Holyoke — Holyoke" },
  { value: "CareOne at Lexington in Lexington, MA", label: "CareOne at Lexington — Lexington" },
  { value: "CareOne at Lowell in Lowell, MA", label: "CareOne at Lowell — Lowell" },
  { value: "CareOne at Millbury in Millbury, MA", label: "CareOne at Millbury — Millbury" },
  { value: "CareOne at New Bedford in New Bedford, MA", label: "CareOne at New Bedford — New Bedford" },
  { value: "CareOne at Newton in Newton, MA", label: "CareOne at Newton — Newton" },
  { value: "CareOne at Northampton in Northampton, MA", label: "CareOne at Northampton — Northampton" },
  { value: "CareOne at Peabody in Peabody, MA", label: "CareOne at Peabody — Peabody" },
  { value: "CareOne at Randolph in Randolph, MA", label: "CareOne at Randolph — Randolph" },
  { value: "CareOne at Redstone in East Longmeadow, MA", label: "CareOne at Redstone — East Longmeadow" },
  { value: "CareOne at Weymouth in Weymouth, MA", label: "CareOne at Weymouth — Weymouth" },
  { value: "CareOne at Wilmington in Wilmington, MA", label: "CareOne at Wilmington — Wilmington" },
  { value: "CareOne at Sharon in Sharon, MA", label: "CareOne at Sharon — Sharon" },
];

const BCH_HOSPITALS: HospitalOption[] = [
  { value: "Boston Children's Hospital in Boston, MA", label: "Boston Children's Hospital — Boston" },
  { value: "Boston Children's Brookline in Brookline, MA", label: "Boston Children's — Brookline" },
  { value: "Boston Children's Lexington in Lexington, MA", label: "Boston Children's — Lexington" },
  { value: "Boston Children's Martha Eliot in Boston, MA", label: "Boston Children's Martha Eliot — Boston" },
  { value: "Boston Children's Needham in Needham, MA", label: "Boston Children's — Needham" },
  { value: "Boston Children's North Dartmouth in North Dartmouth, MA", label: "Boston Children's — North Dartmouth" },
  { value: "Boston Children's Peabody in Peabody, MA", label: "Boston Children's — Peabody" },
  { value: "Boston Children's Waltham in Waltham, MA", label: "Boston Children's — Waltham" },
  { value: "Boston Children's Weymouth in Weymouth, MA", label: "Boston Children's — Weymouth" },
];

const ENCOMPASS_HOSPITALS: HospitalOption[] = [
  { value: "Encompass Health Rehabilitation Hospital of Braintree in Braintree, MA", label: "Encompass Health Rehab — Braintree" },
  { value: "Encompass Health Rehabilitation Hospital of Braintree at Framingham in Framingham, MA", label: "Encompass Health Rehab — Framingham" },
  { value: "Encompass Health Rehabilitation Hospital of Concord in Concord, NH", label: "Encompass Health Rehab — Concord, NH" },
  { value: "Encompass Health Rehabilitation Hospital of Johnston in Johnston, RI", label: "Encompass Health Rehab — Johnston, RI" },
  { value: "Encompass Health Rehabilitation Hospital of New England in Woburn, MA", label: "Encompass Health Rehab of New England — Woburn" },
  { value: "Encompass Health Rehabilitation Hospital of New England at Beverly in Beverly, MA", label: "Encompass Health Rehab of New England — Beverly" },
  { value: "Encompass Health Rehabilitation Hospital of New England at Lowell in Lowell, MA", label: "Encompass Health Rehab of New England — Lowell" },
  { value: "Encompass Health Rehabilitation Hospital of Western Massachusetts in Ludlow, MA", label: "Encompass Health Rehab of Western MA — Ludlow" },
  { value: "Fairlawn Rehabilitation Hospital in Worcester, MA", label: "Fairlawn Rehabilitation Hospital — Worcester" },
  { value: "New England Rehabilitation Hospital of Portland, a Joint Venture of Maine Medical Center and Encompass Health, in Portland, ME", label: "New England Rehabilitation Hospital of Portland — Portland, ME" },
];

const TUFTS_HOSPITALS: HospitalOption[] = [
  { value: "Tufts Medical Center in Boston, MA", label: "Tufts Medical Center — Boston" },
  { value: "Melrose Wakefield Hospital in Melrose, MA", label: "Melrose Wakefield Hospital — Melrose" },
  { value: "Lowell General Hospital - Saints Campus in Lowell, MA", label: "Lowell General Hospital — Saints Campus" },
  { value: "Lowell General Hospital in Lowell, MA", label: "Lowell General Hospital — Lowell" },
];

const DFCI_HOSPITALS: HospitalOption[] = [
  { value: "Dana-Farber Cancer Institute in Boston, MA", label: "Dana-Farber — Longwood" },
  { value: "Dana-Farber Cancer Institute in Newton, MA", label: "Dana-Farber — Chestnut Hill" },
];

const HOSPITAL_SYSTEMS: Record<string, HospitalOption[]> = {
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

function getCampusOptions(system: string, name: string): HospitalOption[] {
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function StructuredForm() {
  const model = "claude-sonnet-4-6" as const;
  const { status, narrative, error, generate, reset } = useNarrativeGeneration();

  const { register, handleSubmit, watch, setValue, reset: resetForm, getValues } = useForm<StructuredFormData>({
    defaultValues: {
      ambulanceNumber: "",
      transportType: "",
      sceneLocation: "",
      sceneLocationCustom: "",
      sceneHospitalSystem: "",
      sceneHospitalName: "",
      sceneHospitalCampus: "",
      sceneHospitalCustom: "",
      sceneFloorRoom: "",
      destination: "",
      destinationCustom: "",
      destinationHospitalSystem: "",
      destinationHospitalName: "",
      destinationHospitalCampus: "",
      destinationHospitalCustom: "",
      destinationRoom: "",
      reportReceivedFrom: "",
      patientAge: "",
      patientDOB: "",
      patientAddress: "",
      patientGender: "",
      chiefComplaint: "",
      transportReason: "",
      transportReasonCustom: "",
      oxygenDelivery: "",
      oxygenLiters: "",
      castType: "",
      sectionType: "",
      mentalStatus: "",
      medicalHistory: "",
      airway: "",
      breathing: "",
      circulation: "",
      skin: "",
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
      mobilityLevel: "",
      transferType: "",
      transportPosition: "",
      transportPositionCustom: "",
      additionalInfo: "",
    },
  });

  const sceneLocation = watch("sceneLocation");
  const sceneHospitalSystem = watch("sceneHospitalSystem");
  const sceneHospitalName = watch("sceneHospitalName");
  const destination = watch("destination");
  const destinationHospitalSystem = watch("destinationHospitalSystem");
  const destinationHospitalName = watch("destinationHospitalName");
  const transportPosition = watch("transportPosition");
  const transportReason = watch("transportReason");
  const bloodPressure = watch("bloodPressure");
  const heartRate = watch("heartRate");
  const spo2 = watch("spo2");
  const mobilityLevel = watch("mobilityLevel");
  const transportType = watch("transportType");
  const isEmergent = transportType === "Emergent Priority 1" || transportType === "Emergent Priority 2" || transportType === "Emergent Priority 3";
  const isGenerating = status === "loading" || status === "streaming";

  useEffect(() => {
    if (mobilityLevel === "Non-Ambulatory") setValue("transferType", "Sheet Draw Method");
    else if (mobilityLevel === "Ambulatory") setValue("transferType", "Ambulation");
    else if (mobilityLevel === "Stand and Pivot") setValue("transferType", "");
  }, [mobilityLevel, setValue]);

  const patientDOB = watch("patientDOB");
  useEffect(() => {
    if (!patientDOB) return;
    const birth = new Date(patientDOB);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age >= 0) setValue("patientAge", String(age));
  }, [patientDOB, setValue]);

  async function onSubmit(data: StructuredFormData) {
    await generate({ model, structuredData: data });
    setTimeout(() => {
      document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Unit & Transport */}
      <Card title="Unit & Transport">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ambulance Number">
            <input
              {...register("ambulanceNumber")}
              type="text"
              placeholder="e.g. BA-042"
              className={inputCls}
            />
          </Field>
          <Field label="Transport Type">
            <select {...register("transportType")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Emergent Priority 1">Emergent Priority 1</option>
              <option value="Emergent Priority 2">Emergent Priority 2</option>
              <option value="Emergent Priority 3">Emergent Priority 3</option>
              <option value="Non-Emergent">Non-Emergent</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* Scene */}
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

      {/* Patient */}
      <Card title="Patient">
        <div className="grid grid-cols-2 gap-4">
          {isEmergent ? (
            <Field label="Date of Birth">
              <input
                {...register("patientDOB")}
                type="date"
                className={cn(inputCls, "max-w-[90px]")}
              />
              {watch("patientAge") && (
                <p className="text-xs text-slate-500 mt-1">Age: {watch("patientAge")} years old</p>
              )}
            </Field>
          ) : (
            <Field label="Age">
              <input
                {...register("patientAge")}
                type="number"
                placeholder="e.g. 75"
                className={inputCls}
                maxLength={3}
                onKeyDown={e => { if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"].includes(e.key)) e.preventDefault(); if (/^\d$/.test(e.key) && (e.target as HTMLInputElement).value.length >= 3) e.preventDefault(); }}
              />
            </Field>
          )}
          <Field label="Gender">
            <select {...register("patientGender")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>
        </div>

        {isEmergent && (
          <Field label="Patient Address">
            <AddressAutocomplete
              value={watch("patientAddress")}
              onChange={v => setValue("patientAddress", v)}
            />
          </Field>
        )}

        <Field label="Chief Complaint">
          <input
            {...register("chiefComplaint")}
            type="text"
            placeholder="e.g. failure to thrive, frequent falls"
            className={inputCls}
          />
        </Field>

        <Field label="Reason for Transport">
          <select {...register("transportReason")} className={inputCls}>
            <option value="">Select reason...</option>
            <option value="On oxygen">On oxygen</option>
            <option value="Has symptoms of heart failure at rest">Has symptoms of heart failure at rest</option>
            <option value="Is receiving IV fluids">Is receiving IV fluids</option>
            <option value="Transporting after cardiac catheterization">Transporting after cardiac catheterization</option>
            <option value="Has uncontrolled epilepsy">Has uncontrolled epilepsy</option>
            <option value="Has a cast">Has a cast</option>
            <option value="Is in a neonatal incubator">Is in a neonatal incubator</option>
            <option value="Is sectioned">Is sectioned</option>
            <option value="Is sedated">Is sedated</option>
            <option value="Is in a coma">Is in a coma</option>
            <option value="Is unable to safely sit upright">Is unable to safely sit upright</option>
            <option value="Requires two-person assist for all transfers">Requires two-person assist for all transfers</option>
            <option value="Has severe dementia">Has severe dementia</option>
            <option value="Is altered mental status">Is altered mental status</option>
            <option value="Is paralyzed">Is paralyzed</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        {transportReason === "On oxygen" && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Oxygen Delivery Method">
              <select {...register("oxygenDelivery")} className={inputCls}>
                <option value="">Select...</option>
                <option value="nasal cannula">Nasal Cannula</option>
                <option value="non-rebreather mask">Non-Rebreather Mask</option>
              </select>
            </Field>
            <Field label="Liters per Minute">
              <input
                {...register("oxygenLiters")}
                type="number"
                placeholder="e.g. 2"
                className={inputCls}
              />
            </Field>
          </div>
        )}

        {transportReason === "Has a cast" && (
          <Field label="Cast Type">
            <select {...register("castType")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Total body cast">Total body cast</option>
              <option value="Hip cast">Hip cast</option>
            </select>
          </Field>
        )}

        {transportReason === "Is sectioned" && (
          <Field label="Section">
            <select {...register("sectionType")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Section 12">Section 12</option>
              <option value="Section 21">Section 21</option>
            </select>
          </Field>
        )}

        {transportReason === "Other" && (
          <Field label="Reason for Transport (specify)">
            <input
              {...register("transportReasonCustom")}
              type="text"
              placeholder="Describe reason for transport"
              className={inputCls}
            />
          </Field>
        )}

        <Field label="Mental Status">
          <select {...register("mentalStatus")} className={inputCls}>
            <option value="">Select...</option>
            <option value="A&Ox4">A&Ox4</option>
            <option value="A&Ox3">A&Ox3</option>
            <option value="A&Ox2">A&Ox2</option>
            <option value="A&Ox1">A&Ox1</option>
            <option value="Alert with Intermittent Confusion">Alert w/ Intermittent Confusion</option>
            <option value="Confused">Confused</option>
            <option value="Lethargic">Lethargic</option>
            <option value="Obtunded">Obtunded</option>
            <option value="Unresponsive">Unresponsive</option>
          </select>
        </Field>

        <Field label="Medical History">
          <MedHistoryInput
            value={watch("medicalHistory")}
            onChange={v => setValue("medicalHistory", v)}
          />
        </Field>
      </Card>

      {/* EMS Assessment */}
      <Card title="EMS Assessment">
        <button
          type="button"
          onClick={() => {
            setValue("airway", "Patent");
            setValue("breathing", "Unlabored");
            setValue("circulation", "Adequate");
            setValue("skin", "warm and dry");
            setValue("bloodPressure", "Normal (at Baseline)");
            setValue("heartRate", "Normal (at Baseline)");
            setValue("spo2", "Normal (at Baseline)");
          }}
          className="w-full rounded-lg border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 active:bg-green-100 transition-colors"
        >
          Set Normal
        </button>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Airway">
            <select {...register("airway")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Patent">Patent</option>
              <option value="Compromised">Compromised</option>
              <option value="Obstructed">Obstructed</option>
            </select>
          </Field>
          <Field label="Breathing">
            <select {...register("breathing")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Unlabored">Unlabored</option>
              <option value="Labored">Labored</option>
              <option value="Shallow">Shallow</option>
              <option value="Absent">Absent</option>
            </select>
          </Field>
          <Field label="Circulation">
            <select {...register("circulation")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Adequate">Adequate</option>
              <option value="Inadequate">Inadequate</option>
            </select>
          </Field>
        </div>

        <Field label="Skin">
          <select {...register("skin")} className={inputCls}>
            <option value="">Select...</option>
            <option value="warm and dry">Warm and dry</option>
            <option value="cool and diaphoretic">Cool and diaphoretic</option>
            <option value="warm and diaphoretic">Warm and diaphoretic</option>
            <option value="cool and dry">Cool and dry</option>
            <option value="pale and diaphoretic">Pale and diaphoretic</option>
            <option value="pale and dry">Pale and dry</option>
            <option value="flushed and warm">Flushed and warm</option>
            <option value="cyanotic">Cyanotic</option>
            <option value="__other__">Other (enter manually)</option>
          </select>
        </Field>

        {watch("skin") === "__other__" && (
          <Field label="Skin (specify)">
            <input
              {...register("skinCustom")}
              type="text"
              placeholder="Describe skin condition"
              className={inputCls}
            />
          </Field>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Field label="BP">
            <select {...register("bloodPressure")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Normal (at Baseline)">Normal (at Baseline)</option>
              <option value="Hypertensive">Hypertensive</option>
              <option value="Hypotensive">Hypotensive</option>
            </select>
          </Field>
          <Field label="Heart Rate">
            <select {...register("heartRate")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Normal (at Baseline)">Normal (at Baseline)</option>
              <option value="Tachycardic">Tachycardic</option>
              <option value="Bradycardic">Bradycardic</option>
            </select>
          </Field>
          <Field label="SPO2">
            <select {...register("spo2")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Normal (at Baseline)">Normal (at Baseline)</option>
              <option value="Hypoxic">Hypoxic</option>
            </select>
          </Field>
        </div>

        {bloodPressure === "Hypertensive" && (
          <Field label="BP — specify">
            <input {...register("bloodPressureNote")} type="text" placeholder="e.g. 180/110 mmHg, history of hypertension" className={inputCls} />
          </Field>
        )}
        {bloodPressure === "Hypotensive" && (
          <Field label="BP — specify">
            <input {...register("bloodPressureNote")} type="text" placeholder="e.g. 88/50 mmHg, suspected dehydration" className={inputCls} />
          </Field>
        )}
        {heartRate === "Tachycardic" && (
          <Field label="Heart Rate — specify">
            <input {...register("heartRateNote")} type="text" placeholder="e.g. HR 130 bpm, anxiety / pain" className={inputCls} />
          </Field>
        )}
        {heartRate === "Bradycardic" && (
          <Field label="Heart Rate — specify">
            <input {...register("heartRateNote")} type="text" placeholder="e.g. HR 42 bpm, on beta-blockers" className={inputCls} />
          </Field>
        )}
        {spo2 === "Hypoxic" && (
          <Field label="SPO2 — specify">
            <input {...register("spo2Note")} type="text" placeholder="e.g. SpO2 88% on room air" className={inputCls} />
          </Field>
        )}

        {isEmergent && (
          <div className="grid grid-cols-3 gap-4">
            <Field label="Pain (0–10)">
              <select {...register("painScore")} className={inputCls}>
                <option value="">Select...</option>
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={String(i)}>{i}</option>
                ))}
              </select>
            </Field>
            <Field label="Height">
              <select {...register("patientHeight")} className={inputCls}>
                <option value="">Select...</option>
                {Array.from({ length: 49 }, (_, i) => {
                  const totalIn = 30 + i;
                  const ft = Math.floor(totalIn / 12);
                  const inches = totalIn % 12;
                  return (
                    <option key={totalIn} value={`${ft}ft ${inches}in (${totalIn} in)`}>
                      {ft}ft {inches}in ({totalIn} in)
                    </option>
                  );
                })}
              </select>
            </Field>
            <Field label="Weight">
              <input {...register("patientWeight")} type="number" min="1" max="999" placeholder="lbs" className={inputCls} onKeyDown={e => { if (!/^\d$/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab"].includes(e.key)) e.preventDefault(); if (/^\d$/.test(e.key) && (e.target as HTMLInputElement).value.length >= 4) e.preventDefault(); }} />
            </Field>
          </div>
        )}

        <Field label="Patient Complaints">
          <input
            {...register("patientComplaints")}
            type="text"
            placeholder="e.g. pain 6/10 right hip, shortness of breath (leave blank if none)"
            className={inputCls}
          />
        </Field>
      </Card>

      {/* Mobility & Transfer */}
      <Card title="Mobility & Transfer">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mobility Level">
            <select {...register("mobilityLevel")} className={inputCls}>
              <option value="">Select...</option>
              <option value="Non-Ambulatory">Non-Ambulatory</option>
              <option value="Ambulatory">Ambulatory</option>
              <option value="Stand and Pivot">Stand and Pivot</option>
            </select>
          </Field>
          <Field label="Transfer Method">
            {mobilityLevel === "Stand and Pivot" ? (
              <select {...register("transferType")} className={inputCls}>
                <option value="">Select...</option>
                <option value="Stand & Pivot 2x Assist">Stand & Pivot 2x Assist</option>
                <option value="Stand & Pivot 1x Assist">Stand & Pivot 1x Assist</option>
              </select>
            ) : (
              <input
                readOnly
                value={mobilityLevel === "Non-Ambulatory" ? "Sheet Draw Method" : mobilityLevel === "Ambulatory" ? "Ambulation" : ""}
                placeholder="Select mobility first..."
                className={cn(inputCls, "bg-slate-50 text-slate-500 cursor-not-allowed")}
              />
            )}
          </Field>
        </div>

        <Field label="Transport Position">
          <select {...register("transportPosition")} className={inputCls}>
            <option value="">Select...</option>
            <option value="Semi-Fowler's">Semi-Fowler&apos;s</option>
            <option value="Supine">Supine</option>
            <option value="Prone">Prone</option>
            <option value="Sitting">Sitting</option>
            <option value="__other__">Other (enter manually)</option>
          </select>
        </Field>

        {transportPosition === "__other__" && (
          <Field label="Transport Position (specify)">
            <input
              {...register("transportPositionCustom")}
              type="text"
              placeholder="e.g. Left lateral recumbent"
              className={inputCls}
            />
          </Field>
        )}
      </Card>

      {/* Destination */}
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

      {/* Additional Information */}
      <Card title="Additional Information">
        <Field label="Anything else to include">
          <textarea
            {...register("additionalInfo")}
            rows={4}
            placeholder="Vital signs, medications, oxygen use, IV access, patient complaints en route, receiving nurse name, etc."
            className={inputCls}
          />
        </Field>
      </Card>

      {/* Model + Submit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <button
          type="submit"
          disabled={isGenerating}
          className={cn(
            "w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors",
            isGenerating
              ? "bg-blue-600 opacity-70 cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-900"
          )}
        >
          {isGenerating ? "Generating narrative..." : "Generate Narrative"}
        </button>

        <div id="narrative-output">
          <NarrativeOutput
            status={status}
            narrative={narrative}
            error={error}
            onRegenerate={reset}
          />
        </div>

        {status === "complete" && (
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                const d = getValues();
                const returnData: StructuredFormData = {
                  ...d,
                  sceneLocation: d.destination,
                  sceneLocationCustom: d.destinationCustom,
                  sceneHospitalSystem: d.destinationHospitalSystem,
                  sceneHospitalName: d.destinationHospitalName,
                  sceneHospitalCampus: d.destinationHospitalCampus,
                  sceneHospitalCustom: d.destinationHospitalCustom,
                  sceneFloorRoom: d.destinationRoom,
                  destination: d.sceneLocation,
                  destinationCustom: d.sceneLocationCustom,
                  destinationHospitalSystem: d.sceneHospitalSystem,
                  destinationHospitalName: d.sceneHospitalName,
                  destinationHospitalCampus: d.sceneHospitalCampus,
                  destinationHospitalCustom: d.sceneHospitalCustom,
                  destinationRoom: d.sceneFloorRoom,
                };
                generate({ model, structuredData: returnData });
                setTimeout(() => {
                  document.getElementById("narrative-output")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
              className="w-full rounded-lg border border-blue-500 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              Generate Return Trip Narrative
            </button>
            <button
              type="button"
              onClick={() => { reset(); resetForm(); }}
              className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              New Call — Clear All Fields
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
