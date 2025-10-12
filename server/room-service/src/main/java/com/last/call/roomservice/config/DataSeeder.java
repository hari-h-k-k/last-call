package com.last.call.roomservice.config;

import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.entity.Bid;
import com.last.call.roomservice.entity.RoomUser;
import com.last.call.roomservice.repository.RoomRepository;
import com.last.call.roomservice.repository.BidRepository;
import com.last.call.roomservice.repository.RoomUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Date;

@Configuration
@Profile("!prod")
public class DataSeeder {

    @Bean
    CommandLineRunner seedRoomData(RoomRepository roomRepository, 
                                   BidRepository bidRepository,
                                   RoomUserRepository roomUserRepository) {
        return args -> {
            if (roomRepository.count() > 0) return;

            System.out.println("✅ Room service data seeded! (2 active, 2 pending rooms)");
        };
    }
}