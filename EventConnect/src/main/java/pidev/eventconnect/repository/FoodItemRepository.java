package pidev.eventconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pidev.eventconnect.entities.FoodItem;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByExpirationDateBefore(LocalDate date);
    List<FoodItem> findByQuantityLessThan(Double threshold);
}
