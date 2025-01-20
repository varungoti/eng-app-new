import { ReactNode } from 'react';

export default function LessonManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
} 