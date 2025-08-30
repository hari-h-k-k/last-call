package com.bidding.backend.controller;

import com.bidding.backend.commonUtils.ResponseBuilder;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.UserRepository;
import com.bidding.backend.jwtUtils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            Map<String, Object> response = new ResponseBuilder()
                    .setStatus("error")
                    .setMessage("Username already taken!")
                    .build();
            return ResponseEntity.status(400).body(response);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("User registered successfully!")
                .setData(Map.of(
                        "username", user.getUsername(),
                        "email", user.getEmail()
                ))
                .build();

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser != null && passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            String token = jwtUtil.generateToken(foundUser.getUsername());

            Map<String, Object> response = new ResponseBuilder()
                    .setStatus("success")
                    .setMessage("Login successful!")
                    .setData(Map.of(
                            "token", token,
                            "username", foundUser.getUsername(),
                            "email", foundUser.getEmail()
                    ))
                    .build();

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new ResponseBuilder()
                    .setStatus("error")
                    .setMessage("Invalid username or password!")
                    .build();
            return ResponseEntity.status(401).body(response);
        }
    }
}

