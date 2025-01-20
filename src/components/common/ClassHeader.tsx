import { Card } from "@/components/ui/card";
import { Icon } from '@/components/ui/icons';

interface ClassHeaderProps {
  classes: any[];
  selectedClass: any;
  onClassChange: (classData: any) => void;
}

export default function ClassHeader({ classes, selectedClass, onClassChange }: ClassHeaderProps) {
  return (
    <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
      {classes.map((classData) => (
        <Card
          key={classData.id}
          className={`flex-shrink-0 cursor-pointer p-4 ${
            selectedClass?.id === classData.id
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={() => onClassChange(classData)}
        >
          <div className="flex items-center gap-2">
            <Icon 
              type="phosphor" 
              name="GRADUATION_CAP" 
              className="h-5 w-5 text-primary" 
            />
            <span className="font-medium">{classData.name}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Icon type="phosphor" name="USERS" className="h-4 w-4" />
              <span>{classData.students} Students</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
