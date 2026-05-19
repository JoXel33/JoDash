'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Prize } from '@/lib/types';
import {
  addPrize,
  getPrizes,
  isWantListFull,
  removePrize,
  updatePrize,
} from '@/lib/storage/wantList';
import { validatePrizeName, validateStarCost } from '@/lib/utils/validation';

interface UseWantListReturn {
  prizes: Prize[];
  isFull: boolean;
  loading: boolean;
  error: string | null;
  addNewPrize: (name: string, starCost: number) => boolean;
  removePrizeItem: (prizeId: string) => boolean;
  updatePrizeItem: (prizeId: string, updates: Partial<Prize>) => boolean;
  refreshPrizes: () => void;
}

/**
 * Custom hook for managing the want list
 * Provides methods to add, remove, and update prizes
 */
export function useWantList(): UseWantListReturn {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isFull, setIsFull] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load prizes on mount
  useEffect(() => {
    try {
      setLoading(true);
      const loadedPrizes = getPrizes();
      setPrizes(loadedPrizes);
      setIsFull(isWantListFull());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prizes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewPrize = useCallback((name: string, starCost: number): boolean => {
    const nameValidation = validatePrizeName(name);
    if (!nameValidation.valid) {
      setError(nameValidation.error || 'Invalid prize name');
      return false;
    }

    const costValidation = validateStarCost(starCost);
    if (!costValidation.valid) {
      setError(costValidation.error || 'Invalid star cost');
      return false;
    }

    if (isWantListFull()) {
      setError('Want list is full (maximum 3 prizes)');
      return false;
    }

    try {
      const newPrize = addPrize(name, costValidation.value!);
      if (newPrize) {
        setPrizes([...prizes, newPrize]);
        setIsFull(isWantListFull());
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add prize');
      return false;
    }
  }, [prizes]);

  const removePrizeItem = useCallback((prizeId: string): boolean => {
    try {
      const success = removePrize(prizeId);
      if (success) {
        setPrizes(prizes.filter((p) => p.id !== prizeId));
        setIsFull(isWantListFull());
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove prize');
      return false;
    }
  }, [prizes]);

  const updatePrizeItem = useCallback(
    (prizeId: string, updates: Partial<Prize>): boolean => {
      try {
        const success = updatePrize(prizeId, updates);
        if (success) {
          setPrizes(
            prizes.map((p) => (p.id === prizeId ? { ...p, ...updates } : p))
          );
          setError(null);
          return true;
        }
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update prize');
        return false;
      }
    },
    [prizes]
  );

  const refreshPrizes = useCallback(() => {
    try {
      const loadedPrizes = getPrizes();
      setPrizes(loadedPrizes);
      setIsFull(isWantListFull());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh prizes');
    }
  }, []);

  return {
    prizes,
    isFull,
    loading,
    error,
    addNewPrize,
    removePrizeItem,
    updatePrizeItem,
    refreshPrizes,
  };
}
