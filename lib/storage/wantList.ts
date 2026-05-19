import type { Prize, WantList } from '@/lib/types';

const STORAGE_KEY = 'mydashboard_want_list';
const MAX_PRIZES = 3;

/**
 * Get the entire want list from localStorage
 */
export function getWantList(): WantList {
  if (typeof window === 'undefined') {
    return { prizes: [], lastModified: Date.now() };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { prizes: [], lastModified: Date.now() };
  } catch (error) {
    console.error('Error reading want list from localStorage:', error);
    return { prizes: [], lastModified: Date.now() };
  }
}

/**
 * Get all prizes from the want list
 */
export function getPrizes(): Prize[] {
  return getWantList().prizes;
}

/**
 * Get a specific prize by ID
 */
export function getPrize(prizeId: string): Prize | null {
  const prizes = getPrizes();
  return prizes.find((p) => p.id === prizeId) || null;
}

/**
 * Check if want list is at max capacity (3 items)
 */
export function isWantListFull(): boolean {
  return getPrizes().length >= MAX_PRIZES;
}

/**
 * Add a prize to the want list
 * Returns the added prize or null if list is full
 */
export function addPrize(name: string, starCost: number): Prize | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const wantList = getWantList();

    if (wantList.prizes.length >= MAX_PRIZES) {
      console.warn(`Cannot add prize: want list is full (max ${MAX_PRIZES})`);
      return null;
    }

    const newPrize: Prize = {
      id: `prize_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      starCost,
      createdAt: Date.now(),
      addedToWantList: true,
    };

    wantList.prizes.push(newPrize);
    wantList.lastModified = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wantList));
    return newPrize;
  } catch (error) {
    console.error('Error adding prize to want list:', error);
    return null;
  }
}

/**
 * Remove a prize from the want list
 */
export function removePrize(prizeId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const wantList = getWantList();
    const initialLength = wantList.prizes.length;

    wantList.prizes = wantList.prizes.filter((p) => p.id !== prizeId);
    wantList.lastModified = Date.now();

    if (wantList.prizes.length < initialLength) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wantList));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error removing prize from want list:', error);
    return false;
  }
}

/**
 * Update a prize's details
 */
export function updatePrize(prizeId: string, updates: Partial<Prize>): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const wantList = getWantList();
    const prize = wantList.prizes.find((p) => p.id === prizeId);

    if (!prize) {
      return false;
    }

    Object.assign(prize, updates, { id: prizeId }); // Prevent ID changes
    wantList.lastModified = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wantList));
    return true;
  } catch (error) {
    console.error('Error updating prize:', error);
    return false;
  }
}

/**
 * Clear all prizes from the want list
 */
export function clearWantList(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing want list from localStorage:', error);
  }
}

/**
 * Set entire want list (useful for bulk operations or data restoration)
 */
export function setWantList(wantList: WantList): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wantList));
  } catch (error) {
    console.error('Error writing want list to localStorage:', error);
  }
}
