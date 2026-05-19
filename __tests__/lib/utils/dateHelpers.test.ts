import {
  getISODate,
  formatDate,
  getTodayISO,
  getNextDate,
  getPreviousDate,
  isSameDay,
  isToday,
  isPastDate,
  isFutureDate,
  getDaysDifference,
  timeToMinutes,
  minutesToTime,
} from '@/lib/utils/dateHelpers';

describe('dateHelpers', () => {
  const testDate = new Date('2026-05-18');
  const testDateISO = '2026-05-18';

  describe('getISODate', () => {
    it('should convert Date to ISO format', () => {
      expect(getISODate(testDate)).toBe(testDateISO);
    });

    it('should return ISO string as-is', () => {
      expect(getISODate(testDateISO)).toBe(testDateISO);
    });
  });

  describe('formatDate', () => {
    it('should format Date to readable string', () => {
      const result = formatDate(testDate, false);
      expect(result).toContain('May');
      expect(result).toContain('18');
      expect(result).toContain('2026');
    });

    it('should include day of week when requested', () => {
      const result = formatDate(testDate, true);
      expect(result.toLowerCase()).toMatch(/sunday|monday|tuesday|wednesday|thursday|friday|saturday/);
    });
  });

  describe('getTodayISO', () => {
    it('should return today in ISO format', () => {
      const today = getTodayISO();
      const todayCheck = getISODate(new Date());
      expect(today).toBe(todayCheck);
    });
  });

  describe('getNextDate', () => {
    it('should return next day', () => {
      const nextDate = getNextDate(testDate);
      expect(getISODate(nextDate)).toBe('2026-05-19');
    });
  });

  describe('getPreviousDate', () => {
    it('should return previous day', () => {
      const prevDate = getPreviousDate(testDate);
      expect(getISODate(prevDate)).toBe('2026-05-17');
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2026-05-18');
      const date2 = new Date('2026-05-18T10:30:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      expect(isSameDay(testDate, '2026-05-19')).toBe(false);
    });
  });

  describe('timeToMinutes', () => {
    it('should convert time string to minutes', () => {
      expect(timeToMinutes('10:30')).toBe(630);
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('23:59')).toBe(1439);
    });
  });

  describe('minutesToTime', () => {
    it('should convert minutes to time string', () => {
      expect(minutesToTime(630)).toBe('10:30');
      expect(minutesToTime(0)).toBe('00:00');
      expect(minutesToTime(1439)).toBe('23:59');
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date('2026-05-18');
      const date2 = new Date('2026-05-25');
      expect(getDaysDifference(date1, date2)).toBe(7);
    });

    it('should return positive difference regardless of order', () => {
      const date1 = new Date('2026-05-25');
      const date2 = new Date('2026-05-18');
      expect(getDaysDifference(date1, date2)).toBe(7);
    });
  });
});
