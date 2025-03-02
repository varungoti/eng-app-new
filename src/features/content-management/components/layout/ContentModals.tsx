import { AddItemModal } from '../shared/AddItemModal';

interface ContentModalsProps {
  modals: {
    addGrade: boolean;
    addTopic: boolean;
    addSubtopic: boolean;
    addLesson: boolean;
  };
  onClose: (modalKey: keyof ContentModalsProps['modals']) => void;
  onSubmit: {
    grade: (data: { title: string; description?: string }) => Promise<void>;
    topic: (data: { title: string; description?: string }) => Promise<void>;
    subtopic: (data: { title: string; description?: string }) => Promise<void>;
    lesson: (data: { title: string; description?: string }) => Promise<void>;
  };
}

export const ContentModals = ({
  modals,
  onClose,
  onSubmit
}: ContentModalsProps) => {
  return (
    <>
      {/* Add Grade Modal */}
      <AddItemModal
        title="Add New Grade"
        description="Create a new grade level for organizing content."
        isOpen={modals.addGrade}
        onClose={() => onClose('addGrade')}
        onSubmit={onSubmit.grade}
        submitLabel="Create Grade"
        showDescription={false}
      />

      {/* Add Topic Modal */}
      <AddItemModal
        title="Add New Topic"
        description="Create a new topic within the selected grade."
        isOpen={modals.addTopic}
        onClose={() => onClose('addTopic')}
        onSubmit={onSubmit.topic}
        submitLabel="Create Topic"
        showDescription={true}
      />

      {/* Add Subtopic Modal */}
      <AddItemModal
        title="Add New Subtopic"
        description="Create a new subtopic within the selected topic."
        isOpen={modals.addSubtopic}
        onClose={() => onClose('addSubtopic')}
        onSubmit={onSubmit.subtopic}
        submitLabel="Create Subtopic"
        showDescription={true}
      />

      {/* Add Lesson Modal */}
      <AddItemModal
        title="Add New Lesson"
        description="Create a new lesson within the selected subtopic."
        isOpen={modals.addLesson}
        onClose={() => onClose('addLesson')}
        onSubmit={onSubmit.lesson}
        submitLabel="Create Lesson"
        showDescription={true}
      />
    </>
  );
}; 