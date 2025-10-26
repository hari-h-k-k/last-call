package com.last.call.roomservice.util;

import com.last.call.roomservice.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseBuilder {
    
    public static <T> ResponseEntity<ApiResponse<T>> success(T subject, String message) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .subject(subject)
                .statusCode(200)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> error(String message) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .statusCode(400)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}