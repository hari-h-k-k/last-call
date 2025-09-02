package com.bidding.backend.controller;

import com.bidding.backend.entity.User;
import com.bidding.backend.service.UserService;
import com.bidding.backend.utils.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/getAll")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public String getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "No token provided!";
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return "Invalid token!";
        }
        String username = jwtUtil.extractUsername(token);
        return "Hello, " + username;
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }
}