import React, { useState } from 'react';
import { Upload, AlertTriangle, X, FileText, Download } from 'lucide-react';
import { logger } from '../../lib/logger';

interface BulkImportProps {
  title: string;
  onImport: (data: any[]) => Promise<void>;
  onClose: () => void;
  template: {
    headers: string[];
    sampleData: any[];
  };
  validateRow: (row: any) => { isValid: boolean; errors?: string[] };
}

const BulkImportDialog: React.FC<BulkImportProps> = ({
  title,
  onImport,
  onClose,
  template,
  validateRow
}) => {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const downloadTemplate = () => {
    const headers = template.headers.join(',');
    const sampleRows = template.sampleData.map(row => 
      template.headers.map(header => row[header] || '').join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${sampleRows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setValidationErrors([]);

    try {
      const text = await file.text();
      const extension = file.name.split('.').pop()?.toLowerCase();
      let rows: any[] = [];

      if (extension === 'csv') {
        // Process CSV
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Validate headers
        const missingHeaders = template.headers.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        // Parse data rows
        rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {} as any);
        });
      } else {
        throw new Error('Please upload a CSV file');
      }

      // Validate rows
      const errors: string[] = [];
      const validRows = rows.filter((row, index) => {
        const validation = validateRow(row);
        if (!validation.isValid && validation.errors) {
          errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
        }
        return validation.isValid;
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        if (validRows.length === 0) {
          throw new Error('No valid data found in file');
        }
      }

      setPreview(validRows.slice(0, 5));
      await onImport(validRows);

      logger.info('Bulk import successful', {
        context: { 
          totalRows: rows.length,
          validRows: validRows.length,
          errors: errors.length
        },
        source: 'BulkImport'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      setError(message);
      logger.error(message, {
        context: { error: err },
        source: 'BulkImport'
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
            <h2 className="text-lg font-medium">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Template Download */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Download the template CSV file to see the required format
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload your CSV file
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processFile(file);
                      }}
                      disabled={isProcessing}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Only CSV files are supported
                </p>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Validation Warnings
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                      <div key={index} className="text-sm">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key} className="text-gray-600">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                        <hr className="my-2" />
                      </div>
                    ))}
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

export default BulkImportDialog;