# Quickstart: Kids Daily Planner Dashboard

**Feature**: Kids Daily Planner Dashboard  
**Feature Branch**: `001-kids-daily-planner`  
**Tech Stack**: Next.js 13+ | React 18+ | TypeScript | localStorage  
**Target**: Static export for CDN delivery  

---

## 🚀 Quick Setup

### Prerequisites

- **Node.js**: 18+ (includes npm)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with ESLint + Prettier extensions)

### Installation (5 minutes)

```bash
# Clone the repository
git clone https://github.com/your-repo/jodash.git
cd jodash

# Switch to feature branch
git checkout 001-kids-daily-planner

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
# You should see the Kids Daily Planner Dashboard
```

### Verify Installation

Open http://localhost:3000 in your browser. You should see:
- 📅 **Date Picker** (defaults to today)
- ⏰ **Time Blocks** grid (44 blocks from 7:00 AM to 9:00 PM)
- ⭐ **Stars Logger** input field (0–5 stars)
- 🎁 **Want List** section (currently empty)

All sections should be fully interactive. If you see these components, **installation successful!** ✅

---

## 💻 Development Workflow

### Running Locally

```bash
# Start dev server (hot reload enabled)
npm run dev
# Then open http://localhost:3000

# In another terminal, run tests (watch mode)
npm test -- --watch

# In another terminal, run linter (auto-fix)
npm run lint -- --fix
```

### Project Structure

```
app/
├── page.tsx              # Main dashboard page
├── layout.tsx            # Root layout
└── globals.css           # Global styles

components/
├── DatePicker.tsx        # Date navigation
├── TimeBlocks.tsx        # Schedule grid
├── StarsLogger.tsx       # Stars input
├── WantList.tsx          # Prize list
└── Animation/            # Animation components

lib/
├── storage/              # localStorage wrappers
├── hooks/                # Custom React hooks (state management)
├── utils/                # Helper functions
└── types/                # TypeScript types

__tests__/               # Jest test files (mirrors src structure)
```

### Key Files to Know

| File | Purpose | Notes |
|------|---------|-------|
| `app/page.tsx` | Main dashboard layout | Component imports + state setup |
| `components/TimeBlocks.tsx` | 44-block schedule grid | Core UI for daily schedule |
| `lib/hooks/useDailyData.ts` | Custom hook for schedule state | Manages localStorage sync |
| `lib/storage/dailyStars.ts` | Star persistence utility | Read/write localStorage |
| `lib/utils/dateHelpers.ts` | Date utilities | formatDate, getCurrentBlockId |
| `__tests__/components/StarsLogger.test.tsx` | Unit test example | React Testing Library patterns |

### Making Changes

**Example: Update time-block styling**

1. Open `components/TimeBlocks.module.css` (or create if missing)
2. Edit CSS (changes auto-reload on save)
3. Verify in browser

**Example: Add validation to stars input**

1. Edit `lib/hooks/useStarLogger.ts` (validation logic)
2. Write test in `__tests__/hooks/useStarLogger.test.ts`
3. Run `npm test -- useStarLogger.test.ts` to verify
4. Commit with message: `feat: enhance star validation`

---

## 📋 First-Run Guide

### What You Can Do Right Now

