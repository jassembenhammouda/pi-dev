package pidev.eventconnect.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pidev.eventconnect.messaging.User;
import pidev.eventconnect.messaging.UserClient;
import pidev.eventconnect.dto.LoginRequest; // Assurez-vous d'avoir créé ce DTO

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    // Harmonisation du nom de la variable pour correspondre à vos méthodes
    private final UserClient userClient;

    public AuthController(UserClient userClient) {
        this.userClient = userClient;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }
        return userClient.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return userClient.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    // La comparaison échouera si le champ password n'est pas dans User.java
                    if (user.getPassword() != null && user.getPassword().equals(loginRequest.getPassword())) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe incorrect");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé"));
    }
    // Dans AuthController.java
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Récupère tous les utilisateurs de la base H2
        List<User> users = userClient.findAll();
        return ResponseEntity.ok(users);
    }
}