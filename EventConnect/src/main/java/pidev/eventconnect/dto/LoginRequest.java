package pidev.eventconnect.dto;

import lombok.Data;

@Data // Génère automatiquement les Getters et Setters
public class LoginRequest {
    private String email;
    private String password;
}