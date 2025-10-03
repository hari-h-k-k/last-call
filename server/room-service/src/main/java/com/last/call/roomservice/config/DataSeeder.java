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
            // Picasso Blue Period Sketch (item ID 2)
            Room liveRoom1 = new Room(2L, 
                new Date(now - 2 * 60 * 60 * 1000),  // started 2h ago
                new Date(now + 4 * 60 * 60 * 1000),  // ends in 4h
                "ACTIVE", 850000.0);
            
            // Ferrari 250 GTO (item ID 4)
            Room liveRoom2 = new Room(4L,
                new Date(now - 1 * 60 * 60 * 1000),  // started 1h ago
                new Date(now + 5 * 60 * 60 * 1000),  // ends in 5h
                "ACTIVE", 48000000.0);

            // Manhattan Penthouse (item ID 11)
            Room liveRoom3 = new Room(11L,
                new Date(now - 2 * 60 * 60 * 1000),  // started 2h ago
                new Date(now + 6 * 60 * 60 * 1000),  // ends in 6h
                "ACTIVE", 12500000.0);

            // AUCTION OF THE DAY - Registration closed, auction starts today
            // Honda CB750 (item ID 5) - PENDING until auction starts
            Room todayRoom1 = new Room(5L,
                new Date(now + 2 * 60 * 60 * 1000),  // starts in 2h
                new Date(now + 8 * 60 * 60 * 1000),  // ends in 8h
                "PENDING", 25000.0);

            // Mickey Mantle Card (item ID 8) - PENDING until auction starts
            Room todayRoom2 = new Room(8L,
                new Date(now + 8 * 60 * 60 * 1000),  // starts in 8h
                new Date(now + 14 * 60 * 60 * 1000), // ends in 14h
                "PENDING", 5200000.0);

            // Patek Philippe Nautilus (item ID 14) - PENDING until auction starts
            Room todayRoom3 = new Room(14L,
                new Date(now + 2 * 60 * 60 * 1000),  // starts in 2h
                new Date(now + 8 * 60 * 60 * 1000),  // ends in 8h
                "PENDING", 180000.0);

            roomRepository.save(liveRoom1);
            roomRepository.save(liveRoom2);
            roomRepository.save(liveRoom3);
            roomRepository.save(todayRoom1);
            roomRepository.save(todayRoom2);
            roomRepository.save(todayRoom3);

            // Room participants for live auctions
            roomUserRepository.save(new RoomUser("steve", liveRoom1));
            roomUserRepository.save(new RoomUser("tony", liveRoom1));
            roomUserRepository.save(new RoomUser("peter", liveRoom2));
            roomUserRepository.save(new RoomUser("bruce", liveRoom2));
            roomUserRepository.save(new RoomUser("clark", liveRoom3));
            roomUserRepository.save(new RoomUser("diana", liveRoom3));

            // Sample bids for active auctions
            bidRepository.save(new Bid("steve", 900000.0, liveRoom1));
            bidRepository.save(new Bid("tony", 950000.0, liveRoom1));
            bidRepository.save(new Bid("peter", 50000000.0, liveRoom2));
            bidRepository.save(new Bid("bruce", 52000000.0, liveRoom2));
            bidRepository.save(new Bid("clark", 13000000.0, liveRoom3));
            bidRepository.save(new Bid("diana", 13500000.0, liveRoom3));

            System.out.println("✅ Room service data seeded! (3 active, 3 pending rooms)");
        };
    }
}