'use client';

import { useEffect, useState } from 'react';
import type { DailySchedule } from '@/lib/types';
import { getCurrentBlockId } from '@/lib/utils/timeBlocks';
import { TimeBlock } from './TimeBlock';
import styles from '@/styles/TimeBlock.module.css';

interface TimeBlocksProps {
  schedule: DailySchedule | null;
  onActivityChange?: (_blockId: string, _activity: string) => void;
}

export function TimeBlocks({ schedule, onActivityChange: _onActivityChange }: TimeBlocksProps) {
  const [currentBlockId, setCurrentBlockId] = useState<string>('');

  // Update current block ID on mount and periodically
  useEffect(() => {
    const updateCurrentBlock = () => {
      setCurrentBlockId(getCurrentBlockId());
    };

    updateCurrentBlock();

    // Update current block every minute to reflect time passage
    const interval = setInterval(updateCurrentBlock, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!schedule) {
    return <div className={styles.loadingState}>Loading schedule...</div>;
  }

  return (
    <div className={styles.timeBlocksContainer}>
      <div className={styles.timeBlocksGrid}>
        {schedule.timeBlocks.map((block) => (
          <TimeBlock
            key={block.id}
            block={block}
            isCurrentBlock={block.id === currentBlockId}
            isPastBlock={block.id < currentBlockId}
          />
        ))}
      </div>
    </div>
  );
}
