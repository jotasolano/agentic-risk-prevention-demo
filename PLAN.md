# Agentic Risk Prevention — Prototype Implementation Plan

> Hand this file to **Claude Code** in a fresh repo. It contains everything needed to build the prototype end-to-end without further clarification. Work top-to-bottom; each phase ends with a runnable checkpoint.

---

## 0. What we're building (one paragraph)

A clickable prototype of an agentic risk-prevention workflow. The user sees a **simulated macOS desktop** containing two windows: a **terminal running a fake Claude Code CLI**, and a **browser** that, when the CLI emits a URL, opens an **ephemeral Grafana risk-prevention page** for the just-created PR. The user reviews 4 predicted risks, clicks **Fix all**, focus returns to the terminal, and the agent executes 3 remediation steps live. Everything is fake — no real git, no real backend — but the choreography, timing, and visual language must feel authentic.

Two surfaces, one stage:

| Surface | Lives in | Style |
|---|---|---|
| Simulated CLI (Claude Code) | Terminal window on the desktop | Monospace, ANSI-ish, Claude Code-style spinners and boxes |
| Risk Prevention Plan website | Browser window on the desktop | Grafana dark theme, dashboard-grade cards |

---

## 1. Tech stack & ground rules

- **Framework**: Vite + React + TypeScript. No SSR, no router library — a single `App.tsx` swaps which window is focused via state.
- **Styling**: Plain CSS with CSS variables. No Tailwind, no UI kit. We want pixel-level control over the Grafana look and the terminal look.
- **Fonts** (load via `<link>` in `index.html`):
  - **Inter** — UI text on the Grafana page (Grafana itself uses Inter; this is the one place Inter is correct)
  - **JetBrains Mono** — terminal, code, anything monospaced
  - **System** — macOS chrome (`-apple-system, BlinkMacSystemFont, "SF Pro Text"`)
- **Charts**: hand-rolled inline SVG sparklines. Do not pull a chart library — the data is fake and we want full control of the predicted-vs-current visual.
- **Icons**: inline SVGs in a single `Icon.tsx` component. No icon library.
- **State**: one `useReducer` in `App.tsx` driving the whole demo. No Redux, no Zustand.
- **Animations**: CSS transitions + `requestAnimationFrame` for the terminal typewriter. No animation library.
- **No real network**: everything is local fixtures.

### Hard rules

1. Never use `alert()`, `confirm()`, or `localStorage`.
2. Every clickable thing must do something — no dead buttons. If a button isn't part of the demo path, give it a believable hover state and a no-op handler that briefly shakes/flashes.
3. The whole prototype lives in **one browser tab**. The "browser window" inside the desktop is a faked Chrome chrome wrapping the Grafana page; it is not an iframe.
4. Reset button (top-right of desktop menu bar) returns to initial state at any time.

---

## 2. File & directory layout

Create exactly this structure on first pass:

