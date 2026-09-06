/** GUNUCO partner document verification domain types */

export type DocumentType =
  | 'DRIVING_LICENCE'
  | 'RC'
  | 'INSURANCE'
  | 'IDENTITY'
  | 'PROFILE_PHOTO';

export type DocumentStatus =
  | 'NOT_UPLOADED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export interface PartnerDocument {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl?: string;
  uploadedAt?: string;
  expiryDate?: string;
  rejectionReason?: string;
}
