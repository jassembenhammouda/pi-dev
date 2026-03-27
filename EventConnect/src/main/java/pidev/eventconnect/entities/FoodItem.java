package pidev.eventconnect.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double quantity;
    private String unit; // kg, liters, pieces, etc.
    private String category;
    private LocalDate expirationDate;
    private LocalDate receivedDate;
    private String donorName;
    private Double estimatedValue; // for financial impact report
}
