import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notification, NotificationType } from '@shared/models/notification';
import { NotificationApiService } from '@core/services/notification-service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.html',
  styleUrls: ['./notification-center.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class NotificationCenterComponent implements OnInit {
  userId = 1; // ⚠️ remplace par ton user connecté (localStorage / auth service)
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount = 0;

  // valeurs utilisées dans ton HTML
  selectedFilter: 'all' | 'unread' | 'reminder' | 'availability' | 'price_change' | 'new_event' | 'cancellation' = 'all';

  loading = false;

  constructor(private api: NotificationApiService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;

    this.api.getUserNotifications(this.userId).subscribe({
      next: (data) => {
        // normalisation (au cas où isRead ou type arrivent en minuscule)
        this.notifications = this.sortByNewestFirst(
          (data ?? []).map(n => ({
            ...n,
            isRead: !!(n as any).isRead, // force boolean
            type: (String((n as any).type || '').toUpperCase() as NotificationType)
          }))
        );

        this.applyFilter();
        this.refreshUnreadCount();
        this.loading = false;
      },
      error: () => {
        this.notifications = [];
        this.filteredNotifications = [];
        this.unreadCount = 0;
        this.loading = false;
      }
    });
  }

  refreshUnreadCount(): void {
    this.api.getUnreadCount(this.userId).subscribe({
      next: (res) => (this.unreadCount = res?.unreadCount ?? 0),
      error: () => (this.unreadCount = 0)
    });
  }

  onFilterChange(filter: typeof this.selectedFilter): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    // `notifications` est déjà trié du plus récent au plus ancien
    const all = [...this.notifications];

    if (this.selectedFilter === 'all') {
      this.filteredNotifications = all;
      return;
    }

    if (this.selectedFilter === 'unread') {
      this.filteredNotifications = all.filter(n => !n.isRead);
      return;
    }

    // mapping filtre UI -> enum backend
    const map: Record<string, NotificationType> = {
      reminder: 'REMINDER',
      availability: 'AVAILABILITY',
      price_change: 'PRICE_CHANGE',
      new_event: 'NEW_EVENT',
      cancellation: 'CANCELLATION'
    };

    const wantedType = map[this.selectedFilter];
    this.filteredNotifications = all.filter(n => n.type === wantedType);
  }

  /** Plus récent en premier (createdAt décroissant) */
  private sortByNewestFirst(list: Notification[]): Notification[] {
    return [...list].sort((a, b) => {
      const ta = new Date(a.createdAt ?? 0).getTime();
      const tb = new Date(b.createdAt ?? 0).getTime();
      return tb - ta;
    });
  }

  markAsRead(notification: Notification): void {
    if (!notification?.id) return;

    this.api.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.applyFilter();
        this.refreshUnreadCount();
      }
    });
  }

  markAllAsRead(): void {
    this.api.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(n => (n.isRead = true));
        this.applyFilter();
        this.refreshUnreadCount();
      }
    });
  }

  deleteNotification(notification: Notification): void {
    if (!notification?.id) return;

    this.api.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.applyFilter();
        this.refreshUnreadCount();
      }
    });
  }

  // UI helpers
  getNotificationIcon(type: NotificationType | string): string {
    switch (String(type).toUpperCase()) {
      case 'REMINDER': return '⏰';
      case 'AVAILABILITY': return '✅';
      case 'PRICE_CHANGE': return '💰';
      case 'NEW_EVENT': return '🎉';
      case 'CANCELLATION': return '❌';
      default: return '🔔';
    }
  }

  getNotificationColor(type: NotificationType | string): string {
    switch (String(type).toUpperCase()) {
      case 'REMINDER': return '#7c3aed';
      case 'AVAILABILITY': return '#16a34a';
      case 'PRICE_CHANGE': return '#f59e0b';
      case 'NEW_EVENT': return '#0ea5e9';
      case 'CANCELLATION': return '#ef4444';
      default: return '#64748b';
    }
  }
}