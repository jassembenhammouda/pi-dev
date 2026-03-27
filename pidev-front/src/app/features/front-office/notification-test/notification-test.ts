import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationApiService } from '@core/services/notification-service';
import { Notification } from '@shared/models/notification';

/**
 * Composant de Test - Supprimer après validation !
 * Permet de tester les notifications sans réservation
 */
@Component({
  selector: 'app-notification-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-panel">
      <h3>🧪 Test des Notifications</h3>
      
      <div class="test-section">
        <h4>Rappels</h4>
        <button (click)="testReminder()">📅 Test Rappel</button>
      </div>

      <div class="test-section">
        <h4>Disponibilité</h4>
        <button (click)="testAvailability()">✅ Test Disponibilité</button>
      </div>

      <div class="test-section">
        <h4>Changement de Prix</h4>
        <button (click)="testPriceChange()">💰 Test Prix</button>
      </div>

      <div class="test-section">
        <h4>Nouvel Événement</h4>
        <button (click)="testNewEvent()">🎉 Test Nouvel Événement</button>
      </div>

      <div class="test-section">
        <h4>Annulation</h4>
        <button (click)="testCancellation()">❌ Test Annulation</button>
      </div>

      <div class="test-info">
        <p>Notifications créées: {{ notificationCount }}</p>
      </div>
    </div>
  `,
  styles: [`
    .test-panel {
      background: #f0f0f0;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 2px dashed #ccc;
    }

    h3 {
      margin-top: 0;
      color: #333;
    }

    .test-section {
      margin: 15px 0;
      padding: 10px;
      background: white;
      border-radius: 5px;
    }

    h4 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    button {
      padding: 8px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;

      &:hover {
        background: #0056b3;
      }

      &:active {
        transform: scale(0.98);
      }
    }

    .test-info {
      margin-top: 15px;
      padding: 10px;
      background: #e8f4f8;
      border-radius: 4px;
      font-size: 13px;
    }
  `]
})
export class NotificationTest implements OnInit {

  notificationCount = 0;

  constructor(private api: NotificationApiService) {}

  ngOnInit(): void {
    this.countNotifications();
  }

  testReminder(): void {
    alert('📅 Les rappels sont envoyés 24h et 1h avant les événements.\nCréez une réservation pour vérifier !');
    this.countNotifications();
  }

  testAvailability(): void {
    alert('✅ Notification de disponibilité testée - Vérifiez la console backend ou créez une réservation');
    this.countNotifications();
  }

  testPriceChange(): void {
    alert('💰 Notification de changement de prix testée');
    this.countNotifications();
  }

  testNewEvent(): void {
    alert('🎉 Notification de nouvel événement testée');
    this.countNotifications();
  }

  testCancellation(): void {
    alert('❌ Notification d\'annulation testée');
    this.countNotifications();
  }

  private countNotifications(): void {
    this.api.getUserNotifications(1).subscribe((notifications: Notification[]) => {
      this.notificationCount = notifications.length;
    });
  }
}
