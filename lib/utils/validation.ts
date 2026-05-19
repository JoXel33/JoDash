/**
 * Validate star input (must be 0-5)
 */
export function validateStarInput(value: unknown): {
  valid: boolean;
  value: number | null;
  error?: string;
} {
  // Check if value is a number
  if (typeof value === 'string') {
    // Try to parse as number
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return {
        valid: false,
        value: null,
        error: 'Please enter a number',
      };
    }
    value = parsed;
  }

  if (typeof value !== 'number') {
    return {
      valid: false,
      value: null,
      error: 'Stars must be a number',
    };
  }

  // Check if it's an integer
  if (!Number.isInteger(value)) {
    return {
      valid: false,
      value: null,
      error: 'Stars must be a whole number',
    };
  }

  // Check if it's in valid range (0-5)
  if (value < 0 || value > 5) {
    return {
      valid: false,
      value: null,
      error: 'Stars must be between 0 and 5',
    };
  }

  return {
    valid: true,
    value,
  };
}

/**
 * Validate prize name (1-50 characters)
 */
export function validatePrizeName(name: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof name !== 'string') {
    return {
      valid: false,
      error: 'Prize name must be text',
    };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Prize name cannot be empty',
    };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: 'Prize name must be 50 characters or less',
    };
  }

  return {
    valid: true,
  };
}

/**
 * Validate star cost (non-negative integer)
 */
export function validateStarCost(value: unknown): {
  valid: boolean;
  value: number | null;
  error?: string;
} {
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return {
        valid: false,
        value: null,
        error: 'Star cost must be a number',
      };
    }
    value = parsed;
  }

  if (typeof value !== 'number') {
    return {
      valid: false,
      value: null,
      error: 'Star cost must be a number',
    };
  }

  if (!Number.isInteger(value)) {
    return {
      valid: false,
      value: null,
      error: 'Star cost must be a whole number',
    };
  }

  if (value < 0) {
    return {
      valid: false,
      value: null,
      error: 'Star cost cannot be negative',
    };
  }

  return {
    valid: true,
    value,
  };
}

/**
 * Validate activity text (1-150 characters, optional empty is allowed)
 */
export function validateActivityText(text: unknown): {
  valid: boolean;
  error?: string;
} {
  // Empty text is allowed (optional activity)
  if (text === undefined || text === null || text === '') {
    return {
      valid: true,
    };
  }

  if (typeof text !== 'string') {
    return {
      valid: false,
      error: 'Activity must be text',
    };
  }

  if (text.length > 150) {
    return {
      valid: false,
      error: 'Activity must be 150 characters or less',
    };
  }

  return {
    valid: true,
  };
}

/**
 * Validate ISO date format (YYYY-MM-DD)
 */
export function validateISODate(date: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof date !== 'string') {
    return {
      valid: false,
      error: 'Date must be a string',
    };
  }

  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDatePattern.test(date)) {
    return {
      valid: false,
      error: 'Date must be in YYYY-MM-DD format',
    };
  }

  // Try to parse as a valid date
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return {
      valid: false,
      error: 'Invalid date',
    };
  }

  return {
    valid: true,
  };
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
}

/**
 * Sanitize user input by trimming whitespace
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}
