package me.soldesk.springbootback.global.exception;

import me.soldesk.springbootback.global.response.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionController {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionController.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("입력값을 확인해주세요.");
        ErrorResponse errorResponse = new ErrorResponse("INVALID_INPUT_VALUE", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException e) {
        int statusCode = e.getStatusCode().value();
        String message = e.getReason() == null || e.getReason().isBlank()
                ? "요청을 처리할 수 없습니다."
                : e.getReason();

        return ResponseEntity
                .status(e.getStatusCode())
                .body(new ErrorResponse(getErrorCode(statusCode), message));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        log.warn("데이터 무결성 제약조건 위반", e);
        ErrorResponse errorResponse = new ErrorResponse(
                "DATA_CONFLICT",
                "이미 등록된 정보이거나 다른 데이터에서 사용 중인 정보입니다."
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e){
        ErrorResponse errorResponse = new ErrorResponse("INVALID_INPUT_VALUE", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        // 시세 API처럼 메시지를 직접 지정해 던진 순수 RuntimeException은 기존 400 응답을 유지합니다.
        if (e.getClass().equals(RuntimeException.class)) {
            ErrorResponse errorResponse = new ErrorResponse("API_ERROR", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        return handleUnexpectedException(e);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception e) {
        return handleUnexpectedException(e);
    }

    private ResponseEntity<ErrorResponse> handleUnexpectedException(Exception e) {
        log.error("처리되지 않은 서버 오류", e);
        ErrorResponse errorResponse = new ErrorResponse(
                "SYSTEM_ERROR",
                "서버에서 요청을 처리하는 중 오류가 발생했습니다."
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private String getErrorCode(int statusCode) {
        return switch (statusCode) {
            case 400 -> "INVALID_INPUT_VALUE";
            case 401 -> "UNAUTHORIZED";
            case 403 -> "FORBIDDEN";
            case 404 -> "RESOURCE_NOT_FOUND";
            case 409 -> "DATA_CONFLICT";
            default -> "REQUEST_FAILED";
        };
    }
}
