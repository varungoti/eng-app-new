import { cn } from "../../lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({ 
  className, 
  size = "md", 
  label = "Loading...",
  ...props 
}: SpinnerProps) {
  return (
    <div 
      role="status"
      aria-label={label}
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    >
      <div className="h-full w-full rounded-full border-4 border-background border-t-foreground" />
      <span className="sr-only">{label}</span>
    </div>
  );
} 