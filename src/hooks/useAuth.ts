import { useCallback } from 'react';

import {
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@/src/api/endpoints/authApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setAuthStatus } from '@/src/store/slices/authSlice';
import type { SendOtpRequest, VerifyOtpRequest } from '@/src/types';

/**
 * Auth login / logout surface for screens.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { session, isAuthenticated, isHydrated, status, error } = useAppSelector(
    (state) => state.auth,
  );

  const [sendOtpMutation, sendOtpState] = useSendOtpMutation();
  const [verifyOtpMutation, verifyOtpState] = useVerifyOtpMutation();
  const [logoutMutation, logoutState] = useLogoutMutation();

  const sendOtp = useCallback(
    async (request: SendOtpRequest) => {
      dispatch(setAuthStatus({ status: 'loading', error: null }));
      try {
        const data = await sendOtpMutation(request).unwrap();
        dispatch(setAuthStatus({ status: 'success', error: null }));
        return data;
      } catch (err) {
        const message =
          typeof err === 'object' &&
          err !== null &&
          'error' in err &&
          typeof (err as { error: unknown }).error === 'string'
            ? (err as { error: string }).error
            : 'Unable to send OTP';
        dispatch(setAuthStatus({ status: 'error', error: message }));
        throw err;
      }
    },
    [dispatch, sendOtpMutation],
  );

  const verifyOtp = useCallback(
    async (request: VerifyOtpRequest) => {
      dispatch(setAuthStatus({ status: 'loading', error: null }));
      try {
        const data = await verifyOtpMutation(request).unwrap();
        dispatch(setAuthStatus({ status: 'success', error: null }));
        return data;
      } catch (err) {
        const message =
          typeof err === 'object' &&
          err !== null &&
          'error' in err &&
          typeof (err as { error: unknown }).error === 'string'
            ? (err as { error: string }).error
            : 'Unable to verify OTP';
        dispatch(setAuthStatus({ status: 'error', error: message }));
        throw err;
      }
    },
    [dispatch, verifyOtpMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation(undefined).unwrap().catch(() => undefined);
  }, [logoutMutation]);

  return {
    session,
    isAuthenticated,
    isHydrated,
    status,
    error,
    sendOtp,
    verifyOtp,
    logout,
    sendOtpState,
    verifyOtpState,
    logoutState,
  };
}
