import React, { useState } from 'react';
import { Upload, AlertTriangle, Check, X } from 'lucide-react';
import type { Class } from '../../types';
import { logger } from '../../lib/logger';

interface ScheduleImportProps {
  onImport: (schedules: Omit<Class, 'id'>[]) => void;
  onClose: () => void;
}

const ScheduleImport: React.FC<ScheduleImportProps> = ({ onImport, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateSchedule = (schedule: any): schedule is Omit<Class, 'id'> => {
    return (
      typeof schedule.schoolId === 'string' &&
      typeof schedule.gradeId === 'string' &&
      typeof schedule.teacherId === 'string' &&
      Array.isArray(schedule.schedule) &&
      schedule.schedule.every((s: any) =>
        typeof s.dayOfWeek === 'number' &&
        typeof s.startTime === 'string' &&
        typeof s.endTime === 'string' &&
        s.dayOfWeek >= 0 &&
        s.dayOfWeek <= 6
      )
    );
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const extension = file.name.split('.').pop()?.toLowerCase();
      let rows: any[] = [];

      if (extension === 'csv') {
        // Process CSV
        rows = text.split('\n')
          .map(line => line.split(','))
          .filter(row => row.length >= 5); // Minimum required columns

        // Remove header row
        const headers = rows.shift();
        if (!headers) throw new Error('CSV file is empty');

        rows = rows.map(row => ({
          schoolId: row[0]?.trim(),
          gradeId: row[1]?.trim(),
          teacherId: row[2]?.trim(),
          schedule: [{
            dayOfWeek: parseInt(row[3]?.trim() || '0'),
            startTime: row[4]?.trim(),
            endTime: row[5]?.trim()
          }]
        }));
      } else if (extension === 'xlsx' || extension === 'xls') {
        // For Excel files, we'll need to use a library like xlsx
        // This is just a placeholder for the structure
        throw new Error('Excel import not implemented yet');
      } else {
        throw new Error('Unsupported file format. Please use CSV or Excel files.');
      }

      // Validate each row
      const validSchedules = rows.filter(validateSchedule);
      
      if (validSchedules.length === 0) {
        throw new Error('No valid schedules found in file');
      }

      setPreview(validSchedules.slice(0, 5)); // Show first 5 for preview
      onImport(validSchedules);

      logger.info('Schedules imported successfully', {
        context: { count: validSchedules.length },
        source: 'ScheduleImport'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      setError(message);
      logger.error(message, {
        context: { error: err },
        source: 'ScheduleImport'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Import Schedules</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload a CSV or Excel file
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processFile(file);
                      }}
                      disabled={isProcessing}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  CSV or Excel files only
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
                      Import failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {preview.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {preview.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        School: {item.schoolId}, Grade: {item.gradeId}, Teacher: {item.teacherId}
                        {item.schedule.map((s: any, i: number) => (
                          <div key={i} className="ml-4 text-xs">
                            Day {s.dayOfWeek}: {s.startTime} - {s.endTime}
                          </div>
                        ))}
                      </div>
                    ))}
                    {preview.length < 5 && (
                      <div className="text-sm text-gray-500">
                        + {preview.length - 5} more schedules
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleImport;