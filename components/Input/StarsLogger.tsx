'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStarLogger } from '@/lib/hooks/useStarLogger';
import styles from '@/styles/StarsLogger.module.css';

interface StarsLoggerProps {
  currentStars: number;
  onStarsSaved: (stars: number) => void;
}

export function StarsLogger({ currentStars, onStarsSaved }: StarsLoggerProps) {
  const { value, error, isValid, handleInput, reset } = useStarLogger();
  const [justSaved, setJustSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValid && value !== null) {
      onStarsSaved(value);
      setJustSaved(true);
      reset();

      // Reset success state after 2 seconds
      setTimeout(() => {
        setJustSaved(false);
      }, 2000);

      // Clear input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i < count ? styles.filled : styles.empty}`}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className={styles.starsLoggerContainer}>
      <div className={styles.currentStarsDisplay}>
        <h3 className={styles.displayLabel}>Today&apos;s Stars</h3>
        <div className={styles.starCount}>
          <motion.div
            key={currentStars}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <span className={styles.largeNumber}>{currentStars}</span>
          </motion.div>
          <span className={styles.maxStars}> / 5</span>
        </div>
        <div className={styles.starVisuals}>{renderStars(currentStars)}</div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="stars-input" className={styles.label}>
            Log Stars Earned
          </label>
          <input
            ref={inputRef}
            id="stars-input"
            type="number"
            min="0"
            max="5"
            placeholder="0-5"
            onChange={(e) => handleInput(e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ''} ${
              justSaved ? styles.inputSuccess : ''
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? 'stars-error' : 'stars-hint'}
          />
          <p id="stars-hint" className={styles.hint}>
            Enter a number from 0 to 5
          </p>
        </div>

        {error && (
          <motion.div
            id="stars-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.errorMessage}
            role="alert"
          >
            {error}
          </motion.div>
        )}

        {justSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={styles.successMessage}
          >
            ✨ Stars saved! Great job!
          </motion.div>
        )}

        <motion.button
          type="submit"
          className={styles.submitButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isValid && value !== null}
        >
          Save Stars ⭐
        </motion.button>
      </form>
    </div>
  );
}
