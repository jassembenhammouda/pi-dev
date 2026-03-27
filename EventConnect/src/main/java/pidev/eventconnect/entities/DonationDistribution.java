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
public class DonationDistribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private FoodItem foodItem;

    private Double quantity;
    private String associationName;
    private LocalDate distributionDate;
    private Double economicValue; // estimatedValue * quantity
    private Double environmentalImpact; // e.g. kg of food saved
}
