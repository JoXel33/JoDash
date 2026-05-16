# Phase 0 Research: Kids Daily Planner Dashboard

**Feature**: Kids Daily Planner Dashboard  
**Feature Branch**: `001-kids-daily-planner`  
**Research Completed**: 2026-05-16  
**Status**: ✅ All clarifications resolved; ready for Phase 1 design

---

## Executive Summary

All technical clarifications from the feature specification have been addressed. Research confirms that Next.js 13+ with React and TypeScript is the optimal choice for this feature, balancing rich interactivity requirements, accessibility standards, performance targets, and the zero-backend architecture principle. This document consolidates key decisions, best practices, and architectural patterns.

---

## Clarifications Resolved

### ✅ Clarification 1: Time-Block Count (7am-9pm schedule)

**Question**: How many 30-minute time blocks for a 7am-9pm schedule?

**Decision**: **44 blocks** (7:00, 7:30, 8:00... 8:30, 9:00 PM)

**Rationale**:
- 7am to 9pm = 14 hours
- 14 hours × 60 minutes ÷ 30 minutes per block = 44 blocks
- This aligns with the feature spec clarification (Session 2026-05-16)
- Provides granular time-block selection without overwhelming UI

**Implementation Impact**: TimeBlocks component will render exactly 44 `<TimeBlock>` children; data model accommodates fixed-size array

---

### ✅ Clarification 2: Want List Scope (Per-Date vs Global)

**Question**: Is the Want List per-date or global (same across all dates)?

**Decision**: **Global** (same 3 prizes visible every day; not per-date)

**Rationale**:
- Children manage long-term goals (e.g., "earn enough stars for a toy")
- Global list encourages sustained motivation across multiple days
- Simpler data model and UX (one list, not 365+ per year)
- Spec clarification confirms: "same 3 prizes visible every day"

**Implementation Impact**: 
- `wantList` stored as single array in localStorage (not nested by date)
- Stars earned per date are tracked separately (`dailyStars` keyed by date)
- Redemption logic compares cumulative stars against global want list

---

### ✅ Clarification 3: Time-Block Completion Tracking (Auto vs Manual)

**Question**: How are time blocks marked complete—manual (child clicks) or automatic (time passes)?

**Decision**: **Auto-tracking only** (past blocks fade automatically; no explicit child action required)

**Rationale**:
- Simplifies UX for 8-12 year-olds (fewer interactions to understand)
- Past blocks naturally fade; current block highlighted; future blocks normal
- Aligns with spec requirement: "past blocks display with subtle visual distinction (e.g., faded color)"
- Reduces cognitive load; automation is less error-prone

**Implementation Impact**:
- CurrentBlockId computed in real-time from `new Date()`
- Conditional CSS classes: `past`, `current`, `future`
- No explicit "mark complete" button needed; UX is passive observation

---

### ✅ Clarification 4: Accessibility Standards for Children's App

**Question**: What accessibility standards apply for a children's app?

