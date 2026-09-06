import {
  useGetActiveOrderQuery,
  useGetOrderQuery,
  useGetOrdersQuery,
} from '@/src/api/endpoints/ordersApi';
import type { OrderFilter } from '@/src/repositories/interfaces';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Order list / active / detail queries for screens.
 */
export function useOrders(filter?: OrderFilter) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const listQuery = useGetOrdersQuery(filter, { skip: !isAuthenticated });
  const activeQuery = useGetActiveOrderQuery(undefined, {
    skip: !isAuthenticated,
  });

  return {
    orders: listQuery.data ?? [],
    activeOrder: activeQuery.data ?? null,
    isLoading: listQuery.isLoading || activeQuery.isLoading,
    isFetching: listQuery.isFetching || activeQuery.isFetching,
    listError: listQuery.error,
    activeError: activeQuery.error,
    refetchList: listQuery.refetch,
    refetchActive: activeQuery.refetch,
    listQuery,
    activeQuery,
  };
}

/**
 * Single-order detail hook.
 */
export function useOrder(orderId: string | undefined) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const query = useGetOrderQuery(orderId as string, {
    skip: !isAuthenticated || !orderId,
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
