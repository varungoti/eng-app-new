import React, { useEffect, useRef, useState, useCallback } from 'react';
import { measurePerformance } from './performance';
import { useIsFirstRender } from './performance';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onScrollEnd?: () => void;
  scrollThreshold?: number;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  onScrollEnd,
  scrollThreshold = 0.9
}: VirtualListProps<T>): JSX.Element {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useIsFirstRender();
  const scrollTimeoutRef = useRef<number>();
  const lastScrollTime = useRef<number>(0);

  const handleScroll = useCallback(() => {
    // Throttle scroll events
    const now = Date.now();
    if (now - lastScrollTime.current < 16) { // ~60fps
      return;
    }
    lastScrollTime.current = now;

    const endMetric = measurePerformance('virtualList.scroll');
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;

    // Check if we're near the bottom and should trigger onScrollEnd
    if (onScrollEnd && scrollPosition / scrollHeight > scrollThreshold) {
      // Debounce scroll end callback
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        onScrollEnd();
      }, 150);
    }

    requestAnimationFrame(() => {
      setScrollTop(container.scrollTop);
    });
    endMetric();
  }, [onScrollEnd, scrollThreshold]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    
    // Reset scroll position on first render
    if (isFirstRender) {
      container.scrollTop = 0;
    }
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isFirstRender]);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  // Memoize visible items to prevent unnecessary re-renders
  const visibleItems = React.useMemo(() => 
    items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    })),
    [items, startIndex, endIndex]
  );

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto overscroll-contain"
      style={{ height }}
    >
      <div 
        className="absolute inset-0"
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            className="absolute w-full"
            style={{
              top: index * itemHeight,
              height: itemHeight,
              transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
              willChange: 'transform' // Hint to browser about animation
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}