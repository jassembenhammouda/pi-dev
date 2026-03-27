package pidev.eventconnect.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pidev.eventconnect.dto.PredictionRequestDto;
import pidev.eventconnect.dto.PredictionResponseDto;
import pidev.eventconnect.services.PredictionService;

@RestController
@RequestMapping("/api/prediction")
@CrossOrigin(origins = "http://localhost:4200")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/event-success")
    public ResponseEntity<PredictionResponseDto> predictEventSuccess(
            @RequestBody PredictionRequestDto request) {
        return ResponseEntity.ok(predictionService.predict(request));
    }
}