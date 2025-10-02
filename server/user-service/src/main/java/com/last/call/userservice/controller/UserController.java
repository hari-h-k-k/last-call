package com.last.call.userservice.controller;

import com.last.call.userservice.dto.ApiResponse;
import com.last.call.userservice.dto.UserResponse;
import com.last.call.userservice.dto.UpdateUserRequest;
import com.last.call.userservice.entity.User;
import com.last.call.userservice.service.AuthService;

import com.last.call.userservice.util.ResponseBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        logger.info("Test endpoint called");
        return ResponseBuilder.success("UserController is working", "Test successful");
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@RequestHeader("X-User-Id") String userId) {
        try {
            User user = authService.findById(Long.parseLong(userId));
            UserResponse userResponse = new UserResponse(user);
            
            return ResponseBuilder.success(userResponse, "User profile retrieved successfully");
        } catch (Exception e) {
            logger.error("Failed to get user profile for userId: {}", userId, e);
            return ResponseBuilder.serverError("Failed to retrieve user profile");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            User user = authService.findById(Long.parseLong(userId));
            
            if (request.getName() != null) {
                user.setName(request.getName());
            }
            if (request.getUsername() != null) {
                user.setUsername(request.getUsername());
            }
            if (request.getEmail() != null) {
                user.setEmail(request.getEmail());
            }
            
            User updatedUser = authService.updateUser(user);
            UserResponse userResponse = new UserResponse(updatedUser);
            
            return ResponseBuilder.success(userResponse, "User profile updated successfully");
        } catch (Exception e) {
            logger.error("Failed to update user profile for userId: {}", userId, e);
            return ResponseBuilder.serverError("Failed to update user profile");
        }
    }
}