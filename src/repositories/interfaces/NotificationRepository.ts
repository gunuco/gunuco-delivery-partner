import type { AppNotification, Result } from '@/src/types';

export interface NotificationRepository {
  getNotifications(): Promise<Result<AppNotification[]>>;
  markRead(notificationId: string): Promise<Result<AppNotification>>;
  markAllRead(): Promise<Result<void>>;
  getUnreadCount(): Promise<Result<number>>;
}
