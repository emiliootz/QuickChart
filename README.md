# QuickChart — EMS PCR Narrative Generator

A mobile-first web app for EMS personnel to generate Medicare-compliant Patient Care Report (PCR) narratives using Claude AI. Fill out one structured form and receive a complete, legally defensible ambulance transport narrative.

---

## Features

- Structured form covering unit info, scene, patient, assessment, mobility, and destination
- AI-generated 9-paragraph PCR narrative
- Streaming output with animated cursor — narrative appears in real time
- One-click copy to clipboard
- Mobile-first design with iOS zoom prevention
- Deployed on Vercel with server-side API key handling

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **React 19** + **Tailwind CSS v4**
- **@anthropic-ai/sdk** — Claude Sonnet for narrative generation
- **react-hook-form** — form state management
- **clsx** + **tailwind-merge** — conditional class utilities

---

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/emiliootz/QuickChart.git
cd QuickChart

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.local.example .env.local
# Then edit .env.local and set:
# ANTHROPIC_API_KEY=sk-ant-...

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key — required for narrative generation |

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Usage

1. Fill in the form fields: unit number, transport type, scene, patient info, EMS assessment, mobility, and destination
2. Click **Generate Narrative**
3. The narrative streams in real time below the form
4. Click **Copy** to copy the full narrative to your clipboard
5. Paste directly into your PCR software

---

## Project Structure

```
/
├── app/
│   ├── api/generate-narrative/route.ts   # Streaming POST endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── forms/
│   │   ├── StructuredForm.tsx            # Main form with all fields
│   │   └── ModelSelector.tsx             # AI model toggle
│   ├── layout/Header.tsx
│   └── narrative/NarrativeOutput.tsx     # Streaming output display
├── hooks/
│   ├── useNarrativeGeneration.ts         # Fetch + stream accumulation
│   └── useClipboard.ts                   # Copy with fallback
└── lib/
    ├── anthropic.ts                       # Anthropic SDK client
    ├── types.ts                           # Shared TypeScript types
    └── prompts/
        ├── formats.ts                     # System prompt
        └── structured.ts                  # Prompt builder
```

---

## Deployment

The app is deployed on Vercel. To deploy your own instance:

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` under **Settings → Environment Variables**
4. Deploy — Vercel handles the rest

---

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm run build` to verify no TypeScript or build errors
4. Open a pull request with a clear description of the change
