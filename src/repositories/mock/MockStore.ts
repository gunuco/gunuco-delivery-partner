import type {
  AppNotification,
  AuthSession,
  BankDetails,
  Benefit,
  DemandZone,
  DeliveryEarning,
  FaqItem,
  HelpTopic,
  Incentive,
  InsuranceInfo,
  OnboardingProgress,
  Order,
  Partner,
  PartnerDocument,
  PerformanceMetrics,
  PerformanceTrendPoint,
  PersonalDetails,
  Payout,
  Referral,
  Shift,
  SupportTicket,
  Vehicle,
} from '@/src/types';

import { createFullSeed, type SeedBundle } from './seedData';

export interface PendingOtp {
  requestId: string;
  phone: string;
  /** Intentionally never logged by repositories */
  otp: string;
  expiresAtMs: number;
}

export interface MockStoreState {
  session: AuthSession | null;
  partner: Partner;
  personalDetails: PersonalDetails;
  bankDetails: BankDetails;
  onboarding: OnboardingProgress;
  orders: Order[];
  earnings: DeliveryEarning[];
  payouts: Payout[];
  incentives: Incentive[];
  performance: PerformanceMetrics;
  performanceTrend: PerformanceTrendPoint[];
  shifts: Shift[];
  demandZones: DemandZone[];
  notifications: AppNotification[];
  tickets: SupportTicket[];
  faqs: FaqItem[];
  helpTopics: HelpTopic[];
  documents: PartnerDocument[];
  vehicle: Vehicle;
  benefits: Benefit[];
  insurance: InsuranceInfo;
  referral: Referral;
  pendingOtps: PendingOtp[];
  forceError: boolean;
  networkDegraded: boolean;
  /** Scenario id last applied */
  activeScenario: string;
}

function cloneSeed(bundle: SeedBundle): Omit<
  MockStoreState,
  'pendingOtps' | 'forceError' | 'networkDegraded' | 'activeScenario'
> {
  return {
    session: bundle.session ? { ...bundle.session } : null,
    partner: { ...bundle.partner },
    personalDetails: { ...bundle.personalDetails },
    bankDetails: { ...bundle.bankDetails },
    onboarding: {
      ...bundle.onboarding,
      completedSteps: [...bundle.onboarding.completedSteps],
      requiredSteps: [...bundle.onboarding.requiredSteps],
    },
    orders: bundle.orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        ...i,
        handlingInstructions: [...i.handlingInstructions],
      })),
      pickup: {
        ...o.pickup,
        address: { ...o.pickup.address, coordinates: o.pickup.address.coordinates
          ? { ...o.pickup.address.coordinates }
          : undefined },
      },
      delivery: {
        ...o.delivery,
        address: {
          ...o.delivery.address,
          coordinates: o.delivery.address.coordinates
            ? { ...o.delivery.address.coordinates }
            : undefined,
        },
      },
    })),
    earnings: bundle.earnings.map((e) => ({
      ...e,
      breakdown: { ...e.breakdown },
    })),
    payouts: bundle.payouts.map((p) => ({ ...p })),
    incentives: bundle.incentives.map((i) => ({ ...i })),
    performance: { ...bundle.performance },
    performanceTrend: bundle.performanceTrend.map((p) => ({ ...p })),
    shifts: bundle.shifts.map((s) => ({ ...s })),
    demandZones: bundle.demandZones.map((z) => ({
      ...z,
      center: { ...z.center },
    })),
    notifications: bundle.notifications.map((n) => ({ ...n })),
    tickets: bundle.tickets.map((t) => ({
      ...t,
      messages: t.messages?.map((m) => ({ ...m })),
    })),
    faqs: bundle.faqs.map((f) => ({ ...f })),
    helpTopics: bundle.helpTopics.map((h) => ({ ...h })),
    documents: bundle.documents.map((d) => ({ ...d })),
    vehicle: { ...bundle.vehicle },
    benefits: bundle.benefits.map((b) => ({ ...b })),
    insurance: { ...bundle.insurance },
    referral: {
      ...bundle.referral,
      history: bundle.referral.history.map((h) => ({ ...h })),
    },
  };
}

