package com.last.call.userservice.config;

import com.last.call.userservice.entity.User;
import com.last.call.userservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Date;

@Configuration
@Profile("!prod")
public class DataSeeder {

    @Bean
    CommandLineRunner seedUserData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() > 0) return;

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            Date now = new Date();

            User steve = new User("Steve Rogers", "steve", "steve@rogers.com", encoder.encode("rogers"));
            steve.setDateCreated(now);
            steve.setVerified(true);

            User tony = new User("Tony Stark", "tony", "tony@stark.com", encoder.encode("stark"));
            tony.setDateCreated(now);
            tony.setVerified(true);

            User peter = new User("Peter Parker", "peter", "peter@parker.com", encoder.encode("parker"));
            peter.setDateCreated(now);
            peter.setVerified(true);

            User bruce = new User("Bruce Wayne", "bruce", "bruce@wayne.com", encoder.encode("wayne"));
            bruce.setDateCreated(now);
            bruce.setVerified(true);

            User clark = new User("Clark Kent", "clark", "clark@dailyplanet.com", encoder.encode("kent"));
            clark.setDateCreated(now);
            clark.setVerified(true);

            userRepository.save(steve);
            userRepository.save(tony);
            userRepository.save(peter);
            userRepository.save(bruce);
            userRepository.save(clark);

            System.out.println("✅ User service data seeded!");
        };
    }
}