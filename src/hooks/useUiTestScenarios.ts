import { useCallback, useMemo, useState } from 'react';
import type { Href } from 'expo-router';

import { appConfig } from '@/src/config/env';
import {
  UI_TEST_SCENARIO_LIST,
  type UiTestScenario,
  isUiTestScenario,
} from '@/src/config/scenarios';
import { resetApiState } from '@/src/api/baseApi';
import { getHrefForScenario } from '@/src/features/dev/scenarioNavigation';
import {
  getActiveScenarioName,
  reseedScenario,
} from '@/src/repositories/mock/scenarioSeeder';
import { mockStore } from '@/src/repositories/mock/MockStore';
import { clearSession, setSession } from '@/src/services/session';
import { useAppDispatch } from '@/src/store/hooks';
import {
  clearSession as clearAuthSession,
  setSession as setAuthSession,
} from '@/src/store/slices/authSlice';
import { setAvailability } from '@/src/store/slices/partnerSlice';

const ACTIVE_ORDER_STATUSES = new Set([
  'ASSIGNED',
  'ACCEPTED',
  'GOING_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'GOING_TO_CUSTOMER',
  'ARRIVED_AT_CUSTOMER',
  'DELIVERY_VERIFICATION',
]);

export function useUiTestScenarios() {
  const dispatch = useAppDispatch();
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState(() => getActiveScenarioName());

  const isAvailable =
    !appConfig.isProduction &&
    appConfig.uiTestMode &&
    appConfig.dataMode === 'mock';

  const scenarios = useMemo(() => UI_TEST_SCENARIO_LIST, []);

  const applyScenario = useCallback(
    async (scenarioId: string): Promise<{ ok: true; href: Href } | { ok: false; message: string }> => {
      if (!isAvailable) {
        return {
          ok: false,
          message: 'UI Test Mode is only available in mock development builds.',
        };
      }
      if (!isUiTestScenario(scenarioId)) {
        return { ok: false, message: 'Unknown scenario.' };
      }

      setApplyingId(scenarioId);
      try {
        const seed = reseedScenario(scenarioId, { forceLoggedIn: true });
        const state = mockStore.getState();

        if (state.session) {
          await setSession(state.session);
          dispatch(setAuthSession(state.session));
        } else {
          await clearSession();
          dispatch(clearAuthSession());
        }

        dispatch(setAvailability(state.partner.availability));
        dispatch(resetApiState());
        setActiveId(scenarioId);

        const activeOrder =
          state.orders.find((o) => ACTIVE_ORDER_STATUSES.has(o.status)) ?? null;

        const href = getHrefForScenario({
          scenario: scenarioId as UiTestScenario,
          seed,
          partnerStatus: state.partner.status,
          onboarding: state.onboarding,
          activeOrder,
        });

        return { ok: true, href };
      } finally {
        setApplyingId(null);
      }
    },
    [dispatch, isAvailable],
  );

  return {
    isAvailable,
    scenarios,
    activeId,
    applyingId,
    applyScenario,
  };
}
