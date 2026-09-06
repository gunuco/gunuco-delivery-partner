import { useCallback } from 'react';

import {
  useBookShiftMutation,
  useCancelShiftMutation,
  useGetShiftsQuery,
  useGetUpcomingShiftsQuery,
} from '@/src/api/endpoints/shiftsApi';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Shift listing and book / cancel actions.
 */
export function useShifts(date?: string) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const shiftsQuery = useGetShiftsQuery(date, { skip: !isAuthenticated });
  const upcomingQuery = useGetUpcomingShiftsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [bookShiftMutation, bookState] = useBookShiftMutation();
  const [cancelShiftMutation, cancelState] = useCancelShiftMutation();

  const bookShift = useCallback(
    async (shiftId: string) => bookShiftMutation(shiftId).unwrap(),
    [bookShiftMutation],
  );

  const cancelShift = useCallback(
    async (shiftId: string) => cancelShiftMutation(shiftId).unwrap(),
    [cancelShiftMutation],
  );

  return {
    shifts: shiftsQuery.data ?? [],
    upcoming: upcomingQuery.data ?? [],
    isLoading: shiftsQuery.isLoading || upcomingQuery.isLoading,
    isFetching: shiftsQuery.isFetching || upcomingQuery.isFetching,
    error: shiftsQuery.error ?? upcomingQuery.error,
    bookShift,
    cancelShift,
    bookState,
    cancelState,
    refetch: async () => {
      await Promise.all([shiftsQuery.refetch(), upcomingQuery.refetch()]);
    },
  };
}
