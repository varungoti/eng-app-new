'use client';

import { Button } from "../ui/button";
import { RichTextEditor } from "../ui/rich-text-editor";

interface VocabularyQuestionProps {
  question: any;
}

export function VocabularyQuestion({ question }: VocabularyQuestionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Vocabulary Practice</h2>
      <RichTextEditor value={question.content} onChange={() => {}} />
      <div className="flex gap-2">
        <Button>Save</Button>
        

        <Button>Cancel</Button>
        <Button>Delete</Button>
      </div>
    </div>
  );
} 