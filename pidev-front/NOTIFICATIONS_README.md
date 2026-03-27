# 🔔 Système de Notifications & Rappels - EventConnect

## 📚 Vue d'ensemble

Un système complet de notifications et rappels pour l'application EventConnect, incluant :

✅ **Rappels d'événements** (24h et 1h avant)
✅ **Notifications de disponibilité** (places libérées)
✅ **Alertes de prix** (changements de tarif)
✅ **Nouveaux événements** (intéressants pour l'utilisateur)
✅ **Annulations** (avec remboursement)

---

## 🗂️ Structure des Fichiers

### **FRONTEND (Angular)**

```
frontend/
├── models/
│   └── notification.ts                         ← Modèle Notification
│
├── services/
│   └── notification-service.ts                 ← Service principal
│
├── FrontOffice/
│   ├── notification-center/
│   │   ├── notification-center.ts              ← Component page
│   │   ├── notification-center.html            ← Template
│   │   └── notification-center.scss            ← Styles
│   │
│   ├── notification-badge/
│   │   └── notification-badge.ts               ← Badge header
│   │
│   └── notification-test/
│       └── notification-test.ts                ← Testing component
│
└── FrontOffice/reservation/
    └── reservation.ts                          ← MODIFIÉ (ajout de rappels)

Documentation:
├── NOTIFICATIONS_INTEGRATION.md                ← Guide frontend
└── BACKEND_SPRING_SETUP.md                     ← Guide backend
```

### **BACKEND (Spring Boot)**

```
backend/
├── models/
│   └── Notification.java                       ← Entity JPA
│
├── repositories/
│   └── NotificationRepository.java             ← Data access
│
├── services/
│   └── NotificationService.java                ← Business logic
│
├── controllers/
│   └── NotificationController.java             ← REST API
│
├── dtos/
│   └── NotificationDTO.java                    ← Data transfer
│
├── config/
│   └── CorsConfig.java                         ← CORS settings
│
├── scheduler/
│   └── NotificationScheduler.java              ← Tâches programmées
│
└── resources/
    ├── application.properties                  ← Configuration
    └── notifications-migration.sql             ← Migration BD
```

---

## 🎯 Types de Notifications

| Type | Icône | Déclencheur | Description |
|------|-------|-------------|-------------|
| **REMINDER** | ⏰ | Événement approche | Rappels 24h et 1h avant |
| **AVAILABILITY** | ✅ | Places disponibles | Événement complet qui se libère |
| **PRICE_CHANGE** | 💰 | Prix modifié | Hausse ou baisse du prix |
| **NEW_EVENT** | 🎉 | Nouveaux événements | Événement correspondant à vos intérêts |
| **CANCELLATION** | ❌ | Annulation | Événement annulé - remboursement |

---

## 🚀 Démarrage Rapide

### **1. Frontend (Angular)**

```bash
# Les fichiers sont déjà créés dans le workspace
# Ajouter dans app-module.ts:
import { NotificationCenter } from './FrontOffice/notification-center/notification-center';
import { NotificationBadge } from './FrontOffice/notification-badge/notification-badge';

@NgModule({
  declarations: [NotificationCenter, NotificationBadge],
  imports: [CommonModule, HttpClientModule]
})

# Ajouter la route dans app-routing-module.ts:
{ path: 'notifications', component: NotificationCenter }

# Ajouter le badge dans header-front.html:
<app-notification-badge></app-notification-badge>
```

### **2. Backend (Spring Boot)**

```bash
# 1. Copier les fichiers dans votre projet Spring
# 2. Ajouter les dépendances Maven (voir BACKEND_SPRING_SETUP.md)
# 3. Configurer application.properties
# 4. Exécuter la migration SQL
# 5. Démarrer l'application

mvn clean install
mvn spring-boot:run
```

---

## 📡 API Endpoints Complète

### **GET - Lecture**
```
GET  /api/notifications/user/{userId}              ← Toutes
GET  /api/notifications/user/{userId}/unread       ← Non lues
GET  /api/notifications/user/{userId}/unread-count ← Compte
GET  /api/notifications/user/{userId}/type/{type}  ← Par type
```

### **POST - Création**
```
POST /api/notifications/create                     ← Création simple
POST /api/notifications/reminder                   ← Programmer rappels
POST /api/notifications/availability               ← Notifier dispo
POST /api/notifications/price-change               ← Alerter prix
POST /api/notifications/new-event                  ← Nouvel événement
POST /api/notifications/cancellation               ← Annulation
```

### **PUT - Mise à jour**
```
PUT  /api/notifications/{id}/read                  ← Marquer lue
PUT  /api/notifications/user/{userId}/read-all     ← Tout marquer lue
```

### **DELETE - Suppression**
```
DELETE /api/notifications/{id}                     ← Une notification
DELETE /api/notifications/user/{userId}            ← Toutes du user
```

---

## 🔄 Flux de Données

```
┌─────────────────────────────────────────────┐
│  Frontend Angular                            │
├─────────────────────────────────────────────┤
│ NotificationCenter (affichage)               │
│ NotificationBadge (badgeification)           │
│ NotificationService (communication)          │
└────────────┬────────────────────────────────┘
             │
             ↓ HTTP Requests
             │
┌─────────────────────────────────────────────┐
│  Spring Boot Backend                         │
├─────────────────────────────────────────────┤
│ NotificationController (API endpoints)       │
│ NotificationService (business logic)         │
│ NotificationRepository (database access)     │
│ Notification Entity (JPA model)              │
└────────────┬────────────────────────────────┘
             │
             ↓ SQL Queries
             │
        ┌────────────────┐
        │  MySQL Database │
        │  notifications  │
        └─────────────────┘
```

---

## 🎨 Interface Utilisateur

### **Centre de Notifications**
- Page complète avec filtrage par type
- Vue des notifications non lues en priorité
- Actions rapides (marquer lu, supprimer)
- Statistiques en temps réel
- Responsive design

### **Badge Notification**
- Affichage du nombre de non-lues
- Icône dans le header
- Redirection vers le centre
- Mise à jour automatique (30s)

---

## 🤖 Tâches Programmées (Scheduler)

```
┌─────────────────────────────────────────┐
│  NotificationScheduler                   │
├─────────────────────────────────────────┤
│ Chaque 5 minutes   → Envoyer rappels    │
│ Chaque jour 2h     → Nettoyer anciennes │
│ Chaque heure       → Statistiques       │
└─────────────────────────────────────────┘
```

---

## 💾 Schéma de la Base de Données

```sql
notifications
├── id (PK)
├── user_id (FK) → users
├── event_id (FK) → events
├── title (VARCHAR)
├── message (TEXT)
├── type (ENUM)
├── is_read (BOOLEAN)
├── created_at (TIMESTAMP)
└── scheduled_for (TIMESTAMP)
```

---

## 🔧 Configuration Requise

### **Frontend**
- Angular 15+
- RxJS
- TypeScript
- Node.js 16+

### **Backend**
- Java 11+
- Spring Boot 2.7+
- MySQL 8.0+
- Maven 3.6+

---

## ✨ Fonctionnalités Spéciales

### **1. Programmation Intelligente**
Les rappels sont programmés automatiquement quand vous réservez :
```
- 24h avant l'événement → Notification rappel
- 1h avant l'événement → Dernière chance
- À l'heure exacte → Pousser vers la page
```

### **2. Filtrage Avancé**
```
- Tous les notifications
- Non lues uniquement
- Par type (reminder, availability, etc.)
- Tri par date (plus récent en premier)
```

### **3. Actions Rapides**
```
- Marquer comme lu
- Marquer tout comme lu
- Supprimer
- Gérer de masse
```

### **4. Statistiques**
```
- Nombre total
- Nombre non lues
- Répartition par type
- Tendances
```

---

## 📋 Checklist Complète

### **Frontend**
- [ ] Modèle Notification créé
- [ ] Service NotificationService créé
- [ ] Component NotificationCenter créé
- [ ] Badge NotificationBadge créé
- [ ] Intégration dans app.module.ts
- [ ] Route /notifications ajoutée
- [ ] Badge ajouté au header
- [ ] Rappels intégrés dans reservation.ts
- [ ] Tests fonctionnels validés

### **Backend**
- [ ] Entity Notification créée
- [ ] Repository créé
- [ ] Service créé
- [ ] Controller créé
- [ ] Dépendances Maven ajoutées
- [ ] Configuration application.properties
- [ ] Table créée en base de données
- [ ] CORS configuré
- [ ] Scheduler configuré
- [ ] Tests avec Postman validés

### **Intégration**
- [ ] Frontend ↔ Backend communiquent
- [ ] Créer une réservation déclenche les rappels
- [ ] Notifications s'affichent dans le centre
- [ ] Badge s'actualise en temps réel
- [ ] Suppression de notification fonctionne
- [ ] Marquer comme lu fonctionne

---

## 🐛 Dépannage

### **Notifications ne s'affichent pas**
```
1. Vérifier la console frontend pour les erreurs
2. Vérifier les logs backend
3. Vérifier que l'userId est correct
4. Vérifier la connexion à la base de données
```

### **Badge ne s'actualise pas**
```
1. Vérifier que NotificationBadge est déclaré
2. Vérifier que getUnreadCount() renvoie un Observable
3. Vérifier les timers du polling
```

### **Endpoint 404**
```
1. Vérifier l'URL exacte de l'endpoint
2. Vérifier que le port est 8080
3. Vérifier que le context-path est /api
```

---

## 📞 Support

Pour toute question ou problème, consultez :
- `NOTIFICATIONS_INTEGRATION.md` (Frontend)
- `BACKEND_SPRING_SETUP.md` (Backend)
- Les commentaires dans le code

---

## 📈 Évolutions Futures Possibles

- [ ] Notifications par email
- [ ] Notifications SMS
- [ ] WebSocket pour real-time
- [ ] Préférences de notifications par utilisateur
- [ ] Catégorisation avancée
- [ ] Filtres sauvegardés
- [ ] Export des notifications
- [ ] Partage des notifications

---

**Système complet et prêt à l'emploi ! 🚀**

Créé: 5 Mars 2026
Version: 1.0
Status: Production Ready ✅
