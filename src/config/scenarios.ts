import type { DemandLevel } from '../types/demand';
import type { OrderStatus } from '../types/order';
import type { PartnerAvailability, PartnerStatus } from '../types/partner';

/**
 * Centralized UI Test Mode scenarios for GUNUCO Delivery Partner.
 * Seed mock repositories from these — never branch on UI_TEST_MODE in screens.
 */
export type UiTestScenario =
  | 'default'
  | 'onboarding'
  | 'pending-verification'
  | 'approved'
  | 'offline'
  | 'online'
  | 'new-order'
  | 'active-pickup'
  | 'active-delivery'
  | 'delivery-verification'
  | 'completed'
  | 'failed-delivery'
  | 'high-demand'
  | 'earnings'
  | 'incentives'
  | 'empty'
  | 'error'
  | 'no-orders'
  | 'support'
  | 'poor-network';

export interface ScenarioSeed {
  partnerStatus: PartnerStatus;
  availability: PartnerAvailability;
  /** Null means no active order for the scenario */
  activeOrderStatus: OrderStatus | null;
  hasEarnings: boolean;
  hasIncentives: boolean;
  demandLevel: DemandLevel;
  showEmptyStates: boolean;
  forceError: boolean;
  networkDegraded: boolean;
  hasSupportTickets: boolean;
  description: string;
}

export const SCENARIO_DEFAULTS: Record<UiTestScenario, ScenarioSeed> = {
  default: {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Approved partner online with typical home dashboard data',
  },
  onboarding: {
    partnerStatus: 'PENDING',
    availability: 'UNAVAILABLE',
    activeOrderStatus: null,
    hasEarnings: false,
    hasIncentives: false,
    demandLevel: 'LOW',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'New partner mid-onboarding (personal details / documents)',
  },
  'pending-verification': {
    partnerStatus: 'UNDER_REVIEW',
    availability: 'UNAVAILABLE',
    activeOrderStatus: null,
    hasEarnings: false,
    hasIncentives: false,
    demandLevel: 'LOW',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Documents submitted; partner awaiting GUNUCO verification',
  },
  approved: {
    partnerStatus: 'APPROVED',
    availability: 'OFFLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Freshly approved partner ready to go online',
  },
  offline: {
    partnerStatus: 'APPROVED',
    availability: 'OFFLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Approved partner currently offline',
  },
  online: {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Partner online waiting for assignments',
  },
  'new-order': {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: 'ASSIGNED',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Incoming assignment (e.g. GN10284) awaiting accept/reject',
  },
  'active-pickup': {
    partnerStatus: 'APPROVED',
    availability: 'BUSY',
    activeOrderStatus: 'GOING_TO_PICKUP',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Partner en route to GUNUCO hub pickup',
  },
  'active-delivery': {
    partnerStatus: 'APPROVED',
    availability: 'BUSY',
    activeOrderStatus: 'GOING_TO_CUSTOMER',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Cake order picked up; heading to customer area',
  },
  'delivery-verification': {
    partnerStatus: 'APPROVED',
    availability: 'BUSY',
    activeOrderStatus: 'DELIVERY_VERIFICATION',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'At customer; OTP/QR/photo/signature verification in progress',
  },
  completed: {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: 'DELIVERED',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Just completed a delivery; earnings updated',
  },
  'failed-delivery': {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: 'FAILED',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: true,
    description: 'Failed delivery with structured fail reason',
  },
  'high-demand': {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'HIGH',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'High demand around Jubilee Hills / Film Nagar zones',
  },
  earnings: {
    partnerStatus: 'APPROVED',
    availability: 'OFFLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: false,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Rich earnings, breakdowns, and payout history',
  },
  incentives: {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Active weekly / peak-hour incentive progress cards',
  },
  empty: {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: false,
    hasIncentives: false,
    demandLevel: 'LOW',
    showEmptyStates: true,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Empty states across home, orders, earnings',
  },
  error: {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: false,
    hasIncentives: false,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: true,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Repository layer returns recoverable AppError',
  },
  'no-orders': {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'LOW',
    showEmptyStates: true,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: false,
    description: 'Online with no active or recent orders',
  },
  support: {
    partnerStatus: 'APPROVED',
    availability: 'OFFLINE',
    activeOrderStatus: null,
    hasEarnings: true,
    hasIncentives: false,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: false,
    hasSupportTickets: true,
    description: 'Open support tickets and FAQ help topics',
  },
  'poor-network': {
    partnerStatus: 'APPROVED',
    availability: 'ONLINE',
    activeOrderStatus: 'GOING_TO_CUSTOMER',
    hasEarnings: true,
    hasIncentives: true,
    demandLevel: 'NORMAL',
    showEmptyStates: false,
    forceError: false,
    networkDegraded: true,
    hasSupportTickets: false,
    description: 'Degraded network while on an active delivery',
  },
};

export function isUiTestScenario(value: string): value is UiTestScenario {
  return Object.prototype.hasOwnProperty.call(SCENARIO_DEFAULTS, value);
}

export function getScenarioSeed(scenario: string): ScenarioSeed {
  if (isUiTestScenario(scenario)) {
    return SCENARIO_DEFAULTS[scenario];
  }
  return SCENARIO_DEFAULTS.default;
}
