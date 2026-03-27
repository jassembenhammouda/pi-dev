# 🔔 Système de Notifications - Guide d'Intégration Spring Boot

## 📋 Résumé des Fichiers

| Fichier | Type | Description |
|---------|------|-------------|
| `Notification.java` | Entity JPA | Modèle pour la base de données |
| `NotificationRepository.java` | Repository | Accès à la base de données |
| `NotificationService.java` | Service | Logique métier |
| `NotificationController.java` | Controller | API REST |
| `NotificationDTO.java` | DTO | Transfert de données |
| `CorsConfig.java` | Config | Configuration CORS |
| `NotificationScheduler.java` | Scheduler | Tâches programmées |
| `notifications-migration.sql` | SQL | Création de la table |

---

## 🚀 Installation

### 1. **Ajouter les dépendances pom.xml**

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Lombok (optionnel) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Spring Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 2. **Configurer application.properties**

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/pidev_notifications
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 3. **Copier les fichiers Java**

```
src/main/java/com/pidev/
  ├── models/
  │   └── Notification.java
  ├── repositories/
  │   └── NotificationRepository.java
  ├── services/
  │   └── NotificationService.java
  ├── controllers/
  │   └── NotificationController.java
  ├── dtos/
  │   └── NotificationDTO.java
  ├── config/
  │   └── CorsConfig.java
  └── scheduler/
      └── NotificationScheduler.java
```

### 4. **Créer la table en base de données**

Exécuter le fichier `notifications-migration.sql`:

```sql
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT,
    type ENUM('REMINDER', 'AVAILABILITY', 'PRICE_CHANGE', 'NEW_EVENT', 'CANCELLATION') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);
```

---

## 📡 API Endpoints

### **GET - Récupérer**

```
GET  /api/notifications/user/{userId}
     → Toutes les notifications

GET  /api/notifications/user/{userId}/unread
     → Notifications non lues

GET  /api/notifications/user/{userId}/unread-count
     → Compte non-lues { "unreadCount": 5 }

GET  /api/notifications/user/{userId}/type/{type}
     → Par type (REMINDER, AVAILABILITY, PRICE_CHANGE, NEW_EVENT, CANCELLATION)
```

### **POST - Créer**

```
POST /api/notifications/create
     Body: { userId, title, message, type }

POST /api/notifications/reminder
     Params: userId, eventId, eventTitle, eventDate

POST /api/notifications/availability
     Params: userId, eventId, eventTitle

POST /api/notifications/price-change
     Params: userId, eventId, eventTitle, oldPrice, newPrice

POST /api/notifications/new-event
     Params: userId, eventId, eventTitle, eventDate

POST /api/notifications/cancellation
     Params: eventId, eventTitle
```

### **PUT - Mettre à jour**

```
PUT  /api/notifications/{id}/read
     → Marquer comme lue

PUT  /api/notifications/user/{userId}/read-all
     → Tout marquer comme lu
```

### **DELETE - Supprimer**

```
DELETE /api/notifications/{id}
       → Supprimer une notification

DELETE /api/notifications/user/{userId}
       → Supprimer toutes les notifications
```

---

## 🔌 Intégration avec les Services Existants

### **Dans ReservationService**:

```java
@Service
public class ReservationService {
    
    @Autowired
    private NotificationService notificationService;
    
    public void createReservation(Reservation reservation, Event event) {
        // ... logique de création ...
        
        // Programmer les rappels
        notificationService.scheduleEventReminders(
            reservation.getUserId(),
            event.getId(),
            event.getTitle(),
            event.getStartDate()
        );
    }
}
```

### **Dans EventService (pour les changements de prix)**:

```java
public void updateEventPrice(Long eventId, Double newPrice) {
    Event event = eventRepository.findById(eventId).orElseThrow();
    Double oldPrice = event.getPrice();
    
    event.setPrice(newPrice);
    eventRepository.save(event);
    
    // Notifier les utilisateurs
    List<Reservation> reservations = reservationRepository.findByEventId(eventId);
    for (Reservation res : reservations) {
        notificationService.notifyPriceChange(
            res.getUserId(),
            eventId,
            event.getTitle(),
            oldPrice,
            newPrice
        );
    }
}
```

### **Lors de l'annulation d'un événement**:

```java
public void cancelEvent(Long eventId) {
    Event event = eventRepository.findById(eventId).orElseThrow();
    event.setStatus("CANCELLED");
    eventRepository.save(event);
    
    // Notifier tous les utilisateurs avec réservations
    notificationService.notifyEventCancellationToAll(eventId, event.getTitle());
}
```

---

## 🤖 Tâches Programmées (Scheduler)

Le scheduler fait automatiquement :

1. **Toutes les 5 minutes** : Vérifie et envoie les notifications programmées
2. **Chaque jour à 2h du matin** : Nettoie les anciennes notifications (>30 jours)
3. **Chaque heure** : Log des statistiques

Pour désactiver le scheduler :
```properties
spring.task.scheduling.enabled=false
```

---

## ✅ Checklist d'Intégration

- [ ] Ajouter les dépendances Maven
- [ ] Configurer application.properties
- [ ] Copier tous les fichiers Java dans le bon package
- [ ] Créer la table en base de données
- [ ] Démarrer l'application Spring
- [ ] Tester les endpoints avec Postman
- [ ] Intégrer dans ReservationService
- [ ] Intégrer dans EventService
- [ ] Tester la création de notifications depuis le frontend

---

## 🧪 Test avec cURL

```bash
# Créer une notification
curl -X POST http://localhost:8080/api/notifications/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventId": 5,
    "title": "Rappel Événement",
    "message": "Votre événement commence dans 24h",
    "type": "REMINDER",
    "isRead": false
  }'

# Récupérer les notifications
curl http://localhost:8080/api/notifications/user/1

# Marquer comme lue
curl -X PUT http://localhost:8080/api/notifications/1/read

# Marquer toutes comme lues
curl -X PUT http://localhost:8080/api/notifications/user/1/read-all

# Compter les non-lues
curl http://localhost:8080/api/notifications/user/1/unread-count

# Supprimer
curl -X DELETE http://localhost:8080/api/notifications/1
```

---

## 📊 Schéma de la Table

```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT,
    type ENUM('REMINDER', 'AVAILABILITY', 'PRICE_CHANGE', 'NEW_EVENT', 'CANCELLATION'),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);
```

---

## 🐛 Dépannage

### Port déjà utilisé
```properties
server.port=8081
```

### Erreur de connexion MySQL
- Vérifier que MySQL est démarré
- Vérifier les credentials dans application.properties
- Créer la base de données : `CREATE DATABASE pidev_notifications;`

### Entité non reconnue
- Vérifier que l'annotation `@Entity` est présente
- Vérifier le package et l'import

### Endpoint 404
- Vérifier l'URL exacte
- Vérifier que le contrôleur est dans le bon package

---

**Système prêt ! 🚀**
