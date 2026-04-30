import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = '', duration = 1200 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = counterRef.current;

    if (!element || hasAnimatedRef.current) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const runAnimation = () => {
      hasAnimatedRef.current = true;

      if (reduceMotion) {
        setDisplayValue(value);
        return undefined;
      }

      const startTime = performance.now();
      let frameId = 0;

      const tick = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(Math.round(value * easedProgress));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        }
      };

      frameId = window.requestAnimationFrame(tick);

      return () => window.cancelAnimationFrame(frameId);
    };

    if (typeof globalThis.IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(runAnimation);
      return () => window.cancelAnimationFrame(frameId);
    }

    let cleanupAnimation: (() => void) | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cleanupAnimation = runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cleanupAnimation?.();
    };
  }, [duration, value]);

  return (
    <span ref={counterRef}>
      {displayValue}
      {suffix}
    </span>
  );
}
