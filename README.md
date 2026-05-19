# Kids Daily Planner Dashboard

A child-friendly web application for managing daily schedules, earning and tracking stars, and maintaining a prize want list.

## Features

- **Daily Schedule View**: Display 44 time blocks (7am-9pm in 30-min intervals) with current time block highlighted
- **Date Navigation**: Select different dates to view or plan future schedules
- **Star Logger**: Log 0-5 stars earned each day with real-time validation
- **Want List**: Create and manage a max-3-item prize list with star costs
- **Activities**: Add brief descriptions to time blocks for better routine understanding
- **Animations**: Smooth, delightful animations throughout (respecting prefers-reduced-motion)
- **Persistence**: 100% client-side data persistence using browser localStorage
- **Responsive Design**: Works seamlessly on mobile (320px), tablet (600px), and desktop (1024px+)
- **Accessibility**: WCAG 2.1 AA compliance with child-specific enhancements

## Project Structure

```
app/                          # Next.js App Router
├── page.tsx                  # Main dashboard page
└── layout.tsx                # Root layout

components/                   # React components
├── DatePicker.tsx            # Date navigation UI
├── TimeBlocks.tsx            # Daily schedule grid
├── StarsLogger.tsx           # Star input component
├── WantList.tsx              # Prize list
└── Animation/                # Animation components

lib/                          # Business logic & utilities
├── storage/                  # localStorage helpers
│   ├── dailyStars.ts         # Star persistence
│   ├── dailyPlans.ts         # Schedule persistence
│   └── wantList.ts           # Want list persistence
├── hooks/                    # Custom React hooks
│   ├── useDailyData.ts       # Schedule & stars management
│   ├── useStarLogger.ts      # Star input validation
│   └── useWantList.ts        # Want list management
├── utils/                    # Utility functions
│   ├── dateHelpers.ts        # Date utilities
│   ├── timeBlocks.ts         # Time block utilities
│   ├── validation.ts         # Input validation
│   └── starsTracker.ts       # Star aggregation
└── types/                    # TypeScript definitions

styles/                       # CSS files
├── globals.css               # Global styles & reset
├── variables.css             # CSS custom properties
└── *.module.css              # Component-scoped styles

__tests__/                    # Jest tests
├── components/               # Component tests
├── lib/                      # Utility & hook tests
└── integration/              # End-to-end tests

public/                       # Static assets
```

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript 5.x
- **UI**: React 18+
- **Styling**: CSS Modules + CSS Custom Properties (no build-time CSS-in-JS)
- **Animations**: Framer Motion
- **Storage**: Browser localStorage (100% client-side)
- **Testing**: Jest + React Testing Library
- **Build**: Static export via `next export` (CDN-ready)
- **Code Quality**: ESLint + Prettier

## Development

### Prerequisites

- Node.js 18+ and npm 9+

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build static export
npm run export   # Generate /out/ folder
npm test         # Run Jest tests
npm run lint     # Run ESLint and Prettier check
npm run format   # Format code with Prettier
```

### Testing

```bash
npm test                 # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## Deployment

This project builds to a static HTML/CSS/JavaScript export suitable for CDN deployment:

```bash
npm run build
npm run export
# Artifacts generated in /out/ folder
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

WCAG 2.1 AA compliant with enhancements:
- 16px minimum font size
- 44px minimum touch targets
- 7:1 color contrast
- Keyboard navigation throughout
- Screen reader support
- Respects prefers-reduced-motion

## Data Persistence

All data is stored in browser localStorage with the following schema:

- `dailyStars`: Star counts by date
- `dailyPlans`: Time blocks and activities by date
- `wantList`: Global prize list (shared across dates)

## License

Internal use only
