package pidev.eventconnect.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private FoodItem foodItem;

    private String type; // SURPLUS, EXPIRATION, STOCKOUT
    private String message;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
