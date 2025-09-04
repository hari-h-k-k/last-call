package com.bidding.backend.config;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.BiddingRoom;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.BiddingRoomRepository;
import com.bidding.backend.repository.UserRepository;
import com.bidding.backend.service.BiddingRoomService;
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
                                   BiddingRoomRepository biddingRoomRepo,
                                   BiddingRoomService biddingRoomService) {
        return args -> {
            userRepo.deleteAll();
            itemRepo.deleteAll();
            biddingRoomRepo.deleteAll();

            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            // ---- USERS ---- (passwords are hashed)
            User steve = new User("Steve Rogers", "steve", "steve@rogers.com",
                    passwordEncoder.encode("rogers"));
            User uncle   = new User("Uncle Ben", "uncle", "uncle@ben.com",
                    passwordEncoder.encode("ben"));
            User peter = new User("Peter Parker", "peter", "peter@parker.com",
                    passwordEncoder.encode("parker"));
            User tony = new User("Tony Stark", "tony", "tony@stark.com",
                    passwordEncoder.encode("stark"));

            userService.saveUser(steve);
            userService.saveUser(uncle);
            userService.saveUser(peter);
            userService.saveUser(tony);

            Date now = new Date();

            // ---- BID ITEMS ----
            Item laptop = new Item("Gaming Laptop", "RTX 4060, 16GB RAM, 1TB SSD",
                    steve.getId(),
                    new Date(now.getTime() + 1000 * 60 * 60),     // registration closes in 1h
                    new Date(now.getTime() + 1000 * 60 * 60 * 2), // bidding starts in 2h
                    1000.0, ItemCategory.ELECTRONICS, List.of("laptop", "gaming"));
            laptop.setSubscribersId(List.of(uncle.getId(), peter.getId()));

            Item phone = new Item("iPhone 14", "128GB, Midnight Black",
                    uncle.getId(),
                    new Date(now.getTime() + 1000 * 60 * 60 * 3), // closes in 3h
                    new Date(now.getTime() + 1000 * 60 * 60 * 4), // starts in 4h
                    800.0, ItemCategory.ELECTRONICS, List.of("smartphone", "apple"));
            phone.setSubscribersId(List.of(steve.getId(), tony.getId()));

            Item bike = new Item("Mountain Bike", "21 speed, lightweight frame",
                    peter.getId(),
                    new Date(now.getTime() + 1000 * 60 * 20), // closes in 20 min
                    new Date(now.getTime() + 1000 * 60 * 30), // starts in 30 min
                    300.0, ItemCategory.SPORTS, List.of("bike", "outdoor"));
            bike.setSubscribersId(List.of(steve.getId(), uncle.getId()));

//            Item car = new Item("SUV", "4x4, 4-cylinder engine",
//                    tony.getId(),
//                    new Date(now.getTime() + 1000 * 60 * 20), // closes in 20 min
//                    new Date(now.getTime() + 1000 * 60 * 10), // starts in 30 min
//                    300.0, "Sports", List.of("car", "outdoor"));
//            car.setSubscribersId(List.of(steve.getId(), uncle.getId()));

            Item house = new Item("House", "3BHK",
                    tony.getId(),
                    new Date(now.getTime() - 1000 * 60 * 60 * 100),
                    new Date(now.getTime() - 1000 * 60 * 60 * 80),
                    300.0, ItemCategory.PROPERTY, List.of("property", "house"));
            house.setSubscribersId(List.of(steve.getId(), uncle.getId()));

            itemService.saveItem(laptop);
            itemService.saveItem(phone);
            itemService.saveItem(bike);
//            itemService.saveItem(car);
            itemService.saveItem(house);

            // ---- BIDDING ROOMS ----
            BiddingRoom room1 = new BiddingRoom();
            room1.setItemId(laptop.getId());
            room1.setStartDate(new Date());
            room1.setEndDate(new Date(System.currentTimeMillis() + 1000 * 60 * 60));
            room1.setStatus("ACTIVE");
            room1.setListOfUserIds(List.of(uncle.getId(), peter.getId()));
            room1.setCurrentPrice(1100.0);
            room1.setCreatedAt(new Date());
            room1.setUpdatedAt(new Date());
            room1.setWinnerId(null); // no winner yet

            BiddingRoom room2 = new BiddingRoom();
            room2.setItemId(phone.getId());
            room2.setStartDate(new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 2));
            room2.setEndDate(new Date(System.currentTimeMillis() - 1000 * 60 * 30));
            room2.setStatus("ENDED");
            room2.setListOfUserIds(List.of(steve.getId(), peter.getId()));
            room2.setCurrentPrice(950.0);
            room2.setCreatedAt(new Date());
            room2.setUpdatedAt(new Date());
            room2.setWinnerId(steve.getId()); // Alice won

            biddingRoomService.saveBiddingRoom(room1);
            biddingRoomService.saveBiddingRoom(room2);
        };
    }
}
