import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/cn';

interface SwipeCardStackProps<T> {
  items: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  className?: string;
  ariaLabel?: string;
  showControls?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  onIndexChange?: (index: number) => void;
}

interface OutgoingState {
  index: number;
  direction: 1 | -1;
  startX: number;
  startY: number;
}

const VISIBLE_BEHIND = 2;
const DRAG_THRESHOLD = 110;
const FLY_OUT_DURATION = 360;
const STACK_DEPTH_SCALE = 0.06;
const STACK_DEPTH_OFFSET_Y = 18;
const FLY_OUT_DISTANCE = 1300;
const FLY_OUT_ROTATION = 22;

export function SwipeCardStack<T>({
  items,
  renderItem,
  getKey,
  className,
  ariaLabel = 'Carrousel de cartes',
  showControls = true,
  previousLabel = 'Carte précédente',
  nextLabel = 'Carte suivante',
  onIndexChange,
}: SwipeCardStackProps<T>) {
  const total = items.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<OutgoingState | null>(null);
  const [outgoingPhase, setOutgoingPhase] = useState<'start' | 'end'>('start');
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [skipActiveTransition, setSkipActiveTransition] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const dragXRef = useRef(0);
  const dragYRef = useRef(0);

  useEffect(() => {
    dragXRef.current = dragX;
  }, [dragX]);

  useEffect(() => {
    dragYRef.current = dragY;
  }, [dragY]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (!outgoing) return;
    setOutgoingPhase('start');
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setOutgoingPhase('end'));
    });
    const timer = window.setTimeout(() => setOutgoing(null), FLY_OUT_DURATION);
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(timer);
    };
  }, [outgoing]);

  useEffect(() => {
    if (!skipActiveTransition) return;
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setSkipActiveTransition(false));
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [skipActiveTransition]);

  if (total === 0) return null;

  const advance = (direction: 1 | -1) => {
    if (outgoing || total < 2) return;
    const startX = dragXRef.current !== 0 ? dragXRef.current : direction * 80;
    const startY = dragYRef.current;
    setSkipActiveTransition(true);
    setOutgoing({ index: currentIndex, direction, startX, startY });
    setCurrentIndex((i) => (i + 1) % total);
    setDragX(0);
    setDragY(0);
    setIsDragging(false);
    pointerStartRef.current = null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (outgoing || total < 2) return;
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // ignore — some browsers throw when pointer is already captured
    }
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    setDragX(event.clientX - start.x);
    setDragY(event.clientY - start.y);
  };

  const endPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    pointerStartRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
    if (Math.abs(dragXRef.current) > DRAG_THRESHOLD) {
      advance(dragXRef.current > 0 ? 1 : -1);
    } else {
      setIsDragging(false);
      setDragX(0);
      setDragY(0);
    }
  };

  const visibleBehind = Math.min(VISIBLE_BEHIND, Math.max(0, total - 1));

  const activeStyle: CSSProperties = {
    transform: `translate3d(${dragX}px, ${dragY * 0.3}px, 0) rotate(${dragX * 0.04}deg)`,
    transition:
      isDragging || skipActiveTransition
        ? 'none'
        : 'transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    zIndex: 30,
    cursor: total < 2 ? 'default' : isDragging ? 'grabbing' : 'grab',
    touchAction: 'pan-y',
  };

  const outgoingFromTransform = outgoing
    ? `translate3d(${outgoing.startX}px, ${outgoing.startY * 0.3}px, 0) rotate(${outgoing.startX * 0.04}deg)`
    : '';
  const outgoingToTransform = outgoing
    ? `translate3d(${outgoing.direction * FLY_OUT_DISTANCE}px, ${outgoing.startY * 0.3 + 120}px, 0) rotate(${outgoing.direction * FLY_OUT_ROTATION}deg)`
    : '';
  const outgoingStyle: CSSProperties | undefined = outgoing
    ? {
        transform: outgoingPhase === 'start' ? outgoingFromTransform : outgoingToTransform,
        opacity: outgoingPhase === 'start' ? 1 : 0,
        transition:
          outgoingPhase === 'end'
            ? `transform ${FLY_OUT_DURATION}ms cubic-bezier(0.32, 0, 0.67, 0), opacity ${FLY_OUT_DURATION}ms ease-out`
            : 'none',
        zIndex: 40,
        pointerEvents: 'none',
      }
    : undefined;

  const dotItems = items.slice(0, total);

  return (
    <div
      className={cn('relative', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="relative mx-auto w-full">
        <div className="relative w-full">
          {Array.from({ length: visibleBehind })
            .map((_, raw) => visibleBehind - raw)
            .map((depth) => {
              const itemIndex = (currentIndex + depth) % total;
              const item = items[itemIndex];
              const baseScale = 1 - depth * STACK_DEPTH_SCALE;
              const baseTranslateY = depth * STACK_DEPTH_OFFSET_Y;
              const style: CSSProperties = {
                transform: `translate3d(0, ${baseTranslateY}px, 0) scale(${baseScale})`,
                transition:
                  'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 320ms ease-out',
                opacity: 1 - depth * 0.08,
                zIndex: 30 - depth,
                pointerEvents: 'none',
                transformOrigin: 'top center',
              };
              return (
                <div
                  key={`stack-depth-${depth}`}
                  className="absolute inset-x-0 top-0 select-none"
                  style={style}
                  aria-hidden
                >
                  {renderItem(item, itemIndex)}
                </div>
              );
            })}

          <div
            key="stack-active"
            className="relative select-none will-change-transform"
            style={activeStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            role="group"
            aria-roledescription="slide"
            aria-label={`Carte ${currentIndex + 1} sur ${total}`}
          >
            {renderItem(items[currentIndex], currentIndex)}
          </div>

          {outgoing ? (
            <div
              key={`outgoing-${outgoing.index}-${outgoing.direction}-${outgoingPhase}`}
              className="absolute inset-x-0 top-0 select-none will-change-transform"
              style={outgoingStyle}
              aria-hidden
            >
              {renderItem(items[outgoing.index], outgoing.index)}
            </div>
          ) : null}
        </div>
      </div>

      {showControls && total > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => advance(-1)}
            disabled={!!outgoing}
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2" aria-hidden="true">
            {dotItems.map((item, index) => (
              <span
                key={`${getKey(item, index)}-dot`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentIndex ? 'w-8 bg-brand-600' : 'w-2 bg-slate-300'
                )}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => advance(1)}
            disabled={!!outgoing}
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
