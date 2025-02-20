import { Card } from "@/components/ui/card";
import { Users, GraduationCap } from 'lucide-react';
import { useComponentLogger } from "@/hooks/useComponentLogger";
import { memo, useCallback, useMemo } from 'react';

interface Class {
  id: string | number;
  name: string;
  students: number;
}

interface ClassHeaderProps {
  classes: Class[];
  selectedClass: Class | null;
  onClassChange: (classData: Class) => void;
} 

// Memoized card component to prevent unnecessary re-renders
const ClassCard = memo(({ 
  classData, 
  isSelected, 
  onClassChange, 
  logError 
}: { 
  classData: Class; 
  isSelected: boolean; 
  onClassChange: (classData: Class) => void;
  logError: (error: any) => void;
}) => {
  const handleClick = useCallback(() => {
    try {
      onClassChange(classData);
    } catch (error) {
      logError(error);
    }
  }, [classData, onClassChange, logError]);

  const cardClassName = useMemo(() => 
    `flex-shrink-0 cursor-pointer p-4 ${isSelected ? "border-primary" : "border-transparent"}`, 
    [isSelected]
  );

  return (
    <Card
      key={classData.id}
      className={cardClassName}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <GraduationCap 
          className="h-5 w-5 text-primary" 
        />
        <span className="font-medium">{classData.name}</span>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{classData.students} Students</span>
        </div>
      </div>
    </Card>
  );
});

ClassCard.displayName = 'ClassCard';

const ClassHeader = memo(({ classes, selectedClass, onClassChange }: ClassHeaderProps) => {
  const { logError } = useComponentLogger('ClassHeader');

  const renderedCards = useMemo(() => 
    classes.map((classData) => (
      <ClassCard
        key={classData.id}
        classData={classData}
        isSelected={selectedClass?.id === classData.id}
        onClassChange={onClassChange}
        logError={logError}
      />
    )),
    [classes, selectedClass, onClassChange, logError]
  );

  try {
    return (
      <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
        {renderedCards}
      </div>
    );
  } catch (error) {
    logError(error);
    return <div>Error loading class header</div>;
  }
});

ClassHeader.displayName = 'ClassHeader';

export default ClassHeader;
