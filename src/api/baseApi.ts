import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export type ApiCustomError = {
  status: 'CUSTOM_ERROR';
  error: string;
};

export const apiTagTypes = [
  'Partner',
  'Orders',
  'Order',
  'Earnings',
  'Incentives',
  'Performance',
  'Shifts',
  'Demand',
  'Notifications',
  'Support',
  'Documents',
  'Vehicle',
  'Benefits',
  'Referral',
] as const;

export type ApiTagType = (typeof apiTagTypes)[number];

/**
 * Empty RTK Query API. Domain endpoints are injected from `src/api/endpoints/*`.
 * Uses `fakeBaseQuery` so each endpoint calls repositories via `queryFn`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<ApiCustomError>(),
  tagTypes: [...apiTagTypes],
  endpoints: () => ({}),
});

/** Clears all RTK Query cached data (call on logout / 401). */
export const resetApiState = baseApi.util.resetApiState;
