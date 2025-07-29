package tec.edu.azuay.shortbank.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tec.edu.azuay.shortbank.persistence.entity.model.PredictionHistory;

import java.util.List;

public interface IPredictionHistoryRepository extends JpaRepository<PredictionHistory, Long> {
    List<PredictionHistory> findAllByUserEmailOrderByCreatedAtDesc(String email);
}
