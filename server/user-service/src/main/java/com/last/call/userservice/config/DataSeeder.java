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

            User tony = new User("Tony Stark", "tony", "tony@stark.com", encoder.encode("stark"));
            tony.setDateCreated(now);
            tony.setVerified(true);

            User uncle = new User("Uncle Ben", "uncle", "uncle@ben.com", encoder.encode("ben"));
            uncle.setDateCreated(now);
            uncle.setVerified(true);

            User peter = new User("Peter Parker", "peter", "peter@parker.com", encoder.encode("parker"));
            peter.setDateCreated(now);
            peter.setVerified(true);

            userRepository.save(tony);
            userRepository.save(uncle);
            userRepository.save(peter);

            System.out.println("✅ User service data seeded!");
        };
    }
}