```
/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── state.ts                 # reducer, types, initial state, demo timeline constants
    ├── styles/
    │   ├── tokens.css           # CSS variables: Grafana palette, terminal palette, spacing, type
    │   ├── reset.css            # tiny reset
    │   ├── desktop.css          # macOS shell, menu bar, dock, wallpaper
    │   ├── window.css           # generic window chrome (traffic lights, titlebar, resize)
    │   ├── terminal.css         # CLI styling
    │   ├── browser.css          # fake Chrome chrome
    │   └── grafana.css          # the risk prevention page
    ├── components/
    │   ├── Desktop.tsx          # wallpaper + menu bar + dock + windows
    │   ├── MenuBar.tsx          # top macOS menu bar with clock + reset
    │   ├── Dock.tsx             # bottom dock (cosmetic)
    │   ├── Window.tsx           # generic draggable-feeling window shell (no real drag needed; just focus + z-index)
    │   ├── TerminalWindow.tsx   # wraps Window with terminal chrome
    │   ├── BrowserWindow.tsx    # wraps Window with fake Chrome chrome (URL bar, tabs)
    │   ├── Terminal/
    │   │   ├── Terminal.tsx     # the CLI body
    │   │   ├── ClaudeBanner.tsx # the Claude Code welcome box
    │   │   ├── Prompt.tsx       # typed-in prompt line + simulated user input
    │   │   ├── StepLine.tsx     # ⏺ ●  spinner / check / dot lines
    │   │   ├── Box.tsx          # rounded ANSI-style box for results
    │   │   └── Typewriter.tsx   # progressive text reveal
    │   ├── Grafana/
    │   │   ├── RiskPlanPage.tsx       # whole page composition
    │   │   ├── GrafanaTopNav.tsx      # left rail icons + breadcrumb header
    │   │   ├── PRHeader.tsx           # PR #1247 banner + Fix all CTA
    │   │   ├── RiskCard.tsx           # one of the 4 risks
    │   │   ├── PastIncidentsList.tsx  # 3 similar past incidents
    │   │   ├── AffectedServices.tsx   # services + sparklines
    │   │   └── Sparkline.tsx          # SVG sparkline w/ current vs predicted
    │   └── Icon.tsx                   # inline SVG icon set
    └── data/
        ├── pr.ts                # PR metadata: number, title, author, files changed, branch, commits
        ├── risks.ts             # the 4 risks (id, severity, title, body, category, suggested_fix)
        ├── incidents.ts         # 3 past incidents (date, title, similarity %, link)
        ├── services.ts          # affected services + sparkline arrays
        └── timeline.ts          # ordered list of CLI events with delays
```

---

## 3. State machine (single source of truth)

Put this in `src/state.ts`. The whole demo is a 7-state finite machine:

```ts
type Phase =
  | 'idle'              // CLI shows banner + blinking prompt, browser closed
  | 'typing'            // user "types" the prompt (typewriter)
  | 'pushing'           // git steps animate
  | 'pr_created'        // PR success box renders
  | 'scanning'          // Grafana agent runs in CLI, emits URL
  | 'plan_open'         // browser window opens, Grafana page rendered
  | 'fixing'            // Fix all clicked → focus back to CLI, 3 remediation steps
  | 'done';             // final success state in CLI, browser still open
```

Transitions are **time-driven** for the most part (so a viewer can just watch), but the user can also click to **skip** to the next step at any time (`Space` or click the terminal). Required transitions:

- `idle → typing`: user clicks anywhere in the terminal OR presses any key. (Also auto-advance after 3s of inactivity so a passive viewer sees the demo run.)
- `typing → pushing`: when the typewriter for `push branch and create PR` finishes (~1.4s).
- `pushing → pr_created`: after the last git step check (~3.5s of staged steps).
- `pr_created → scanning`: 700ms after the PR success box.
- `scanning → plan_open`: when the user clicks the URL in the terminal. (Also auto-open after 4s.)
- `plan_open → fixing`: when user clicks **Fix all** on the Grafana page.
- `fixing → done`: after the last remediation check (~5s).

Provide a `dispatch({type:'reset'})` that returns to `idle` and clears all timers.

---

## 4. Visual system

### 4.1 Tokens (`tokens.css`)

Use these exact values. They give us Grafana-accurate dark mode plus a credible terminal.

