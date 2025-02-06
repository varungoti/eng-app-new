"use client";

import { useComponentLogger } from "@/hooks/useComponentLogger";

interface LayoutProps {
  children: React.ReactNode;
}

export default function LessonsLayout({ children }: LayoutProps) {
  const { logError } = useComponentLogger('LessonsLayout');

  try {
    return (
      <div className="w-full h-full">
        {children}
      </div>
    );
  } catch (error) {
    logError(error);
    return <div>Error loading lessons layout</div>;
  }
}