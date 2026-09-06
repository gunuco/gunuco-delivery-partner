import { useCallback } from 'react';

import {
  useGetDocumentQuery,
  useGetDocumentsQuery,
  useUploadDocumentMutation,
} from '@/src/api/endpoints/documentsApi';
import { useAppSelector } from '@/src/store/hooks';
import type { DocumentType } from '@/src/types';

/**
 * Partner document list and upload.
 */
export function useDocuments() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const listQuery = useGetDocumentsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [uploadMutation, uploadState] = useUploadDocumentMutation();

  const uploadDocument = useCallback(
    async (type: DocumentType, fileUri: string) =>
      uploadMutation({ type, fileUri }).unwrap(),
    [uploadMutation],
  );

  return {
    documents: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    uploadDocument,
    uploadState,
    refetch: listQuery.refetch,
  };
}

export function useDocument(documentId: string | undefined) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const query = useGetDocumentQuery(documentId as string, {
    skip: !isAuthenticated || !documentId,
  });

  return {
    document: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