```css
:root {
  /* Grafana dark palette (Grafana 10/11 OSS) */
  --gf-bg-canvas:        #111217;
  --gf-bg-primary:       #181b1f;
  --gf-bg-secondary:     #22252b;
  --gf-bg-elevated:      #2c3037;
  --gf-border-weak:      #2c3235;
  --gf-border-medium:    #3d444d;
  --gf-text-primary:     #ccccdc;
  --gf-text-secondary:   #8e8e8e;
  --gf-text-disabled:    #6e6e6e;
  --gf-text-link:        #6e9fff;

  /* Grafana semantic colors */
  --gf-blue:    #3871dc;     /* primary */
  --gf-blue-hi: #4f8af2;
  --gf-orange:  #ff9830;     /* warning / Grafana orange */
  --gf-red:     #e02f44;     /* critical */
  --gf-yellow:  #f2cc0c;
  --gf-green:   #56a64b;     /* ok */
  --gf-purple:  #8f3bb8;

  /* Severity scale used in risk cards */
  --sev-critical: var(--gf-red);
  --sev-high:     var(--gf-orange);
  --sev-medium:   var(--gf-yellow);
  --sev-low:      var(--gf-blue);

  /* Terminal palette (warm, slightly off-pure-black so it feels like a real terminal app) */
  --term-bg:        #1a1a1a;
  --term-bg-titlebar: #2b2b2b;
  --term-fg:        #e8e6e3;
  --term-dim:       #8a8784;
  --term-accent:    #d97757;     /* Claude orange — used sparingly for the ⏺ dot and banner */
  --term-success:   #7cb342;
  --term-error:     #ef5350;
  --term-prompt:    #6ec0ff;
  --term-cursor:    #e8e6e3;

  /* Type */
  --font-ui:   'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
  --font-sys:  -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;

  /* Radii & shadow */
  --radius-window: 10px;
  --radius-card:   2px;       /* Grafana panels are nearly square */
  --shadow-window: 0 30px 60px -15px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04);

  /* Wallpaper — Sonoma-ish gradient */
  --wallpaper:
    radial-gradient(ellipse at 20% 10%, #4a3a7a 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, #2d4a6e 0%, transparent 55%),
    linear-gradient(180deg, #1a1838 0%, #2a2050 100%);
}
```

### 4.2 Type scale

- Grafana page H1: 22px / 600
- Grafana page section title: 14px / 500, uppercase letter-spacing 0.04em — Grafana's panel-title vibe
- Grafana body: 13px / 400
- Terminal: 13px / 400 line-height 1.5
- macOS menu bar: 13px / 500 system font

### 4.3 Spacing

8px grid. Cards use 16px internal padding. Page max width 1280px; page side gutter 24px on the Grafana page.

---

## 5. macOS desktop shell

`Desktop.tsx` is a single full-viewport flex column:

1. **Menu bar** (top, 24px tall, frosted dark `rgba(0,0,0,0.45)` + `backdrop-filter: blur(20px)`).
   - Left: ` ` Apple logo, then bold "Terminal" or "Chrome" depending on which window is focused (track `state.focusedWindow`).
   - Right: a live clock (`HH:MM` updated every 30s), a small battery icon, a Wi-Fi icon, then a subtle **Reset demo** text button.
2. **Wallpaper area** (flex: 1, the `--wallpaper` background).
3. **Windows layer** — absolute-positioned children. Two windows:
   - Terminal window: starts focused, positioned roughly centered-left, 720×460.
   - Browser window: hidden (`display: none`) until phase ≥ `plan_open`. Positioned to the right and slightly down so both are visible. 1100×720.
4. **Dock** (bottom, 64px, frosted, centered).
   - Cosmetic only. Show Finder, Terminal (active dot), Chrome (active dot when browser open), Slack, VS Code, Settings. Use simple SVG glyphs or colored rounded squares with letters; do not waste time sourcing real icons.

Window focus: clicking a window brings it to top and updates `state.focusedWindow`. Both windows share the generic `Window.tsx` chrome:

- 10px corner radius, the `--shadow-window`, 1px translucent border.
- Title bar 28px tall with three traffic-light circles on the left (`#ff5f57`, `#febc2e`, `#28c840`) — purely cosmetic, hover should brighten them.
- The close (red) button calls `dispatch({type:'close_browser'})` for the browser window only; ignore for the terminal (or have it gently shake — wins charm).

---

## 6. Simulated CLI (the Claude Code experience)

This is the hero of the prototype. Make it feel real.

### 6.1 Terminal chrome (`TerminalWindow.tsx`)

- Window background `--term-bg`, titlebar `--term-bg-titlebar`.
- Titlebar text: `claude — -zsh — 100×30` centered, `--term-dim`, 12px monospace.
- Body: 16px padding, font `--font-mono`, 13px, `--term-fg`, `line-height: 1.55`. Always scrolled to bottom (`useEffect` to scroll on log change).

