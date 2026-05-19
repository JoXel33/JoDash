import { getAllDailyStars } from '@/lib/storage/dailyStars';

/**
 * Get the cumulative total of all daily stars across all dates
 * Used for tracking progress towards unlocking prizes in the want list
 */
export function getCumulativeStars(): number {
  const allStars = getAllDailyStars();
  return Object.values(allStars).reduce((total, dailyStars) => {
    return total + (dailyStars.stars || 0);
  }, 0);
}

/**
 * Get the cumulative stars up to and including a specific date
 */
export function getCumulativeStarsUpTo(date: string): number {
  const allStars = getAllDailyStars();
  let total = 0;

  // Sort dates and accumulate up to the target date
  const sortedDates = Object.keys(allStars).sort();
  for (const dateKey of sortedDates) {
    if (dateKey <= date) {
      total += allStars[dateKey].stars || 0;
    } else {
      break;
    }
  }

  return total;
}

/**
 * Get cumulative stars for a date range
 */
export function getCumulativeStarsInRange(startDate: string, endDate: string): number {
  const allStars = getAllDailyStars();
  let total = 0;

  Object.entries(allStars).forEach(([date, dailyStars]) => {
    if (date >= startDate && date <= endDate) {
      total += dailyStars.stars || 0;
    }
  });

  return total;
}

/**
 * Get the number of days with at least one star earned
 */
export function getActiveDaysCount(): number {
  const allStars = getAllDailyStars();
  return Object.values(allStars).filter((dailyStars) => dailyStars.stars > 0).length;
}

/**
 * Get the longest consecutive streak of days with stars earned
 */
export function getLongestStreak(): number {
  const allStars = getAllDailyStars();
  const sortedDates = Object.keys(allStars).sort();

  if (sortedDates.length === 0) {
    return 0;
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: string | null = null;

  sortedDates.forEach((date) => {
    if (allStars[date].stars > 0) {
      if (lastDate === null) {
        currentStreak = 1;
      } else {
        // Check if this date is exactly one day after the last date
        const last = new Date(lastDate);
        const current = new Date(date);
        const diffDays = Math.floor(
          (current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, currentStreak);
      lastDate = date;
    }
  });

  return longestStreak;
}

/**
 * Get the current streak of consecutive days with stars earned
 */
export function getCurrentStreak(): number {
  const allStars = getAllDailyStars();
  const sortedDates = Object.keys(allStars).sort().reverse();

  let streak = 0;
  let expectedDate = new Date();

  for (const date of sortedDates) {
    if (allStars[date].stars > 0) {
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (date === expectedDateStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get star summary statistics
 */
export function getStarStats() {
  const allStars = getAllDailyStars();
  const values = Object.values(allStars);

  if (values.length === 0) {
    return {
      total: 0,
      average: 0,
      max: 0,
      min: 0,
      activeDays: 0,
      totalDays: 0,
      longestStreak: 0,
      currentStreak: 0,
    };
  }

  const starCounts = values.map((s) => s.stars);
  const total = starCounts.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...starCounts);
  const min = Math.min(...starCounts);
  const activeDays = values.filter((s) => s.stars > 0).length;

  return {
    total,
    average: Math.round(average * 10) / 10, // Round to 1 decimal place
    max,
    min,
    activeDays,
    totalDays: values.length,
    longestStreak: getLongestStreak(),
    currentStreak: getCurrentStreak(),
  };
}
