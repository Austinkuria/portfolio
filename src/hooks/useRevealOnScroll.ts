'use client';

import { useEffect, useRef } from 'react';

export interface UseRevealOnScrollOptions {
  /** Percentage of target visibility before triggering. Default: 0.1 */
  threshold?: number;
  /** Margin around root. Default: '0px 0px -50px 0px' */
  rootMargin?: string;
  /** Whether animation fires only once or re-triggers on scroll. Default: false */
  once?: boolean;
  /** Optional dependency array */
  deps?: unknown[];
}

/**
 * Attaches an IntersectionObserver to a container ref.
 * When child elements with .reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale
 * enter the viewport, the hook adds .is-visible to trigger CSS sliding animations.
 *
 * Implemented following the exact motion architecture from Overflow-college.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options: UseRevealOnScrollOptions = {},
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    once = false,
    deps = [],
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Check if the container itself has reveal classes, or observe its children
    const selector =
      '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale';
    
    const targets: HTMLElement[] = [];
    if (container.matches?.(selector)) {
      targets.push(container);
    }
    targets.push(...Array.from(container.querySelectorAll<HTMLElement>(selector)));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, once, ...deps]);

  return ref;
}

export default useRevealOnScroll;
