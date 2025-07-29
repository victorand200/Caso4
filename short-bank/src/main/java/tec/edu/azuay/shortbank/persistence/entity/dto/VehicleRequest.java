package tec.edu.azuay.shortbank.persistence.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleRequest {

    private Integer make_year;

    private Double mileage_kmpl;

    private Integer engine_cc;

    private String fuel_type;

    private Integer owner_count;

    private String brand;

    private String transmission;

    private String color;

    private Integer accidents_reported;

    private String service_history;

    private String insurance_valid;
}
