import { useCallback, useEffect, useRef } from 'react';

import { baseApi } from '@/src/api/baseApi';
import { getSession } from '@/src/services/session';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  clearSession,
  setAuthStatus,
  setHydrated,
  setSession,
} from '@/src/store/slices/authSlice';

/**
 * Loads SecureStore session once on app start and hydrates auth slice.
 * Call from the root layout / app bootstrap.
 */
export function useSessionHydration() {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const startedRef = useRef(false);

  const hydrate = useCallback(async () => {
    dispatch(setAuthStatus({ status: 'loading', error: null }));
    try {
      const session = await getSession();
      if (session) {
        dispatch(setSession(session));
      } else {
        dispatch(clearSession());
        dispatch(baseApi.util.resetApiState());
      }
      dispatch(setAuthStatus({ status: 'success', error: null }));
    } catch {
      dispatch(clearSession());
      dispatch(setAuthStatus({ status: 'error', error: 'Failed to restore session' }));
    } finally {
      dispatch(setHydrated(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (startedRef.current || isHydrated) {
      return;
    }
    startedRef.current = true;
    void hydrate();
  }, [hydrate, isHydrated]);

  return {
    isHydrated,
    rehydrate: hydrate,
  };
}
