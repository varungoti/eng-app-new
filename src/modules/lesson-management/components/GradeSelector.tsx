import { useLessonManagementContext } from '../context/LessonManagementContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Spinner as LoadingSpinner } from '../../../components/ui/spinner';

interface Grade {
  id: string;
  name: string;
}

export function GradeSelector() {
  const { grades, selectedGrade, setSelectedGrade, isLoading } = useLessonManagementContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Grade</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Select 
            value={(selectedGrade as Grade | null)?.id} 
            onValueChange={(value: string) => {
              const grade = (grades as Grade[]).find(g => g.id === value);
              setSelectedGrade(value || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
} 