import type { DocumentType, PartnerDocument, Result } from '@/src/types';

export interface DocumentRepository {
  getDocuments(): Promise<Result<PartnerDocument[]>>;
  getDocument(documentId: string): Promise<Result<PartnerDocument>>;
  uploadDocument(
    type: DocumentType,
    fileUri: string,
  ): Promise<Result<PartnerDocument>>;
}
