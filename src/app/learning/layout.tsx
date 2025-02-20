import { LearningProvider } from "@/contexts/LearningContext";

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LearningProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </LearningProvider>
  );
} 