import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { DocumentType } from '@/src/types';

type UploadDocumentArg = {
  type: DocumentType;
  fileUri: string;
};

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query({
      async queryFn() {
        const result = await repositories.documents.getDocuments();
        return mapResult(result);
      },
      providesTags: ['Documents'],
    }),
    getDocument: build.query({
      async queryFn(documentId: string) {
        const result = await repositories.documents.getDocument(documentId);
        return mapResult(result);
      },
      providesTags: (_result, _error, documentId) => [
        { type: 'Documents', id: documentId },
      ],
    }),
    uploadDocument: build.mutation({
      async queryFn({ type, fileUri }: UploadDocumentArg) {
        const result = await repositories.documents.uploadDocument(type, fileUri);
        return mapResult(result);
      },
      invalidatesTags: ['Documents', 'Partner'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useUploadDocumentMutation,
} = documentsApi;
