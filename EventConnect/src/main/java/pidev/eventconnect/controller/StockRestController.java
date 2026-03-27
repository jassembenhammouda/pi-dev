package pidev.eventconnect.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pidev.eventconnect.entities.AssociationNeed;
import pidev.eventconnect.entities.DonationDistribution;
import pidev.eventconnect.entities.FoodItem;
import pidev.eventconnect.entities.StockAlert;
import pidev.eventconnect.services.StockService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class StockRestController {

    private final StockService stockService;

    @GetMapping("/all")
    public List<FoodItem> getAllStock() {
        return stockService.getAllStock();
    }

    @PostMapping("/add")
    public FoodItem addFoodItem(@RequestBody FoodItem item) {
        return stockService.addFoodItem(item);
    }

    @PostMapping("/distribute")
    public DonationDistribution distributeFood(@RequestParam Long itemId, @RequestParam Double quantity, @RequestParam String association) {
        return stockService.distributeFood(itemId, quantity, association);
    }

    @GetMapping("/alerts")
    public List<StockAlert> getAlerts() {
        return stockService.getUnreadAlerts();
    }

    @PutMapping("/alerts/{id}/read")
    public void markAlertRead(@PathVariable Long id) {
        stockService.markAlertAsRead(id);
    }

    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        return stockService.getStatistics();
    }

    @PostMapping("/check-alerts")
    public void triggerAlertCheck() {
        stockService.checkStockAlerts();
    }

    @GetMapping("/needs")
    public List<AssociationNeed> getAllNeeds() {
        return stockService.getAllNeeds();
    }

    @PostMapping("/needs")
    public AssociationNeed createNeed(@RequestBody AssociationNeed need) {
        return stockService.createNeed(need);
    }
}
