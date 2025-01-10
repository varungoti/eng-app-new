import { BookOpen } from "lucide-react";

interface Course {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  level?: string;
  progress?: number;
}

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h3 className="text-xl font-semibold">{course.title}</h3>
        </div>
        {course.level && <p className="text-sm text-gray-600">Level: {course.level}</p>}
      </div>
      {course.progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
