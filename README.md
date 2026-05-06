# Agentic Risk Prevention — Interactive Prototype

A clickable prototype of an agentic risk-prevention workflow. Watch a simulated Claude Code CLI push a PR, trigger a Grafana risk-agent, and automatically remediate 4 predicted risks.

## How to run

```
npm i && npm run dev
```

Open http://localhost:5173 (or whichever port Vite picks).

## Demo script

1. Wait 3 seconds — the CLI auto-starts, types a command, and runs through a git push to PR creation.
2. The risk agent auto-triggers, scans the diff, then shows a clickable URL. Click it to open the Grafana risk-prevention page with 4 risk cards, 3 past incidents, and sparklines for 4 affected services.
3. Click **Fix all** on the Grafana page — focus snaps back to the terminal and 3 remediation steps execute live, finishing with a success box.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Advance to next phase (skip waits) |
| `R` | Reset demo to beginning |
| Click anywhere in terminal | Start the demo (idle state) |

## Stack

- Vite + React + TypeScript
- Plain CSS with CSS variables (no Tailwind, no UI kit)
- Fonts: Inter (Grafana page), JetBrains Mono (terminal), System (macOS chrome)
- Hand-rolled SVG sparklines
- Single `useReducer` state machine — no Redux/Zustand
- No real network — all data is local fixtures
