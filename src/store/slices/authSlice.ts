import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AsyncStatus, AuthSession } from '@/src/types';

export interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  status: AsyncStatus;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  isHydrated: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload;
      state.isAuthenticated = true;
      state.status = 'success';
      state.error = null;
    },
    clearSession(state) {
      state.session = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
    setAuthStatus(
      state,
      action: PayloadAction<{ status: AsyncStatus; error?: string | null }>,
    ) {
      state.status = action.payload.status;
      if (action.payload.error !== undefined) {
        state.error = action.payload.error;
      }
    },
  },
});

export const { setSession, clearSession, setHydrated, setAuthStatus } =
  authSlice.actions;

export default authSlice.reducer;
