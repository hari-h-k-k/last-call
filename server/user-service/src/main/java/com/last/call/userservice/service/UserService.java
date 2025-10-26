package com.last.call.userservice.service;

import com.last.call.userservice.entity.User;
import com.last.call.userservice.exception.InvalidCredentialsException;
import com.last.call.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public boolean isUsernameExistsExcludingUser(String username, Long userId) {
        return userRepository.findByUsername(username)
                .filter(user -> !user.getId().equals(userId))
                .isPresent();
    }

    public boolean isEmailExistsExcludingUser(String email, Long userId) {
        return userRepository.findByEmail(email)
                .filter(user -> !user.getId().equals(userId))
                .isPresent();
    }
}