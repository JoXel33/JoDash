import {
  validateStarInput,
  validatePrizeName,
  validateStarCost,
  validateActivityText,
  validateISODate,
  isEmpty,
  sanitizeInput,
} from '@/lib/utils/validation';

describe('validation', () => {
  describe('validateStarInput', () => {
    it('should accept valid star values 0-5', () => {
      for (let i = 0; i <= 5; i++) {
        const result = validateStarInput(i);
        expect(result.valid).toBe(true);
        expect(result.value).toBe(i);
      }
    });

    it('should reject values outside 0-5 range', () => {
      expect(validateStarInput(-1).valid).toBe(false);
      expect(validateStarInput(6).valid).toBe(false);
      expect(validateStarInput(100).valid).toBe(false);
    });

    it('should reject non-integer values', () => {
      expect(validateStarInput(2.5).valid).toBe(false);
      expect(validateStarInput('2.5').valid).toBe(false);
    });

    it('should parse string input', () => {
      const result = validateStarInput('3');
      expect(result.valid).toBe(true);
      expect(result.value).toBe(3);
    });

    it('should reject non-numeric string input', () => {
      expect(validateStarInput('abc').valid).toBe(false);
    });
  });

  describe('validatePrizeName', () => {
    it('should accept valid prize names (1-50 chars)', () => {
      expect(validatePrizeName('Sticker Pack').valid).toBe(true);
      expect(validatePrizeName('A').valid).toBe(true);
      expect(validatePrizeName('X'.repeat(50)).valid).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(validatePrizeName('').valid).toBe(false);
      expect(validatePrizeName('   ').valid).toBe(false);
    });

    it('should reject names longer than 50 characters', () => {
      expect(validatePrizeName('X'.repeat(51)).valid).toBe(false);
    });

    it('should reject non-string input', () => {
      expect(validatePrizeName(123 as unknown as string).valid).toBe(false);
    });
  });

  describe('validateStarCost', () => {
    it('should accept non-negative integers', () => {
      expect(validateStarCost(0).valid).toBe(true);
      expect(validateStarCost(10).valid).toBe(true);
      expect(validateStarCost(100).valid).toBe(true);
    });

    it('should reject negative numbers', () => {
      expect(validateStarCost(-1).valid).toBe(false);
      expect(validateStarCost(-10).valid).toBe(false);
    });

    it('should reject non-integer values', () => {
      expect(validateStarCost(10.5).valid).toBe(false);
      expect(validateStarCost('10.5').valid).toBe(false);
    });

    it('should parse string input', () => {
      const result = validateStarCost('25');
      expect(result.valid).toBe(true);
      expect(result.value).toBe(25);
    });
  });

  describe('validateActivityText', () => {
    it('should accept valid activity text (1-150 chars)', () => {
      expect(validateActivityText('Math homework').valid).toBe(true);
      expect(validateActivityText('X'.repeat(150)).valid).toBe(true);
    });

    it('should accept empty/undefined/null (optional)', () => {
      expect(validateActivityText(undefined).valid).toBe(true);
      expect(validateActivityText(null).valid).toBe(true);
      expect(validateActivityText('').valid).toBe(true);
    });

    it('should reject text longer than 150 characters', () => {
      expect(validateActivityText('X'.repeat(151)).valid).toBe(false);
    });

    it('should reject non-string input', () => {
      expect(validateActivityText(123 as unknown as string).valid).toBe(false);
    });
  });

  describe('validateISODate', () => {
    it('should accept valid ISO dates', () => {
      expect(validateISODate('2026-05-18').valid).toBe(true);
      expect(validateISODate('2026-01-01').valid).toBe(true);
      expect(validateISODate('2026-12-31').valid).toBe(true);
    });

    it('should reject invalid date formats', () => {
      expect(validateISODate('05-18-2026').valid).toBe(false);
      expect(validateISODate('2026/05/18').valid).toBe(false);
      expect(validateISODate('05/18').valid).toBe(false);
    });

    it('should reject invalid dates', () => {
      expect(validateISODate('2026-02-30').valid).toBe(false);
      expect(validateISODate('2026-13-01').valid).toBe(false);
    });

    it('should reject non-string input', () => {
      expect(validateISODate(12345 as unknown as string).valid).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({})).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should collapse multiple spaces', () => {
      expect(sanitizeInput('hello   world')).toBe('hello world');
    });

    it('should handle tabs and newlines', () => {
      expect(sanitizeInput('hello\t\nworld')).toBe('hello world');
    });
  });
});
