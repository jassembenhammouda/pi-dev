export type NotificationType =
  | 'REMINDER'
  | 'AVAILABILITY'
  | 'PRICE_CHANGE'
  | 'NEW_EVENT'
  | 'CANCELLATION';

export interface Notification {
  id: number;
  userId: number;
  eventId?: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO date string
}