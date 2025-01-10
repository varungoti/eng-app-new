/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react"
import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isCollapsible?: boolean;
  onResize?: (height: number) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isCollapsible = false, onResize, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
      return () => {
        mounted.current = false;
      };
    }, []);

    useEffect(() => {
      if (textareaRef.current && onResize) {
        const resizeObserver = new ResizeObserver(entries => {
          if (mounted.current) {
            onResize(entries[0].contentRect.height);
          }
        });
        resizeObserver.observe(textareaRef.current);
        return () => resizeObserver.disconnect();
      }
    }, [onResize]);

    const defaultHeight = isCollapsible ? "40px" : "60px";
    const expandedHeight = "200px";

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          isCollapsible && !isFocused ? `min-h-[${defaultHeight}] max-h-[${defaultHeight}] resize-none` : `min-h-[${defaultHeight}] resize-vertical`,
          isFocused && isCollapsible && `min-h-[${expandedHeight}]`,
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={(el) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
          textareaRef.current = el;
        }}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
