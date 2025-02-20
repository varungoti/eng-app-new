import { ReactNode } from 'react';

export default function ContentManagementLayout({
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