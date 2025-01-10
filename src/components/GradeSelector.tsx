import React from 'react';
import { useContentQuery } from '../hooks/content/useContentQuery';
import { Check } from 'lucide-react';

interface GradeSelectorProps {
  selectedGrades: string[];
  onChange: (grades: string[]) => void;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrades, onChange }) => {
  const { grades, loading } = useContentQuery();

  const toggleGrade = (gradeId: string) => {
    const newSelection = selectedGrades.includes(gradeId)
      ? selectedGrades.filter(id => id !== gradeId)
      : [...selectedGrades, gradeId];
    onChange(newSelection);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Grades Offered
      </label>
      <div className="grid grid-cols-2 gap-2">
        {grades.map((grade) => (
          <button
            key={grade.id}
            type="button"
            onClick={() => toggleGrade(grade.id)}
            className={`flex items-center justify-between px-3 py-2 border rounded-md text-sm ${
              selectedGrades.includes(grade.id)
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <span>{grade.name}</span>
            {selectedGrades.includes(grade.id) && (
              <Check className="h-4 w-4 text-indigo-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradeSelector;