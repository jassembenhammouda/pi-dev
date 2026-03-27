# 🔧 Exemple d'Intégration dans ReservationService

Voici comment intégrer les notifications dans votre service de réservation Spring Boot:

---

## Avant (sans notifications)

```java
@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private EventService eventService;
    
    public Reservation addReservation(Reservation reservation, Long eventId) {
        Event event = eventService.getEvent(eventId);
        
        // Vérifier la disponibilité
        if (event.getNbParticipantsActuels() < event.getCapacityMax()) {
            reservation.setStatus("CONFIRMED");
            event.setNbParticipantsActuels(event.getNbParticipantsActuels() + 1);
        } else {
            reservation.setStatus("PENDING");
        }
        
        eventService.updateEvent(event);
        return reservationRepository.save(reservation);
    }
}
```

---

## Après (avec notifications)

```java
@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private EventService eventService;
    
    // ✅ NOUVEAU: Injecter le NotificationService
    @Autowired
    private NotificationService notificationService;
    
    public Reservation addReservation(Reservation reservation, Long eventId) {
        Event event = eventService.getEvent(eventId);
        
        // Vérifier la disponibilité
        if (event.getNbParticipantsActuels() < event.getCapacityMax()) {
            reservation.setStatus("CONFIRMED");
            event.setNbParticipantsActuels(event.getNbParticipantsActuels() + 1);
            
            // ✅ NOUVEAU: Programmer les rappels
            notificationService.scheduleEventReminders(
                reservation.getUserId(),
                eventId,
                event.getTitle(),
                event.getStartDate()
            );
            
            // ✅ BONUS: Notifier d'autres utilisateurs en attente
            if (event.getNbParticipantsActuels() == event.getCapacityMax()) {
                // L'événement est maintenant complet
                List<Reservation> pendingReservations = 
                    reservationRepository.findByEventIdAndStatus(eventId, "PENDING");
                
                for (Reservation pending : pendingReservations) {
                    notificationService.notifyEventAvailability(
                        pending.getUserId(),
                        eventId,
                        event.getTitle() + " - Liste d'attente"
                    );
                }
            }
        } else {
            reservation.setStatus("PENDING");
        }
        
        eventService.updateEvent(event);
        return reservationRepository.save(reservation);
    }
    
    // ✅ NOUVEAU: Quand une place se libère
    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        
        Event event = eventService.getEvent(reservation.getEventId());
        
        // Libérer la place
        event.setNbParticipantsActuels(event.getNbParticipantsActuels() - 1);
        eventService.updateEvent(event);
        
        // Supprimer la réservation
        reservationRepository.deleteById(reservationId);
        
        // ✅ Notifier les utilisateurs en attente
        List<Reservation> pendingReservations = 
            reservationRepository.findByEventIdAndStatus(
                reservation.getEventId(), 
                "PENDING"
            );
        
        if (!pendingReservations.isEmpty() && event.getNbParticipantsActuels() < event.getCapacityMax()) {
            for (Reservation pending : pendingReservations) {
                notificationService.notifyEventAvailability(
                    pending.getUserId(),
                    reservation.getEventId(),
                    event.getTitle() + " - Une place s'est libérée !"
                );
            }
        }
    }
}
```

---

## Intégration dans EventService

```java
@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    // ✅ NOUVEAU: Injecter le NotificationService
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    // ✅ NOUVEAU: Notifier changement de prix
    @Transactional
    public Event updateEvent(Event event) {
        Event oldEvent = eventRepository.findById(event.getId())
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        // Vérifier si le prix a changé
        if (!oldEvent.getPrice().equals(event.getPrice())) {
            Double oldPrice = oldEvent.getPrice();
            Double newPrice = event.getPrice();
            
            // Notifier tous les utilisateurs avec réservations
            List<Reservation> reservations = 
                reservationRepository.findByEventId(event.getId());
            
            for (Reservation reservation : reservations) {
                notificationService.notifyPriceChange(
                    reservation.getUserId(),
                    event.getId(),
                    event.getTitle(),
                    oldPrice,
                    newPrice
                );
            }
        }
        
        return eventRepository.save(event);
    }
    
    // ✅ NOUVEAU: Annuler un événement
    @Transactional
    public void cancelEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        event.setStatus("CANCELLED");
        eventRepository.save(event);
        
        // Notifier tous les utilisateurs
        List<Reservation> reservations = 
            reservationRepository.findByEventId(eventId);
        
        for (Reservation reservation : reservations) {
            notificationService.notifyEventCancellation(
                reservation.getUserId(),
                eventId,
                event.getTitle()
            );
        }
    }
    
    // ✅ NOUVEAU: Créer un nouvel événement (optionnel)
    public Event createEvent(Event event) {
        Event savedEvent = eventRepository.save(event);
        
        // Optionnel: Notifier les utilisateurs intéressés
        // notificationService.notifyNewEvent(...);
        
        return savedEvent;
    }
}
```

---

## Points Clés

### 1. **Injection du Service**
```java
@Autowired
private NotificationService notificationService;
```

### 2. **Programmer les Rappels**
```java
notificationService.scheduleEventReminders(
    userId,
    eventId,
    eventTitle,
    eventDate  // LocalDateTime
);
```

### 3. **Notifier la Disponibilité**
```java
notificationService.notifyEventAvailability(
    userId,
    eventId,
    eventTitle
);
```

### 4. **Alerter les Changements de Prix**
```java
notificationService.notifyPriceChange(
    userId,
    eventId,
    eventTitle,
    oldPrice,  // Double
    newPrice   // Double
);
```

### 5. **Notifier les Annulations**
```java
notificationService.notifyEventCancellation(
    userId,
    eventId,
    eventTitle
);
```

---

## Exemple : Workflow Complet

### **Scénario: Un utilisateur réserve une place**

```
1. Utilisateur clique "Réserver"
   ↓
2. Frontend appelle: POST /reservation
   ↓
3. Backend ReservationService.addReservation()
   - Vérifier dispo
   - Créer réservation
   - ✅ notificationService.scheduleEventReminders()
   ↓
4. Rappels programmés:
   - 24h avant: Notification créée
   - 1h avant: Notification créée
   ↓
5. NotificationScheduler (toutes les 5 minutes):
   - Vérifier les rappels à envoyer
   - Marquer comme envoyés
   ↓
6. Frontend NotificationCenter:
   - Affiche les rappels à l'utilisateur
   - Badge actualise le compteur
```

---

## Dépendances à Ajouter

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
```

---

## Configuration application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pidev_notifications
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

## ✅ Validation

Pour vérifier que l'intégration fonctionne:

```
1. Faire une réservation depuis l'UI
2. Vérifier dans la table `notifications` que 2 entrées sont créées (24h et 1h)
3. Vérifier que NotificationCenter affiche les rappels
4. Vérifier que le badge affiche le nombre non-lues
5. Cliquer sur le badge vers NotificationCenter
6. Marquer comme lue et vérifier la suppression du badge
```

---

**Intégration complète ! 🚀**
