'use client';

import { useEffect, useState } from 'react';
import type { DailySchedule } from '@/lib/types';
import { getDailySchedule, updateTimeBlockActivity } from '@/lib/storage/dailyPlans';
import { getStarCount, setDailyStars } from '@/lib/storage/dailyStars';

interface UseDailyDataReturn {
  schedule: DailySchedule | null;
  stars: number;
  loading: boolean;
  error: string | null;
  updateActivity: (blockId: string, activity?: string) => void;
  updateStars: (starCount: number) => void;
  refreshData: () => void;
}

/**
 * Custom hook for managing daily schedule and stars data
 * Fetches data from localStorage and provides update methods
 */
export function useDailyData(date: string): UseDailyDataReturn {
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [stars, setStars] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount and when date changes
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedSchedule = getDailySchedule(date);
        const fetchedStars = getStarCount(date);

        setSchedule(fetchedSchedule);
        setStars(fetchedStars);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  const updateActivity = (blockId: string, activity?: string) => {
    try {
      updateTimeBlockActivity(date, blockId, activity);

      // Update local state
      if (schedule) {
        const updatedBlocks = schedule.timeBlocks.map((block) => {
          if (block.id === blockId) {
            return { ...block, activity };
          }
          return block;
        });

        setSchedule({
          ...schedule,
          timeBlocks: updatedBlocks,
          lastModified: Date.now(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update activity');
    }
  };

  const updateStars = (starCount: number) => {
    try {
      setDailyStars(date, starCount);
      setStars(starCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stars');
    }
  };

  const refreshData = () => {
    try {
      const fetchedSchedule = getDailySchedule(date);
      const fetchedStars = getStarCount(date);
      setSchedule(fetchedSchedule);
      setStars(fetchedStars);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  };

  return {
    schedule,
    stars,
    loading,
    error,
    updateActivity,
    updateStars,
    refreshData,
  };
}
