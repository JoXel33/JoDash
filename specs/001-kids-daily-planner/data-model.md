# Phase 1: Data Model & State Management

**Feature**: Kids Daily Planner Dashboard  
**Feature Branch**: `001-kids-daily-planner`  
**Design Completed**: 2026-05-16  
**Status**: ✅ Ready for implementation

---

## Executive Summary

This document defines the data structures, state management patterns, and persistence layer for the Kids Daily Planner Dashboard. All data is stored in browser `localStorage`; no backend database is required. The model is designed for simplicity, offline-first capability, and child-friendly UX.

---

## Core Entities

### 1. TimeBlock

Represents a single 30-minute time slot in the daily schedule (7:00 AM – 9:00 PM; 44 blocks total).

**TypeScript Type**:
```typescript
type TimeBlock = {
  blockId: number;           // 0–43 (44 blocks: 7:00 AM–9:00 PM)
  time: string;              // "HH:MM" (e.g., "07:00", "14:30")
  activity: string;          // User-entered activity description (e.g., "Math homework", "Lunch")
  completed?: boolean;       // [Future] Explicit completion marker (not MVP; future enhancement)
};
```

**Example**:
```typescript
{
  blockId: 5,
  time: "09:00",
  activity: "Breakfast"
}
```

**Validation Rules**:
- `blockId`: Integer, 0 ≤ blockId ≤ 43
- `time`: Valid HH:MM format (24-hour); must align with 30-min intervals
- `activity`: String, 0–150 characters (short description)

**State Transitions**:
- Created: When user adds an activity to a block
- Updated: When user edits activity text
- Deleted: When user clears activity (sets to empty string, not removed from array)

---

### 2. DailySchedule

The complete schedule for a specific date: all 44 time blocks plus metadata.

**TypeScript Type**:
```typescript
type DailySchedule = {
  date: string;              // "YYYY-MM-DD" (e.g., "2026-05-16")
  timeBlocks: TimeBlock[];    // Always 44 blocks, one per 30-min interval
  createdAt: number;         // Unix timestamp (for analytics/debug)
  updatedAt: number;         // Unix timestamp (last modified)
};
```

**Example**:
```typescript
{
  date: "2026-05-16",
  timeBlocks: [
    { blockId: 0, time: "07:00", activity: "" },
    { blockId: 1, time: "07:30", activity: "" },
    // ... 42 more blocks
    { blockId: 43, time: "21:00", activity: "" }
  ],
  createdAt: 1715869200000,
  updatedAt: 1715869500000
}
```

**Invariants**:
- `timeBlocks` always has exactly 44 entries (no gaps, no duplicates)
- `blockId` is sequential: 0, 1, 2, ..., 43
- `updatedAt ≥ createdAt`

---

### 3. DailyStars

Daily earned stars for a specific date (0–5 scale).

**TypeScript Type**:
```typescript
type DailyStars = {
  date: string;              // "YYYY-MM-DD"
  starCount: number;         // 0 ≤ starCount ≤ 5
  recordedAt: number;        // Unix timestamp when logged
};
```

**Example**:
```typescript
{
  date: "2026-05-16",
  starCount: 4,
  recordedAt: 1715869800000
}
```

**Validation Rules**:
- `starCount`: Integer, 0 ≤ starCount ≤ 5
- Invalid inputs rejected with user-friendly error: "Stars must be between 0 and 5"

---

### 4. Prize

A single item on the child's Want List: name and star cost.

**TypeScript Type**:
```typescript
type Prize = {
  id: string;                // Unique identifier (UUID or timestamp-based)
  name: string;              // Prize name (e.g., "Sticker pack", "Video game")
  starCost: number;          // Stars required to "unlock" this prize (≥ 0)
  addedAt: number;           // Unix timestamp when added to list
};
```

**Example**:
```typescript
{
  id: "prize-1715869200000",
  name: "Sticker pack",
  starCost: 20,
  addedAt: 1715869200000
}
```

**Validation Rules**:
- `name`: String, 1–50 characters (no HTML, sanitized)
- `starCost`: Integer, starCost ≥ 0 (no upper limit, but reasonable UI hint: < 1000)
- `id`: Unique across entire want list (enforced by storage layer)

---

### 5. WantList

Collection of prizes (max 3 items), representing the child's reward goals.

**TypeScript Type**:
```typescript
type WantList = {
  prizes: Prize[];           // Array of Prize objects
  totalStars?: number;       // [Optional] Cached sum of starCosts (computed on read)
};
```

**Example**:
```typescript
{
  prizes: [
    { id: "prize-1", name: "Sticker pack", starCost: 20, addedAt: 1715869200000 },
    { id: "prize-2", name: "Video game", starCost: 50, addedAt: 1715869300000 },
    { id: "prize-3", name: "Toy robot", starCost: 100, addedAt: 1715869400000 }
  ],
  totalStars: 170
}
```

**Invariants**:
- `prizes.length ≤ 3` (enforced at add time)
- All prize IDs unique
- WantList is global (same across all dates)

---

## localStorage Schema

