# Therapeutic Modalities Guide

A comprehensive digital reference tool for mental health counselors covering 11 evidence-based therapy approaches with case conceptualization frameworks, therapeutic questions, and printable worksheets.

## Features

- **11 Modality Pages** — ACT, Adlerian, CBT, DBT, EFT, EMDR, IFS, MI, Narrative, Psychodynamic, SFBT
- **2,200+ Therapeutic Questions** — Organized across self-awareness, counseling, Gestalt, humanistic, and crisis/safety banks
- **Compare Lenses Matrix** — Side-by-side comparison of assessment, maintaining factors, change targets, and interventions
- **Fillable Worksheets** — Case conceptualization templates with localStorage persistence
- **AI Case Formulation** — Generate multi-lens formulations powered by Claude API
- **Personal Toolkit** — Star and save favorite questions, modalities, and worksheets
- **Session Companion** — Floating panel for quick question access during sessions
- **Question of the Day** — Date-based daily question on the homepage
- **Dark Mode** — Full light/dark theme support
- **Responsive** — Optimized for desktop, tablet, and mobile

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Shadcn/ui
- **Backend:** Express.js (production server)
- **AI:** Anthropic Claude API (optional, for AI Formulation feature)
- **Routing:** Wouter
- **State:** React Context + localStorage

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Enables the AI Case Formulation feature. Without it, the feature shows setup instructions. |

## Project Structure

```
client/
  src/
    components/     # Shared components (Layout, SessionCompanion, UI)
    contexts/       # React contexts (Theme, Favorites)
    data/           # JSON data (modalities, questions, worksheets)
    pages/          # Page components
server/
  index.ts          # Express production server + AI endpoint
shared/
  const.ts          # Shared constants
```

## License

MIT
