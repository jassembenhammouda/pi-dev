package pidev.eventconnect.services;

import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pidev.eventconnect.entities.AssociationNeed;
import pidev.eventconnect.entities.DonationDistribution;
import pidev.eventconnect.entities.FoodItem;
import pidev.eventconnect.entities.StockAlert;
import pidev.eventconnect.repository.AssociationNeedRepository;
import pidev.eventconnect.repository.DonationDistributionRepository;
import pidev.eventconnect.repository.FoodItemRepository;
import pidev.eventconnect.repository.StockAlertRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StockService {

    private final FoodItemRepository foodItemRepository;
    private final DonationDistributionRepository distributionRepository;
    private final StockAlertRepository alertRepository;
    private final AssociationNeedRepository needRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Priority map for sorting
    private static final Map<String, Integer> PRIORITY_LEVELS = Map.of(
        "CRITICAL", 3,
        "MEDIUM", 2,
        "LOW", 1
    );

    // Advanced ECO logic: KG saved to CO2/Water
    private static final Map<String, Double> CATEGORY_CO2_FACTORS = Map.of(
        "Viande", 27.0, // kg CO2 per kg
        "Produits Laitiers", 9.0,
        "Fruits & Légumes", 0.4,
        "Boulangerie", 1.5,
        "Epicerie", 3.0
    );

    private static final Map<String, Double> CATEGORY_WATER_FACTORS = Map.of(
        "Viande", 15000.0, // liters per kg
        "Produits Laitiers", 1000.0,
        "Fruits & Légumes", 300.0,
        "Boulangerie", 1600.0,
        "Epicerie", 2000.0
    );

    public List<FoodItem> getAllStock() {
        return foodItemRepository.findAll();
    }

    @Transactional
    public FoodItem addFoodItem(FoodItem item) {
        if (item.getReceivedDate() == null) {
            item.setReceivedDate(LocalDate.now());
        }
        FoodItem saved = foodItemRepository.save(item);
        
        // Advanced: Automatic Attribution to existing needs
        autoDistributeDonation(saved);
        
        // Final check for alerts (low stock etc)
        checkSingleItemAlerts(saved);
        return saved;
    }

    private void autoDistributeDonation(FoodItem item) {
        if (item.getQuantity() <= 0) return;

        List<AssociationNeed> pendingNeeds = needRepository.findByCategoryAndIsSatisfiedFalse(item.getCategory()).stream()
            .sorted((n1, n2) -> PRIORITY_LEVELS.getOrDefault(n2.getPriority(), 0) - PRIORITY_LEVELS.getOrDefault(n1.getPriority(), 0))
            .collect(Collectors.toList());

        for (AssociationNeed need : pendingNeeds) {
            if (item.getQuantity() <= 0) break;

            double needed = need.getQuantityRequested() - need.getQuantitySatisfied();
            double quantityToGive = Math.min(item.getQuantity(), needed);

            if (quantityToGive > 0) {
                performDistribution(item, quantityToGive, need.getAssociationName(), need);
                createAlert(item, "AUTO_DISTRIBUTION", "DISTRIBUTION AUTO: " + quantityToGive + " " + item.getUnit() + " de " + item.getName() + 
                    " attribués à " + need.getAssociationName() + " (Priorité: " + need.getPriority() + ")");
            }
        }
    }

    public List<AssociationNeed> getAllNeeds() {
        return needRepository.findAll();
    }

    @Transactional
    public AssociationNeed createNeed(AssociationNeed need) {
        need.setCreatedAt(LocalDateTime.now());
        need.setSatisfied(false);
        need.setQuantitySatisfied(0.0);
        AssociationNeed saved = needRepository.save(need);
        
        // Advanced: Automatic satisfying from existing stock
        autoSatisfyNeed(saved);
        
        return saved;
    }

    private void autoSatisfyNeed(AssociationNeed need) {
        List<FoodItem> availableStock = foodItemRepository.findAll().stream()
            .filter(item -> item.getCategory().equals(need.getCategory()) && item.getQuantity() > 0)
            .sorted(Comparator.comparing(FoodItem::getExpirationDate)) // Earliest expiration first
            .collect(Collectors.toList());

        for (FoodItem item : availableStock) {
            if (need.isSatisfied()) break;

            double needed = need.getQuantityRequested() - need.getQuantitySatisfied();
            double quantityToTake = Math.min(item.getQuantity(), needed);

            if (quantityToTake > 0) {
                performDistribution(item, quantityToTake, need.getAssociationName(), need);
                createAlert(item, "AUTO_SATISFACTION", "BESOIN SATISFAIT: " + quantityToTake + " " + item.getUnit() + " de " + item.getName() + 
                    " utilisés pour " + need.getAssociationName());
            }
        }
    }

    private void performDistribution(FoodItem item, Double quantity, String associationName, AssociationNeed need) {
        item.setQuantity(item.getQuantity() - quantity);
        foodItemRepository.save(item);

        if (need != null) {
            need.setQuantitySatisfied(need.getQuantitySatisfied() + quantity);
            if (need.getQuantitySatisfied() >= need.getQuantityRequested()) {
                need.setSatisfied(true);
            }
            needRepository.save(need);
        }

        DonationDistribution distribution = DonationDistribution.builder()
                .foodItem(item)
                .quantity(quantity)
                .associationName(associationName)
                .distributionDate(LocalDate.now())
                .economicValue(item.getEstimatedValue() * quantity)
                .environmentalImpact(quantity)
                .build();

        distributionRepository.save(distribution);
    }

    @Transactional
    public DonationDistribution distributeFood(Long foodItemId, Double quantity, String associationName) {
        FoodItem item = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("Food item not found"));

        if (item.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        // Check if there's a corresponding need to update
        AssociationNeed matchingNeed = needRepository.findByCategoryAndIsSatisfiedFalse(item.getCategory()).stream()
            .filter(n -> n.getAssociationName().equalsIgnoreCase(associationName))
            .findFirst()
            .orElse(null);

        performDistribution(item, quantity, associationName, matchingNeed);
        
        // Fetch the last saved distribution for return
        return distributionRepository.findAll().get(distributionRepository.findAll().size() - 1);
    }

    private void checkSingleItemAlerts(FoodItem item) {
        // Expiration check
        if (item.getExpirationDate() != null && item.getExpirationDate().isBefore(LocalDate.now().plusDays(3))) {
            createAlert(item, "EXPIRATION", "Le produit " + item.getName() + " expire bientôt (" + item.getExpirationDate() + ")");
        }
        // Low stock check
        if (item.getQuantity() != null && item.getQuantity() < 5.0) {
            createAlert(item, "STOCKOUT", "Rupture de stock imminente pour " + item.getName() + " (Quantité: " + item.getQuantity() + ")");
        }
    }

    public List<StockAlert> getUnreadAlerts() {
        return alertRepository.findByIsReadFalse();
    }

    @Transactional
    public void markAlertAsRead(Long alertId) {
        StockAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setIsRead(true);
        alertRepository.save(alert);
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void checkStockAlerts() {
        foodItemRepository.findAll().forEach(this::checkSingleItemAlerts);
    }

    private void createAlert(FoodItem item, String type, String message) {
        StockAlert alert = StockAlert.builder()
                .foodItem(item)
                .type(type)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        StockAlert savedAlert = alertRepository.save(alert);
        messagingTemplate.convertAndSend("/topic/alerts", savedAlert);
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        List<DonationDistribution> distributions = distributionRepository.findAll();
        
        double totalQty = distributions.stream()
            .filter(d -> d.getQuantity() != null)
            .mapToDouble(DonationDistribution::getQuantity).sum();
        double totalCO2 = distributions.stream()
            .filter(d -> d.getQuantity() != null && d.getFoodItem() != null)
            .mapToDouble(d -> d.getQuantity() * CATEGORY_CO2_FACTORS.getOrDefault(d.getFoodItem().getCategory(), 2.0))
            .sum();
        double totalWater = distributions.stream()
            .filter(d -> d.getQuantity() != null && d.getFoodItem() != null)
            .mapToDouble(d -> d.getQuantity() * CATEGORY_WATER_FACTORS.getOrDefault(d.getFoodItem().getCategory(), 500.0))
            .sum();

        stats.put("totalRedistributed", totalQty);
        stats.put("totalEconomicValue", distributionRepository.getTotalEconomicValue());
        stats.put("totalCO2Saved", totalCO2);
        stats.put("totalWaterSaved", totalWater);
        stats.put("stockCount", foodItemRepository.count());
        
        // Advanced Waste Risk Prediction
        long criticalRiskItems = foodItemRepository.findAll().stream()
            .filter(item -> item.getExpirationDate() != null && ChronoUnit.DAYS.between(LocalDate.now(), item.getExpirationDate()) < 5)
            .count();
        stats.put("criticalRiskCount", criticalRiskItems);

        return stats;
    }
}
