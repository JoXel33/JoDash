import {
  generateTimeBlocks,
  getCurrentBlockId,
  isTimeBlockPast,
  isTimeBlockFuture,
  isTimeBlockCurrent,
  getTotalTimeBlocks,
  isValidTimeBlockId,
  timeToMinutes as timeBlockTimeToMinutes,
  minutesToTime as timeBlockMinutesToTime,
} from '@/lib/utils/timeBlocks';

describe('timeBlocks', () => {
  describe('generateTimeBlocks', () => {
    it('should generate exactly 44 time blocks', () => {
      const blocks = generateTimeBlocks();
      expect(blocks.length).toBe(44);
    });

    it('should start at 07:00 and end at 21:00', () => {
      const blocks = generateTimeBlocks();
      expect(blocks[0].startTime).toBe('07:00');
      expect(blocks[blocks.length - 1].endTime).toBe('21:00');
    });

    it('should have 30-minute intervals', () => {
      const blocks = generateTimeBlocks();
      blocks.forEach((block) => {
        const [startHour, startMin] = block.startTime.split(':').map(Number);
        expect(startMin % 30).toBe(0);
      });
    });

    it('should have unique block IDs', () => {
      const blocks = generateTimeBlocks();
      const ids = new Set(blocks.map((b) => b.id));
      expect(ids.size).toBe(44);
    });

    it('should not have activities by default', () => {
      const blocks = generateTimeBlocks();
      blocks.forEach((block) => {
        expect(block.activity).toBeUndefined();
      });
    });
  });

  describe('getTotalTimeBlocks', () => {
    it('should return 44', () => {
      expect(getTotalTimeBlocks()).toBe(44);
    });
  });

  describe('isValidTimeBlockId', () => {
    it('should validate correct time block IDs', () => {
      expect(isValidTimeBlockId('07:00')).toBe(true);
      expect(isValidTimeBlockId('12:30')).toBe(true);
      expect(isValidTimeBlockId('20:30')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidTimeBlockId('7:00')).toBe(false);
      expect(isValidTimeBlockId('25:00')).toBe(false);
      expect(isValidTimeBlockId('12:45')).toBe(false); // Not 30-min interval
    });

    it('should reject times outside 7am-9pm range', () => {
      expect(isValidTimeBlockId('06:30')).toBe(false);
      expect(isValidTimeBlockId('21:00')).toBe(false);
    });
  });

  describe('timeToMinutes and minutesToTime', () => {
    it('should convert between time strings and minutes', () => {
      expect(timeBlockTimeToMinutes('07:00')).toBe(420);
      expect(timeBlockMinutesToTime(420)).toBe('07:00');
      expect(timeBlockTimeToMinutes('12:30')).toBe(750);
      expect(timeBlockMinutesToTime(750)).toBe('12:30');
    });
  });
});
