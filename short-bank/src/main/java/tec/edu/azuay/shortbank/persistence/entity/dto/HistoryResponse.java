package tec.edu.azuay.shortbank.persistence.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistoryResponse {

    private Long id;

    private String fullName;

    private String email;

    private String brand;

    private Double kerasPrediction;

    private Double linearPrediction;

    private LocalDateTime createdAt;
}
