import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { OrderFilter } from '@/src/repositories/interfaces';
import type { DeliveryVerification, FailReason } from '@/src/types';

type OrderIdArg = string;

type RejectOrderArg = {
  orderId: string;
  reason?: string;
};

type VerifyDeliveryArg = {
  orderId: string;
  verification: DeliveryVerification;
};

type FailDeliveryArg = {
  orderId: string;
  reason: FailReason;
};

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      async queryFn(filter?: OrderFilter) {
        const result = await repositories.orders.getOrders(filter);
        return mapResult(result);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((order) => ({ type: 'Order' as const, id: order.id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
    }),
    getOrder: build.query({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.getOrder(orderId);
        return mapResult(result);
      },
      providesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    getActiveOrder: build.query({
      async queryFn() {
        const result = await repositories.orders.getActiveOrder();
        return mapResult(result);
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Order', id: result.id },
              { type: 'Orders', id: 'ACTIVE' },
            ]
          : [{ type: 'Orders', id: 'ACTIVE' }],
    }),
    acceptOrder: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.acceptOrder(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order', 'Partner'],
    }),
    rejectOrder: build.mutation({
      async queryFn({ orderId, reason }: RejectOrderArg) {
        const result = await repositories.orders.rejectOrder(orderId, reason);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order', 'Partner'],
    }),
    goToPickup: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.goToPickup(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order'],
    }),
    markArrivedAtPickup: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.markArrivedAtPickup(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order'],
    }),
    confirmPickup: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.confirmPickup(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order'],
    }),
    startDelivery: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.startDelivery(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order'],
    }),
    markArrivedAtCustomer: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.markArrivedAtCustomer(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order'],
    }),
    verifyDelivery: build.mutation({
      async queryFn({ orderId, verification }: VerifyDeliveryArg) {
        const result = await repositories.orders.verifyDelivery(
          orderId,
          verification,
        );
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order'],
    }),
    completeDelivery: build.mutation({
      async queryFn(orderId: OrderIdArg) {
        const result = await repositories.orders.completeDelivery(orderId);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order', 'Earnings', 'Incentives', 'Performance', 'Partner'],
    }),
    failDelivery: build.mutation({
      async queryFn({ orderId, reason }: FailDeliveryArg) {
        const result = await repositories.orders.failDelivery(orderId, reason);
        return mapResult(result);
      },
      invalidatesTags: ['Orders', 'Order', 'Performance', 'Partner'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderQuery,
  useLazyGetOrderQuery,
  useGetActiveOrderQuery,
  useLazyGetActiveOrderQuery,
  useAcceptOrderMutation,
  useRejectOrderMutation,
  useGoToPickupMutation,
  useMarkArrivedAtPickupMutation,
  useConfirmPickupMutation,
  useStartDeliveryMutation,
  useMarkArrivedAtCustomerMutation,
  useVerifyDeliveryMutation,
  useCompleteDeliveryMutation,
  useFailDeliveryMutation,
} = ordersApi;
