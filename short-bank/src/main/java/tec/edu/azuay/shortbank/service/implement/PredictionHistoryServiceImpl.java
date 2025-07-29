package tec.edu.azuay.shortbank.service.implement;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tec.edu.azuay.shortbank.exceptions.ObjectNotFoundException;
import tec.edu.azuay.shortbank.persistence.entity.dto.HistoryResponse;
import tec.edu.azuay.shortbank.persistence.entity.dto.VehicleResponse;
import tec.edu.azuay.shortbank.persistence.entity.model.PredictionHistory;
import tec.edu.azuay.shortbank.persistence.entity.model.User;
import tec.edu.azuay.shortbank.persistence.repository.IPredictionHistoryRepository;
import tec.edu.azuay.shortbank.persistence.repository.IUserRepository;
import tec.edu.azuay.shortbank.service.auth.IPredictionHistoryService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionHistoryServiceImpl implements IPredictionHistoryService {

    private final IPredictionHistoryRepository historyRepository;

    private final IUserRepository userRepository;

    private final ModelMapper modelMapper;

    @Override
    public List<HistoryResponse> getAll() {
        return historyRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<HistoryResponse> getMyHistory() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findOneByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PredictionHistory> historyList = historyRepository.findAllByUserEmailOrderByCreatedAtDesc(user.getEmail());

        return historyList.stream().map(this::mapToDto).toList();
    }

    @Override
    public VehicleResponse getHistoryById(Long id) {
        return historyRepository.findById(id)
                .map(this::mapToVehicleResponse)
                .orElseThrow(() -> new ObjectNotFoundException("Prediction history not found with id: " + id));
    }

    private HistoryResponse mapToDto(PredictionHistory entity) {
        HistoryResponse historyResponse = modelMapper.map(entity, HistoryResponse.class);
        historyResponse.setEmail(entity.getUser().getEmail());
        historyResponse.setFullName(entity.getUser().getName() + " " + entity.getUser().getLastName());
        historyResponse.setKerasPrediction(entity.getPredictedPriceKeras() != null ? entity.getPredictedPriceKeras() : null);
        historyResponse.setLinearPrediction(entity.getPredictedPriceLinear() != null ? entity.getPredictedPriceLinear() : null);

        return historyResponse;
    }

    private VehicleResponse mapToVehicleResponse(PredictionHistory entity) {
        return  modelMapper.map(entity, VehicleResponse.class);
    }
}
