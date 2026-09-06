import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/src/api/baseApi';
import '@/src/api';

import authReducer from './slices/authSlice';
import partnerReducer from './slices/partnerSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    partner: partnerReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
