'use client';

import { useState } from 'react';
import { getNextDate, getPreviousDate, formatDate, getISODate } from '@/lib/utils/dateHelpers';
import styles from '@/styles/DatePicker.module.css';

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD format
  onDateChange: (date: string) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [showModal, setShowModal] = useState(false);

  const handlePreviousDay = () => {
    const newDate = getPreviousDate(selectedDate);
    onDateChange(getISODate(newDate));
  };

  const handleNextDay = () => {
    const newDate = getNextDate(selectedDate);
    onDateChange(getISODate(newDate));
  };

  const handleToday = () => {
    const today = getISODate(new Date());
    onDateChange(today);
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(e.target.value);
      setShowModal(false);
    }
  };

  const isToday = getISODate(new Date()) === selectedDate;
  const displayDate = formatDate(selectedDate, true); // Include day of week

  return (
    <div className={styles.datePickerContainer}>
      <div className={styles.dateControls}>
        <button
          className={styles.navButton}
          onClick={handlePreviousDay}
          aria-label="Previous day"
          title="Previous day (⌘ + ←)"
        >
          ←
        </button>

        <div className={styles.dateDisplay}>
          <button
            className={styles.dateButton}
            onClick={() => setShowModal(!showModal)}
            title={selectedDate}
          >
            <span className={styles.dateText}>{displayDate}</span>
            {isToday && <span className={styles.todayBadge}>Today</span>}
          </button>
        </div>

        <button
          className={styles.navButton}
          onClick={handleNextDay}
          aria-label="Next day"
          title="Next day (⌘ + →)"
        >
          →
        </button>

        {!isToday && (
          <button
            className={styles.todayButton}
            onClick={handleToday}
            title="Go to today"
          >
            📅 Today
          </button>
        )}
      </div>

      {/* Optional date picker modal */}
      {showModal && (
        <div className={styles.datePickerModal}>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateInput}
            className={styles.dateInput}
            autoFocus
          />
          <button
            className={styles.closeButton}
            onClick={() => setShowModal(false)}
            aria-label="Close date picker"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
