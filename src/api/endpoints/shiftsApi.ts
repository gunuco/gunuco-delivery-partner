import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';

export const shiftsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShifts: build.query({
      async queryFn(date?: string) {
        const result = await repositories.shifts.getShifts(date);
        return mapResult(result);
      },
      providesTags: ['Shifts'],
    }),
    getUpcomingShifts: build.query({
      async queryFn() {
        const result = await repositories.shifts.getUpcoming();
        return mapResult(result);
      },
      providesTags: ['Shifts'],
    }),
    bookShift: build.mutation({
      async queryFn(shiftId: string) {
        const result = await repositories.shifts.bookShift(shiftId);
        return mapResult(result);
      },
      invalidatesTags: ['Shifts'],
    }),
    cancelShift: build.mutation({
      async queryFn(shiftId: string) {
        const result = await repositories.shifts.cancelShift(shiftId);
        return mapResult(result);
      },
      invalidatesTags: ['Shifts'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetUpcomingShiftsQuery,
  useBookShiftMutation,
  useCancelShiftMutation,
} = shiftsApi;
