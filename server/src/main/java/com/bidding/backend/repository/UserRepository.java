package com.bidding.backend.repository;


import com.bidding.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findByUsername(String username);
    boolean existsByUsername(String username);
}
