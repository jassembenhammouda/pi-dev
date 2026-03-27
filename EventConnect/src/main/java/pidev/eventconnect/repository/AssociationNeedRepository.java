package pidev.eventconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pidev.eventconnect.entities.AssociationNeed;
import java.util.List;

@Repository
public interface AssociationNeedRepository extends JpaRepository<AssociationNeed, Long> {
    List<AssociationNeed> findByIsSatisfiedFalse();
    List<AssociationNeed> findByCategoryAndIsSatisfiedFalse(String category);
}
