export default function ContentManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      {children}
    </div>
  );
} 