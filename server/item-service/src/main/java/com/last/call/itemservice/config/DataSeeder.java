package com.last.call.itemservice.config;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import com.last.call.itemservice.service.ItemService;
import com.last.call.itemservice.service.ItemTagService;
import com.last.call.itemservice.service.ItemSubscriberService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Date;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedItemData(ItemService itemService,
                                   ItemTagService itemTagService,
                                   ItemSubscriberService itemSubscriberService) {
        return args -> {
            System.out.println("🚀 DataSeeder starting...");
            if (!itemService.getAllItems().isEmpty()) {
                System.out.println("⚠️ Items already exist, skipping data seeding");
                return;
            }
            System.out.println("📦 Seeding item data...");

            long now = System.currentTimeMillis();

            Item art = new Item("Mona Lisa", "Original painting by Leonardo da Vinci, 1503-1506",
                    1L, 1000, ItemCategory.ART,
                    new Date(now + 5 * 60 * 1000),
                    new Date(now + 2 * 60 * 60 * 1000));

            itemSubscriberService.register(art, "2");
            itemSubscriberService.register(art, "3");

            System.out.println("✅ Data seeding completed successfully!");
        };
    }
}