package com.bidding.backend.config;

import com.bidding.backend.entity.BidItem;
import com.bidding.backend.entity.BiddingRoom;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.BidItemRepository;
import com.bidding.backend.repository.BiddingRoomRepository;
import com.bidding.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepo,
                                   BidItemRepository bidItemRepo,
                                   BiddingRoomRepository biddingRoomRepo) {
        return args -> {
            userRepo.deleteAll();
            bidItemRepo.deleteAll();
            biddingRoomRepo.deleteAll();

            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            // ---- USERS ---- (passwords are hashed)
            User alice = new User("Alice Smith", "alice", "alice@example.com",
                    passwordEncoder.encode("password123"));
            User bob   = new User("Bob Johnson", "bob", "bob@example.com",
                    passwordEncoder.encode("qwerty"));
            User carol = new User("Carol Lee", "carol", "carol@example.com",
                    passwordEncoder.encode("password678"));
            User tony = new User("Tony Stark", "tony", "tony@stark.com",
                    passwordEncoder.encode("stark"));

            userRepo.saveAll(List.of(alice, bob, carol, tony));

            // ---- BID ITEMS ----
            BidItem laptop = new BidItem("Gaming Laptop", "RTX 4060, 16GB RAM, 1TB SSD",
                    alice.getId(), 1000.0, "Electronics", List.of("laptop", "gaming"));

            BidItem phone  = new BidItem("iPhone 14", "128GB, Midnight Black",
                    bob.getId(), 800.0, "Electronics", List.of("smartphone", "apple"));

            BidItem bike   = new BidItem("Mountain Bike", "21 speed, lightweight frame",
                    carol.getId(), 300.0, "Sports", List.of("bike", "outdoor"));
            bidItemRepo.saveAll(List.of(laptop, phone, bike));

            // ---- BIDDING ROOMS ----
            BiddingRoom room1 = new BiddingRoom();
            room1.setItemId(laptop.getId());
            room1.setStartDate(new Date());
            room1.setEndDate(new Date(System.currentTimeMillis() + 1000 * 60 * 60));
            room1.setStatus("ACTIVE");
            room1.setListOfUserIds(List.of(bob.getId().hashCode(), carol.getId().hashCode()));
            room1.setCurrentPrice(1100.0);
            room1.setCreatedAt(new Date());
            room1.setUpdatedAt(new Date());
            room1.setWinnerId(null); // no winner yet

            BiddingRoom room2 = new BiddingRoom();
            room2.setItemId(phone.getId());
            room2.setStartDate(new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 2));
            room2.setEndDate(new Date(System.currentTimeMillis() - 1000 * 60 * 30));
            room2.setStatus("ENDED");
            room2.setListOfUserIds(List.of(alice.getId().hashCode(), carol.getId().hashCode()));
            room2.setCurrentPrice(950.0);
            room2.setCreatedAt(new Date());
            room2.setUpdatedAt(new Date());
            room2.setWinnerId(alice.getId()); // Alice won

            biddingRoomRepo.saveAll(List.of(room1, room2));
        };
    }
}