### 6.2 The Claude Code banner (`ClaudeBanner.tsx`)

Render this exactly once when the app loads, in `idle` state. Use a rounded ANSI-style box drawn with Unicode `╭ ─ ╮ │ ╰ ╯`:

```
╭───────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code!                      │
│                                                │
│   /help for help, /status for your current setup │
│                                                │
│   cwd: ~/work/grafana-platform                 │
╰───────────────────────────────────────────────╯
```

The `✻` glyph is in `--term-accent` (Claude orange). The rest is `--term-fg`. Pad each line so the right `│` aligns; do this with JS string padding, not by eyeballing.

### 6.3 Prompt + typewriter

Below the banner, render the prompt:

```
> █
```

`>` is `--term-prompt`, the cursor `█` blinks at 1Hz with a CSS animation (`@keyframes blink`).

When phase advances to `typing`, replace the cursor with a typewriter that types `push branch and create PR` at ~30ms/char, then pauses 300ms, then submits.

### 6.4 The git push sequence (`pushing` phase)

Render lines progressively. Each line uses one of these glyphs (Claude Code conventions):

- `⏺` — currently running (in `--term-accent`, with a 4-frame pulse animation)
- `●` — completed (in `--term-success`)
- `○` — pending (dim)

Each step appears as `⏺` first, sits for its duration, then turns into `●` and a sub-line of detail prints below in `--term-dim`.

Sequence (durations in ms; total ~3.5s):

| # | Line | Sub-line | Duration |
|---|------|----------|----------|
| 1 | `⏺ Staging changes` | `Adding 7 files (+312 / −48)` | 400 |
| 2 | `⏺ Creating commit` | `[feat/cache-layer 9a2f1c4] feat(cache): introduce write-through Redis cache for /api/search` | 500 |
| 3 | `⏺ Pushing to origin` | `remote: Resolving deltas: 100% (12/12), done.` | 900 |
| 4 | `⏺ Opening pull request` | `https://github.com/grafana/platform/pull/1247` | 800 |

After step 4, render a Claude Code-style success box (`pr_created` phase):

```
╭───────────────────────────────────────────────────────────────╮
│ ● Pull request opened                                          │
│                                                                │
│   #1247  feat(cache): introduce write-through Redis cache      │
│   feat/cache-layer → main                                      │
│   7 files changed · +312 −48                                   │
╰───────────────────────────────────────────────────────────────╯
```

### 6.5 The Grafana agent execution (`scanning` phase, ~2s)

700ms after the PR box, print:

```
⏺ grafana-risk-agent · auto-triggered by PR #1247
  Analyzing diff against past incidents and SLO history…
```

Animate a 3-frame brail spinner (`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`, swap every 80ms) next to that line. After ~1.6s replace with:

```
● grafana-risk-agent · 4 risks identified

  ╭───────────────────────────────────────────────────────────╮
  │  4 predicted risks · 3 similar past incidents              │
  │                                                            │
  │  Open the prevention plan:                                 │
  │  → https://ephemeral-pr1247.grafana-risk.app/plan          │
  ╰───────────────────────────────────────────────────────────╯

  Press the link, or run /fix-all to apply remediations now.
```

The URL line is rendered as a clickable element styled like a terminal hyperlink: `--term-prompt`, underlined on hover, cursor pointer. Clicking it dispatches `open_browser` and transitions to `plan_open`.

### 6.6 The remediation phase (`fixing`)

When the user clicks **Fix all** on the Grafana page, focus snaps back to the terminal (animate the browser z-index dropping below the terminal, or just bring terminal to front). Print:

```
⏺ grafana-risk-agent · applying remediation plan for PR #1247
```

Then run 3 sequential steps (each ~1.4s), same `⏺ → ●` pattern:

