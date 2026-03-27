package pidev.eventconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pidev.eventconnect.entities.StockAlert;
import java.util.List;

@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {
    List<StockAlert> findByIsReadFalse();
}
