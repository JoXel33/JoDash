import type { DailySchedule, TimeBlock } from '@/lib/types';
import { generateTimeBlocks } from '@/lib/utils/timeBlocks';

const STORAGE_KEY = 'mydashboard_daily_plans';

/**
 * Get all daily schedules from localStorage
 */
export function getAllDailyPlans(): Record<string, DailySchedule> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading daily plans from localStorage:', error);
    return {};
  }
}

/**
 * Get schedule for a specific date
 * If date doesn't exist, generate default schedule with 44 empty time blocks
 */
export function getDailySchedule(date: string): DailySchedule {
  const allPlans = getAllDailyPlans();

  if (allPlans[date]) {
    return allPlans[date];
  }

  // Generate default schedule with 44 empty time blocks
  return {
    date,
    timeBlocks: generateTimeBlocks(),
    lastModified: Date.now(),
  };
}

/**
 * Get all time blocks for a specific date
 */
export function getTimeBlocks(date: string): TimeBlock[] {
  const schedule = getDailySchedule(date);
  return schedule.timeBlocks;
}

/**
 * Get a specific time block by ID
 */
export function getTimeBlock(date: string, blockId: string): TimeBlock | null {
  const blocks = getTimeBlocks(date);
  return blocks.find((block) => block.id === blockId) || null;
}

/**
 * Update activity for a specific time block
 */
export function updateTimeBlockActivity(
  date: string,
  blockId: string,
  activity: string | undefined
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allPlans = getAllDailyPlans();
    if (!allPlans[date]) {
      allPlans[date] = getDailySchedule(date);
    }

    const block = allPlans[date].timeBlocks.find((b) => b.id === blockId);
    if (block) {
      block.activity = activity;
      allPlans[date].lastModified = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlans));
    }
  } catch (error) {
    console.error('Error updating time block activity:', error);
  }
}

/**
 * Set entire schedule for a date
 */
export function setDailySchedule(date: string, schedule: DailySchedule): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allPlans = getAllDailyPlans();
    allPlans[date] = {
      ...schedule,
      date,
      lastModified: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlans));
  } catch (error) {
    console.error('Error writing daily schedule to localStorage:', error);
  }
}

/**
 * Delete schedule for a specific date
 */
export function deleteDailySchedule(date: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allPlans = getAllDailyPlans();
    delete allPlans[date];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlans));
  } catch (error) {
    console.error('Error deleting daily schedule from localStorage:', error);
  }
}

/**
 * Clear all daily plans data
 */
export function clearAllDailyPlans(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing daily plans from localStorage:', error);
  }
}
