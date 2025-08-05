import { useEffect, useRef } from 'react';

interface SwipeOptions {
  onSwipeDown?: () => void;
  onSwipeUp?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipeGesture(elementRef: React.RefObject<HTMLElement>, options: SwipeOptions) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { threshold = 50, enabled = true } = options;

  useEffect(() => {
    if (!elementRef.current || !enabled) return;

    const element = elementRef.current;
    let touchStart: { x: number; y: number } | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
      touchStartRef.current = touchStart;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      // Determine swipe direction
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical swipe
        if (deltaY > threshold && options.onSwipeDown) {
          options.onSwipeDown();
        } else if (deltaY < -threshold && options.onSwipeUp) {
          options.onSwipeUp();
        }
      } else {
        // Horizontal swipe
        if (deltaX > threshold && options.onSwipeRight) {
          options.onSwipeRight();
        } else if (deltaX < -threshold && options.onSwipeLeft) {
          options.onSwipeLeft();
        }
      }

      touchStart = null;
      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, options, threshold, enabled]);
}