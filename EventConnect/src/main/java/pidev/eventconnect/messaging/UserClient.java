package pidev.eventconnect.messaging;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserClient extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email); // Pour le Login
}
