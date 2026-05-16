<!--
SYNC IMPACT REPORT
==================
Version Update: 1.0.0 → 1.1.0 (MINOR: Added storage requirements for daily stars and time-block planning)
Ratified: 2026-05-16
Last Amended: 2026-05-16

Changes:
- Updated Technical Constraints: Added localStorage schema for daily star tracking and 30-minute planning blocks
- Clarified: Time-block structure (7am-9pm in 30-minute increments)
- No principle changes; storage model aligns with Principle I (Zero-Backend) and II (Minimal Dependencies)

Templates Requiring Review:
  - spec-template.md (✅ scope now includes time-planner and star persistence)
  - tasks-template.md (✅ add data persistence and UI interaction tasks)
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

- **Language**: HTML5, CSS3, vanilla JavaScript (ES2015+) only unless consensus agrees otherwise
- **No Build Tool Required**: Direct browser imports or simple concatenation; avoid Webpack, Rollup, or similar if possible
- **Package Manager**: Optional—prefer CDN links (e.g., unpkg, jsDelivr) for small, stable libraries
- **Storage**: localStorage only (no backend DB); structured JSON schema for persistence
- **Externals**: Third-party APIs (weather, maps, etc.) via fetch with proper CORS handling

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

**Want List** (up to 3 prizes with star costs)
```
wantList: [
  { id: 1, name: "Toy", starCost: 5 },
  { id: 2, name: "Game", starCost: 10 },
  { id: 3, name: "Book", starCost: 3 }
]
```

## Development Workflow

1. **Simple Setup**: Clone, open HTML in browser. No npm install or build step required.
2. **File Structure**: Flat or simple hierarchy—avoid deep nesting. CSS in `css/`, JS in `js/`, assets in `assets/`.
3. **Testing**: Manual browser testing preferred for UI; unit tests optional but MUST not introduce heavy frameworks.
4. **Documentation**: Inline comments for non-obvious logic. README explains feature overview and API usage.
5. **Deployment**: Commit HTML/CSS/JS directly. Push to Git; CD pipeline copies to CDN/static host.

## Governance

This constitution supersedes all prior design assumptions. Amendments require a consensus discussion and MUST include:

1. Rationale for change (principle conflict, performance discovery, compatibility issue)
2. Affected deliverables and dependencies (plan, spec, tasks)
3. Approval from all contributors before merge

Compliance is verified at code review: every PR MUST cite which principle(s) it upholds. Complexity claims MUST be justified against Principle II (Minimal Dependencies) and Principle V (Performance targets).

**Version**: 1.1.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