All data persists in browser `localStorage` under specific keys. Structure is flat with minimal nesting for reliability and debugging.

### Storage Keys

```typescript
// Daily schedule per date
`dailySchedule:${dateString}`  // e.g., "dailySchedule:2026-05-16"
// Value: JSON.stringify(DailySchedule)

// Daily stars per date
`dailyStars:${dateString}`     // e.g., "dailyStars:2026-05-16"
// Value: JSON.stringify(DailyStars)

// Global want list (not date-specific)
`wantList`
// Value: JSON.stringify(WantList)

// App metadata (version, migration info)
`appMetadata`
// Value: JSON.stringify({ version: "1.0.0", lastMigration: 1715869200000 })
```

### Storage Limits & Cleanup

**Estimated Usage per Year**:
- Daily Schedules: 365 dates × ~2KB per schedule ≈ 730 KB
- Daily Stars: 365 dates × ~100B per star entry ≈ 36 KB
- Want List: 1 global list × ~1KB ≈ 1 KB
- **Total**: ~767 KB (well within 5–10 MB typical localStorage limit)

**Cleanup Strategy** (future enhancement):
- Archive schedules older than 1 year (compress or move to IndexedDB)
- Prompt user if usage approaches 80% of limit

---

## State Management Pattern

React custom hooks manage all state, hiding localStorage complexity from UI components.

### Hook: `useDailyData(dateString)`

Fetches daily schedule and stars for a given date; handles creation of defaults if missing.

**Signature**:
```typescript
type UseDailyDataReturn = {
  schedule: DailySchedule | null;
  stars: DailyStars | null;
  isLoading: boolean;
  error: string | null;
  updateActivity: (blockId: number, activity: string) => void;
  updateStars: (starCount: number) => void;
};

const useDailyData = (dateString: string): UseDailyDataReturn => {
  // Implementation: read from localStorage, handle errors, persist on update
};
```

**Behavior**:
1. On mount or date change: fetch `dailySchedule:${dateString}` and `dailyStars:${dateString}`
2. If missing: create defaults (44 empty time blocks, 0 stars)
3. On `updateActivity(blockId, activity)`: update block and persist
4. On `updateStars(starCount)`: validate (0–5) and persist; throw error if invalid

**Example Usage**:
```typescript
const DateViewComponent = ({ dateString }) => {
  const { schedule, stars, updateActivity } = useDailyData(dateString);

  if (!schedule) return <div>Loading...</div>;

  return (
    <div>
      <h2>Schedule for {dateString}</h2>
      {schedule.timeBlocks.map(block => (
        <TimeBlock
          key={block.blockId}
          block={block}
          onActivityChange={(activity) => updateActivity(block.blockId, activity)}
        />
      ))}
      <p>Stars today: {stars?.starCount ?? 0}</p>
    </div>
  );
};
```

---

### Hook: `useStarLogger(dateString)`

Manages star input validation and persistence.

**Signature**:
```typescript
type UseStarLoggerReturn = {
  starCount: number | null;
  setStarCount: (value: number) => void;
  error: string | null;
  isValid: boolean;
};

const useStarLogger = (dateString: string): UseStarLoggerReturn => {
  // Implementation: validate 0–5, persist, manage error state
};
```

**Validation Logic**:
- Input must be integer
- Input must be in range [0, 5]
- Non-numeric or out-of-range inputs trigger `error` state
- User sees error message; field doesn't update until valid value entered

**Example Usage**:
```typescript
const StarsLoggerComponent = ({ dateString }) => {
  const { starCount, setStarCount, error, isValid } = useStarLogger(dateString);

  return (
    <div>
      <label htmlFor="stars-input">⭐ Stars Earned Today:</label>
      <input
        id="stars-input"
        type="number"
        min="0"
        max="5"
        value={starCount ?? ''}
        onChange={(e) => setStarCount(Number(e.target.value))}
        aria-describedby={error ? 'stars-error' : undefined}
      />
      {error && <p id="stars-error" role="alert">{error}</p>}
      {isValid && starCount !== null && <p>✓ {starCount} stars logged!</p>}
    </div>
  );
};
```

---

### Hook: `useWantList()`

Manages global want list: add, remove, fetch prizes.

**Signature**:
```typescript
type UseWantListReturn = {
  wantList: WantList | null;
  isLoading: boolean;
  error: string | null;
  addPrize: (name: string, starCost: number) => void;
  removePrize: (prizeId: string) => void;
  canAddMore: boolean; // true if fewer than 3 prizes
};

const useWantList = (): UseWantListReturn => {
  // Implementation: read/write global wantList from localStorage
};
```

**Behavior**:
- `addPrize(name, starCost)`: Adds prize if count < 3; throws error otherwise (captured in `error` state)
- `removePrize(prizeId)`: Removes prize by ID; updates localStorage
- `canAddMore`: Returns `wantList.prizes.length < 3`

