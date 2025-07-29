package tec.edu.azuay.shortbank.persistence.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleResponse {

    private Long id;

    @JsonProperty("make_year")
    private Integer makeYear;

    @JsonProperty("mileage_kmpl")
    private Double mileageKmpl;

    @JsonProperty("engine_cc")
    private Integer engineCc;

    @JsonProperty("fuel_type")
    private String fuelType;

    @JsonProperty("owner_count")
    private Integer ownerCount;

    private String brand;

    private String transmission;

    private String color;

    @JsonProperty("accidents_reported")
    private Integer accidentsReported;

    @JsonProperty("service_history")
    private String serviceHistory;

    @JsonProperty("insurance_valid")
    private String insuranceValid;
}
