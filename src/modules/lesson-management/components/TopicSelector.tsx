import { useLessonManagementContext } from '../context/LessonManagementContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Spinner as LoadingSpinner } from '../../../components/ui/spinner';

interface Topic {
  id: string;
  name: string;
}

export function TopicSelector() {
  const { topics, selectedTopic, setSelectedTopic, isLoading } = useLessonManagementContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Topic</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Select 
            value={(selectedTopic as Topic | null)?.id} 
            onValueChange={(value: string) => {
                const topic = (topics as Topic[]).find(t => t.id === value);
                setSelectedTopic(topic?.id || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {(topics as Topic[]).map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
} 