'use client';

interface VocabularyQuestionProps {
  question: any;
}

export function VocabularyQuestion({ question }: VocabularyQuestionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Vocabulary Practice</h2>
      {/* ... rest of the vocabulary question content ... */}
    </div>
  );
} 