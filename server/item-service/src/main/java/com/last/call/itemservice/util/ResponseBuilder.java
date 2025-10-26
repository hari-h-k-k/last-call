package com.last.call.itemservice.util;

import com.last.call.itemservice.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseBuilder {

    private ResponseBuilder() {
        throw new IllegalStateException("");
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> success(T subject, String message) {
        return ResponseEntity.ok(ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .subject(subject)
                .statusCode(200)
                .build());
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .statusCode(status.value())
                .build());
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> validationError(String message) {
        return error(message, HttpStatus.BAD_REQUEST);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> unauthorized(String message) {
        return error(message, HttpStatus.UNAUTHORIZED);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> serverError(String message) {
        return error(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}