#### 1. View Today's Schedule
- Load the app (should show today's date)
- Scroll through all 44 time blocks (7:00 AM to 9:00 PM)
- Notice the **current time block** is highlighted

#### 2. Navigate Dates
- Click the **< Previous** button → view yesterday's schedule (empty)
- Click the **Next >** button → view tomorrow's schedule (empty)
- Click **Today** → return to today
- Click the date text → open date picker (if implemented)

#### 3. Add Activity to a Time Block
- Click any time block (e.g., "09:00 AM")
- An edit modal/input appears
- Type activity: "Breakfast" or "Math homework"
- Click **Save** or press Enter
- Activity persists in that block
- Reload the page → activity still there (stored in localStorage)

#### 4. Log Stars Earned
- Find the **⭐ Stars Earned Today** section
- Click the input field
- Enter a number: 0, 1, 2, 3, 4, or 5
- Confirm (Enter or blur)
- See confirmation message: "✓ 3 stars logged!"
- Try entering 10 → see error: "Stars must be between 0 and 5" ❌
- Reload the page → star count persists

#### 5. Add Items to Want List
- Find the **🎁 Prize Wish List** section
- Click **+ Add Prize**
- Enter prize name: "Sticker pack"
- Enter star cost: "20"
- Click **Save**
- Prize appears in the list
- Try adding 4th prize → see error: "Max 3 prizes reached" ❌
- Click **Remove** on any prize → it disappears

#### 6. Test on Mobile
- Open DevTools (F12)
- Toggle Device Toolbar (Ctrl+Shift+M)
- Choose "iPhone 12" or "Pixel 5"
- Verify layout adapts (single column, larger buttons)
- Tap buttons/inputs (ensure 44px touch targets)

#### 7. Test Accessibility
- Press **Tab** key repeatedly → navigate all interactive elements
- Each button/input gets keyboard focus (visible outline)
- **Shift+Tab** → navigate backward
- **Enter** → activate button
- Open DevTools → Lighthouse → Accessibility
- Should show 95+ accessibility score

---

## 🧪 Testing

### Run All Tests

```bash
npm test
# Output: number of tests passed/failed
```

### Run Tests for One File

```bash
npm test -- StarsLogger.test.tsx
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
# Auto-reruns on file changes
```

### Generate Coverage Report

```bash
npm test -- --coverage
# Shows % coverage for components, hooks, utilities
# Goal: 80%+ coverage
```

### Test Accessibility

```bash
# Run axe-core accessibility audit
npm install --save-dev @axe-core/react
npm test -- --testNamePattern="accessibility"
```

### Manual Testing Checklist

- [ ] Date picker navigates correctly
- [ ] Time blocks display all 44 blocks (no missing)
- [ ] Current time block is highlighted correctly
- [ ] Activity text persists on reload
- [ ] Star input accepts 0–5; rejects 6 or -1
- [ ] Star count persists on reload
- [ ] Can add up to 3 prizes to want list
- [ ] 4th prize rejected with error
- [ ] Can remove prizes from want list
- [ ] Want list persists on reload
- [ ] Layout responsive on mobile (< 600px)
- [ ] Layout responsive on tablet (600–1024px)
- [ ] Layout responsive on desktop (> 1024px)
- [ ] All text readable (16px+ font)
- [ ] All buttons 44px+ touch targets
- [ ] Can navigate entire app with keyboard (Tab, Shift+Tab)
- [ ] Screen reader announces time blocks, stars, prizes
- [ ] Animations smooth; no jank or layout shift
- [ ] Works offline (after first load)
- [ ] Dark mode respected (if OS preference set to dark)

---

## 🔨 Build & Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# This runs:
# 1. TypeScript compilation (checks for errors)
# 2. Next.js build (bundles, optimizes)
# 3. Static export (generates /out folder with HTML/CSS/JS)

# Output: /out/ folder ready for CDN
```

### Export (Static Site Generation)

```bash
# Already included in `npm run build`, but can run separately:
npm run export

# Generates: /out/index.html, /out/_next/*, /out/public/*
```

### Deploy to CDN

#### Option A: Netlify (Easiest)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy the /out folder
netlify deploy --prod --dir=out

# Get deployment URL (https://your-site.netlify.app)
```

#### Option B: Vercel (Next.js Official)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Auto-builds from Git on push
```

#### Option C: GitHub Pages

```bash
# Push to GitHub repo
git push origin 001-kids-daily-planner

# In GitHub Settings → Pages:
# 1. Select branch: main (or your branch)
# 2. Select folder: /docs (if using docs/) or root + /out/
# 3. Click "Save"

# Site available at: https://your-username.github.io/jodash
```

#### Option D: AWS S3 + CloudFront

```bash
# Upload /out folder to S3 bucket
aws s3 sync out/ s3://your-bucket-name/

# CloudFront distribution serves files with cache headers
# Set Cache-Control: public, max-age=31536000 for /out/_next/static/
```

### Verify Deployment

```bash
# Check site loads
curl -i https://your-deployed-site.com/

# Expected response: HTTP 200 OK, HTML content type
# Should see <script> tags for React + Next.js

# Run Lighthouse on deployed site
npx lighthouse https://your-deployed-site.com --output-path=lighthouse-report.html

# Goal: LCP < 2.5s, CLS < 0.1, INP < 200ms
```

---

## 🐛 Troubleshooting

### Issue: npm install fails

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Use different port
npm run dev -- -p 3001

# Then open http://localhost:3001
```

### Issue: localStorage data doesn't persist

**Solution**:
1. Check if localStorage is disabled in browser
2. Check if running in private/incognito mode (disabled in some browsers)
3. Open DevTools → Application → Storage → localStorage
4. Verify entries like `dailySchedule:2026-05-16` exist

### Issue: Styles look broken or not loading

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run dev
```

### Issue: TypeScript errors on build

**Solution**:
```bash
# Check tsconfig.json is correct
cat tsconfig.json

# Fix any type errors:
npm run type-check  # Shows all type errors
```

### Issue: Tests fail after changing component

**Solution**:
```bash
# Update test snapshots
npm test -- --updateSnapshot

# Or update specific test:
npm test -- StarsLogger.test.tsx --updateSnapshot
```

---

## 📚 Common Tasks

### Add a New Component

1. Create file: `components/MyNewComponent.tsx`
   ```typescript
   import styles from './MyNewComponent.module.css';
   
   export const MyNewComponent = () => {
     return <div className={styles.root}>Hello!</div>;
   };
   ```

2. Create styles: `components/MyNewComponent.module.css`
   ```css
   .root {
     padding: 1rem;
     background: var(--color-bg);
   }
   ```

3. Create test: `__tests__/components/MyNewComponent.test.tsx`
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { MyNewComponent } from '@/components/MyNewComponent';
   
   test('renders hello', () => {
     render(<MyNewComponent />);
     expect(screen.getByText('Hello!')).toBeInTheDocument();
   });
   ```

4. Use component in `app/page.tsx`:
   ```typescript
   import { MyNewComponent } from '@/components/MyNewComponent';
   
   export default function Home() {
     return <MyNewComponent />;
   }
   ```

### Add a New Custom Hook

1. Create file: `lib/hooks/useMyHook.ts`
   ```typescript
   import { useState } from 'react';
   
   export const useMyHook = () => {
     const [value, setValue] = useState<string>('');
     return { value, setValue };
   };
   ```

2. Create test: `__tests__/hooks/useMyHook.test.ts`
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   import { useMyHook } from '@/lib/hooks/useMyHook';
   
   test('hook works', () => {
     const { result } = renderHook(() => useMyHook());
     act(() => {
       result.current.setValue('hello');
     });
     expect(result.current.value).toBe('hello');
   });
   ```

3. Use hook in component:
   ```typescript
   import { useMyHook } from '@/lib/hooks/useMyHook';
   
   export const MyComponent = () => {
     const { value, setValue } = useMyHook();
     return <input value={value} onChange={(e) => setValue(e.target.value)} />;
   };
   ```

### Update Data Model

1. Edit `lib/types/index.ts` to add/change types
2. Update storage getters/setters in `lib/storage/*` if schema changed
3. Update hooks in `lib/hooks/*` to handle new fields
4. Update tests in `__tests__/*`
5. Add migration logic to `lib/storage/migrate.ts` if breaking change

### Deploy a Fix

```bash
# Make changes
git add .
git commit -m "fix: correct time block highlighting"

# Build & test
npm run build
npm test

# Deploy
npm run deploy  # or manually push to CDN
```

---

## 📖 Documentation

- **[spec.md](spec.md)**: Original feature specification (requirements, user stories)
- **[plan.md](plan.md)**: Implementation plan (tech context, architecture)
- **[research.md](research.md)**: Tech stack decisions, patterns, best practices
- **[data-model.md](data-model.md)**: Entity definitions, schemas, state management
- **[contracts/README.md](contracts/README.md)**: Public API contracts, deployment, compliance

---

## 🤝 Contributing

### Code Standards

- **TypeScript**: Strict mode; no `any` types
- **Naming**: PascalCase components; camelCase functions; kebab-case CSS classes
- **Testing**: Write tests for all components/hooks/utilities
- **Linting**: Run `npm run lint` before commit
- **Formatting**: Run `npm run format` before commit

### Commit Message Format

```
type(scope): short description

Longer explanation if needed.

Fixes #123  (if closing issue)
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples**:
- `feat(dashboard): add date picker`
- `fix(stars-logger): validate input correctly`
- `test(time-block): add edge case coverage`

### Pull Request Process

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes + commit with proper messages
3. Run tests: `npm test`
4. Run linter: `npm run lint -- --fix`
5. Build: `npm run build`
6. Push: `git push origin feature/my-feature`
7. Create PR on GitHub with description
8. Wait for CI checks to pass
9. Request review from team members
10. Merge after approval

---

## 🚨 Emergency Contacts

- **Bug Reports**: Open GitHub issue with reproduction steps
- **Security Issues**: Email security@your-domain.com (don't open public issue)
- **Performance Issues**: Include Lighthouse report + network throttling settings
- **Accessibility Issues**: Include screen reader name/version + reproduction steps

---

## 📞 Support

- **Docs**: Read files in `specs/001-kids-daily-planner/`
- **Code Examples**: Check `__tests__/` for component/hook usage patterns
- **Slack**: Post in #jodash-development channel
- **Office Hours**: [Schedule](your-calendar-link)

---

**Happy coding! 🎉**

Need help? Re-read [Troubleshooting](#-troubleshooting) or ask in team chat.
