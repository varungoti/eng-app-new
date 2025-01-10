/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react"
import { logger } from "@/lib/logger"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onError?: (error: Error) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onError, ...props }, ref) => {
    const mounted = React.useRef(true);

    React.useEffect(() => {
      return () => {
        mounted.current = false;
      };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (props.onChange && mounted.current) {
          props.onChange(e);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Input change error');
        logger.error('Input change error', {
          context: { error },
          source: 'Input'
        });
        if (onError) {
          onError(error);
        }
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
        onChange={handleChange}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
