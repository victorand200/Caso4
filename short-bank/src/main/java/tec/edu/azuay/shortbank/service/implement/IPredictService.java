package tec.edu.azuay.shortbank.service.implement;

import tec.edu.azuay.shortbank.persistence.entity.dto.HistoryResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.VehicleRequest;

public interface IPredictService {

    /**
     * Predicts the outcome based on the provided input.
     *
     * @param input The input data for prediction.
     * @return The predicted outcome as a String.
     */
    HistoryResponse predict(VehicleRequest input);
}
