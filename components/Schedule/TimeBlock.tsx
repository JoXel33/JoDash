'use client';

import type { TimeBlock as TimeBlockType } from '@/lib/types';
import styles from '@/styles/TimeBlock.module.css';

interface TimeBlockProps {
  block: TimeBlockType;
  isCurrentBlock: boolean;
  isPastBlock: boolean;
  onActivityChange?: (_blockId: string, _activity: string) => void;
}

export function TimeBlock({
  block,
  isCurrentBlock,
  isPastBlock,
  onActivityChange: _onActivityChange,
}: TimeBlockProps) {
  // Extract time components from block ID (format: "HH:MM")
  const [hours, minutes] = block.id.split(':').map(Number);

  // Format time for display (12-hour format)
  const formatTime = (h: number, m: number): string => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
  };

  // Calculate end time (30 minutes after start)
  const endMinutes = minutes + 30;
  const endHours = hours + (endMinutes >= 60 ? 1 : 0);

  const displayStartTime = formatTime(hours, minutes);
  const displayEndTime = formatTime(endHours, endMinutes % 60);

  // Determine block state class
  let stateClass = styles.future;
  if (isCurrentBlock) {
    stateClass = styles.current;
  } else if (isPastBlock) {
    stateClass = styles.past;
  }

  return (
    <div className={`${styles.timeBlock} ${stateClass}`} data-block-id={block.id}>
      <div className={styles.timeLabel}>
        <span className={styles.startTime}>{displayStartTime}</span>
        <span className={styles.endTime}>{displayEndTime}</span>
      </div>

      <div className={styles.activityArea}>
        {block.activity ? (
          <p className={styles.activityText}>{block.activity}</p>
        ) : (
          <p className={styles.emptyActivity}>Add activity</p>
        )}
      </div>

      {isCurrentBlock && <div className={styles.currentIndicator} />}
    </div>
  );
}
