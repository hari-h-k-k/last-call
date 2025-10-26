package com.last.call.userservice.dto;

public class AuthResponse {
    private String token;
    private String name;
    private String username;
    private Long userId;

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, String name, String username, Long userId) {
        this.token = token;
        this.name = name;
        this.username = username;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}