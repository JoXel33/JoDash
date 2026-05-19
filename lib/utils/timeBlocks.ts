import type { TimeBlock } from '@/lib/types';

const START_HOUR = 7; // 7 AM
const END_HOUR = 21; // 9 PM (21:00)
const BLOCK_DURATION_MINUTES = 30;

/**
 * Generate all 44 time blocks for a given date
 * Time blocks are 30-minute intervals from 7:00 AM to 9:00 PM
 */
export function generateTimeBlocks(): TimeBlock[] {
  const blocks: TimeBlock[] = [];

  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += BLOCK_DURATION_MINUTES) {
      const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const endMinute = minute + BLOCK_DURATION_MINUTES;
      const endHour = hour + Math.floor(endMinute / 60);
      const adjustedEndMinute = endMinute % 60;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(adjustedEndMinute).padStart(2, '0')}`;

      blocks.push({
        id: startTime,
        startTime,
        endTime,
        activity: undefined,
        isCurrentBlock: false,
        isPastBlock: false,
      });
    }
  }

  return blocks;
}

/**
 * Get the current time in HH:MM format
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get the current time block ID (start time of the current block)
 */
export function getCurrentBlockId(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // If before 7 AM or after 9 PM, return null (no current block)
  if (hours < START_HOUR || hours >= END_HOUR) {
    return '';
  }

  // Round down to nearest 30-minute interval
  const blockMinutes = Math.floor(minutes / BLOCK_DURATION_MINUTES) * BLOCK_DURATION_MINUTES;
  return `${String(hours).padStart(2, '0')}:${String(blockMinutes).padStart(2, '0')}`;
}

/**
 * Check if a time block is in the past (based on current time)
 */
export function isTimeBlockPast(blockId: string): boolean {
  const currentTime = getCurrentTime();
  // blockId format: "HH:MM"
  // For past check, we need to compare if the end time is before current time
  const [blockHour, blockMinute] = blockId.split(':').map(Number);
  const blockEndMinute = blockMinute + BLOCK_DURATION_MINUTES;
  const blockEndHour = blockHour + Math.floor(blockEndMinute / 60);
  const adjustedBlockEndMinute = blockEndMinute % 60;

  const endTimeStr = `${String(blockEndHour).padStart(2, '0')}:${String(adjustedBlockEndMinute).padStart(2, '0')}`;

  return endTimeStr <= currentTime;
}

/**
 * Check if a time block is in the future (based on current time)
 */
export function isTimeBlockFuture(blockId: string): boolean {
  const currentTime = getCurrentTime();
  // blockId format: "HH:MM" (start time of block)
  return blockId > currentTime;
}

/**
 * Check if a time block is the current block
 */
export function isTimeBlockCurrent(blockId: string): boolean {
  return blockId === getCurrentBlockId();
}

/**
 * Update all blocks with current/past/future status
 */
export function updateBlockStatus(blocks: TimeBlock[]): TimeBlock[] {
  const currentBlockId = getCurrentBlockId();

  return blocks.map((block) => ({
    ...block,
    isCurrentBlock: block.id === currentBlockId,
    isPastBlock: isTimeBlockPast(block.id),
  }));
}

/**
 * Convert time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Get the total number of time blocks (should be 44)
 */
export function getTotalTimeBlocks(): number {
  const totalHours = END_HOUR - START_HOUR;
  return (totalHours * 60) / BLOCK_DURATION_MINUTES;
}

/**
 * Validate time block ID format
 */
export function isValidTimeBlockId(blockId: string): boolean {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timePattern.test(blockId)) {
    return false;
  }

  const [hours, minutes] = blockId.split(':').map(Number);
  return (
    hours >= START_HOUR &&
    hours < END_HOUR &&
    minutes % BLOCK_DURATION_MINUTES === 0
  );
}
