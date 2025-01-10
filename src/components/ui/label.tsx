"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { logger } from "@/lib/logger"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => {
  const mounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    try {
      if (props.onClick && mounted.current) {
        props.onClick(e);
      }
    } catch (err) {
      logger.error('Label click error', {
        context: { error: err },
        source: 'Label'
      });
    }
  };

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
      onClick={handleClick}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
