import { useCallback } from 'react';

import {
  useGetVehicleQuery,
  useUpdateVehicleMutation,
} from '@/src/api/endpoints/vehicleApi';
import type { VehicleUpdate } from '@/src/repositories/interfaces';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Partner vehicle profile.
 */
export function useVehicle() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const vehicleQuery = useGetVehicleQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateMutation, updateState] = useUpdateVehicleMutation();

  const updateVehicle = useCallback(
    async (update: VehicleUpdate) => updateMutation(update).unwrap(),
    [updateMutation],
  );

  return {
    vehicle: vehicleQuery.data ?? null,
    isLoading: vehicleQuery.isLoading,
    isFetching: vehicleQuery.isFetching,
    error: vehicleQuery.error,
    updateVehicle,
    updateState,
    refetch: vehicleQuery.refetch,
  };
}
