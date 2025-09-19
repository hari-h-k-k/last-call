package com.last.call.userservice.service;

import com.last.call.userservice.entity.User;
import com.last.call.userservice.exception.InvalidCredentialsException;
import com.last.call.userservice.exception.UserAlreadyExistsException;
import com.last.call.userservice.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // -----------------------------
    // Register a new user
    // -----------------------------
    public User register(String username, String email, String password, String confirmPassword) {

        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setDateCreated(new Date());

        return userRepository.save(user);
    }

    // -----------------------------
    // Authenticate user
    // -----------------------------
    public User authenticate(String usernameOrEmail, String rawPassword) {
        Optional<User> userOpt = usernameOrEmail.contains("@") 
            ? userRepository.findByEmail(usernameOrEmail)
            : userRepository.findByUsername(usernameOrEmail);

        if (userOpt.isEmpty()) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        User user = userOpt.get();

        // Check password
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        return user;
    }
}