| # | Line | Sub-line printed on completion |
|---|------|-------------------------------|
| 1 | `⏺ Pushing safety changes to feat/cache-layer` | `Added cache-stampede guard, request coalescing, and 30s TTL ceiling. (+58 / −4 across 3 files)` |
| 2 | `⏺ Implementing alert rules with suggested thresholds` | `Created 4 alert rules: search-latency-p99, cache-hit-ratio, redis-evictions, error-rate-search-api` |
| 3 | `⏺ Wiring on-call escalation paths` | `Routed to team-search (primary) → team-platform (secondary). Owners derived from service graph.` |

Then a final `done` box:

```
╭───────────────────────────────────────────────────────────────╮
│ ● Remediation plan applied                                     │
│                                                                │
│   PR #1247 updated · 4/4 risks mitigated                       │
│   Predicted error rate: 4.8% → 0.3%                            │
│                                                                │
│   View updated plan: → https://ephemeral-pr1247.grafana-risk.app/plan │
╰───────────────────────────────────────────────────────────────╯
```

### 6.7 Skip & speed

- Pressing `Space` advances time 4× until the next phase boundary.
- Pressing `R` resets.
- Holding the terminal click does the same as Space (mobile-friendly).

---

## 7. The Grafana risk-prevention page

Lives inside `BrowserWindow.tsx`. The browser chrome:

- macOS-style traffic lights at top-left.
- A tab strip with one tab: `Risk Prevention · PR #1247 — Grafana`.
- A URL bar showing `🔒 ephemeral-pr1247.grafana-risk.app/plan`. Read-only; clicking it selects the text but does nothing else.
- Content area: full Grafana page below.

### 7.1 Grafana page layout

A two-column layout:

- **Left rail (56px)**: vertical icon nav, dark `--gf-bg-secondary`, with the Grafana logo at top and 6 nav glyphs below (Home, Dashboards, Explore, Alerting, Connections, Admin). Cosmetic. Active item: Alerting.
- **Main area** (`--gf-bg-canvas`): top breadcrumb row, then content.

Breadcrumb row (40px tall, bottom border `--gf-border-weak`):
`Home / Risk Prevention / PR #1247`  — last segment in `--gf-text-primary`, others in `--gf-text-secondary`.

### 7.2 Page sections (top-to-bottom)

#### A. PR header card (`PRHeader.tsx`)

A wide card spanning the content area. Left side:

- Small tag: `PULL REQUEST · GITHUB.COM/GRAFANA/PLATFORM`
- H1: `#1247  feat(cache): introduce write-through Redis cache for /api/search`
- Sub-row: avatar (initials circle "AS"), `antonio.solano` opened this PR · `feat/cache-layer → main` · `7 files changed`

Right side: a **risk summary cluster**:

- Big number `4` (60px, `--gf-orange`) with label `predicted risks` underneath.
- Smaller stat: `3 similar past incidents`.
- Primary button **Fix all** — solid `--gf-blue`, white text, 36px tall, generous horizontal padding, slight shadow. On hover: `--gf-blue-hi`. On click: dispatch `fix_all_clicked` and animate a brief pulse.
- Secondary button **Export plan** — ghost style, border `--gf-border-medium`. No-op (gentle shake on click).

#### B. Identified risks (`risks.ts` + `RiskCard.tsx` × 4)

Section title row: `IDENTIFIED RISKS` (uppercase 12px letter-spacing 0.06em, `--gf-text-secondary`) on the left; right side a small filter pill `All · Critical · High · Medium`.

Grid: 2 columns × 2 rows on desktop, 1 column on narrow.

Each card:

- Background `--gf-bg-primary`, border `1px solid --gf-border-weak`, radius `--radius-card`.
- Top accent stripe (3px) in the severity color.
- Severity pill (top-right): `CRITICAL` / `HIGH` / `MEDIUM` in the severity color background at 18% opacity, text in the severity color.
- Category label (top-left, 11px uppercase): e.g. `LATENCY`, `CACHE`, `RELIABILITY`, `OBSERVABILITY`.
- H3 title (15px, 600, `--gf-text-primary`).
- Body (13px, `--gf-text-secondary`, 3-line clamp).
- Footer row: a small "evidence" link (`📊 3 past incidents`), then two buttons: **Fix** (small primary) and **Details** (small ghost). Fix button on individual cards is a no-op that subtly checks itself off with a strikethrough on the title and a `✓ Fix queued` badge.

