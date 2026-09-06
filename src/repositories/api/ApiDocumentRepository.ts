import type { DocumentRepository } from '@/src/repositories/interfaces/DocumentRepository';
import type { DocumentType, PartnerDocument, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiDocumentRepository implements DocumentRepository {
  async getDocuments(): Promise<Result<PartnerDocument[]>> {
    return notConnected();
  }

  async getDocument(_documentId: string): Promise<Result<PartnerDocument>> {
    return notConnected();
  }

  async uploadDocument(
    _type: DocumentType,
    _fileUri: string,
  ): Promise<Result<PartnerDocument>> {
    return notConnected();
  }
}
