import type { NotificationRepository } from '@/src/repositories/interfaces/NotificationRepository';
import type { AppNotification, Result } from '@/src/types';

import { mockStore } from './MockStore';
import { err, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockNotificationRepository implements NotificationRepository {
  async getNotifications(): Promise<Result<AppNotification[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().notifications]);
    });
  }

  async markRead(notificationId: string): Promise<Result<AppNotification>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const list = mockStore.getState().notifications;
      const idx = list.findIndex((n) => n.id === notificationId);
      if (idx < 0) {
        return err(NOT_FOUND('Notification', notificationId));
      }
      const updated = { ...list[idx], read: true };
      const next = [...list];
      next[idx] = updated;
      mockStore.replaceState({ notifications: next });
      return ok(updated);
    });
  }

  async markAllRead(): Promise<Result<void>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      mockStore.replaceState({
        notifications: mockStore
          .getState()
          .notifications.map((n) => ({ ...n, read: true })),
      });
      return ok(undefined);
    });
  }

  async getUnreadCount(): Promise<Result<number>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok(
        mockStore.getState().notifications.filter((n) => !n.read).length,
      );
    });
  }
}