**Example Usage**:
```typescript
const WantListComponent = () => {
  const { wantList, addPrize, removePrize, canAddMore, error } = useWantList();

  if (!wantList) return <div>Loading...</div>;

  return (
    <div>
      <h3>🎁 Prize Wish List</h3>
      <ul>
        {wantList.prizes.map(prize => (
          <li key={prize.id}>
            <span>{prize.name} ({prize.starCost} ⭐)</span>
            <button onClick={() => removePrize(prize.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {canAddMore && (
        <button onClick={() => addPrize("New Prize", 30)}>+ Add Prize</button>
      )}
      {!canAddMore && <p>Max 3 prizes reached</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
```

---

## Computed Values

### Current Block ID

**Definition**: The time-block index corresponding to the current time (now).

**Calculation**:
```typescript
function getCurrentBlockId(now: Date = new Date()): number {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const blockMinutes = 7 * 60; // 7:00 AM start

  if (totalMinutes < blockMinutes) return -1; // Before 7am
  if (totalMinutes >= blockMinutes + 14 * 60) return -1; // After 9pm

  const blockIndex = Math.floor((totalMinutes - blockMinutes) / 30);
  return Math.min(blockIndex, 43); // Cap at 43 (last block)
}
```

**Example**:
- 10:30 AM → 630 minutes → (630 - 420) / 30 = **7** (block 7: 10:00–10:30)
- 3:00 PM → 900 minutes → (900 - 420) / 30 = **16** (block 16: 3:00–3:30)
- 11:00 PM (23:00) → 1380 minutes → **-1** (after schedule)

**Usage in UI**:
- `blockId < 0`: Before schedule starts or after ends; no highlighting
- `blockId >= 0`: Highlight time-block at index `blockId` with CSS class `current`

---

### Cumulative Stars (Future Feature)

**Definition**: Total earned stars across all dates (for Want List redemption).

**Calculation**:
```typescript
function getCumulativeStars(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('dailyStars:')) {
      const starsEntry = JSON.parse(localStorage.getItem(key) ?? '{}');
      total += starsEntry.starCount ?? 0;
    }
  }
  return total;
}
```

**Usage**:
- Compare cumulative stars against want list prize costs
- Display "Unlock this! 🎉" badge if cumulative ≥ starCost for a prize

---

## Error Handling & Fallbacks

### Corrupt localStorage Data

**Scenario**: User's localStorage is corrupted or partially deleted.

**Handling**:
```typescript
const getSafeData = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Failed to parse ${key}:`, err);
    // Clear corrupted data and return default
    localStorage.removeItem(key);
    return defaultValue;
  }
};
```

### Invalid Star Input

**Scenario**: User enters "-1", "10", or "abc" in star logger.

**Handling**:
```typescript
const validateStarInput = (value: unknown): { valid: boolean; error?: string } => {
  if (typeof value !== 'number') {
    return { valid: false, error: 'Please enter a number' };
  }
  if (!Number.isInteger(value)) {
    return { valid: false, error: 'Stars must be a whole number' };
  }
  if (value < 0 || value > 5) {
    return { valid: false, error: 'Stars must be between 0 and 5' };
  }
  return { valid: true };
};
```

### Missing Activity Description

**Scenario**: User leaves a time block empty (no activity description).

**Handling**: Allowed. Time blocks render without activity text but remain interactive. Example rendering:

```typescript
<div className={`time-block ${currentBlockId === blockId ? 'current' : ''}`}>
  <span className="time">{block.time}</span>
  {block.activity ? <span className="activity">{block.activity}</span> : null}
  {/* Edit button or click handler always present */}
</div>
```

---

## Migration & Versioning

### Schema Versioning

Future enhancements (e.g., `completed` flag on TimeBlock, recurring schedules) require migration.

**Strategy**:
```typescript
const currentSchemaVersion = 1;

const migrateIfNeeded = () => {
  const metadata = JSON.parse(localStorage.getItem('appMetadata') ?? '{}');
  if (!metadata.version || metadata.version < currentSchemaVersion) {
    // Perform migration logic here
    localStorage.setItem('appMetadata', JSON.stringify({
      version: currentSchemaVersion,
      lastMigration: Date.now()
    }));
  }
};
```

---

## Testing Checklist

- [ ] `useDailyData` fetches correct schedule for given date
- [ ] `useDailyData` creates default (44 empty blocks) if missing
- [ ] `useDailyData.updateActivity` persists activity text to localStorage
- [ ] `useStarLogger` validates 0–5 range; rejects invalid inputs
- [ ] `useStarLogger` displays error message on invalid input
- [ ] `useWantList` enforces 3-item limit; prevents 4th add
- [ ] `useWantList.removePrize` removes prize by ID
- [ ] `getCurrentBlockId` returns correct index for given time
- [ ] Corrupt localStorage data doesn't crash app; gracefully falls back to defaults
- [ ] Cumulative stars calculation sums all daily stars correctly
- [ ] Schema migration logic runs on version change

---

## Related Documents

- [research.md](research.md): Tech stack decisions, patterns, best practices
- [quickstart.md](quickstart.md): Setup instructions, dev workflow, first-run guide
- [spec.md](spec.md): Original feature specification
- [contracts/](contracts/): Public API contracts (if applicable)
