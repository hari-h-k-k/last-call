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

            // ART
            Item art1 = new Item("Banksy Girl with Balloon", "Original stencil on canvas, authenticated",
                    1L, 1200000.0, ItemCategory.ART,
                    new Date(now + 12 * 60 * 60 * 1000),
                    new Date(now + 36 * 60 * 60 * 1000));
            Item savedArt1 = itemService.saveItem(art1);

            Item art2 = new Item("Picasso Blue Period Sketch", "Rare pencil sketch from 1903, provenance documented",
                    2L, 850000.0, ItemCategory.ART,
                    new Date(now - 24 * 60 * 60 * 1000),
                    new Date(now - 2 * 60 * 60 * 1000));
            Item savedArt2 = itemService.saveItem(art2);

            // CAR
            Item car1 = new Item("1969 Dodge Charger R/T", "Matching numbers 440 Six Pack, 4-speed manual",
                    1L, 85000.0, ItemCategory.CAR,
                    new Date(now + 36 * 60 * 60 * 1000),
                    new Date(now + 60 * 60 * 60 * 1000));
            Item savedCar1 = itemService.saveItem(car1);

            Item car2 = new Item("1963 Ferrari 250 GTO", "Chassis #4153GT, matching numbers, race history",
                    2L, 48000000.0, ItemCategory.CAR,
                    new Date(now - 12 * 60 * 60 * 1000),
                    new Date(now - 1 * 60 * 60 * 1000));
            Item savedCar2 = itemService.saveItem(car2);

            // MOTORCYCLE
            Item moto1 = new Item("1969 Honda CB750", "First superbike, original condition, 12k miles",
                    3L, 25000.0, ItemCategory.MOTORCYCLE,
                    new Date(now - 48 * 60 * 60 * 1000),
                    new Date(now + 2 * 60 * 60 * 1000));
            Item savedMoto1 = itemService.saveItem(moto1);

            Item moto2 = new Item("1998 Ducati 916 SPS", "Limited edition, 1 of 1500 made, pristine",
                    4L, 45000.0, ItemCategory.MOTORCYCLE,
                    new Date(now + 5 * 24 * 60 * 60 * 1000),
                    new Date(now + 7 * 24 * 60 * 60 * 1000));
            Item savedMoto2 = itemService.saveItem(moto2);

            // COLLECTIBLES
            Item collect1 = new Item("Action Comics #1 CGC 9.0", "First Superman appearance, highest grade",
                    1L, 3200000.0, ItemCategory.COLLECTIBLES,
                    new Date(now + 10 * 24 * 60 * 60 * 1000),
                    new Date(now + 12 * 24 * 60 * 60 * 1000));
            Item savedCollect1 = itemService.saveItem(collect1);

            Item collect2 = new Item("1952 Topps Mickey Mantle PSA 10", "Perfect grade rookie card, pop 6",
                    2L, 5200000.0, ItemCategory.COLLECTIBLES,
                    new Date(now - 72 * 60 * 60 * 1000),
                    new Date(now + 8 * 60 * 60 * 1000));
            Item savedCollect2 = itemService.saveItem(collect2);

            // HOUSES
            Item house1 = new Item("Beverly Hills Mansion", "8BR/12BA estate, 15,000 sq ft, pool, tennis court",
                    3L, 25000000.0, ItemCategory.HOUSES,
                    new Date(now + 24 * 60 * 60 * 1000),
                    new Date(now + 48 * 60 * 60 * 1000));
            Item savedHouse1 = itemService.saveItem(house1);

            Item house2 = new Item("Hamptons Oceanfront Estate", "6BR/8BA, private beach, 3 acres",
                    4L, 18500000.0, ItemCategory.HOUSES,
                    new Date(now + 3 * 24 * 60 * 60 * 1000),
                    new Date(now + 5 * 24 * 60 * 60 * 1000));
            Item savedHouse2 = itemService.saveItem(house2);

            // APARTMENTS
            Item apt1 = new Item("Manhattan Penthouse", "5BR/4BA penthouse with Central Park views",
                    1L, 12500000.0, ItemCategory.APARTMENTS,
                    new Date(now - 24 * 60 * 60 * 1000),
                    new Date(now - 2 * 60 * 60 * 1000));
            Item savedApt1 = itemService.saveItem(apt1);

            Item apt2 = new Item("SoHo Loft", "3BR/2BA converted warehouse, 2500 sq ft",
                    2L, 4200000.0, ItemCategory.APARTMENTS,
                    new Date(now + 6 * 24 * 60 * 60 * 1000),
                    new Date(now + 8 * 24 * 60 * 60 * 1000));
            Item savedApt2 = itemService.saveItem(apt2);

            // PLOTS
            Item plot1 = new Item("Malibu Oceanfront Lot", "2.5 acres with 200ft of beach frontage",
                    3L, 8500000.0, ItemCategory.PLOTS,
                    new Date(now + 48 * 60 * 60 * 1000),
                    new Date(now + 72 * 60 * 60 * 1000));
            Item savedPlot1 = itemService.saveItem(plot1);

            // ELECTRONICS
            Item elec1 = new Item("Apple-1 Computer", "Working condition, original manual included",
                    4L, 400000.0, ItemCategory.ELECTRONICS,
                    new Date(now + 4 * 24 * 60 * 60 * 1000),
                    new Date(now + 6 * 24 * 60 * 60 * 1000));
            Item savedElec1 = itemService.saveItem(elec1);

            // JEWELRY
            Item jewelry1 = new Item("Patek Philippe Nautilus 5711", "Stainless steel, blue dial, discontinued",
                    1L, 180000.0, ItemCategory.JEWELRY,
                    new Date(now - 48 * 60 * 60 * 1000),
                    new Date(now + 2 * 60 * 60 * 1000));
            Item savedJewelry1 = itemService.saveItem(jewelry1);

            Item jewelry2 = new Item("Cartier Panther Bracelet", "18k gold with emerald eyes, vintage 1970s",
                    2L, 125000.0, ItemCategory.JEWELRY,
                    new Date(now + 7 * 24 * 60 * 60 * 1000),
                    new Date(now + 9 * 24 * 60 * 60 * 1000));
            Item savedJewelry2 = itemService.saveItem(jewelry2);

            // ANTIQUES
            Item antique1 = new Item("Ming Dynasty Vase", "14th century porcelain, museum quality",
                    3L, 2800000.0, ItemCategory.ANTIQUES,
                    new Date(now + 8 * 24 * 60 * 60 * 1000),
                    new Date(now + 10 * 24 * 60 * 60 * 1000));
            Item savedAntique1 = itemService.saveItem(antique1);

            // BOOKS
            Item book1 = new Item("Gutenberg Bible", "42-line Bible, complete vellum copy",
                    4L, 25000000.0, ItemCategory.BOOKS,
                    new Date(now + 9 * 24 * 60 * 60 * 1000),
                    new Date(now + 11 * 24 * 60 * 60 * 1000));
            Item savedBook1 = itemService.saveItem(book1);

            // SPORTS
            Item sports1 = new Item("Babe Ruth Game-Used Bat", "1927 season, PSA/DNA authenticated",
                    1L, 1800000.0, ItemCategory.SPORTS,
                    new Date(now + 11 * 24 * 60 * 60 * 1000),
                    new Date(now + 13 * 24 * 60 * 60 * 1000));
            Item savedSports1 = itemService.saveItem(sports1);

            // FASHION
            Item fashion1 = new Item("Hermès Birkin Bag", "Himalaya Crocodile with diamonds, size 30",
                    2L, 380000.0, ItemCategory.FASHION,
                    new Date(now + 12 * 24 * 60 * 60 * 1000),
                    new Date(now + 14 * 24 * 60 * 60 * 1000));
            Item savedFashion1 = itemService.saveItem(fashion1);

            // OTHER
            Item other1 = new Item("Meteorite Fragment", "Mars meteorite, 2.3kg specimen with certificate",
                    3L, 95000.0, ItemCategory.OTHER,
                    new Date(now + 13 * 24 * 60 * 60 * 1000),
                    new Date(now + 15 * 24 * 60 * 60 * 1000));
            Item savedOther1 = itemService.saveItem(other1);

            // Add tags
            itemTagService.addTag(savedArt1.getId(), "banksy", 1L);
            itemTagService.addTag(savedArt2.getId(), "picasso", 2L);
            itemTagService.addTag(savedCar1.getId(), "dodge", 1L);
            itemTagService.addTag(savedCar2.getId(), "ferrari", 2L);
            itemTagService.addTag(savedMoto1.getId(), "honda", 3L);
            itemTagService.addTag(savedMoto2.getId(), "ducati", 4L);
            itemTagService.addTag(savedCollect1.getId(), "superman", 1L);
            itemTagService.addTag(savedCollect2.getId(), "mantle", 2L);
            itemTagService.addTag(savedHouse1.getId(), "beverly-hills", 3L);
            itemTagService.addTag(savedApt1.getId(), "manhattan", 1L);
            itemTagService.addTag(savedJewelry1.getId(), "patek", 1L);

            // Add subscribers
            itemSubscriberService.subscribe(savedArt1, "2");
            itemSubscriberService.subscribe(savedCar1, "3");
            itemSubscriberService.subscribe(savedMoto1, "4");
            itemSubscriberService.subscribe(savedCollect1, "5");
            itemSubscriberService.subscribe(savedHouse1, "2");
            itemSubscriberService.subscribe(savedApt1, "3");
            itemSubscriberService.subscribe(savedJewelry1, "4");

            System.out.println("✅ Items seeded for all categories! (20 items with varied timing)");
        };
    }
}