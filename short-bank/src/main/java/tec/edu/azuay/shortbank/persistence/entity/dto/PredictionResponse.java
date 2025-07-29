package tec.edu.azuay.shortbank.persistence.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PredictionResponse {

    private boolean success;

    private double predicted_price_usd_with_keras;

    private double predicted_price_usd_with_linear;

    private Map<String, Object> input_data;

    private String timestamp;

    private String model_version;

}
