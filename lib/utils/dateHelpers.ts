/**
 * Format a date object or date string to ISO format (YYYY-MM-DD)
 */
export function getISODate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format a date for display (e.g., "May 18, 2026")
 */
export function formatDate(date: Date | string, includeDay: boolean = false): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeDay) {
    options.weekday = 'long';
  }

  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date for short display (e.g., "May 18")
 */
export function formatDateShort(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

/**
 * Get today's date in ISO format
 */
export function getTodayISO(): string {
  return getISODate(new Date());
}

/**
 * Get tomorrow's date in ISO format
 */
export function getTomorrowISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getISODate(tomorrow);
}

/**
 * Get yesterday's date in ISO format
 */
export function getYesterdayISO(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getISODate(yesterday);
}

/**
 * Navigate to the next date
 */
export function getNextDate(date: Date | string): Date {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
}

/**
 * Navigate to the previous date
 */
export function getPreviousDate(date: Date | string): Date {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  return prevDate;
}

/**
 * Get date range between two dates
 */
export function getDateRange(
  startDate: Date | string,
  endDate: Date | string
): string[] {
  if (typeof startDate === 'string') {
    startDate = new Date(startDate);
  }
  if (typeof endDate === 'string') {
    endDate = new Date(endDate);
  }

  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(getISODate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  return getISODate(date1) === getISODate(date2);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today;
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date > today;
}

/**
 * Get the difference in days between two dates
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  if (typeof date1 === 'string') {
    date1 = new Date(date1);
  }
  if (typeof date2 === 'string') {
    date2 = new Date(date2);
  }

  const timeDifference = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

/**
 * Get week start (Monday) for a given date
 */
export function getWeekStart(date: Date | string): Date {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const weekStart = new Date(date);
  const dayOfWeek = weekStart.getDay();
  const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
}

/**
 * Parse ISO date string and return Date object
 */
export function parseISODate(dateStr: string): Date {
  const date = new Date(dateStr);
  // Adjust for timezone offset to prevent date drift
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  return date;
}