The 4 risks (in `data/risks.ts`):

```ts
export const RISKS = [
  {
    id: 'r1',
    severity: 'critical',
    category: 'CACHE',
    title: 'Cache stampede risk on cold start',
    body: 'New write-through cache has no request coalescing. On a cold Redis instance or eviction wave, /api/search will fan out N×concurrent-requests to Postgres. Past incident INC-2049 was caused by this exact pattern in /api/dashboards.',
    fix: 'Wrap fetch in singleflight + add 30s TTL ceiling',
  },
  {
    id: 'r2',
    severity: 'high',
    category: 'LATENCY',
    title: 'p99 search latency predicted to regress 4.2×',
    body: 'Synthetic replay against last 24h of /api/search traffic shows p99 moving from 142ms → 600ms during cache misses. Threshold for the search-api SLO (450ms p99) will be breached within ~6 minutes of deploy under typical Tuesday load.',
    fix: 'Add cache warmup on deploy + raise Redis maxmemory',
  },
  {
    id: 'r3',
    severity: 'high',
    category: 'RELIABILITY',
    title: 'No fallback when Redis is unreachable',
    body: 'New code path treats Redis as required. If the Redis cluster is unhealthy, /api/search returns 5xx instead of degrading to direct-DB reads. Past incidents INC-1832 and INC-1901 were both caused by hard Redis dependencies in hot paths.',
    fix: 'Add circuit breaker + direct-DB fallback',
  },
  {
    id: 'r4',
    severity: 'medium',
    category: 'OBSERVABILITY',
    title: 'New code path has no alerts or dashboards',
    body: 'cache-hit-ratio, eviction-rate, and stampede-coalesce-count are not exported. On-call cannot diagnose this surface during an incident. Two of the three similar past incidents took >40 min to mitigate primarily due to missing telemetry on the cache layer.',
    fix: 'Emit 3 metrics + create 4 alert rules with suggested thresholds',
  },
];
```

#### C. Past incidents (`PastIncidentsList.tsx`)

Section title: `SIMILAR PAST INCIDENTS` with right-aligned text `Pattern match: code-shape + service graph`.

A horizontal stack of 3 incident cards, narrower than risk cards:

- Date pill (top): e.g. `MAR 4, 2026`
- INC ID + title: `INC-2049 · Cache stampede on /api/dashboards after cold deploy`
- Two stat rows:
  - `Duration` `47m`
  - `Similarity` `91%` (with a tiny horizontal bar)
- Footer link: `View postmortem →` (no-op)

The 3 incidents (in `data/incidents.ts`):

```ts
export const PAST_INCIDENTS = [
  { id:'INC-2049', date:'MAR 4, 2026', title:'Cache stampede on /api/dashboards after cold deploy', durationMin:47, similarity:91 },
  { id:'INC-1901', date:'NOV 12, 2025', title:'Redis cluster failover, hard dependency caused 5xx burst', durationMin:62, similarity:84 },
  { id:'INC-1832', date:'SEP 28, 2025', title:'Search API p99 regression after caching change', durationMin:38, similarity:79 },
];
```

#### D. Affected services (`AffectedServices.tsx` + `Sparkline.tsx`)

Section title: `AFFECTED SERVICES` with right-aligned text `4 services · derived from service graph`.

A table-ish layout — 4 rows. Columns:

| Service | Owner | Current error rate | Predicted error rate | Sparkline |
|---|---|---|---|---|

- Service name: e.g. `search-api`, font weight 500.
- Owner: small grey text, e.g. `team-search`.
- Current error rate: a number like `0.12%` in `--gf-green`.
- Predicted error rate: a number like `4.8%` in `--gf-red`, with a small `▲ 38×` next to it.
- **Sparkline (the centerpiece)**:
  - 180×40 SVG.
  - Two lines: solid (current) in `--gf-green`, dashed (predicted) in `--gf-red`.
  - The predicted line should start where the current one ends and trend upward; the area under the predicted line gets a faint red gradient fill.
  - A vertical hairline at `x = 70%` labeled "deploy" in `--gf-text-secondary` at the top.

