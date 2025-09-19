package com.last.call.userservice.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private Long userId;

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, String username, Long userId) {
        this.token = token;
        this.username = username;
        this.userId = userId;
    }
}