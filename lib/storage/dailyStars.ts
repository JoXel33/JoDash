import type { DailyStars } from '@/lib/types';

const STORAGE_KEY = 'mydashboard_daily_stars';

/**
 * Get all daily stars from localStorage
 */
export function getAllDailyStars(): Record<string, DailyStars> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading daily stars from localStorage:', error);
    return {};
  }
}

/**
 * Get star count for a specific date
 */
export function getDailyStars(date: string): DailyStars | null {
  const allStars = getAllDailyStars();
  return allStars[date] || null;
}

/**
 * Get star count for a specific date (simplified)
 */
export function getStarCount(date: string): number {
  const stars = getDailyStars(date);
  return stars?.stars ?? 0;
}

/**
 * Set star count for a specific date
 */
export function setDailyStars(date: string, stars: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allStars = getAllDailyStars();
    allStars[date] = {
      date,
      stars,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStars));
  } catch (error) {
    console.error('Error writing daily stars to localStorage:', error);
  }
}

/**
 * Delete star entry for a specific date
 */
export function deleteDailyStars(date: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allStars = getAllDailyStars();
    delete allStars[date];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStars));
  } catch (error) {
    console.error('Error deleting daily stars from localStorage:', error);
  }
}

/**
 * Clear all daily stars data
 */
export function clearAllDailyStars(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing daily stars from localStorage:', error);
  }
}
