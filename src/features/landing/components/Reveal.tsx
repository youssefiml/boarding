import { type CSSProperties, type HTMLAttributes, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article';
  children: ReactNode;
  delay?: number;
}

export function Reveal({ as = 'div', children, className = '', delay = 0, style, ...props }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const setElementRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      const frameId = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  const revealStyle = {
    ...style,
    '--reveal-delay': `${delay}ms`,
  } as CSSProperties;

  const revealClassName = cn(
    'transform-gpu transition-all duration-[520ms] [transition-delay:var(--reveal-delay)] [transition-timing-function:var(--motion-ease-premium)]',
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    className
  );

  const sharedProps = {
    ref: setElementRef,
    className: revealClassName,
    style: revealStyle,
    ...props,
  };

  if (as === 'section') {
    return <section {...sharedProps}>{children}</section>;
  }

  if (as === 'article') {
    return <article {...sharedProps}>{children}</article>;
  }

  return <div {...sharedProps}>{children}</div>;
}
