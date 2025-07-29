package tec.edu.azuay.shortbank.persistence.entity.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PredictionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(targetEntity = User.class)
    private User user;

    private Double predictedPriceKeras;

    private Double predictedPriceLinear;

    private Integer makeYear;

    private Double mileageKmpl;

    private Integer engineCc;

    private Integer ownerCount;

    private Integer accidentsReported;

    private String fuelType;

    private String brand;

    private String transmission;

    private String color;

    private String serviceHistory;

    private String insuranceValid;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdAt;

    @PrePersist
    private void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
