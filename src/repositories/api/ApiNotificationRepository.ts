import type { NotificationRepository } from '@/src/repositories/interfaces/NotificationRepository';
import type { AppNotification, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiNotificationRepository implements NotificationRepository {
  async getNotifications(): Promise<Result<AppNotification[]>> {
    return notConnected();
  }

  async markRead(_notificationId: string): Promise<Result<AppNotification>> {
    return notConnected();
  }

  async markAllRead(): Promise<Result<void>> {
    return notConnected();
  }

  async getUnreadCount(): Promise<Result<number>> {
    return notConnected();
  }
}
