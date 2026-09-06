import type { DocumentRepository } from '@/src/repositories/interfaces/DocumentRepository';
import type { DocumentType, PartnerDocument, Result } from '@/src/types';
import { logger } from '@/src/services/logger';

import { mockStore } from './MockStore';
import { err, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockDocumentRepository implements DocumentRepository {
  async getDocuments(): Promise<Result<PartnerDocument[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().documents]);
    });
  }

  async getDocument(documentId: string): Promise<Result<PartnerDocument>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const doc = mockStore.getState().documents.find((d) => d.id === documentId);
      if (!doc) {
        return err(NOT_FOUND('Document', documentId));
      }
      return ok(doc);
    });
  }

  async uploadDocument(
    type: DocumentType,
    fileUri: string,
  ): Promise<Result<PartnerDocument>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      // Never log fileUri contents / paths that may include PII filenames beyond type
      logger.info('Document uploaded (mock)', { type });
      const documents = mockStore.getState().documents;
      const idx = documents.findIndex((d) => d.type === type);
      const now = new Date().toISOString();
      const updated: PartnerDocument = {
        id: idx >= 0 ? documents[idx].id : `doc_${type.toLowerCase()}`,
        type,
        status: 'PENDING',
        fileUrl: fileUri,
        uploadedAt: now,
        expiryDate: idx >= 0 ? documents[idx].expiryDate : undefined,
      };
      const next = [...documents];
      if (idx >= 0) {
        next[idx] = updated;
      } else {
        next.push(updated);
      }
      mockStore.replaceState({ documents: next });
      return ok(updated);
    });
  }
}