Services data:

```ts
export const SERVICES = [
  { name:'search-api',       owner:'team-search',   current:0.12, predicted:4.8,
    spark:[0.1,0.12,0.11,0.13,0.1,0.12,0.11,0.13,0.12,0.11,0.12,0.13,0.12,0.11,/*deploy*/4.8,4.6,5.1,5.3,5.0,5.2] },
  { name:'dashboard-api',    owner:'team-platform', current:0.08, predicted:1.2,
    spark:[0.07,0.08,0.09,0.07,0.08,0.08,0.09,0.07,0.08,0.07,0.08,0.09,0.08,0.07,/*deploy*/1.2,1.3,1.5,1.4,1.2,1.3] },
  { name:'redis-cache',      owner:'team-platform', current:0.01, predicted:2.1,
    spark:[0.01,0.01,0.02,0.01,0.01,0.01,0.02,0.01,0.01,0.01,0.02,0.01,0.01,0.01,/*deploy*/2.1,2.4,2.0,2.3,2.5,2.2] },
  { name:'auth-service',     owner:'team-identity', current:0.05, predicted:0.18,
    spark:[0.05,0.04,0.05,0.05,0.04,0.05,0.05,0.04,0.05,0.05,0.04,0.05,0.05,0.04,/*deploy*/0.18,0.16,0.19,0.17,0.18,0.16] },
];
```

#### E. Footer strip

A thin row at the bottom: `Plan generated 24s ago · grafana-risk-agent v0.4.1 · ephemeral · expires in 7 days · Resync`

---

## 8. Sparkline implementation notes

Don't reach for a chart lib. Hand-compute:

```ts
function path(values: number[], width = 180, height = 40, padding = 2) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = (width - 2 * padding) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((v - min) / range) * (height - 2 * padding);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
```

Render two `<path>`s — one for indices `[0, deployIdx]` (solid green), one for `[deployIdx, end]` (dashed red, `stroke-dasharray="3 3"`). Use a `<linearGradient>` for the red fill below the predicted segment.

---

## 9. Animations & timing

Build a `useTimeline()` hook that, given the current phase, schedules the next set of `setTimeout`s and clears them on phase change or unmount. Never use uncleaned timers — they will fire after a reset and corrupt state.

Phase durations (ms) — single source of truth in `data/timeline.ts`:

```ts
export const TIMING = {
  idleAutoStart: 3000,
  typingPerChar: 30,
  typingPause: 300,
  pushSteps: [400, 500, 900, 800],
  prBoxAppear: 250,
  scanPause: 700,
  scanDuration: 1600,
  fixingSteps: [1400, 1400, 1400],
  doneBoxAppear: 300,
};
```

CSS animations:

- Cursor blink: 1s steps(2) infinite.
- Spinner pulse on `⏺`: opacity 1 → 0.4 → 1 over 800ms ease-in-out infinite.
- Box / line appearance: `fadeUp` 180ms ease-out (translateY 4px → 0, opacity 0 → 1).
- Window open: scale 0.96 → 1 + opacity 0 → 1 over 220ms cubic-bezier(0.2, 0.8, 0.2, 1).

---

## 10. Accessibility & polish (do these or it looks AI-slop)

1. The terminal area must have `role="log"` and `aria-live="polite"` so step lines are announced.
2. The Reset button has visible focus ring.
3. All icon-only buttons have `aria-label`.
4. Respect `prefers-reduced-motion`: disable spinner pulse, snap typewriter to instant, keep transitions ≤ 80ms.
5. The clickable URL in the terminal is a real `<button>` styled to look like a hyperlink, not a div.

---

## 11. The mockup reference

