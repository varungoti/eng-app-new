import React, { useState } from 'react';
import { Upload, AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useContentMutation } from '../../hooks/content/useContentMutation';
import { useToast } from '../../hooks/useToast';
import { logger } from '../../lib/logger';

interface ContentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ContentType = 'topics' | 'subtopics' | 'lessons' | 'exercises';

export const ContentUploadDialog: React.FC<ContentUploadDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedType, setSelectedType] = useState<ContentType>('topics');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const { createContent } = useContentMutation();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const extension = file.name.split('.').pop()?.toLowerCase();
      let data: any[] = [];

      if (extension === 'csv') {
        // Process CSV
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Parse data rows
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {} as any);
        });
      } else if (extension === 'json') {
        data = JSON.parse(text);
        if (!Array.isArray(data)) {
          throw new Error('JSON file must contain an array of objects');
        }
      } else {
        throw new Error('Please upload a CSV or JSON file');
      }

      // Process each item
      for (const item of data) {
        await createContent({
          type: selectedType,
          data: item
        });
      }

      onOpenChange(false);
      showToast('Content uploaded successfully', { type: 'success' });
      logger.info('Content upload successful', {
        context: { type: selectedType, count: data.length },
        source: 'ContentUploadDialog'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      setError(message);
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'ContentUploadDialog'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTemplate = () => {
    switch (selectedType) {
      case 'topics':
        return {
          csv: 'grade_id,title,description,order\n' +
               'grade-123,Basic Grammar,Introduction to grammar,1',
          json: JSON.stringify([{
            grade_id: 'grade-123',
            title: 'Basic Grammar',
            description: 'Introduction to grammar',
            order: 1
          }], null, 2)
        };
      case 'subtopics':
        return {
          csv: 'topic_id,title,description,order\n' +
               'topic-123,Nouns,Learning about nouns,1',
          json: JSON.stringify([{
            topic_id: 'topic-123',
            title: 'Nouns',
            description: 'Learning about nouns',
            order: 1
          }], null, 2)
        };
      case 'lessons':
        return {
          csv: 'sub_topic_id,title,description,order,teacher_script,teacher_prompt\n' +
               'subtopic-123,Common Nouns,Identifying common nouns,1,"Today we\'ll learn...","Ask students to..."',
          json: JSON.stringify([{
            sub_topic_id: 'subtopic-123',
            title: 'Common Nouns',
            description: 'Identifying common nouns',
            order: 1,
            teacher_script: "Today we'll learn...",
            teacher_prompt: "Ask students to..."
          }], null, 2)
        };
      case 'exercises':
        return {
          csv: 'lesson_id,prompt,media_url,media_type,say_text\n' +
               'lesson-123,Identify the noun,https://example.com/image.jpg,image,The ball is red',
          json: JSON.stringify([{
            lesson_id: 'lesson-123',
            prompt: 'Identify the noun',
            media_url: 'https://example.com/image.jpg',
            media_type: 'image',
            say_text: 'The ball is red'
          }], null, 2)
        };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as ContentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="topics">Topics</SelectItem>
                <SelectItem value="subtopics">Sub Topics</SelectItem>
                <SelectItem value="lessons">Lessons</SelectItem>
                <SelectItem value="exercises">Exercises</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Template Download */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Download Template
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const template = getTemplate();
                  const blob = new Blob([template.csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedType}_template.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Download CSV Template
              </button>
              <button
                onClick={() => {
                  const template = getTemplate();
                  const blob = new Blob([template.json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedType}_template.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Download JSON Template
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload your CSV or JSON file
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={isProcessing}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  CSV or JSON files only
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Upload failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};