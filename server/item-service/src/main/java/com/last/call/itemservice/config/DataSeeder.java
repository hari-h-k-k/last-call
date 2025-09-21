package com.last.call.itemservice.config;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import com.last.call.itemservice.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Date;

@Configuration
@Profile("!prod")
public class DataSeeder {

    @Bean
    CommandLineRunner seedItemData(ItemRepository itemRepository) {
        return args -> {
            if (itemRepository.count() > 0) return;

            Date now = new Date();
            
            // Item ID: 1, Seller: Steve Rogers (User ID: 1)
            Item shield = new Item("Captain America Shield", "Replica of Cap's shield", 
                1L, 1200.0, ItemCategory.COLLECTIBLES,
                new Date(now.getTime() + 3600000),  // reg closes in 1h
                new Date(now.getTime() + 7200000)); // auction starts in 2h
            
            // Item ID: 2, Seller: Tony Stark (User ID: 2)
            Item webShooter = new Item("Web Shooter", "Mechanical web-shooters replica",
                2L, 450.0, ItemCategory.COLLECTIBLES,
                new Date(now.getTime() + 900000),   // reg closes in 15min
                new Date(now.getTime() + 1500000)); // auction starts in 25min
            
            // Item ID: 3, Seller: Peter Parker (User ID: 3)
            Item batMobile = new Item("Batmobile", "High-tech armored vehicle",
                3L, 500000.0, ItemCategory.AUTOMOBILES,
                new Date(now.getTime() + 5000),     // reg closes in 5sec
                new Date(now.getTime() + 10000));   // auction starts in 10sec
            
            // Item ID: 4, Seller: Bruce Wayne (User ID: 4)
            Item kryptonite = new Item("Kryptonite Shard", "Green kryptonite piece",
                4L, 500.0, ItemCategory.COLLECTIBLES,
                new Date(now.getTime() + 600000),   // reg closes in 10min
                new Date(now.getTime() + 1200000)); // auction starts in 20min
            
            // Item ID: 5, Seller: Clark Kent (User ID: 5)
            Item helmet = new Item("Iron Man Helmet", "Mark III helmet replica",
                5L, 1000.0, ItemCategory.COLLECTIBLES,
                new Date(now.getTime() - 3600000),  // reg closed 1h ago
                new Date(now.getTime() - 1800000)); // auction started 30min ago

            itemRepository.save(shield);
            itemRepository.save(webShooter);
            itemRepository.save(batMobile);
            itemRepository.save(kryptonite);
            itemRepository.save(helmet);

            System.out.println("✅ Item service data seeded! (5 items created)");
        };
    }
}