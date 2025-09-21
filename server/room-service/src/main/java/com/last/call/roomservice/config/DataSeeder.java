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

            Date now = new Date();
            
            // Rooms for items (matching item IDs from item-service)
            Room room1 = new Room(1L, 
                new Date(now.getTime() + 7200000),  // starts in 2h
                new Date(now.getTime() + 10800000), // ends in 3h
                "ACTIVE", 1200.0);
            
            Room room2 = new Room(2L,
                new Date(now.getTime() + 1500000),  // starts in 25min
                new Date(now.getTime() + 3600000),  // ends in 1h
                "ACTIVE", 450.0);

            roomRepository.save(room1);
            roomRepository.save(room2);

            // Room participants
            roomUserRepository.save(new RoomUser("user1", room1));
            roomUserRepository.save(new RoomUser("user2", room1));
            roomUserRepository.save(new RoomUser("user3", room2));

            // Sample bids
            bidRepository.save(new Bid("user1", 1300.0, room1));
            bidRepository.save(new Bid("user2", 1400.0, room1));
            bidRepository.save(new Bid("user3", 500.0, room2));

            System.out.println("✅ Room service data seeded!");
        };
    }
}