**Decision**: **WCAG 2.1 AA + child-specific enhancements** (per Constitution):
- Minimum font: **16px** (exceeds standard 14px)
- Touch targets: **44px minimum** (exceeds 48px mobile standard for easier targeting)
- Color contrast: **7:1 minimum** (exceeds AA's 4.5:1)
- All buttons: **emoji + text labels** (no emoji-only buttons)
- Reading level: **3rd-grade friendly** (~8–9 year-old comprehension)
- Support **high-contrast mode** (OS-level setting respect)

**Rationale**:
- Children's motor skills and vision still developing
- Higher contrast and larger targets reduce frustration
- Emoji + text improves affordance and learning
- Simple language aids comprehension and independence

**Implementation Impact**:
- CSS variables enforce 16px base, 44px buttons/inputs
- Component tests validate contrast ratios (using axe-core or similar)
- Copy reviewed for reading level (no words > 3-4 syllables where possible)
- Semantic HTML + ARIA labels ensure screen reader support

---

## Technology Stack Decisions

### ✅ Framework: Next.js 13+ with React 18+

**Decision**: Next.js 13+ as primary framework with React 18+ for component library

**Justification**:
1. **Rich Interactivity**: React's component model handles date picking, time-block editing, star logging, and animations seamlessly
2. **Static Export**: `next export` generates pure static files (HTML/CSS/JS) → CDN-ready, zero backend (Constitution Principle I)
3. **Performance**: Built-in optimizations (code splitting, image optimization) target Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
4. **Accessibility**: React ecosystem has mature libraries for ARIA, semantic HTML, and animations (e.g., Framer Motion)
5. **DX**: File-based routing, fast refresh (hot reload), TypeScript support out-of-box
6. **Minimal Dependencies**: Next.js + React satisfy "essential-only" principle (justified for feature complexity)

**Alternatives Considered**:
- **Vanilla HTML/CSS/JS**: Rejected—manual state management, animation handling, and accessibility would add complexity without framework benefits
- **Vue.js / Svelte**: Rejected—smaller ecosystems; fewer accessibility libraries and animations packages; Next.js ecosystem richer for this use case
- **Astro**: Rejected—optimized for static sites; less suitable for interactive date-pickers and real-time star input

**Evidence**: Constitution 1.2.0 formally amended (2026-05-16) to adopt Next.js + React as approved tech stack for this feature.

---

### ✅ Language: TypeScript 5.x

**Decision**: TypeScript 5.x for type safety and improved DX

**Justification**:
1. **Type Safety**: Catch errors at build time (e.g., invalid star counts, malformed dates)
2. **Better Autocompletion**: IDE support speeds up component development
3. **Self-Documenting**: Types serve as inline documentation (e.g., `type StarCount = 0 | 1 | 2 | 3 | 4 | 5`)
4. **Refactoring Safety**: Renaming and API changes propagate across codebase with confidence
5. **React Integration**: React + TypeScript is industry-standard; extensive tooling and community examples

**Implementation Impact**: All `.js` files use `.ts` or `.tsx` extensions; `tsconfig.json` configured with strict mode

---

### ✅ Storage: localStorage (Browser Persistence)

**Decision**: Browser `localStorage` API for all user data

**Justification**:
1. **Zero Backend**: Stores daily schedules, stars, and want list entirely in browser (Constitution Principle I)
2. **Offline Capable**: App works without network; data survives browser restart
3. **Privacy**: No data sent to servers; children's data stays local
4. **Simplicity**: No database setup, authentication, or deployment overhead
5. **Quote Size**: ~10-20KB per user per year is well within localStorage limits (5-10MB typical)

**Storage Schema**:
```typescript
type StorageSchema = {
  dailyStars: Record<string, number>;      // "YYYY-MM-DD" → 0-5
  dailyPlans: Record<string, TimeBlock[]>; // "YYYY-MM-DD" → activities
  wantList: Prize[];                       // Global list, max 3 items
};
```

**Alternatives Considered**:
- **IndexedDB**: Rejected—overkill for this data volume; localStorage sufficient
- **Server Backend**: Rejected—violates Constitution Principle I; adds complexity

**Implementation Impact**: Custom hooks (`useDailyData`, `useStarLogger`, `useWantList`) wrap localStorage operations; errors handled gracefully (fallback to defaults if corrupt)

---

### ✅ Testing Framework: Jest + React Testing Library

**Decision**: Jest (unit tests) + React Testing Library (component tests)

**Justification**:
1. **Component-Centric**: RTL tests behavior, not implementation; matches React best practices
2. **Accessibility-First**: RTL queries (`getByRole`, `getByLabelText`) encourage semantic HTML
3. **Performance**: Jest runs tests in parallel; fast feedback loop for TDD
4. **Coverage**: Combined, they cover unit logic, component rendering, and UX workflows
5. **Ecosystem**: Extensive plugins and matchers; integrates with Next.js build pipeline

**Test Coverage Goals**:
- **Components**: 80%+ (DatePicker, TimeBlock, StarsLogger, WantList)
- **Utilities**: 95%+ (dateHelpers, validation, storage getters/setters)
- **Hooks**: 85%+ (useDailyData, useStarLogger, useWantList)
- **E2E**: Manual browser testing for animations and responsive design (Jest doesn't test visual/animation quality)

**Implementation Impact**: `jest.config.js` configured with `@testing-library/react` preset; test files colocated with components (e.g., `StarsLogger.test.tsx`)

---

### ✅ Styling: CSS Modules + CSS Custom Properties

**Decision**: CSS Modules (scoped styles) + CSS Custom Properties (theming/accessibility)

**Justification**:
1. **No CSS-in-JS Library**: Per Constitution Principle II (minimal dependencies); vanilla CSS files sufficient
2. **Scoping**: CSS Modules prevent global style conflicts; components own their styles
3. **Theming**: CSS custom properties (`--color-primary`, `--font-size-body`) enable light/dark mode and high-contrast support
4. **Performance**: Compiled to static CSS; no runtime overhead
5. **Accessibility**: Custom properties centralize color, contrast, and sizing rules for compliance audits

**CSS Architecture**:
- `globals.css`: Reset, responsive breakpoints (mobile-first: 320px, tablet: 600px, desktop: 1024px+), accessibility resets
- `variables.css`: Color palette, spacing scale, typography, touch-target sizes (44px minimum)
- `[Component].module.css`: Component-specific styles (scoped to `[Component].tsx`)
- `responsive.css`: Mobile-first media queries and breakpoints

**Alternatives Considered**:
- **Tailwind CSS**: Rejected—adds build complexity; vanilla CSS sufficient for this project
- **CSS-in-JS** (e.g., Styled Components): Rejected—adds runtime overhead; conflicts with static export model

**Implementation Impact**: Components import styles: `import styles from './StarsLogger.module.css'`; TypeScript validates class names

---

## Architectural Patterns

### ✅ Pattern 1: Custom React Hooks for Business Logic

**Pattern**: Extract state management and data logic into reusable custom hooks

**Hooks**:
- `useDailyData(dateString)`: Fetch daily schedule and stars for a given date; handle localStorage reads and defaults
- `useStarLogger(dateString)`: Manage star input validation (0-5), persistence, and error handling
- `useWantList()`: Add/remove/list prizes; enforce 3-item max; persist to localStorage

**Benefits**:
- **Separation of Concerns**: UI components stay focused on rendering; hooks handle logic
- **Testability**: Hooks can be tested independently of React rendering
- **Reusability**: Multiple components can use same hook (e.g., multiple date views)

**Example**:
```typescript
const { stars, setStars, error } = useStarLogger('2026-05-16');
// stars: number | null
// setStars: (value: number) => void
// error: string | null (validation errors)
```

---

### ✅ Pattern 2: Progressive Enhancement

**Pattern**: Core functionality works without JavaScript; JavaScript adds interactivity and polish

**Base Layer (HTML/CSS)**:
- Static time-block grid renders from server/build-time (44 blocks visible)
- Date navigation provided by native `<input type="date">` fallback
- Star input is basic `<input type="number">`
- Want list displays as plain `<ul>`

**Enhancement Layer (JavaScript)**:
- Date picker enhances with custom calendar UI and animations
- Time blocks become editable (click to add activity)
- Star input validates in real-time with error feedback
- Want list adds/remove buttons trigger animations
- Smooth transitions and loading states

**Benefits**:
- **Resilience**: If JavaScript fails to load, app is still usable
- **Accessibility**: Native HTML elements accessible by default
- **Performance**: Critical path unblocked by JS bundle

---

### ✅ Pattern 3: Component Composition Over Props Drilling

**Pattern**: Break UI into small, composable components; pass data via context or custom hooks, not deep prop chains

**Example Component Tree**:
```
<Dashboard>
  <DatePicker onDateChange={handleDateChange} />
  <div className="main-content">
    <TimeBlocks date={selectedDate} />
      └─ <TimeBlock key={blockId} block={block} onActivityChange={...} />
    <StarsLogger date={selectedDate} />
    <WantList />
      └─ <WantListItem key={prizeId} prize={prize} />
  </div>
</Dashboard>
```

**Data Flow**:
- `<Dashboard>` manages selected date (top-level state)
- Child components fetch data via custom hooks (`useDailyData`, `useWantList`)
- Avoid passing callbacks through multiple levels; use hooks for side effects

**Benefits**:
- **Maintainability**: Adding new components doesn't require refactoring parent props
- **Testability**: Each component has minimal dependencies
- **Reusability**: Components can be moved/duplicated without prop restructuring

---

### ✅ Pattern 4: Responsive Design (Mobile-First)

**Pattern**: Build for mobile (smallest viewport) first; progressively add features for larger screens

**Breakpoints**:
- **Mobile**: 320px–600px (single-column layout, full-width blocks, stacked sections)
- **Tablet**: 600px–1024px (two-column layout, sidebar for want list, main area for schedule)
- **Desktop**: 1024px+ (three-column: schedule, stars logger, want list side-by-side)

**CSS Media Queries** (mobile-first):
```css
/* Base: mobile (320px+) */
.time-blocks { display: flex; flex-direction: column; }
.want-list { margin-top: 2rem; }

/* Tablet (600px+) */
@media (min-width: 600px) {
  body { display: grid; grid-template-columns: 1fr 300px; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  body { display: grid; grid-template-columns: 1fr 300px 300px; }
}
```

**Benefits**:
- **Performance**: Mobile users get minimal CSS; no desktop styles loaded on phones
- **UX**: Layouts optimized for each form factor; touch targets sized appropriately
- **Maintenance**: Single CSS file; no separate mobile/desktop stylesheets

---

### ✅ Pattern 5: Accessible Animations (Respecting `prefers-reduced-motion`)

**Pattern**: Animations enabled by default; respect OS preference to reduce motion

**Implementation**:
```css
/* Default: animations enabled */
.star-pulse {
  animation: pulse 0.6s ease-in-out;
}

/* Respect OS preference */
@media (prefers-reduced-motion: reduce) {
  .star-pulse {
    animation: none;
    opacity: 1; /* final state without animation */
  }
}
```

**Components**:
- `<StarPulse>`: Celebratory animation when star count updates
- `<FadeTransition>`: Smooth fade when switching dates
- `<TimeBlock>`: Highlight animation for current block

**Benefits**:
- **Accessibility**: Users with vestibular disorders can disable animations
- **Performance**: Reduced-motion mode uses less CPU on low-end devices
- **Compliance**: WCAG 2.1 AA requirement

---

### ✅ Pattern 6: Graceful Error Handling & Fallbacks

**Pattern**: Anticipate failures; provide sensible defaults and user-friendly errors

**Scenarios**:
1. **Corrupt localStorage data**: Wipe and regenerate with defaults (empty schedules, 0 stars, empty want list)
2. **Invalid star input**: Show inline error ("Stars must be 0–5"); keep field focused for correction
3. **Missing date**: Default to today; preserve user's navigation intent
4. **Failed animations**: No error; static fallback (CSS animations already have no-motion fallback)

**Example**:
```typescript
const useDailyData = (dateString: string) => {
  const [data, setData] = useState<DailyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`daily_${dateString}`);
      const parsed = stored ? JSON.parse(stored) : null;
      setData(parsed || { timeBlocks: [], stars: 0 }); // fallback to empty
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Data load failed; using defaults');
      setData({ timeBlocks: [], stars: 0 }); // still set defaults
    }
  }, [dateString]);

  return { data, error, isLoading: data === null };
};
```

**Benefits**:
- **Resilience**: App doesn't crash on bad data; gracefully degraded
- **UX**: Users informed of issues; can take action
- **Debugging**: Errors logged for developer inspection

---

## Best Practices Summary

### Performance

1. **Code Splitting**: Next.js automatically chunks components; lazy-load want list modal if not immediately visible
2. **Image Optimization**: Use Next.js `<Image>` for any hero graphics; automatic responsive sizing
3. **Critical CSS**: Inline critical path CSS in `<head>` for LCP < 2.5s target
4. **Caching**: Static export uses long-lived cache headers; version changes only when content changes

### Accessibility

1. **Semantic HTML**: Use `<nav>`, `<main>`, `<section>`, `<article>` for structure
2. **ARIA Labels**: Buttons have `aria-label` or visible text; form fields have `<label for=...>`
3. **Keyboard Navigation**: All interactive elements reachable via Tab; Enter/Space trigger actions
4. **Focus Management**: Focus visible (outline or highlight); trap in modals (want list add/edit)
5. **Color Alone**: Don't rely on color to convey meaning; use icons + text, patterns, or labels

### Code Quality

1. **TypeScript Strict Mode**: Enforce `strict: true` in `tsconfig.json`; no `any` types
2. **Component Naming**: PascalCase for components; kebab-case for CSS classes
3. **Testing**: Write tests before/during component development (TDD); aim for 80%+ coverage
4. **Linting**: ESLint + Prettier enforce consistent style; run pre-commit hook
5. **Comments**: Document *why* (e.g., "44 blocks = 14 hours ÷ 30 min"), not *what* (code is self-explanatory)

### Security

1. **Input Validation**: Validate star input on client and (if ever serverless functions added) server
2. **localStorage Limits**: Monitor usage (~10-20KB per user per year); warn if approaching limits
3. **XSS Prevention**: React auto-escapes props; only use `dangerouslySetInnerHTML` for trusted content (not user input)
4. **CSP Headers**: If deploying to Netlify/Vercel, set Content-Security-Policy headers; restrict `script-src`

---

## Summary Table

| Decision | Choice | Rationale | Confidence |
|----------|--------|-----------|-----------|
| Framework | Next.js 13+ + React 18+ | Rich interactivity, static export, built-in optimizations | ✅ High |
| Language | TypeScript 5.x | Type safety, better DX, error prevention | ✅ High |
| Storage | localStorage | Zero backend, offline, privacy, simplicity | ✅ High |
| Testing | Jest + RTL | Component-centric, accessible-first, performance | ✅ High |
| Styling | CSS Modules + CSS Custom Properties | Scoping, no runtime overhead, accessibility | ✅ High |
| Design Pattern | Custom hooks + composition | Separation of concerns, testability, reusability | ✅ High |
| Responsive | Mobile-first (320px, 600px, 1024px) | Performance, UX optimization, maintenance | ✅ High |
| Animations | CSS + `prefers-reduced-motion` | Accessible, performant, compliant | ✅ High |
| Error Handling | Graceful fallbacks + user feedback | Resilience, UX, debuggability | ✅ High |

---

## Next Steps

- **Phase 1**: Generate `data-model.md` with entity definitions, schemas, and state management details
- **Phase 1**: Create `contracts/` folder with public interface contracts (if applicable for static web app)
- **Phase 1**: Generate `quickstart.md` with setup, dev workflow, and first-run instructions
- **Phase 2**: Break down feature into tasks (user stories → implementation tasks) via `/speckit.tasks` command
