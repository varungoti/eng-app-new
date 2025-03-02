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

  // Create a dynamic CSS style tag in the component
  const cssRules = `
    .virtual-list-container {
      height: ${height}px;
    }
    .virtual-list-content {
      height: ${totalHeight}px;
    }
    ${visibleItems.map(({ index }) => `
      .virtual-item-${index} {
        top: ${index * itemHeight}px;
        height: ${itemHeight}px;
      }
    `).join('')}
  `;

  return (
    <>
      <style>{cssRules}</style>
      <div
        ref={containerRef}
        className="virtual-list-container relative overflow-auto overscroll-contain"
      >
        <div 
          className="virtual-list-content absolute inset-0"
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              className={`virtual-item-${index} absolute w-full transform-gpu will-change-transform`}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}