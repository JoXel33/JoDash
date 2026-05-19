<!--
SYNC IMPACT REPORT
==================
Version Update: 1.1.0 → 1.2.0 (MINOR: Amended to adopt Next.js + React as approved tech stack)
Ratified: 2026-05-16
Last Amended: 2026-05-16

Amendment Rationale:
- Kids Daily Planner feature requires rich interactivity (date selection, time-block editing, real-time state updates)
- Next.js provides: Built-in optimizations (LCP < 2.5s target), SSG for static delivery, built-in routing, superior DX
- React ecosystem enables: Reusable component library aligned with whimsical design, easier accessibility (aria, semantic), animation libraries (Framer Motion)
- Single-deployment model maintained: Next.js exports static HTML/CSS/JS via `next export`; zero backend dependency preserved
- Minimal Dependencies reframed: Dependencies are React/Next.js core (justified for feature complexity); avoid additional UI libraries

Principles Amended:
- II. Minimal Dependencies → Updated to allow Next.js/React as justified tech foundation; no additional CSS frameworks or UI libs beyond Next.js built-ins
- IV. Single-Deployment Model → Clarified: Uses Next.js static export (`next export`) for CDN-ready delivery

Templates Updated:
  - Technical Constraints section (added Next.js/React specifics)
  - Development Workflow (added npm/build step, but emphasized static export)
-->

# JoDash Constitution

## Core Principles

### I. Zero-Backend Architecture
Static-first design with no server-side processing required. Client-side rendering and logic only. All data delivery via static files, APIs (external), or browser storage. This eliminates server complexity, deployment risk, and operational overhead while enabling global CDN distribution.

### II. Minimal Dependencies
Intentional, essential-only third-party libraries. Prefer browser built-ins (Fetch, DOM APIs, Web Components, localStorage) over frameworks. Every dependency must justify its purpose and size cost. No "nice-to-have" packages. Security and maintenance burden must be evaluated at import time.

### III. Progressive Enhancement
Core functionality MUST work without JavaScript enabled. HTML structure provides semantic content. CSS handles presentation. JavaScript enhances interactivity and performance. No feature gates behind bundle size or runtime requirements. Graceful degradation across browsers and network conditions (offline-first where applicable).

### IV. Single-Deployment Model
Deliverable is a static file bundle ready for any CDN or static host. No build pipeline complexity (avoid Webpack/Vite if vanilla JS/HTML suffices). Long-lived cache headers on immutable assets. Version changes only when content changes. No runtime configuration or environment variables required beyond deployment parameters (e.g., API endpoints if needed).

### V. Accessibility & Performance
WCAG 2.1 AA compliance mandatory. Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms. Mobile-first responsive design. Fast First Contentful Paint via optimized critical path. Unminified code preferred for maintainability unless performance testing proves otherwise.

## Technical Constraints

- **Language**: TypeScript + JSX (React components)
- **Framework**: Next.js 13+ with static export (`next export` for CDN delivery)
- **Primary Dependencies**: React 18+, Next.js 13+ (justified as foundation for rich interactivity); avoid additional UI frameworks (no Ant Design, Material-UI, etc.)
- **Build Tool**: npm/Node.js required for development; outputs static HTML/CSS/JS bundle via `next export`
- **Package Manager**: npm (or yarn); dependencies must be reviewed for justification
- **Storage**: localStorage for client-side persistence (no backend DB required)
- **Testing**: Jest + React Testing Library for component testing; manual browser testing for UX/animations
- **Deployment**: Static export via `next export` outputs to `/out/` folder; ready for any CDN or static host (Vercel, Netlify, S3, GitHub Pages, etc.)

### Data Schema (localStorage)
**Daily Stars**
```
dailyStars: {
  "YYYY-MM-DD": <number 0-5>,
  ...
}
```

**Daily Plan** (30-minute blocks, 7am-9pm = 44 blocks)
```
dailyPlans: {
  "YYYY-MM-DD": [
    { blockId: 0, time: "07:00", activity: "" },   // 7:00am
    { blockId: 1, time: "07:30", activity: "" },   // 7:30am
    ...
    { blockId: 43, time: "21:00", activity: "" }   // 9:00pm (last block starts)
  ],
  ...
}
```

**Want List** (up to 3 prizes with star costs, GLOBAL)
```
wantList: [
  { id: 1, name: "Toy", starCost: 5 },
  { id: 2, name: "Game", starCost: 10 },
  { id: 3, name: "Book", starCost: 3 }
]
```

## Development Workflow

1. **Setup**: Clone, run `npm install`, then `npm run dev` to start local development server (http://localhost:3000)
2. **Development**: Edit React components in `app/` or `components/` directories; hot-reload on save
3. **File Structure**: Next.js App Router convention—pages in `app/` dir, shared components in `components/`, utilities in `lib/`, styles in `styles/`
4. **Testing**: Unit tests via `npm test` (Jest); manual browser testing for UI/animations; test results must be reproducible
5. **Build & Export**: `npm run build && npm run export` generates static `/out/` folder ready for deployment
6. **Deployment**: Upload `/out/` contents to CDN/static host; no Node.js runtime required on production server
7. **Documentation**: README explains feature overview, setup instructions, and API structure

## Governance

This constitution supersedes all prior design assumptions. Amendments require a consensus discussion and MUST include:

1. Rationale for change (principle conflict, performance discovery, compatibility issue, tech stack justification)
2. Affected deliverables and dependencies (plan, spec, tasks)
3. Approval from all contributors before merge

Compliance is verified at code review: every PR MUST cite which principle(s) it upholds. Complexity claims MUST be justified against Principle II (Minimal Dependencies, reframed for Next.js) and Principle V (Performance targets).

**Amendment Process**: Tech stack decisions are locked at constitution amendment time. Future requests to add frameworks (Vue, Svelte, etc.) require new constitution amendment.

**Version**: 1.2.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
