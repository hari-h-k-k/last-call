package com.bidding.backend.service;

import com.bidding.backend.entity.User;
import com.bidding.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean userExists(User user) {
        return userRepository.existsByUsername(user.getUsername());
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User findUser(User user) {
        return userRepository.findByUsername(user.getUsername());
    }
}

