package tec.edu.azuay.shortbank.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tec.edu.azuay.shortbank.persistence.entity.dto.HistoryResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.VehicleResponse;
import tec.edu.azuay.shortbank.service.auth.IPredictionHistoryService;

import java.util.Collection;

@RestController
@RequestMapping("/predictions")
@RequiredArgsConstructor
public class HistoryController {

    private final IPredictionHistoryService historyService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        if (authorities.stream().anyMatch(a -> a.getAuthority().equals("READ_ALL_PREDICTION_HISTORY"))) {
            return ResponseEntity.ok(historyService.getAll());
        }

        if (authorities.stream().anyMatch(a -> a.getAuthority().equals("READ_MY_PREDICTION_HISTORY"))) {
            return ResponseEntity.ok(historyService.getMyHistory());
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para ver el historial");
    }

    @PreAuthorize("hasAuthority('READ_PREDICTION_BY_ID')")
    @GetMapping("/history/{id}")
    public ResponseEntity<VehicleResponse> getHistoryById(@PathVariable Long id) {
        return ResponseEntity.ok(historyService.getHistoryById(id));
    }
}
