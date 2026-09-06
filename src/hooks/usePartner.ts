import { useCallback, useEffect } from 'react';

import {
  useGetMeQuery,
  useGoOfflineMutation,
  useGoOnlineMutation,
} from '@/src/api/endpoints/partnerApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  setAvailability,
  setTogglingAvailability,
} from '@/src/store/slices/partnerSlice';

/**
 * Partner profile + availability toggle with optimistic UI updates.
 */
export function usePartner() {
  const dispatch = useAppDispatch();
  const { availability, isTogglingAvailability } = useAppSelector(
    (state) => state.partner,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const meQuery = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const [goOnlineMutation] = useGoOnlineMutation();
  const [goOfflineMutation] = useGoOfflineMutation();

  useEffect(() => {
    if (meQuery.data?.availability) {
      dispatch(setAvailability(meQuery.data.availability));
    }
  }, [dispatch, meQuery.data?.availability]);

  const goOnline = useCallback(async () => {
    const previous = availability;
    dispatch(setTogglingAvailability(true));
    dispatch(setAvailability('ONLINE'));
    try {
      const partner = await goOnlineMutation(undefined).unwrap();
      dispatch(setAvailability(partner.availability));
      return partner;
    } catch (err) {
      dispatch(setAvailability(previous));
      throw err;
    } finally {
      dispatch(setTogglingAvailability(false));
    }
  }, [availability, dispatch, goOnlineMutation]);

  const goOffline = useCallback(async () => {
    const previous = availability;
    dispatch(setTogglingAvailability(true));
    dispatch(setAvailability('OFFLINE'));
    try {
      const partner = await goOfflineMutation(undefined).unwrap();
      dispatch(setAvailability(partner.availability));
      return partner;
    } catch (err) {
      dispatch(setAvailability(previous));
      throw err;
    } finally {
      dispatch(setTogglingAvailability(false));
    }
  }, [availability, dispatch, goOfflineMutation]);

  return {
    partner: meQuery.data,
    availability: availability ?? meQuery.data?.availability ?? null,
    isTogglingAvailability,
    isLoading: meQuery.isLoading,
    isFetching: meQuery.isFetching,
    error: meQuery.error,
    refetch: meQuery.refetch,
    goOnline,
    goOffline,
  };
}
