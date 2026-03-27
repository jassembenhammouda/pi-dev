package pidev.eventconnect.dto;


import lombok.Data;
import java.time.LocalDate;

@Data
public class PredictionRequestDto {
    private String title;
    private String category;
    private double price;
    private int capacityMax;
    private String place;
    private LocalDate startDate;
}