The original brief references "the attached mockup" for the Grafana page. **Place any provided mockup image at `src/assets/mockup.png`** and match it as closely as possible — when the spec in section 7 conflicts with the mockup, the mockup wins for **layout and proportions**, but this spec wins for **copy, data, and interaction behavior**. If no mockup is supplied, build per spec; do not block.

---

## 12. Implementation order (do it in this order)

1. **Scaffold**: `npm create vite@latest . -- --template react-ts`, install nothing else, delete boilerplate, commit.
2. **Tokens & shell**: `tokens.css`, `reset.css`, `desktop.css`, `MenuBar`, `Dock`, `Window`. Verify the wallpaper, menu bar clock, and dock render. **Checkpoint: it looks like macOS at rest.**
3. **Terminal chrome + banner**: `TerminalWindow`, `Terminal`, `ClaudeBanner`, blinking prompt. No state machine yet — just the static idle look. **Checkpoint: it looks like a fresh Claude Code session.**
4. **State machine**: `state.ts` with the reducer and phase enum. Wire the auto-advance and the click-to-start. **Checkpoint: typing the prompt animates correctly.**
5. **Push sequence**: `StepLine`, `Box`, the 4 git steps, the PR success box. **Checkpoint: the CLI plays through to `pr_created` cleanly.**
6. **Scan + URL**: brail spinner, the result box, clickable URL. **Checkpoint: clicking the URL dispatches `open_browser`.**
7. **Browser shell**: `BrowserWindow` with Chrome chrome, opens with the scale animation, can be closed. **Checkpoint: opening and closing the browser feels right.**
8. **Grafana page top half**: top nav, breadcrumb, PR header card, Fix all CTA. **Checkpoint: page header renders, Fix all dispatches.**
9. **Risk cards**: `RiskCard` × 4 with full styling, severity stripes, fix queue interaction. **Checkpoint: cards look like Grafana panels.**
10. **Past incidents + affected services + sparklines**: `Sparkline` is the trickiest piece — get the deploy-line + predicted-fill right. **Checkpoint: the page is feature-complete.**
11. **Remediation phase**: `fixing` flow back in the terminal, focus switch animation, 3 step lines + final box. **Checkpoint: full demo runs end-to-end.**
12. **Polish pass**: reduced-motion, focus rings, hover states, the small shakes for no-op buttons, the live clock, the Reset behavior. **Checkpoint: it feels designed, not generated.**
13. **README**: how to run (`npm i && npm run dev`), the demo script (3 sentences), the keyboard shortcuts.

Every checkpoint = a commit. Don't pile up uncommitted work.

---

## 13. Things to deliberately not do

- No real Redux, Zustand, React Query, Tailwind, Radix, shadcn, MUI, framer-motion, recharts, ANSI parser libs, terminal emulator libs.
- No real router. The browser inside the desktop is purely visual; the URL bar is text.
- No real backend, websockets, or fetch. Everything is in-memory.
- No tests for the prototype. This is throwaway demo code; spend the time on the visuals instead.
- No dark/light toggle. Dark only — Grafana lives in dark mode and so do terminals.
- No mobile responsiveness below 1024px. It's a desktop demo on a desktop. Above 1280px, center the desktop area; below, allow horizontal scroll.

---

## 14. Acceptance criteria (definition of done)

A reviewer should be able to:

1. Run `npm i && npm run dev`, open the page, and within 3 seconds see the demo start on its own.
2. Watch the CLI animate through `git push → PR created → 4 risks identified → URL`.
3. Click the URL and see the browser window animate in over the desktop, displaying a Grafana-styled page that is visually plausible as a real Grafana surface (someone glancing at it should not be sure if it's real).
4. See 4 risk cards, 3 past incidents, and 4 services with two-tone sparklines.
5. Click **Fix all**, watch focus return to the terminal, and see 3 remediation steps complete and a final success box.
6. Click **Reset demo** in the menu bar at any point and return cleanly to `idle`.
7. The whole experience runs at 60fps on a mid-range laptop with no console errors.

If all 7 are true, ship it.
