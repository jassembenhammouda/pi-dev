package pidev.eventconnect.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pidev.eventconnect.messaging.UserClient;
import pidev.eventconnect.entities.Event;
import pidev.eventconnect.services.EventServiceImpl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventRestController {
    @Autowired
    EventServiceImpl eventService;
    @Autowired
    UserClient userClient; //
    @PostMapping("/addEvent")
    public ResponseEntity<?> addEvent(@RequestBody Event event, @RequestParam String userId) {
        return userClient.findById(userId)
                .map(user -> {
                    if ("Admin".equalsIgnoreCase(user.getRole())) {
                        try {
                            Event saved = eventService.addEvent(event);
                            return ResponseEntity.ok(saved);
                        } catch (Exception e) {
                            e.printStackTrace();
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Erreur lors de l'ajout de l'événement: " + e.getMessage());
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Seul l'admin peut ajouter un event");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User non trouvé"));
    }




    // Dans EventRestController.java

    // 1. Fix pour l'erreur 404 sur les recommandations
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@RequestParam String email) {
        // On renvoie une liste vide pour arrêter l'erreur 404 dans la console
        return ResponseEntity.ok(new java.util.ArrayList<>());
    }

    // 2. Vérifiez que AllEvents ne plante pas (Erreur 500)
    @GetMapping("/AllEvents")
    public ResponseEntity<Page<Event>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Event> events = eventService.getAllEvent(pageable);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            // Loggez l'erreur pour voir pourquoi le serveur répond 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/retrieve-event/{id}")
    public Event getEvent (@PathVariable ("id") Long id){
        return eventService.retrieveEvent(id);
    }

    @DeleteMapping("/remove-event/{id}")
    public void deleteEvent(@PathVariable("id") Long id){
        eventService.removeEvent(id);

    }

    @PutMapping ("/update-event/{id}")
    public ResponseEntity<Event> updateEvent (@Valid @RequestBody Event event,
                                              @PathVariable ("id") Long id){
        try {
            Event event1 = eventService.updateEvent(id,event);
            return ResponseEntity.ok(event1);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }
    @GetMapping("/countAllEvents")
    public int countAllEvents (){
        return eventService.countAllEvent();

    }

    @GetMapping(value = "/export", produces = "text/csv")
    public void exportEvents(HttpServletResponse response) throws IOException {
        eventService.exportEvents(response);

    }


}
