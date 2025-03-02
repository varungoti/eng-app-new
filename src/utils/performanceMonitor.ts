type LayoutShift = {
  value: number;
  hadRecentInput: boolean;
};

type LargestContentfulPaint = {
  renderTime: number;
  loadTime: number;
};

// Define a Record type for window functions instead of using any
type WindowWithFunctions = Record<string, (event: Event) => void>;

export class PerformanceMonitor {
  private metrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  };

  async optimizeLCP() {
    // Implement image optimization
    const images = document.querySelectorAll('img');
    images.forEach((img: HTMLImageElement) => {
      // Convert to WebP format if supported
      if (img.src.match(/\.(jpg|jpeg|png)$/i)) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.srcset = `${webpSrc} 1x, ${webpSrc.replace('.webp', '@2x.webp')} 2x`;
      }
      
      // Add loading="lazy" for images below the fold
      const rect = img.getBoundingClientRect();
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
      
      if (!isInViewport) {
        img.loading = 'lazy';
      }
    });

    // Preload critical resources
    const criticalResources = [
      '/fonts/main.woff2',
      '/css/critical.css',
      '/js/core.js'
    ];
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.woff2') ? 'font' : 
                resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });

    // Optimize CSS delivery
    const styleSheets = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
    styleSheets.forEach(sheet => {
      const isCriticalCSS = sheet.href.includes('critical.css');
      if (!isCriticalCSS) {
        sheet.media = 'print';
        sheet.addEventListener('load', () => {
          sheet.media = 'all';
        });
      }
    });
  }

  async optimizeInteractivity() {
    // Reduce JavaScript execution time by debouncing event handlers
    const debouncedHandlers = new Map<string, NodeJS.Timeout>();
    document.querySelectorAll('[data-event]').forEach(element => {
      const eventType = element.getAttribute('data-event');
      if (eventType) {
        const originalHandler = (element as any)[`on${eventType}`];
        if (originalHandler) {
          (element as any)[`on${eventType}`] = (event: Event) => {
            const handlerId = `${eventType}-${element.id}`;
            if (debouncedHandlers.has(handlerId)) {
              clearTimeout(debouncedHandlers.get(handlerId));
            }
            debouncedHandlers.set(handlerId, setTimeout(() => {
              originalHandler.call(element, event);
              debouncedHandlers.delete(handlerId);
            }, 150));
          };
        }
      }
    });

    // Optimize event delegation for common events
    const eventDelegator = (event: Event) => {
      const target = event.target as HTMLElement;
      const actionElement = target.closest('[data-action]');
      if (actionElement) {
        const action = actionElement.getAttribute('data-action');
        if (action) {
          const fn = (window as unknown as WindowWithFunctions)[action];
          if (typeof fn === 'function') {
            fn(event);
          }
        }
      }
    };
    document.addEventListener('click', eventDelegator);
    document.addEventListener('change', eventDelegator);

    // Implement dynamic imports for heavy components
    const lazyLoadComponents = () => {
      document.querySelectorAll('[data-component]').forEach(async element => {
        const componentName = element.getAttribute('data-component');
        if (componentName) {
          try {
            // Add @vite-ignore comment to suppress the warning
            /* @vite-ignore */
            const componentModule = await import(`../components/${componentName}.tsx`);
            if (componentModule.default) {
              // Replace placeholder with actual component
              const componentInstance = new componentModule.default(element);
              componentInstance.render();
            }
          } catch (error) {
            console.error(`Failed to load component ${componentName}:`, error);
          }
        }
      });
    };
    lazyLoadComponents();
  }

  getMetrics() {
    return this.metrics;
  }

  reportSlowAPI(url: string, duration: number) {
    // Log slow API calls
    // Suggest caching strategies
    // Monitor API patterns
  }

  checkLCP(entry: PerformanceEntry) {
    // Check Largest Contentful Paint
    const lcp = entry as unknown as LargestContentfulPaint;
    this.metrics.lcp = lcp.renderTime || lcp.loadTime;
  }

  checkCLS(entry: PerformanceEntry) {
    // Check Cumulative Layout Shift
    const cls = entry as unknown as LayoutShift;
    this.metrics.cls += cls.value;
  }
} 