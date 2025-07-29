package tec.edu.azuay.shortbank.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tec.edu.azuay.shortbank.persistence.entity.dto.ApiError;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ObjectNotFoundException.class)
    public ResponseEntity<?> handlerObjectNotFoundException(Exception exception, HttpServletRequest request){
        return createResponseEntity(exception, request, 404, "Object not found");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handlerInvalidCredentialsException(Exception exception, HttpServletRequest request){
        return createResponseEntity(exception, request, 401, "Invalid credentials");
    }

    @ExceptionHandler(ExistsObjectException.class)
    public ResponseEntity<?> handlerExistsObjectException(Exception exception, HttpServletRequest request){
        return createResponseEntity(exception, request, 400, exception.getMessage());
    }

    @ExceptionHandler(InvalidDataException.class)
    public ResponseEntity<?> handlerInvalidDataException(Exception exception, HttpServletRequest request){
        return createResponseEntity(exception, request, 409, exception.getMessage());
    }

    @ExceptionHandler(PredictionErrorException.class)
    public ResponseEntity<?> handlerPredictionErrorException(Exception exception, HttpServletRequest request) {
        if (exception instanceof PredictionErrorException) {
            return createResponseEntity(exception, request, 500, "Prediction error occurred");
        }
        return createResponseEntity(exception, request, 500, "An unexpected error occurred");
    }

    private ResponseEntity<?> createResponseEntity(Exception exception, HttpServletRequest request, Integer code, String message) {
        ApiError error = new ApiError();

        error.setHttpCode(code);
        error.setMessage(message);
        error.setBackendMessage(exception.getLocalizedMessage());
        error.setUrl(request.getRequestURI());
        error.setMethod(request.getMethod());
        error.setTime(LocalDateTime.now());

        return ResponseEntity.status(code).body(error);
    }
}
