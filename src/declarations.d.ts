import { logger } from "./lib/logger";

declare module "@/components/ui/card" {
  import { FC, ReactNode } from "react";
  export const Card: FC<{ children?: ReactNode }>;
  export const CardContent: FC<{ children?: ReactNode }>;
  export const CardHeader: FC<{ children?: ReactNode }>;
  export const CardTitle: FC<{ children?: ReactNode }>;
  const _default: any;
  export default _default;
}

declare module "@/components/ui/button" {
  import { FC, ReactNode } from "react";
  export const Button: FC<{ children?: ReactNode }>;
  const _default: any;
  export default _default;
}

declare module "@/components/ui/progress" {
  import { FC } from "react";
  export const Progress: FC<{ value: number; className?: string }>;
  const _default: any;
  export default _default;
}

declare module "@/components/ui/badge" {
  import { FC, ReactNode } from "react";
  export const Badge: FC<{ variant?: string; className?: string; children?: ReactNode }>;
  const _default: any;
  export default _default;
}

declare module "@/components/ui/tabs" {
  import { FC, ReactNode } from "react";
  export const Tabs: FC<{ defaultValue: string; className?: string; children?: ReactNode }>;
  export const TabsContent: FC<{ value: string; children?: ReactNode }>;
  export const TabsList: FC<{ className?: string; children?: ReactNode }>;
  export const TabsTrigger: FC<{ value: string; children?: ReactNode }>;
  const _default: any;
  export default _default;
}

declare module "@/lib/utils" {
  export function cn(...inputs: any[]): string;
}

// declare module "@/lib/supabase" {
//   export const supabase: any;
// }

declare module "@/types" {
  export type Question = any;
  export type Activity = any;
  export type ExercisePrompt = any;
  export type UserRole = string;
}

declare module "@/hooks/useAuth" {
  export function useAuth(): { user: any; loading: boolean };
}

declare module "@/components/LessonErrorBoundary" {
  import { FC, ReactNode } from "react";
  const LessonErrorBoundary: FC<{ source?: string; children?: ReactNode }>;
  export default LessonErrorBoundary;
}

declare module "@/components/LoadingSpinner" {
  import { FC } from "react";
  export const LoadingSpinner: FC<{ message: string; showProgress?: boolean; progress?: number; timeout?: number; onRetry?: () => void }>;
  const _default: any;
  export default _default;
} 

// declare module "@/lib/logger" {
//     import { LogLevel } from "./types/logging";
//     export const logger: FC<{ level: LogLevel }>;
// }