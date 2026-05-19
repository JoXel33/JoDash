'use client';

import { useCallback, useState } from 'react';
import { validateStarInput } from '@/lib/utils/validation';

interface UseStarLoggerReturn {
  value: number | null;
  error: string | null;
  isValid: boolean;
  handleInput: (input: unknown) => void;
  reset: () => void;
}

/**
 * Custom hook for star input validation and management
 * Validates input in real-time and manages error state
 */
export function useStarLogger(
  initialValue: number = 0
): UseStarLoggerReturn {
  const [value, setValue] = useState<number | null>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleInput = useCallback((input: unknown) => {
    const result = validateStarInput(input);

    if (result.valid) {
      setValue(result.value);
      setError(null);
      setIsValid(true);
    } else {
      setValue(null);
      setError(result.error || 'Invalid input');
      setIsValid(false);
    }
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setIsValid(true);
  }, [initialValue]);

  return {
    value,
    error,
    isValid,
    handleInput,
    reset,
  };
}
