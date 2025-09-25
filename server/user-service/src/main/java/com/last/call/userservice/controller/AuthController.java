package com.last.call.userservice.controller;

import com.last.call.userservice.dto.LoginRequest;
import com.last.call.userservice.dto.RegisterRequest;
import com.last.call.userservice.entity.User;
import com.last.call.userservice.exception.InvalidCredentialsException;
import com.last.call.userservice.exception.UserAlreadyExistsException;
import com.last.call.userservice.security.JwtUtil;
import com.last.call.userservice.service.AuthService;

import com.last.call.userservice.dto.ApiResponse;
import com.last.call.userservice.dto.AuthResponse;
import com.last.call.userservice.util.ResponseBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


@RestController
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    // -------------------------
    // Register new user
    // -------------------------
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        
        try {
            User user = authService.register(request.getUsername(),
                    request.getEmail(), request.getPassword(), request.getConfirmPassword());
            String token = jwtUtil.generateToken(user.getId().toString());
            AuthResponse authResponse = new AuthResponse(token, user.getUsername(), user.getId());
            
            return ResponseBuilder.success(authResponse, "User registered successfully");
        } catch (UserAlreadyExistsException e) {
            return ResponseBuilder.validationError(e.getMessage());
        } catch (Exception e) {
            return ResponseBuilder.serverError("Registration failed");
        }
    }

    // -------------------------
    // Login
    // -------------------------
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        
        try {
            User user = authService.authenticate(request.getUsernameOrEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getId().toString());
            AuthResponse authResponse = new AuthResponse(token, user.getUsername(), user.getId());
            
            return ResponseBuilder.success(authResponse, "Login successful");
        } catch (InvalidCredentialsException e) {
            return ResponseBuilder.unauthorized(e.getMessage());
        } catch (Exception e) {
            return ResponseBuilder.serverError("Login failed");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verify(@RequestHeader("X-User-Id") String userId) {
        try {
            User user = authService.findById(Long.parseLong(userId));
            return ResponseBuilder.success(user.getUsername(), "Token verified");
        } catch (Exception e) {
            return ResponseBuilder.unauthorized("User not found");
        }
    }

}

