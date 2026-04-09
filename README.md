# QuickChart — EMS PCR Narrative Generator

A mobile-first web app for EMS personnel to generate Medicare-compliant Patient Care Report (PCR) narratives using Claude AI. Fill out one structured form and receive a complete, legally defensible ambulance transport narrative.

Live at [qchart.app](https://qchart.app)

---

## Features

- Structured form covering unit info, scene, patient, EMS assessment, mobility, and destination
- AI-generated 9-paragraph PCR narrative following a standardized Medicare-compliant structure
- Streaming output with animated cursor — narrative appears in real time as it's written
- One-click copy to clipboard with fallback for older browsers
- Return trip generation — swaps scene and destination to generate the second leg narrative
- Hospital network cascade — select from 11 Boston-area health systems with campus-level specificity
- Medical history autocomplete — tag-based input with abbreviation search (e.g. "HTN", "CHF")
- Address autocomplete via Google Places API (emergent transports only)
- Acknowledgment modal — users confirm AI draft review responsibility each session
- Mobile-first design with iOS zoom prevention

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **React 19** + **React Compiler** + **Tailwind CSS v4**
- **@anthropic-ai/sdk** — Claude Sonnet 4.6 for narrative generation
- **react-hook-form** — form state management (`useWatch` for React Compiler compatibility)
- **@googlemaps/js-api-loader** — Google Places address autocomplete
- **clsx** + **tailwind-merge** — conditional Tailwind class utilities

---

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- A [Google Maps API key](https://console.cloud.google.com/) with the **Places API** enabled (optional — address autocomplete only appears on emergent transports)

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/emiliootz/QuickChart.git
cd QuickChart

# 2. Install dependencies
npm install

# 3. Add your environment variables
cp .env.local.example .env.local
# Edit .env.local — see Environment Variables below

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key — used server-side for narrative generation |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Google Maps API key — enables address autocomplete on emergent transports |

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key-here
```

If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not set, the address field renders as a plain text input with no autocomplete.

---

## Usage

1. Fill in the form fields: unit number, transport type, scene, patient info, EMS assessment, mobility, and destination
2. Click **Generate Narrative**
3. The narrative streams in real time below the form
4. Click **Copy** to copy the full narrative to your clipboard
5. Paste directly into your PCR software
6. Optionally click **Generate Return Trip Narrative** to generate the second leg with scene and destination automatically swapped

---

## Project Structure

```
/
├── app/
│   ├── api/generate-narrative/route.ts   # Streaming POST endpoint (Anthropic SDK)
│   ├── layout.tsx                         # Root layout — Header + Acknowledgment modal
│   └── page.tsx                           # Home page
├── components/
│   ├── cards/                             # One component per form section
│   │   ├── UnitTransport.tsx              # Ambulance number + transport type
│   │   ├── Scene.tsx                      # Pickup location
│   │   ├── Patient.tsx                    # Demographics, complaint, transport reason
│   │   ├── EMSAssessment.tsx              # Vitals, ABC, skin, pain
│   │   ├── MobilityTransfer.tsx           # Mobility level + transfer method
│   │   ├── Destination.tsx                # Drop-off location
│   │   ├── AdditionalInfo.tsx             # Free-text notes
│   │   └── Generate.tsx                   # Submit button + narrative output
│   ├── forms/
│   │   └── PCRForm.tsx                    # Orchestrates all cards and hooks
│   ├── layout/
│   │   ├── Header.tsx                     # Sticky top nav with logo
│   │   └── Acknowledgment.tsx             # Session-gated disclaimer modal
│   ├── narrative/
│   │   └── NarrativeOutput.tsx            # Streaming output, copy, regenerate
│   └── ui/
│       ├── FormPrimitives.tsx             # Card, Field, inputCls shared primitives
│       ├── LocationPicker.tsx             # Reusable hospital cascade (Scene + Destination)
│       ├── MedHistory.tsx                 # Tag autocomplete for medical history
│       └── AddressAutocomplete.tsx        # Google Places address input
├── hooks/
│   ├── use-narrative-generation.ts        # AI generation lifecycle + status machine
│   ├── use-submit.ts                      # Form submission + return trip logic
│   ├── use-form-watchers.ts               # useWatch subscriptions + derived flags
│   └── use-clipboard.ts                  # Copy with navigator.clipboard fallback
└── lib/
    ├── anthropic.ts                       # Shared Anthropic SDK client instance
    ├── types.ts                           # StructuredFormData + GenerateRequest types
    ├── defaults.ts                        # Default (empty) form values
    ├── diagnoses.ts                       # Medical diagnosis list for MedHistory
    ├── cn.ts                              # clsx + tailwind-merge utility
    └── prompts/
        ├── formats.ts                     # System prompt (narrative rules + structure)
        ├── structured.ts                  # User prompt builder (form data → text)
        └── hospitals/                     # Hospital data split by network
            ├── index.ts                   # Barrel — HOSPITAL_SYSTEMS map + getCampusOptions
            └── *.ts                       # One file per health system
```

---

## Deployment

The app is deployed on Vercel. To deploy your own instance:

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add environment variables under **Settings → Environment Variables**:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)
4. If using Google Maps, add your Vercel deployment URL to the allowed referrers in the Google Cloud Console
5. Deploy — Vercel handles the rest

---

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm test` to verify all tests pass
4. Run `npm run build` to verify no TypeScript or build errors
5. Open a pull request with a clear description of the change
