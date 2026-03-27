import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WebSocketService } from '@features/messaging/websocket.service';
import { StockService, StockAlert } from '@core/services/stock-service';
import { AuthService } from '@core/services/auth-service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-front',
  standalone: false,
  templateUrl: './header-front.html',
  styleUrl: './header-front.scss'
})
export class HeaderFront implements OnInit, OnDestroy {
  notifications: StockAlert[] = [];
  unreadCount = 0;
  showDropdown = false;
  /** Menu mobile (burger) */
  navOpen = false;
  private sub!: Subscription;
  private navSub!: Subscription;

  constructor(
    private wsService: WebSocketService,
    private stockService: StockService,
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      const uid = this.authService.getCurrentUserId();
      this.stockService.getAlerts().subscribe(alerts => {
        this.notifications = [...alerts].sort((a, b) => {
          const ta = new Date(a.createdAt ?? 0).getTime();
          const tb = new Date(b.createdAt ?? 0).getTime();
          return tb - ta;
        });
        this.unreadCount = this.notifications.length;
      });

      if (uid) {
        this.wsService.connect(uid);
      }

      this.sub = this.wsService.alertReceived$.subscribe((alert: StockAlert) => {
        if (!this.notifications.find(n => n.id === alert.id)) {
          this.notifications.unshift(alert);
          this.unreadCount++;
        }
      });
    }

    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.navOpen = false;
        this.showDropdown = false;
      });
  }

  toggleNav(): void {
    this.navOpen = !this.navOpen;
    if (this.navOpen) {
      this.showDropdown = false;
    }
  }

  closeNavOnNavigate(): void {
    this.navOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-li')) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(alert: StockAlert, event: Event): void {
    event.stopPropagation();
    if (alert.id) {
      this.stockService.markAlertRead(alert.id).subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== alert.id);
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.navSub?.unsubscribe();
  }
}
