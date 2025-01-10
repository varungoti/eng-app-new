import { useState, useEffect } from 'react';
import { documentManager, Document } from '../lib/documents/DocumentManager';
import { useToast } from './useToast';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await documentManager.fetchDocuments();
        setDocuments(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch documents';
        setError(message);
        showToast(message, { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
    return documentManager.subscribe(setDocuments);
  }, [showToast]);

  const uploadDocument = async (file: File, metadata: Partial<Document>) => {
    try {
      const newDoc = await documentManager.uploadDocument(file, metadata);
      if (newDoc) {
        showToast('Document uploaded successfully', { type: 'success' });
      }
      return newDoc;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload document';
      showToast(message, { type: 'error' });
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentManager.deleteDocument(id);
      showToast('Document deleted successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete document';
      showToast(message, { type: 'error' });
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument
  };
};