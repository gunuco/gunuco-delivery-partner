import type { PartnerStatus } from '../types/partner';

export interface PartnerStatusMeta {
  title: string;
  description: string;
  icon: string;
  colorToken: string;
  canGoOnline: boolean;
}

export const PARTNER_STATUS_META: Record<PartnerStatus, PartnerStatusMeta> = {
  PENDING: {
    title: 'Pending setup',
    description: 'Complete onboarding to start delivering with GUNUCO.',
    icon: 'partnerPending',
    colorToken: 'status.warning',
    canGoOnline: false,
  },
  UNDER_REVIEW: {
    title: 'Under review',
    description: 'Your documents are being verified by the GUNUCO team.',
    icon: 'partnerReview',
    colorToken: 'status.info',
    canGoOnline: false,
  },
  APPROVED: {
    title: 'Approved',
    description: 'You are approved to go online and accept orders.',
    icon: 'partnerApproved',
    colorToken: 'status.success',
    canGoOnline: true,
  },
  REJECTED: {
    title: 'Rejected',
    description: 'Application was not approved. Contact support for next steps.',
    icon: 'partnerRejected',
    colorToken: 'status.danger',
    canGoOnline: false,
  },
  ACTION_REQUIRED: {
    title: 'Action required',
    description: 'Update documents or details to continue verification.',
    icon: 'partnerActionRequired',
    colorToken: 'status.warning',
    canGoOnline: false,
  },
  SUSPENDED: {
    title: 'Suspended',
    description: 'Account temporarily suspended. Contact GUNUCO support.',
    icon: 'partnerSuspended',
    colorToken: 'status.danger',
    canGoOnline: false,
  },
};
