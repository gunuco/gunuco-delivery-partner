/** GUNUCO in-app notification domain types */

export type NotificationCategory =
  | 'ORDER'
  | 'EARNINGS'
  | 'INCENTIVES'
  | 'SHIFT'
  | 'ACCOUNT'
  | 'VERIFICATION'
  | 'SUPPORT'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  deepLink?: string;
}
