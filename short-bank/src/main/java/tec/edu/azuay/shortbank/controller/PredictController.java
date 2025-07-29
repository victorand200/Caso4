package tec.edu.azuay.shortbank.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tec.edu.azuay.shortbank.persistence.entity.dto.VehicleRequest;
import tec.edu.azuay.shortbank.service.implement.IPredictService;

@RestController
@RequestMapping("/predictions")
@RequiredArgsConstructor
public class PredictController {

    private final IPredictService predictService;

    @PreAuthorize("hasAuthority('CREATE_PREDICTION')")
    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody VehicleRequest vehicleRequest) {
        return ResponseEntity.ok(predictService.predict(vehicleRequest));
    }
}
