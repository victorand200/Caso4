package tec.edu.azuay.shortbank.service.implement;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import tec.edu.azuay.shortbank.exceptions.ObjectNotFoundException;
import tec.edu.azuay.shortbank.exceptions.PredictionErrorException;
import tec.edu.azuay.shortbank.persistence.entity.dto.HistoryResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.PredictError;
import tec.edu.azuay.shortbank.persistence.entity.dto.PredictionResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.VehicleRequest;
import tec.edu.azuay.shortbank.persistence.entity.model.PredictionHistory;
import tec.edu.azuay.shortbank.persistence.entity.model.User;
import tec.edu.azuay.shortbank.persistence.repository.IPredictionHistoryRepository;
import tec.edu.azuay.shortbank.service.interfaces.IUserService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PredictServiceImpl implements IPredictService {

    private final RestTemplate restTemplate;

    private final IUserService userService;

    private final IPredictionHistoryRepository historyRepository;

    @Value("${prediction.api.url}")
    private String predictionApiUrl;

    /**
     * Predicts the outcome based on the provided input.
     *
     * @param input The input data for prediction.
     * @return The predicted outcome as a String.
     */
    @Override
    public HistoryResponse predict(VehicleRequest input) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<VehicleRequest> entity = new HttpEntity<>(input, headers);
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(predictionApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                User user = userService.findOneByEmail(username).orElseThrow(() -> new ObjectNotFoundException("User not found with email: " + username));

                PredictionResponse predictionResponse = objectMapper.readValue(response.getBody(), PredictionResponse.class);
                PredictionHistory predictionHistory = new PredictionHistory();
                predictionHistory.setPredictedPriceKeras(predictionResponse.getPredicted_price_usd_with_keras());
                predictionHistory.setPredictedPriceLinear(predictionResponse.getPredicted_price_usd_with_linear());
                predictionHistory.setMakeYear(predictionResponse.getInput_data().get("make_year") != null ? Integer.parseInt(predictionResponse.getInput_data().get("make_year").toString()) : null);
                predictionHistory.setMileageKmpl(predictionResponse.getInput_data().get("mileage_kmpl") != null ? Double.parseDouble(predictionResponse.getInput_data().get("mileage_kmpl").toString()) : null);
                predictionHistory.setEngineCc(predictionResponse.getInput_data().get("engine_cc") != null ? Integer.parseInt(predictionResponse.getInput_data().get("engine_cc").toString()) : null);
                predictionHistory.setOwnerCount(predictionResponse.getInput_data().get("owner_count") != null ? Integer.parseInt(predictionResponse.getInput_data().get("owner_count").toString()) : null);
                predictionHistory.setAccidentsReported(predictionResponse.getInput_data().get("accidents_reported") != null ? Integer.parseInt(predictionResponse.getInput_data().get("accidents_reported").toString()) : null);
                predictionHistory.setFuelType(predictionResponse.getInput_data().get("fuel_type") != null ? predictionResponse.getInput_data().get("fuel_type").toString() : null);
                predictionHistory.setBrand(predictionResponse.getInput_data().get("brand") != null ? predictionResponse.getInput_data().get("brand").toString() : null);
                predictionHistory.setTransmission(predictionResponse.getInput_data().get("transmission") != null ? predictionResponse.getInput_data().get("transmission").toString() : null);
                predictionHistory.setColor(predictionResponse.getInput_data().get("color") != null ? predictionResponse.getInput_data().get("color").toString() : null);
                predictionHistory.setServiceHistory(predictionResponse.getInput_data().get("service_history") != null ? predictionResponse.getInput_data().get("service_history").toString() : null);
                predictionHistory.setInsuranceValid(predictionResponse.getInput_data().get("insurance_valid") != null ? predictionResponse.getInput_data().get("insurance_valid").toString() : null);
                predictionHistory.setCreatedAt(LocalDateTime.now());
                predictionHistory.setUser(user);

                PredictionHistory saved = historyRepository.save(predictionHistory);

                HistoryResponse historyResponse = new HistoryResponse();
                historyResponse.setId(saved.getId());
                historyResponse.setFullName(user.getName() + " " + user.getLastName());
                historyResponse.setEmail(user.getEmail());
                historyResponse.setBrand(saved.getBrand());
                historyResponse.setKerasPrediction(predictionResponse.getPredicted_price_usd_with_keras());
                historyResponse.setLinearPrediction(predictionResponse.getPredicted_price_usd_with_linear());
                historyResponse.setCreatedAt(saved.getCreatedAt());

                return historyResponse;
            } else {
                throw new RuntimeException("Unexpected status code: " + response.getStatusCode());
            }

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            PredictError error = e.getResponseBodyAs(PredictError.class);

            throw new PredictionErrorException(error);
        } catch (Exception e) {
            throw new PredictionErrorException("Error al hacer la solicitud de predicción");
        }
    }
}
