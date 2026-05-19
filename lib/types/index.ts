/**
 * TimeBlock represents a 30-minute time slot in the daily schedule
 */
export interface TimeBlock {
  id: string; // e.g., "07:00" for 7:00 AM
  startTime: string; // e.g., "07:00"
  endTime: string; // e.g., "07:30"
  activity?: string; // Optional activity description (1-150 chars)
  isCurrentBlock?: boolean; // True if this is the current time block
  isPastBlock?: boolean; // True if this time has passed
}

/**
 * DailyStars tracks the star count for a specific date
 */
export interface DailyStars {
  date: string; // ISO date string (YYYY-MM-DD)
  stars: number; // 0-5 star count
  timestamp: number; // Last update timestamp in milliseconds
}

/**
 * DailySchedule represents the complete schedule for a date
 */
export interface DailySchedule {
  date: string; // ISO date string (YYYY-MM-DD)
  timeBlocks: TimeBlock[]; // All 44 time blocks for the day
  lastModified: number; // Timestamp of last modification
}

/**
 * Prize represents an item the child wants to earn stars for
 */
export interface Prize {
  id: string; // Unique identifier (UUID or timestamp-based)
  name: string; // Prize name (1-50 characters)
  starCost: number; // Number of stars required to unlock (0+)
  createdAt: number; // Timestamp when prize was created
  addedToWantList?: boolean; // Flag indicating if it's active in want list
}

/**
 * WantList represents the global list of prizes (max 3 items)
 */
export interface WantList {
  prizes: Prize[]; // Array of Prize items (max 3)
  lastModified: number; // Timestamp of last modification
}

/**
 * StorageData represents all data persisted in localStorage
 */
export interface StorageData {
  dailyStars: Record<string, DailyStars>; // Keyed by ISO date
  dailyPlans: Record<string, DailySchedule>; // Keyed by ISO date
  wantList: WantList; // Global want list (not date-specific)
  version: number; // Schema version for migrations
  lastSync: number; // Timestamp of last data synchronization
}

/**
 * AppState represents the current UI state
 */
export interface AppState {
  currentDate: Date; // Currently selected date
  selectedStars: number | null; // Currently entered star count
  wantListOpen: boolean; // Whether want list panel is visible
  errorMessage?: string; // Error message if any
}
