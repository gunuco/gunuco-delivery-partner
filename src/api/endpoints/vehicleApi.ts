import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { VehicleUpdate } from '@/src/repositories/interfaces';

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVehicle: build.query({
      async queryFn() {
        const result = await repositories.vehicle.getVehicle();
        return mapResult(result);
      },
      providesTags: ['Vehicle'],
    }),
    updateVehicle: build.mutation({
      async queryFn(update: VehicleUpdate) {
        const result = await repositories.vehicle.updateVehicle(update);
        return mapResult(result);
      },
      invalidatesTags: ['Vehicle', 'Partner'],
    }),
  }),
});

export const {
  useGetVehicleQuery,
  useUpdateVehicleMutation,
} = vehicleApi;
