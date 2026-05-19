'use client';

import { useEffect, useState } from 'react';
import { DatePicker } from '@/components/Navigation/DatePicker';
import { TimeBlocks } from '@/components/Schedule/TimeBlocks';
import { StarsLogger } from '@/components/Input/StarsLogger';
import { useDailyData } from '@/lib/hooks/useDailyData';
import { setDailyStars } from '@/lib/storage/dailyStars';
import { getISODate } from '@/lib/utils/dateHelpers';
import styles from '@/styles/Dashboard.module.css';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { schedule, stars, loading, error, refreshData } = useDailyData(selectedDate);

  // Initialize with today's date
  useEffect(() => {
    setSelectedDate(getISODate(new Date()));
  }, []);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const handleStarsSaved = (starCount: number) => {
    // Save stars to storage
    setDailyStars(selectedDate, starCount);
    // Refresh data to update UI
    refreshData();
  };

  if (!selectedDate) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingContainer}>Loading dashboard...</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Daily Planner</h1>
          <p className={styles.subtitle}>Plan your day and earn stars! ⭐</p>
        </div>

        {/* Date Picker Navigation */}
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />

        {/* Error Display */}
        {error && (
          <div className={styles.errorBanner} role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && <div className={styles.loadingIndicator}>Loading...</div>}

        {/* Schedule Section */}
        {schedule && (
          <section className={styles.scheduleSection}>
            <h2 className={styles.sectionTitle}>Schedule</h2>
            <TimeBlocks schedule={schedule} />
          </section>
        )}

        {/* Stars Logger Section */}
        <section className={styles.starsSection}>
          <StarsLogger currentStars={stars} onStarsSaved={handleStarsSaved} />
        </section>
      </div>
    </main>
  );
}
