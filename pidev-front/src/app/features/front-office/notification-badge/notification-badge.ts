import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationApiService } from '@core/services/notification-service';

@Component({
  selector: 'app-notification-badge',
  standalone: false,
  template: `
    <div class="notification-badge-container">
      <button 
        class="notification-btn"
        (click)="navigateToNotifications()"
        title="Notifications">
        🔔
        <span class="badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
      </button>
    </div>
  `,
  styles: [`
    .notification-badge-container {
      position: relative;
      display: inline-block;
    }

    .notification-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 5px 10px;
      transition: transform 0.3s;
      position: relative;

      &:hover {
        transform: scale(1.1);
      }
    }

    .badge {
      position: absolute;
      top: -5px;
      right: 0;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `]
})
export class NotificationBadge implements OnInit {

  unreadCount: number = 0;

  constructor(
    private api: NotificationApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.getUnreadCount(1).subscribe(
      (res: { unreadCount: number }) => (this.unreadCount = res?.unreadCount ?? 0)
    );
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }
}
