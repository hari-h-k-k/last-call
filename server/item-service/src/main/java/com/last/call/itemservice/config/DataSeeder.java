package com.last.call.itemservice.config;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import com.last.call.itemservice.service.ItemService;
import com.last.call.itemservice.service.ItemTagService;
import com.last.call.itemservice.service.ItemSubscriberService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Date;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedItemData(ItemService itemService,
                                   ItemTagService itemTagService,
                                   ItemSubscriberService itemSubscriberService) {
        return args -> {
            if (!itemService.getAllItems().isEmpty()) return;

            Date now = new Date();

            // Create items using service
            Item shield = new Item("Captain America Shield", "Replica of Cap's shield",
                    1L, 1200.0, ItemCategory.COLLECTIBLES,
                    new Date(now.getTime() + 3600000),
                    new Date(now.getTime() + 7200000));
            Item savedShield = itemService.saveItem(shield);

            Item webShooter = new Item("Web Shooter", "Mechanical web-shooters replica",
                    2L, 450.0, ItemCategory.COLLECTIBLES,
                    new Date(now.getTime() + 900000),
                    new Date(now.getTime() + 1500000));
            Item savedWebShooter = itemService.saveItem(webShooter);

            Item batMobile = new Item("Batmobile", "High-tech armored vehicle",
                    3L, 500000.0, ItemCategory.AUTOMOBILES,
                    new Date(now.getTime() + 300000),
                    new Date(now.getTime() + 420000));
            Item savedBatMobile = itemService.saveItem(batMobile);

            Item kryptonite = new Item("Kryptonite Shard", "Green kryptonite piece",
                    4L, 500.0, ItemCategory.COLLECTIBLES,
                    new Date(now.getTime() + 600000),
                    new Date(now.getTime() + 1200000));
            Item savedKryptonite = itemService.saveItem(kryptonite);

            Item helmet = new Item("Iron Man Helmet", "Mark III helmet replica",
                    5L, 1000.0, ItemCategory.COLLECTIBLES,
                    new Date(now.getTime() + 1800000),
                    new Date(now.getTime() + 3600000));
            Item savedHelmet = itemService.saveItem(helmet);

            // Add tags
            itemTagService.addTag(savedShield.getId(), "marvel", 1L);
            itemTagService.addTag(savedShield.getId(), "shield", 1L);
            itemTagService.addTag(savedWebShooter.getId(), "spiderman", 2L);
            itemTagService.addTag(savedBatMobile.getId(), "batman", 3L);
            itemTagService.addTag(savedKryptonite.getId(), "superman", 4L);
            itemTagService.addTag(savedHelmet.getId(), "iron-man", 5L);

            // Add subscribers (only to items with open registration)
            itemSubscriberService.subscribe(savedShield, "2");     // reg closes in 1h
            itemSubscriberService.subscribe(savedShield, "3");
            itemSubscriberService.subscribe(savedWebShooter, "1");   // reg closes in 15min
            itemSubscriberService.subscribe(savedBatMobile, "5");   // reg closes in 5min
            itemSubscriberService.subscribe(savedKryptonite, "1");  // reg closes in 10min
            // Note: helmet registration already closed - no subscribers added

            System.out.println("✅ Item service data seeded! (5 items, 6 tags, 5 subscribers)");
        };
    }
}