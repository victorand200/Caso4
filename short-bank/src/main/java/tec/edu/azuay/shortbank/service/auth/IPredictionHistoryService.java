package tec.edu.azuay.shortbank.service.auth;

import tec.edu.azuay.shortbank.persistence.entity.dto.HistoryResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.VehicleResponse;

import java.util.List;

public interface IPredictionHistoryService {

    List<HistoryResponse> getAll();

    List<HistoryResponse> getMyHistory();

    VehicleResponse getHistoryById(Long id);
}
