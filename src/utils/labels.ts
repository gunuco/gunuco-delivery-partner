import type {
  DemandLevel,
  DocumentType,
  IncentiveStatus,
  NotificationCategory,
  PayoutStatus,
  ShiftStatus,
  TicketCategory,
  TicketStatus,
  VehicleType,
} from '@/src/types';

export function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  DRIVING_LICENCE: 'Driving licence',
  RC: 'Vehicle RC',
  INSURANCE: 'Vehicle insurance',
  IDENTITY: 'Identity proof',
  PROFILE_PHOTO: 'Profile photo',
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  TWO_WHEELER: 'Two-wheeler',
  THREE_WHEELER: 'Three-wheeler',
  EV_SCOOTER: 'EV scooter',
  OTHER: 'Other',
};

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  ORDER: 'Orders',
  EARNINGS: 'Earnings',
  INCENTIVES: 'Incentives',
  SHIFT: 'Shifts',
  ACCOUNT: 'Account',
  VERIFICATION: 'Verification',
  SUPPORT: 'Support',
  SYSTEM: 'System',
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  PICKUP_ISSUE: 'Pickup issue',
  CUSTOMER_ISSUE: 'Customer issue',
  PAYMENT_EARNINGS: 'Payment & earnings',
  APP_PROBLEM: 'App problem',
  ACCOUNT_ISSUE: 'Account issue',
  VEHICLE_ISSUE: 'Vehicle issue',
  DOCUMENT_ISSUE: 'Document issue',
  OTHER: 'Other',
};

export function demandLevelTone(
  level: DemandLevel,
): 'danger' | 'warning' | 'success' | 'neutral' {
  switch (level) {
    case 'HIGH':
      return 'danger';
    case 'NORMAL':
      return 'warning';
    case 'LOW':
      return 'success';
    default:
      return 'neutral';
  }
}

export function incentiveStatusTone(
  status: IncentiveStatus,
): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
  switch (status) {
    case 'ACTIVE':
      return 'info';
    case 'COMPLETED':
      return 'success';
    case 'EXPIRED':
      return 'neutral';
    case 'LOCKED':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function shiftStatusTone(
  status: ShiftStatus,
): 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'primary' {
  switch (status) {
    case 'AVAILABLE':
      return 'info';
    case 'BOOKED':
      return 'primary';
    case 'ACTIVE':
      return 'success';
    case 'COMPLETED':
      return 'neutral';
    case 'MISSED':
    case 'CANCELLED':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function payoutStatusTone(
  status: PayoutStatus,
): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
  switch (status) {
    case 'PAID':
      return 'success';
    case 'PROCESSING':
      return 'info';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function ticketStatusTone(
  status: TicketStatus,
): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
  switch (status) {
    case 'OPEN':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'RESOLVED':
      return 'success';
    case 'CLOSED':
      return 'neutral';
    default:
      return 'neutral';
  }
}
