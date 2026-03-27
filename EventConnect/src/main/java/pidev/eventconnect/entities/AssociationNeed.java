package pidev.eventconnect.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "association_needs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssociationNeed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "association_name")
    private String associationName;
    
    private String category; // Fruits, Viande, etc.
    
    @Column(name = "quantity_requested")
    private Double quantityRequested;
    
    @Column(name = "quantity_satisfied")
    private Double quantitySatisfied;
    
    private String priority; // CRITICAL, MEDIUM, LOW
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_satisfied")
    private boolean isSatisfied;
}
