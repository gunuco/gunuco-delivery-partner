/** Barrel re-exports for GUNUCO Delivery Partner domain types */

export type {
  PartnerStatus,
  PartnerAvailability,
  Gender,
  BankVerificationStatus,
  Partner,
  PersonalDetails,
  BankDetails,
  OnboardingProgress,
} from './partner';

export type {
  OrderStatus,
  FailReason,
  VerificationMethod,
  GeoPoint,
  Address,
  OrderItem,
  PickupDetails,
  DeliveryDetails,
  Order,
  DeliveryVerification,
} from './order';

export type {
  DeliveryEarningStatus,
  PayoutStatus,
  EarningsSummary,
  EarningsBreakdown,
  DeliveryEarning,
  Payout,
} from './earnings';

export type {
  IncentiveStatus,
  IncentiveTargetType,
  Incentive,
} from './incentive';

export type {
  PerformancePeriod,
  PerformanceMetrics,
  PerformanceTrendPoint,
} from './performance';

export type { ShiftStatus, Shift } from './shift';

export type { NotificationCategory, AppNotification } from './notification';

export type {
  TicketStatus,
  TicketCategory,
  MessageSender,
  SupportMessage,
  SupportTicket,
  FaqItem,
  HelpTopic,
} from './support';

export type {
  DocumentType,
  DocumentStatus,
  PartnerDocument,
} from './document';

export type { VehicleType, OwnershipStatus, Vehicle } from './vehicle';

export type { BenefitStatus, Benefit, InsuranceInfo } from './benefits';

export type { ReferralEntryStatus, ReferralEntry, Referral } from './referral';

export type { DemandLevel, DemandZone } from './demand';

export type {
  AuthSession,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './auth';

export type { AsyncStatus, AppError, Result, Paginated } from './common';
