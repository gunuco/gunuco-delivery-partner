import { useCallback } from 'react';

import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/src/api/endpoints/notificationsApi';
import { useAppSelector } from '@/src/store/hooks';

/**
 * In-app notifications list and read actions.
 */
export function useNotifications() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const listQuery = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const unreadQuery = useGetUnreadNotificationCountQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [markReadMutation, markReadState] = useMarkNotificationReadMutation();
  const [markAllReadMutation, markAllReadState] =
    useMarkAllNotificationsReadMutation();

  const markRead = useCallback(
    async (notificationId: string) =>
      markReadMutation(notificationId).unwrap(),
    [markReadMutation],
  );

  const markAllRead = useCallback(
    async () => markAllReadMutation(undefined).unwrap(),
    [markAllReadMutation],
  );

  return {
    notifications: listQuery.data ?? [],
    unreadCount: unreadQuery.data ?? 0,
    isLoading: listQuery.isLoading || unreadQuery.isLoading,
    isFetching: listQuery.isFetching || unreadQuery.isFetching,
    error: listQuery.error ?? unreadQuery.error,
    markRead,
    markAllRead,
    markReadState,
    markAllReadState,
    refetch: async () => {
      await Promise.all([listQuery.refetch(), unreadQuery.refetch()]);
    },
  };
}
