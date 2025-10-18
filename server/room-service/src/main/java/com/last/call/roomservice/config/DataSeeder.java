package com.last.call.roomservice.config;

import com.last.call.roomservice.repository.RoomRepository;
import com.last.call.roomservice.repository.BidRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!prod")
public class DataSeeder {

    @Bean
    CommandLineRunner seedRoomData(RoomRepository roomRepository, 
                                   BidRepository bidRepository) {
        return args -> {
            roomRepository.deleteAll();
            bidRepository.deleteAll();

            System.out.println("✅ Room service data seeded! (2 active, 2 pending rooms)");
        };
    }
}