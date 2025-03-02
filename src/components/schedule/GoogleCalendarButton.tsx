import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

// Interface for GoogleCalendarButton props
interface GoogleCalendarButtonProps {
  onConnect: () => Promise<void>;
  onSync: () => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
}

// Google icon component
const GoogleIcon = () => (
  <svg 
    className="h-4 w-4" 
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 6h12v12H6V6z" fill="#fff" />
    <path d="M18 6H6v12h12V6zm1 0v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1z" fill="#4285F4" />
    <path d="M14 11h4v4h-1v-3h-3v-1zM10 13H6V9h1v3h3v1z" fill="#4285F4" />
  </svg>
);

export const GoogleCalendarButton = ({
  onConnect,
  onSync,
  isConnected,
  isLoading
}: GoogleCalendarButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 transition-all duration-300",
                isConnected ? "bg-blue-50 hover:bg-blue-100 border-blue-200" : ""
              )}
              onClick={isConnected ? onSync : onConnect}
              disabled={isLoading}
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={isLoading ? { duration: 1.5, repeat: Infinity, ease: "linear" } : {}}
              >
                <GoogleIcon />
              </motion.div>
              <span className="hidden sm:inline">
                {isConnected ? "Sync Google Calendar" : "Connect Google Calendar"}
              </span>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isConnected 
            ? "Sync your events with Google Calendar" 
            : "Connect your Google Calendar account"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};