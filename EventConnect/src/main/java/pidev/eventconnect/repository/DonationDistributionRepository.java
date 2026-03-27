package pidev.eventconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pidev.eventconnect.entities.DonationDistribution;
import java.util.List;

@Repository
public interface DonationDistributionRepository extends JpaRepository<DonationDistribution, Long> {
    @Query("SELECT SUM(d.quantity) FROM DonationDistribution d")
    Double getTotalQuantityRedistributed();

    @Query("SELECT SUM(d.economicValue) FROM DonationDistribution d")
    Double getTotalEconomicValue();

    @Query("SELECT SUM(d.environmentalImpact) FROM DonationDistribution d")
    Double getTotalEnvironmentalImpact();
}
