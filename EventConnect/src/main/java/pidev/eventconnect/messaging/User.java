package pidev.eventconnect.messaging;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;

    // Ajoutez ces deux champs pour correspondre à votre formulaire d'inscription
    private String password;
    private String role;
}