import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import {
  clearSession as clearSecureSession,
  setSession as persistSession,
} from '@/src/services/session';
import {
  clearSession as clearAuthSession,
  setSession as setAuthSession,
} from '@/src/store/slices/authSlice';
import { resetPartnerClientState } from '@/src/store/slices/partnerSlice';
import type { SendOtpRequest, VerifyOtpRequest } from '@/src/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendOtp: build.mutation({
      async queryFn(request: SendOtpRequest) {
        const result = await repositories.auth.sendOtp(request);
        return mapResult(result);
      },
    }),
    verifyOtp: build.mutation({
      async queryFn(request: VerifyOtpRequest) {
        const result = await repositories.auth.verifyOtp(request);
        return mapResult(result);
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Mock auth repo also persists; keep Redux in sync for API mode.
          await persistSession(data.session);
          dispatch(setAuthSession(data.session));
        } catch {
          // Error surfaced via mutation result
        }
      },
    }),
    getSession: build.query({
      async queryFn() {
        const result = await repositories.auth.getSession();
        return mapResult(result);
      },
    }),
    logout: build.mutation<null, void>({
      async queryFn() {
        const result = await repositories.auth.logout();
        if (!result.ok) {
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: result.error.userMessage,
            },
          };
        }
        // RTK Query rejects `{ data: undefined }` — use null for void success.
        return { data: null };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Still clear local session on logout failure
        } finally {
          await clearSecureSession();
          dispatch(baseApi.util.resetApiState());
          dispatch(clearAuthSession());
          dispatch(resetPartnerClientState());
        }
      },
    }),
    refreshSession: build.mutation({
      async queryFn(_arg: void) {
        const result = await repositories.auth.refreshSession();
        return mapResult(result);
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await persistSession(data);
          dispatch(setAuthSession(data));
        } catch {
          await clearSecureSession();
          dispatch(baseApi.util.resetApiState());
          dispatch(clearAuthSession());
          dispatch(resetPartnerClientState());
        }
      },
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useLogoutMutation,
  useRefreshSessionMutation,
} = authApi;
