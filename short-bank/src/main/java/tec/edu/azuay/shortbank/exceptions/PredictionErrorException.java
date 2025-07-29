package tec.edu.azuay.shortbank.exceptions;

import tec.edu.azuay.shortbank.persistence.entity.dto.PredictError;

public class PredictionErrorException extends RuntimeException{

    public PredictionErrorException(PredictError predictError) {
        super(predictError.getError() + " - " + predictError.getMessage());
    }

    public PredictionErrorException(String message) {
        super(message);
    }
}
