package pidev.eventconnect.services;

import org.springframework.stereotype.Service;
import pidev.eventconnect.dto.PredictionRequestDto;
import pidev.eventconnect.dto.PredictionResponseDto;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Service
public class PredictionService {

    public PredictionResponseDto predict(PredictionRequestDto request) {
        int score = 50;
        List<String> recommendations = new ArrayList<>();

        if (request.getPrice() <= 20) {
            score += 10;
        } else if (request.getPrice() > 100) {
            score -= 15;
            recommendations.add("Réduire légèrement le prix pour améliorer l’attractivité.");
        }

        if (request.getCapacityMax() <= 100) {
            score += 10;
        } else if (request.getCapacityMax() > 300) {
            score -= 10;
            recommendations.add("La capacité semble élevée. Vérifier la demande attendue.");
        }

        if (request.getPlace() != null && !request.getPlace().isBlank()) {
            score += 5;
        }

        if (request.getStartDate() != null) {
            DayOfWeek day = request.getStartDate().getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                score += 10;
            } else {
                recommendations.add("Favoriser une date de week-end pour augmenter la participation.");
            }
        }

        if (request.getCategory() != null) {
            String cat = request.getCategory().toLowerCase();

            if (cat.contains("music") || cat.contains("concert") || cat.contains("festival")) {
                score += 15;
            } else if (cat.contains("business") || cat.contains("formation")) {
                score += 8;
            }
        }

        if (score < 0) score = 0;
        if (score > 100) score = 100;

        String riskLevel;
        if (score >= 75) {
            riskLevel = "Faible";
        } else if (score >= 50) {
            riskLevel = "Moyen";
        } else {
            riskLevel = "Élevé";
        }

        int estimatedParticipants = Math.max(10, (request.getCapacityMax() * score) / 100);

        if (recommendations.isEmpty()) {
            recommendations.add("La configuration actuelle semble cohérente.");
        }

        return new PredictionResponseDto(score, riskLevel, estimatedParticipants, recommendations);
    }
}