'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2.0,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    decimals > 0 ? (0).toFixed(decimals) : '0'
  );
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;
    const durationMs = duration * 1000;

    // Cubic ease-out function: 1 - Math.pow(1 - t, 3)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(progress);

      const currentNumber = startValue + (endValue - startValue) * easedProgress;

      if (decimals > 0) {
        setDisplayValue(currentNumber.toFixed(decimals));
      } else {
        setDisplayValue(Math.round(currentNumber).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure exact final value is displayed
        setDisplayValue(decimals > 0 ? endValue.toFixed(decimals) : Math.round(endValue).toString());
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, decimals, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
