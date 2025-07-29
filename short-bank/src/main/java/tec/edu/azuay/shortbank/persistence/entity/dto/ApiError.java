package tec.edu.azuay.shortbank.persistence.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiError {

    private String backendMessage;

    private String message;

    private Integer httpCode;

    private String url;

    private String method;

    private LocalDateTime time;
}