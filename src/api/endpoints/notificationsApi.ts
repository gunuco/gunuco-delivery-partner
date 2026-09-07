import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query({
      async queryFn() {
        const result = await repositories.notifications.getNotifications();
        return mapResult(result);
      },
      providesTags: ['Notifications'],
    }),
    getUnreadNotificationCount: build.query({
      async queryFn() {
        const result = await repositories.notifications.getUnreadCount();
        return mapResult(result);
      },
      providesTags: ['Notifications'],
    }),
    markNotificationRead: build.mutation({
      async queryFn(notificationId: string) {
        const result = await repositories.notifications.markRead(notificationId);
        return mapResult(result);
      },
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsRead: build.mutation<null, void>({
      async queryFn() {
        const result = await repositories.notifications.markAllRead();
        if (!result.ok) {
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: result.error.userMessage,
            },
          };
        }
        return { data: null };
      },
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
