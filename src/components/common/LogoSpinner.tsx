'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/logoSpinner.module.css';

export interface LogoSpinnerProps {
  /**
   * Diameter of the loader in px, or a responsive preset.
   * Presets automatically scale up on medium (768px), large (1024px), and extra-large (1440px) screens.
   * Defaults to 'xl' for fullScreen and 'lg' for inline.
   */
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  /** Optional accessible status or caption text displayed below the ring. */
  label?: string;
  /** Optional extra CSS class name. */
  className?: string;
  /** Optional explicit progress value (0 to 100). If omitted, the dual-arc spinning mode is used. */
  progress?: number;
  /** Render as a fixed full-screen overlay with blurred backdrop. */
  fullScreen?: boolean;
}

const sizeClassMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  size,
  label,
  className = '',
  progress: externalProgress,
  fullScreen = false,
}) => {
  // Default to 'xl' for fullScreen loaders, and 'lg' for inline loaders
  const resolvedSize = size ?? (fullScreen ? 'xl' : 'lg');
  const isNumericSize = typeof resolvedSize === 'number';

  // Fallback simulated progress for deterministic progress ring mode
  const [internalProgress, setInternalProgress] = useState(15);

  useEffect(() => {
    if (externalProgress === undefined) return;
    setInternalProgress(15);
    const id = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 95) {
          clearInterval(id);
          return 95;
        }
        const step = prev < 50 ? 8 : prev < 75 ? 5 : 2;
        return Math.min(95, prev + step);
      });
    }, 150);
    return () => clearInterval(id);
  }, [externalProgress]);

  const activeProgress =
    externalProgress !== undefined
      ? Math.min(100, Math.max(0, externalProgress))
      : internalProgress;

  // Circumference for r=47.75 in 100x100 viewBox
  const viewBoxRadius = 47.75;
  const circumference = 2 * Math.PI * viewBoxRadius;
  const strokeDashoffset = circumference - (circumference * activeProgress) / 100;

  // Custom inline style when explicit pixel size is provided
  const customStyle: React.CSSProperties = isNumericSize
    ? ({ '--spinner-size': `${resolvedSize}px` } as React.CSSProperties)
    : {};

  const sizeClass = !isNumericSize ? sizeClassMap[resolvedSize] : '';

  const emblem = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || (externalProgress !== undefined ? `Loading ${Math.round(activeProgress)}%` : 'Loading')}
      className={`${styles.spinnerContainer} ${className}`}
    >
      <div
        className={`${styles.spinnerWrapper} ${sizeClass}`}
        style={customStyle}
      >
        {/* 1. Static faint track ring */}
        <svg
          viewBox="0 0 100 100"
          className={styles.svgLayer}
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r={viewBoxRadius}
            fill="none"
            strokeWidth="2.5"
            className={styles.ringTrack}
          />
        </svg>

        {externalProgress === undefined ? (
          <>
            {/* 2a. Fast clockwise primary arc - AMLABS Brand Blue (#2563EB) */}
            <svg
              viewBox="0 0 100 100"
              className={styles.svgLayer}
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r={viewBoxRadius}
                fill="none"
                strokeWidth="2.5"
                pathLength="300"
                className={styles.ringArc}
              />
            </svg>

            {/* 2b. Slow counter-clockwise accent arc - AMLABS Brand Navy (#0F172A) */}
            <svg
              viewBox="0 0 100 100"
              className={styles.svgLayer}
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r={viewBoxRadius}
                fill="none"
                strokeWidth="2.5"
                pathLength="300"
                className={styles.ringAccent}
              />
            </svg>
          </>
        ) : (
          /* Deterministic progress fill ring */
          <svg
            viewBox="0 0 100 100"
            className={styles.svgLayer}
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r={viewBoxRadius}
              fill="none"
              stroke="#00aeea"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 200ms ease-out',
              }}
            />
          </svg>
        )}

        {/* 3. Center logo with breathing scale pulse */}
        <div className={styles.logoCenter}>
          <Image
            src="/images/am-softwares-logo.png"
            alt="AMLABS"
            width={128}
            height={128}
            className={styles.logoBreathe}
            priority
          />
        </div>
      </div>

      {label && <p className={styles.label}>{label}</p>}
    </div>
  );

  if (!fullScreen) {
    return emblem;
  }

  return <div className={styles.fullScreenOverlay}>{emblem}</div>;
};

export default LogoSpinner;
