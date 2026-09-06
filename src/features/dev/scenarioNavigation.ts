import type { Href } from 'expo-router';

import {
  getAuthenticatedHref,
  STATUS_SCREEN_STATUSES,
} from '@/src/features/auth/routing';
import { getDeliveryDeepLink, assignmentHref } from '@/src/features/orders/deliveryRouting';
import type { ScenarioSeed, UiTestScenario } from '@/src/config/scenarios';
import type { OnboardingProgress, Order, PartnerStatus } from '@/src/types';

/**
 * Best post-apply destination for a UI test scenario.
 */
export function getHrefForScenario(input: {
  scenario: UiTestScenario;
  seed: ScenarioSeed;
  partnerStatus?: PartnerStatus;
  onboarding?: OnboardingProgress;
  activeOrder?: Order | null;
}): Href {
  const { scenario, seed, partnerStatus, onboarding, activeOrder } = input;

  if (partnerStatus && STATUS_SCREEN_STATUSES.has(partnerStatus)) {
    return '/(onboarding)/status';
  }

  if (
    partnerStatus === 'PENDING' ||
    scenario === 'onboarding' ||
    scenario === 'pending-verification'
  ) {
    return getAuthenticatedHref(partnerStatus, onboarding);
  }

  if (activeOrder?.status === 'ASSIGNED' || scenario === 'new-order') {
    return assignmentHref(activeOrder?.id);
  }

  if (activeOrder) {
    return getDeliveryDeepLink(activeOrder);
  }

  switch (scenario) {
    case 'earnings':
      return '/(tabs)/earnings';
    case 'incentives':
      return '/incentives';
    case 'support':
      return '/support';
    case 'empty':
    case 'no-orders':
      return '/(tabs)/orders';
    case 'high-demand':
      return '/demand';
    default:
      if (seed.hasEarnings && scenario === 'completed') {
        return '/(tabs)/home';
      }
      return '/(tabs)/home';
  }
}
