package pidev.eventconnect.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class PredictionResponseDto {
    private int successProbability;
    private String riskLevel;
    private int estimatedParticipants;
    private List<String> recommendations;
}