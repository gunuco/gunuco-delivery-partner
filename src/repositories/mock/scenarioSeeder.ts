import { appConfig } from '@/src/config/env';
import {
  getScenarioSeed,
  isUiTestScenario,
  type ScenarioSeed,
  type UiTestScenario,
} from '@/src/config/scenarios';
import type { OrderStatus, PartnerStatus } from '@/src/types';
import { logger } from '@/src/services/logger';

import { mockStore } from './MockStore';
import {
  createActiveOrderTemplate,
  createFullSeed,
  createSeedDemandZones,
  createSeedDocuments,
  createSeedIncentives,
  createSeedOnboarding,
  createSeedOrders,
  createSeedTickets,
  SEED_PARTNER_ID,
} from './seedData';

const ACTIVE_STATUSES: ReadonlySet<OrderStatus> = new Set([
  'ASSIGNED',
  'ACCEPTED',
  'GOING_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'GOING_TO_CUSTOMER',
  'ARRIVED_AT_CUSTOMER',
  'DELIVERY_VERIFICATION',
]);

function onboardingForStatus(status: PartnerStatus) {
  if (status === 'PENDING') {
    return createSeedOnboarding({
      currentStep: 'DOCUMENTS',
      completedSteps: ['PHONE_VERIFIED', 'PERSONAL_DETAILS'],
    });
  }
  if (status === 'UNDER_REVIEW' || status === 'ACTION_REQUIRED') {
    return createSeedOnboarding({
      currentStep: 'SUBMITTED',
      completedSteps: [
        'PHONE_VERIFIED',
        'PERSONAL_DETAILS',
        'DOCUMENTS',
        'VEHICLE',
        'BANK',
        'TRAINING',
        'SUBMITTED',
      ],
    });
  }
  return createSeedOnboarding();
}

function applyScenarioSeed(
  scenario: UiTestScenario,
  seed: ScenarioSeed,
  options?: { forceLoggedIn?: boolean },
): void {
  // In-app QA switcher keeps a session so gated onboarding/status screens are reachable.
  const loggedIn =
    options?.forceLoggedIn === true ? true : scenario !== 'onboarding';
  const bundle = createFullSeed({
    loggedIn,
    partnerOverrides: {
      status: seed.partnerStatus,
      availability: seed.availability,
      onboardingStep:
        seed.partnerStatus === 'PENDING'
          ? 'DOCUMENTS'
          : seed.partnerStatus === 'UNDER_REVIEW'
            ? 'SUBMITTED'
            : 'COMPLETED',
    },
  });

  mockStore.reset(bundle);

  const partner = mockStore.getState().partner;
  mockStore.replaceState({
    onboarding: onboardingForStatus(seed.partnerStatus),
    documents: createSeedDocuments(
      seed.partnerStatus === 'APPROVED' || seed.partnerStatus === 'SUSPENDED',
    ),
    forceError: seed.forceError,
    networkDegraded: seed.networkDegraded,
    activeScenario: scenario,
    tickets: createSeedTickets(seed.hasSupportTickets),
    demandZones: createSeedDemandZones(seed.demandLevel),
  });

  if (!seed.hasEarnings) {
    mockStore.replaceState({
      earnings: [],
      payouts: [],
    });
  }

  if (!seed.hasIncentives) {
    mockStore.replaceState({ incentives: [] });
  } else if (scenario === 'incentives') {
    mockStore.replaceState({ incentives: createSeedIncentives() });
  }

  if (seed.showEmptyStates || scenario === 'no-orders' || scenario === 'empty') {
    mockStore.replaceState({
      orders: [],
      notifications: seed.showEmptyStates ? [] : mockStore.getState().notifications,
    });
  } else {
    let orders = createSeedOrders(partner.id);

    if (seed.activeOrderStatus) {
      const active = createActiveOrderTemplate(partner.id, seed.activeOrderStatus);
      // Remove duplicate assigned GN10284 seed when scenario supplies active order
      orders = orders.filter((o) => o.orderNumber !== active.orderNumber || o.status === 'DELIVERED');
      orders = [active, ...orders.filter((o) => o.id !== active.id)];
    } else {
      // Default/online: keep assigned order only for new-order-like dashboards;
      // for online waiting, drop ASSIGNED so home is clean.
      if (
        scenario === 'online' ||
        scenario === 'offline' ||
        scenario === 'approved' ||
        scenario === 'default' ||
        scenario === 'high-demand' ||
        scenario === 'earnings' ||
        scenario === 'incentives' ||
        scenario === 'support'
      ) {
        orders = orders.filter((o) => o.status !== 'ASSIGNED');
      }
    }

    mockStore.replaceState({ orders });
  }

  // Completed / failed scenarios should not leave other active orders around
  if (
    seed.activeOrderStatus === 'DELIVERED' ||
    seed.activeOrderStatus === 'FAILED'
  ) {
    const orders = mockStore.getState().orders.map((o) => {
      if (o.id === 'order_active_scenario') {
        return o;
      }
      if (ACTIVE_STATUSES.has(o.status)) {
        return { ...o, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    mockStore.replaceState({ orders });
  }

  if (seed.partnerStatus === 'PENDING' || seed.partnerStatus === 'UNDER_REVIEW') {
    mockStore.replaceState({ session: mockStore.getState().session });
  }

  logger.info('Mock store seeded for UI scenario', {
    scenario,
    partnerId: SEED_PARTNER_ID,
    partnerStatus: seed.partnerStatus,
    availability: seed.availability,
    activeOrderStatus: seed.activeOrderStatus,
  });
}

export type ApplyScenarioOptions = {
  /** Keep SecureStore-ready mock session even for onboarding scenarios (in-app QA). */
  forceLoggedIn?: boolean;
};

/**
 * Reads appConfig.uiTestScenario (or default) and resets the mock store.
 * Call once when creating mock repositories.
 */
export function applyUiTestScenario(
  scenarioName?: string,
  options?: ApplyScenarioOptions,
): ScenarioSeed {
  const raw =
    scenarioName ??
    (appConfig.uiTestMode ? appConfig.uiTestScenario : 'default') ??
    'default';
  const scenario: UiTestScenario = isUiTestScenario(raw) ? raw : 'default';
  const seed = getScenarioSeed(scenario);
  applyScenarioSeed(scenario, seed, options);
  return seed;
}

export function reseedScenario(
  scenario: string,
  options?: ApplyScenarioOptions,
): ScenarioSeed {
  return applyUiTestScenario(scenario, options);
}

/** Current scenario id stored on the mock store (empty when not mock). */
export function getActiveScenarioName(): string {
  return mockStore.getState().activeScenario;
}
