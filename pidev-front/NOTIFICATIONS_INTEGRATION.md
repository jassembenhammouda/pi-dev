# 🔔 Système de Notifications & Rappels - Documentation d'Intégration

## 📦 Fichiers Créés

### 1. **Models**
- `src/app/models/notification.ts` - Modèle de notification avec types

### 2. **Services**
- `src/app/services/notification-service.ts` - Service principal pour gérer les notifications

### 3. **Composants**
- `src/app/FrontOffice/notification-center/notification-center.ts` - Page du centre de notifications
- `src/app/FrontOffice/notification-center/notification-center.html` - Template
- `src/app/FrontOffice/notification-center/notification-center.scss` - Styles
- `src/app/FrontOffice/notification-badge/notification-badge.ts` - Badge pour le header

### 4. **Fichiers Modifiés**
- `src/app/FrontOffice/reservation/reservation.ts` - Intégration des rappels

---

## 🔧 Étapes d'Intégration

### **Étape 1: Déclarer les Composants**
Dans `app-module.ts`, ajouter les imports:

```typescript
import { NotificationCenter } from './FrontOffice/notification-center/notification-center';
import { NotificationBadge } from './FrontOffice/notification-badge/notification-badge';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NotificationCenter,
    NotificationBadge,
    // ... autres composants
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    // ... autres imports
  ]
})
export class AppModule { }
```

### **Étape 2: Ajouter la Route**
Dans `app-routing-module.ts`:

```typescript
{
  path: 'notifications',
  component: NotificationCenter
}
```

### **Étape 3: Ajouter le Badge au Header**
Modifier `header-front.html`:

```html
<!-- Ajouter après le bouton Ticket -->
<app-notification-badge></app-notification-badge>
```

### **Étape 4: Configurer le Serveur Backend**
Le service requiert ces endpoints:

```
GET    /notifications/user/{userId}           - Récupérer les notifications
POST   /notifications/create                  - Créer une notification
PUT    /notifications/{id}/read               - Marquer comme lue
PUT    /notifications/user/{userId}/read-all  - Marquer tout comme lu
DELETE /notifications/{id}                    - Supprimer une notification
```

### **Étape 5: Configurer l'UserID (IMPORTANT)**
Modifier `notification-service.ts` ligne ~150:

```typescript
private getUserId(): number | null {
  // À adapter selon votre système d'auth
  // Option 1: localStorage
  return parseInt(localStorage.getItem('userId') || '0');
  
  // Option 2: desde un service d'authentification
  // return this.authService.getCurrentUserId();
}
```

---

## 🎯 Fonctionnalités

### **Reminders (Rappels)**
Programmés automatiquement lors de chaque réservation confirmée:
- ⏰ Rappel 24h avant
- ⏰ Rappel 1h avant

```typescript
// Utilisé automatiquement dans reservation.ts
notificationService.scheduleEventReminder(eventId, eventDate, eventTitle);
```

### **Availability (Disponibilité)**
Notifier quand un événement redevient disponible:

```typescript
notificationService.notifyEventAvailability(eventId, eventTitle);
```

### **Price Change (Changement de Prix)**
Notifier d'un changement de prix:

```typescript
notificationService.notifyPriceChange(eventId, eventTitle, oldPrice, newPrice);
```

### **New Events (Nouveaux Événements)**
Notifier d'un nouvel événement correspondant à la wishlist:

```typescript
notificationService.notifyNewEvent(eventTitle, eventDate);
```

### **Cancellations (Annulations)**
Notifier d'une annulation d'événement:

```typescript
notificationService.notifyEventCancellation(eventId, eventTitle);
```

---

## 📱 Interface Utilisateur

### **Centre de Notifications**
- Page dédiée avec filtrages par type
- Affichage des non-lues en priorité
- Actions: marquer comme lue, supprimer
- Statistiques en temps réel

### **Badge Notification**
- Affichage du nombre non-lues
- Icône cliquable qui redirige vers le centre
- Mise à jour automatique toutes les 30 secondes

---

## 🔄 Flux de Données

```
1. Utilisateur réserve un événement
   ↓
2. reservation.ts crée les rappels via notificationService
   ↓
3. NotificationService appelle le backend pour créer les notifications
   ↓
4. Backend stocke les notifications en base de données
   ↓
5. NotificationBadge affiche le badge non lu
   ↓
6. Utilisateur clique sur le badge
   ↓
7. NotificationCenter affiche toutes les notifications
```

---

## ✅ Checklist d'Implémentation

- [ ] Modifier `app-module.ts` pour déclarer les composants
- [ ] Ajouter la route `/notifications`
- [ ] Ajouter le badge au header
- [ ] Créer les endpoints backend
- [ ] Configurer `getUserId()` dans le service
- [ ] Tester la création d'une réservation
- [ ] Vérifier les rappels programmés
- [ ] Vérifier l'affichage des notifications

---

## 🐛 Dépannage

### Badge ne s'affiche pas
- Vérifier que `NotificationBadge` est déclaré dans `app-module.ts`
- Vérifier que `app-notification-badge` est dans le template du header

### Notifications n'apparaissent pas
- Vérifier que `getUserId()` retourne un ID valide
- Vérifier que le backend retourne les notifications correctement

### Endpoints non trouvés
- Implémenter les endpoints dans le backend
- Vérifier l'URL de base dans `notification-service.ts`

---

## 📊 Exemple d'Utilisation Avancée

```typescript
// Dans n'importe quel composant
export class MyComponent {
  constructor(private notificationService: NotificationService) {}

  doSomething() {
    // Créer une notification personnalisée
    const customNotification = new Notification(
      'Mon titre',
      'Mon message',
      'new_event'
    );
    
    this.notificationService.createNotification(customNotification)
      .subscribe(notification => {
        console.log('Notification créée:', notification);
      });
  }

  // Écouter les changements
  ngOnInit() {
    // Notifications
    this.notificationService.getNotifications().subscribe(notifications => {
      console.log('Notifications mises à jour:', notifications);
    });

    // Nombre non-lues
    this.notificationService.getUnreadCount().subscribe(count => {
      console.log('Non lues:', count);
    });
  }
}
```

---

**Système prêt à l'emploi !** 🚀
