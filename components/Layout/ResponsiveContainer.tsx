'use client';

import React from 'react';
import styles from './ResponsiveContainer.module.css';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Responsive Container component for consistent layout across devices
 * Provides mobile-first responsive design with semantic breakpoints
 */
export function ResponsiveContainer({
  children,
  maxWidth = 'lg',
  padding = 'md',
  className = '',
}: ResponsiveContainerProps) {
  const containerClass = `${styles.container} ${styles[`maxWidth-${maxWidth}`]} ${styles[`padding-${padding}`]} ${className}`;

  return <div className={containerClass}>{children}</div>;
}