function createInitialState(): MockStoreState {
  const seed = createFullSeed({ loggedIn: true });
  return {
    ...cloneSeed(seed),
    pendingOtps: [],
    forceError: false,
    networkDegraded: false,
    activeScenario: 'default',
  };
}

class MockStoreImpl {
  private state: MockStoreState = createInitialState();

  getState(): MockStoreState {
    return this.state;
  }

  reset(bundle?: SeedBundle): void {
    const seed = bundle ?? createFullSeed({ loggedIn: true });
    this.state = {
      ...cloneSeed(seed),
      pendingOtps: [],
      forceError: false,
      networkDegraded: false,
      activeScenario: 'default',
    };
  }

  replaceState(partial: Partial<MockStoreState>): void {
    this.state = { ...this.state, ...partial };
  }

  patchPartner(patch: Partial<Partner>): Partner {
    this.state.partner = {
      ...this.state.partner,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    return this.state.partner;
  }

  setSession(session: AuthSession | null): void {
    this.state.session = session;
  }

  upsertOrder(order: Order): Order {
    const idx = this.state.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      this.state.orders[idx] = order;
    } else {
      this.state.orders = [order, ...this.state.orders];
    }
    return order;
  }

  findOrder(id: string): Order | undefined {
    return this.state.orders.find((o) => o.id === id);
  }

  addEarning(earning: DeliveryEarning): void {
    this.state.earnings = [earning, ...this.state.earnings];
  }

  updateIncentiveProgress(ordersDelta = 1, earningsPaiseDelta = 0): void {
    this.state.incentives = this.state.incentives.map((inc) => {
      if (inc.status !== 'ACTIVE') {
        return inc;
      }
      let currentValue = inc.currentValue;
      if (inc.targetType === 'ORDERS' || inc.targetType === 'WEEKLY' || inc.targetType === 'PEAK_HOURS') {
        currentValue += ordersDelta;
      }
      if (inc.targetType === 'EARNINGS') {
        currentValue += earningsPaiseDelta;
      }
      const completed = currentValue >= inc.targetValue;
      const remaining = Math.max(inc.targetValue - currentValue, 0);
      let remainingLabel = inc.remainingLabel;
      if (inc.targetType === 'EARNINGS') {
        remainingLabel = remaining > 0 ? `₹${Math.ceil(remaining / 100)} left` : 'Target reached';
      } else {
        remainingLabel = remaining > 0 ? `${remaining} orders left` : 'Target reached';
      }
      return {
        ...inc,
        currentValue: Math.min(currentValue, inc.targetValue),
        status: completed ? 'COMPLETED' : 'ACTIVE',
        remainingLabel,
      };
    });
  }

  bumpPerformanceOnComplete(distanceKm: number): void {
    const p = this.state.performance;
    this.state.performance = {
      ...p,
      ordersCompleted: p.ordersCompleted + 1,
      distanceTravelledKm: Math.round((p.distanceTravelledKm + distanceKm) * 10) / 10,
      partnerScore: Math.min(100, p.partnerScore + 0.2),
      completionRate: Math.min(1, p.completionRate + 0.001),
    };
    this.state.partner = {
      ...this.state.partner,
      totalDeliveries: this.state.partner.totalDeliveries + 1,
      updatedAt: new Date().toISOString(),
    };
  }

  addPendingOtp(entry: PendingOtp): void {
    this.state.pendingOtps = [
      ...this.state.pendingOtps.filter((p) => p.phone !== entry.phone),
      entry,
    ];
  }

  takePendingOtp(requestId: string): PendingOtp | undefined {
    const found = this.state.pendingOtps.find((p) => p.requestId === requestId);
    if (found) {
      this.state.pendingOtps = this.state.pendingOtps.filter((p) => p.requestId !== requestId);
    }
    return found;
  }
}

/** Singleton stateful in-memory store for mock repositories. */
export const mockStore = new MockStoreImpl();

export type MockStore = MockStoreImpl;
