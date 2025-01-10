import { supabase } from '../supabase';
import { logger } from '../logger';

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

class DocumentManager {
  private static instance: DocumentManager;
  private subscribers: Set<(documents: Document[]) => void> = new Set();

  private constructor() {
    this.setupRealtimeSubscription();
  }

  public static getInstance(): DocumentManager {
    if (!DocumentManager.instance) {
      DocumentManager.instance = new DocumentManager();
    }
    return DocumentManager.instance;
  }

  private setupRealtimeSubscription() {
    supabase
      .channel('documents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        this.handleDocumentChange.bind(this)
      )
      .subscribe();
  }

  private async handleDocumentChange() {
    await this.fetchDocuments();
  }

  public async fetchDocuments(): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const documents = data.map(d => ({
        id: d.id,
        name: d.name,
        type: d.type,
        url: d.url,
        size: d.size,
        mimeType: d.mime_type,
        tags: d.tags,
        createdBy: d.created_by,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at)
      }));

      this.notifySubscribers(documents);
      return documents;
    } catch (err) {
      logger.error('Failed to fetch documents', {
        context: { error: err },
        source: 'DocumentManager'
      });
      return [];
    }
  }

  public async uploadDocument(file: File, metadata: Partial<Document>): Promise<Document | null> {
    try {
      // Upload file to storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}-${file.name}`, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          name: metadata.name || file.name,
          type: metadata.type,
          url: fileData.path,
          size: file.size,
          mime_type: file.type,
          tags: metadata.tags || [],
          created_by: metadata.createdBy
        })
        .select()
        .single();

      if (docError) throw docError;

      await this.fetchDocuments();
      return this.mapDocument(docData);
    } catch (err) {
      logger.error('Failed to upload document', {
        context: { error: err, fileName: file.name },
        source: 'DocumentManager'
      });
      return null;
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await this.fetchDocuments();
    } catch (err) {
      logger.error('Failed to delete document', {
        context: { error: err, documentId: id },
        source: 'DocumentManager'
      });
      throw err;
    }
  }

  private mapDocument(data: any): Document {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      url: data.url,
      size: data.size,
      mimeType: data.mime_type,
      tags: data.tags,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  public subscribe(callback: (documents: Document[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(documents: Document[]) {
    this.subscribers.forEach(callback => callback(documents));
  }
}

export const documentManager = DocumentManager.getInstance();