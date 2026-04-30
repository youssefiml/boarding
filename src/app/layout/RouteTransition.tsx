import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { cn } from '@/lib/cn';

interface RouteTransitionProps {
  children: ReactNode;
  className?: string;
}

function reducedMotionPreferred() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function RouteTransition({ children, className }: RouteTransitionProps) {
  const location = useLocation();
  const [isEntered, setIsEntered] = useState(() => reducedMotionPreferred());
  const [reduceMotion, setReduceMotion] = useState(() => reducedMotionPreferred());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    let exitFrame = 0;
    let enterFrame = 0;

    exitFrame = window.requestAnimationFrame(() => {
      setIsEntered(false);
      enterFrame = window.requestAnimationFrame(() => {
        setIsEntered(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(exitFrame);
      window.cancelAnimationFrame(enterFrame);
    };
  }, [location.pathname, reduceMotion]);

  return (
    <div className={cn('motion-page-enter', isEntered ? 'is-entered' : 'is-pre-enter', className)}>
      {children}
    </div>
  );
}
