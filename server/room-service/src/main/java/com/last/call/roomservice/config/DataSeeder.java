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

            long now = System.currentTimeMillis();
            
            // LIVE AUCTIONS - Registration closed, auction active
            // Manhattan Penthouse (item ID 11) - auction started 2 hours ago
            Room liveRoom1 = new Room(11L, 
                new Date(now - 2 * 60 * 60 * 1000),  // started 2h ago
                new Date(now + 6 * 60 * 60 * 1000),  // ends in 6h
                "ACTIVE", 12500000.0);
            
            // 1963 Ferrari 250 GTO (item ID 4) - auction started 1 hour ago
            Room liveRoom2 = new Room(4L,
                new Date(now - 1 * 60 * 60 * 1000),  // started 1h ago
                new Date(now + 5 * 60 * 60 * 1000),  // ends in 5h
                "ACTIVE", 48000000.0);

            // AUCTION OF THE DAY - Registration closed, auction starts today
            // Patek Philippe Nautilus 5711 (item ID 14) - auction starts in 2 hours (today)
            Room todayRoom1 = new Room(14L,
                new Date(now + 2 * 60 * 60 * 1000),  // starts in 2h
                new Date(now + 8 * 60 * 60 * 1000),  // ends in 8h
                "PENDING", 180000.0);

            // Beverly Hills Mansion (item ID 9) - auction starts in 8 hours (today)
            Room todayRoom2 = new Room(9L,
                new Date(now + 8 * 60 * 60 * 1000),  // starts in 8h
                new Date(now + 14 * 60 * 60 * 1000), // ends in 14h
                "PENDING", 25000000.0);

            roomRepository.save(liveRoom1);
            roomRepository.save(liveRoom2);
            roomRepository.save(todayRoom1);
            roomRepository.save(todayRoom2);

            // Room participants for live auctions
            roomUserRepository.save(new RoomUser(2L, liveRoom2));
            roomUserRepository.save(new RoomUser(3L, liveRoom2));

            System.out.println("✅ Room service data seeded! (2 active, 2 pending rooms)");
        };
    }
}