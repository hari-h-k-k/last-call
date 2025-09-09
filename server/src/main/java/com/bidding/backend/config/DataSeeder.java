package com.bidding.backend.config;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.Room;
import com.bidding.backend.entity.LocationRequest;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.repository.UserRepository;
import com.bidding.backend.service.RoomService;
import com.bidding.backend.service.ItemService;
import com.bidding.backend.service.UserService;
import com.bidding.backend.utils.enums.ItemCategory;
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
                                   UserService userService,
                                   ItemRepository itemRepo,
                                   ItemService itemService,
                                   RoomRepository roomRepo,
                                   RoomService roomService) {
        return args -> {
            userRepo.deleteAll();
            itemRepo.deleteAll();
            roomRepo.deleteAll();

            Date now = new Date();
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            // --- USERS (simple names, password = last name) ---
            User steve = new User("Steve Rogers", "steve", "steve@rogers.com",
                    passwordEncoder.encode("rogers"));
            User tony = new User("Tony Stark", "tony", "tony@stark.com",
                    passwordEncoder.encode("stark"));
            User peter = new User("Peter Parker", "peter", "peter@parker.com",
                    passwordEncoder.encode("parker"));
            User bruce = new User("Bruce Wayne", "bruce", "bruce@wayne.com",
                    passwordEncoder.encode("wayne"));
            User clark = new User("Clark Kent", "clark", "clark@dailyplanet.com",
                    passwordEncoder.encode("kent"));
            User thor = new User("Thor Odinson", "thor", "thor@asgard.com",
                    passwordEncoder.encode("odinson"));
            User bruceBanner = new User("Bruce Banner", "hulk", "bruce@banner.com",
                    passwordEncoder.encode("banner"));
            User uncle   = new User("Uncle Ben", "uncle", "uncle@ben.com",
                    passwordEncoder.encode("ben"));

            // --- Save users ---
            List<User> users = List.of(steve, tony, peter, bruce, clark, thor, bruceBanner, uncle);

            for (User user : users) {
                userService.saveUser(user);
            }

            // --- ITEMS ---
            // Owned by Steve Rogers
            Item shield = new Item("Captain America Shield", "Replica of Cap's shield",
                    steve.getId(),
                    new Date(now.getTime() + 1000 * 60 * 60),     // registration closes in 1h
                    new Date(now.getTime() + 1000 * 60 * 60 * 2), // bidding starts in 2h
                    1200.0, ItemCategory.COLLECTIBLES, List.of("shield", "marvel"), new LocationRequest(0,0));
            shield.setSubscribersId(List.of(uncle.getId(), peter.getId(), tony.getId()));

            // Owned by Uncle Ben
            Item pocketWatch = new Item("Vintage Pocket Watch", "Antique gold pocket watch passed down in the family",
                    uncle.getId(),
                    new Date(now.getTime() + 1000 * 60 * 20),   // registration closes in 20 min
                    new Date(now.getTime() + 1000 * 60 * 40),   // auction starts in 40 min
                    200.0, ItemCategory.COLLECTIBLES, List.of("vintage", "watch", "antique"), new LocationRequest(0,0));
            pocketWatch.setSubscribersId(List.of(steve.getId(), peter.getId(), bruce.getId()));

            // Owned by Peter Parker
            Item webShooter = new Item("Web Shooter", "Mechanical web-shooters replica",
                    peter.getId(),
                    new Date(now.getTime() + 1000 * 60 * 15), // registration closes in 15 min
                    new Date(now.getTime() + 1000 * 60 * 25), // auction starts in 25 min
                    450.0, ItemCategory.COLLECTIBLES, List.of("web-shooter", "spiderman"), new LocationRequest(0,0));
            webShooter.setSubscribersId(List.of(steve.getId(), uncle.getId(), tony.getId()));

            Item camera = new Item("Vintage Camera", "Classic film camera, perfect for photography fans",
                    peter.getId(),
                    new Date(now.getTime() + 1000 * 50),    // registration closes in 50 sec
                    new Date(now.getTime() + 1000 * 140),   // auction starts in 2 min 20 sec
                    200.0, ItemCategory.COLLECTIBLES, List.of("camera", "vintage"), new LocationRequest(0,0));
            camera.setSubscribersId(List.of(steve.getId(), uncle.getId()));

            // Owned by Tony Stark
            Item ironSuit = new Item("Iron Man Suit", "Mark XLVI armor replica",
                    tony.getId(),
                    new Date(now.getTime() + 1000 * 60 * 50), // registration closes in 50 min
                    new Date(now.getTime() + 1000 * 60 * 70), // auction starts in 70 min
                    5000.0, ItemCategory.COLLECTIBLES, List.of("armor", "marvel"), new LocationRequest(0,0));
            ironSuit.setSubscribersId(List.of(steve.getId(), peter.getId(), bruce.getId()));

            Item oldHelmet = new Item("Iron Man Helmet", "Scratched Mark III helmet replica",
                    tony.getId(),
                    new Date(now.getTime() - 1000 * 60 * 60), // registration closed 1 hour ago
                    new Date(now.getTime() - 1000 * 30 * 60), // auction started 30 min ago
                    1000.0, ItemCategory.COLLECTIBLES, List.of("helmet", "marvel"), new LocationRequest(0,0));
            oldHelmet.setSubscribersId(List.of(steve.getId(), peter.getId(), bruce.getId()));

            // Owned by Bruce Wayne
            Item batMobile = new Item("Batmobile", "High-tech armored vehicle",
                    bruce.getId(),
                    new Date(now.getTime() + 1000 * 60 * 15), // registration closes in 15 min
                    new Date(now.getTime() + 1000 * 60 * 25), // auction starts in 25 min
                    500000.0, ItemCategory.VEHICLES, List.of("batmobile", "dc"), new LocationRequest(0,0));
            batMobile.setSubscribersId(List.of(bruceBanner.getId(), clark.getId()));

            // Owned by Clark Kent
            Item kryptonite = new Item("Kryptonite Shard", "Green kryptonite piece",
                    clark.getId(),
                    new Date(now.getTime() + 1000 * 60 * 10), // closes in 10 min
                    new Date(now.getTime() + 1000 * 60 * 20), // auction starts in 20 min
                    500.0, ItemCategory.COLLECTIBLES, List.of("kryptonite", "dc"), new LocationRequest(0,0));
            kryptonite.setSubscribersId(List.of(bruce.getId(), bruceBanner.getId(), thor.getId()));

            itemService.saveItem(shield);
            itemService.saveItem(pocketWatch);
            itemService.saveItem(webShooter);
            itemService.saveItem(camera);
            itemService.saveItem(ironSuit);
            itemService.saveItem(batMobile);
            itemService.saveItem(kryptonite);
            itemService.saveItem(oldHelmet);

        };
    }
}
