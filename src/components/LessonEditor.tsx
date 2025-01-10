import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useAutoSave } from '../hooks/useAutoSave';
import type { Lesson, Exercise } from '../types';
import AutoSaveInput from './AutoSaveInput';
import AutoSaveTextarea from './AutoSaveTextarea';

interface LessonEditorProps {
  lesson?: Lesson;
  onSave: (lesson: Partial<Lesson>) => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSave }) => {
  const { value: title, setValue: setTitle, saveStatus: titleSaveStatus } = useAutoSave({
    initialValue: lesson?.title || '',
    onSave: async (value) => {
      await onSave({ ...lesson, title: value });
    }
  });

  const { value: description, setValue: setDescription, saveStatus: descriptionSaveStatus } = useAutoSave({
    initialValue: lesson?.description || '',
    onSave: async (value) => {
      await onSave({ ...lesson, description: value });
    }
  });
  const [teacherScript, setTeacherScript] = useState(lesson?.teacherScript || '');
  const [teacherPrompt, setTeacherPrompt] = useState(lesson?.teacherPrompt || '');
  const [sampleAnswer, setSampleAnswer] = useState(lesson?.sampleAnswer || '');
  const [exercises, setExercises] = useState<Exercise[]>(lesson?.exercises || []);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        prompt: '',
        mediaUrl: '',
        sayText: '',
      },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string) => {
    setExercises(
      exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      teacherScript,
      teacherPrompt,
      sampleAnswer,
      exercises,
    });
  };

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Title
            </label>
            <AutoSaveInput
              type="text"
              defaultValue={title}
              onSave={async (value) => {
                setTitle(value);
                await handleSave();
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Lesson Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <AutoSaveTextarea
              defaultValue={description}
              onSave={async (value) => {
                setDescription(value);
                await handleSave();
              }}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter a brief description of the lesson..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teacher Script
            </label>
            <AutoSaveTextarea
              defaultValue={teacherScript}
              onSave={async (value) => {
                setTeacherScript(value);
                await handleSave();
              }}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter the teacher's script..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teacher Prompt
            </label>
            <textarea
              value={teacherPrompt}
              onChange={(e) => setTeacherPrompt(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter the teacher's prompt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sample Answer (Optional)
            </label>
            <textarea
              value={sampleAnswer}
              onChange={(e) => setSampleAnswer(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter a sample answer..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Exercise Prompts</h3>
              <button
                type="button"
                onClick={handleAddExercise}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </button>
            </div>

            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-900">
                    Exercise {index + 1} of {exercises.length}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Prompt
                  </label>
                  <textarea
                    value={exercise.prompt}
                    onChange={(e) =>
                      handleExerciseChange(index, 'prompt', e.target.value)
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter the exercise prompt or scenario..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={exercise.mediaUrl || ''}
                      onChange={(e) =>
                        handleExerciseChange(index, 'mediaUrl', e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter URL for image, video, or GIF..."
                    />
                    <select
                      value={exercise.mediaType || 'image'}
                      onChange={(e) =>
                        handleExerciseChange(index, 'mediaType', e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                  {exercise.mediaUrl && (
                    <div className="mt-2 border rounded-md p-2">
                      {exercise.mediaType === 'video' ? (
                        <video
                          src={exercise.mediaUrl}
                          controls
                          className="max-w-full h-auto"
                        />
                      ) : (
                        <img
                          src={exercise.mediaUrl}
                          alt="Exercise media"
                          className="max-w-full h-auto"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium text-indigo-600 mb-2">
                    Expected Student Response
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Student should say:</span>
                    <input
                      type="text"
                      value={exercise.sayText}
                      onChange={(e) =>
                        handleExerciseChange(index, 'sayText', e.target.value)
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter the expected student response..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <span className="text-sm text-gray-500">
              {titleSaveStatus === 'saving' && 'Saving...'}
              {titleSaveStatus === 'saved' && 'Saved'}
              {titleSaveStatus === 'error' && 'Error saving'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;