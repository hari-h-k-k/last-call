package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.Room;
import com.bidding.backend.observer.ItemObserver;
import com.bidding.backend.observer.NotificationService;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.utils.enums.RoomStatus;
import com.bidding.backend.utils.scheduler.AuctionSchedulerService;
import org.quartz.SchedulerException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AuctionSchedulerService auctionSchedulerService;

    private final MongoTemplate mongoTemplate;

    private final List<ItemObserver> observers = new ArrayList<>();

    @Autowired
    public ItemService(ItemRepository itemRepository, NotificationService notificationService, MongoTemplate mongoTemplate) {
        this.itemRepository = itemRepository;
        this.mongoTemplate = mongoTemplate;
        this.observers.add(notificationService);
    }


    public void saveItem(Item item) throws SchedulerException {
        if (item.getRegistrationClosingDate().after(item.getAuctionStartDate())) {
            throw new IllegalArgumentException("Registration closing date cannot be after bid start date");
        }

        // --- Save the item ---
        itemRepository.save(item);

        // --- Create room using Builder ---
        Room room = new Room.Builder()
                .itemId(item.getId())
                .startDate(item.getAuctionStartDate())
                .status(RoomStatus.INACTIVE.name())
                .currentPrice(item.getStartingPrice())
                .listOfUserIds(item.getSubscribersId())
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        roomRepository.save(room);

        // --- Schedule auction start and close jobs ---
        auctionSchedulerService.scheduleAuctionJobs(
                item.getId(),
                item.getAuctionStartDate()
        );
    }


    public void removeItem(String itemId) {
        itemRepository.deleteById(itemId);
    }

    public Item getItem(String id) {
        return itemRepository.findById(id).orElse(null);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public List<Item> getAllItemsBySellerId(String userId) {
        return itemRepository.findBySellerId(userId);
    }


    public List<Map<String, Object>> getUpcomingItems(String userId) {
        Date now = new Date();
        List<Item> items;

        if (userId == null || userId.trim().isEmpty()) {
            // Public request → fetch all upcoming items
            items = itemRepository.findByRegistrationClosingDateAfter(now);
        } else {
            // User request → fetch upcoming items excluding user's own
            items = itemRepository.getItemsByRegistrationClosingDateAndNotOwnedByUser(now, userId);
        }

        // Sort by soonest closing
        items.sort(Comparator.comparingLong(i -> i.getRegistrationClosingDate().getTime() - now.getTime()));

        // Convert to list of maps
        return ConstructListWithValues(userId, now, items);
    }

    public void itemSubscribe(String itemId, String userId, boolean subscribeAction) {
        Item item = this.getItem(itemId);
        List<Item> itemsList = itemRepository.getItemsByRegistrationClosingDate(new Date());

        if(subscribeAction) {
            boolean itemFound = itemsList.stream()
                    .anyMatch(i -> i.getId().equals(item.getId()));

            if (!itemFound) {
                throw new IllegalArgumentException("Deadline exceeded to express interest on this item");
            }

            if (item.getSellerId().equals(userId)) {
                throw new IllegalArgumentException("User cannot express interest on the item they listed");
            }

            item.addUserToSubscribersList(userId);
        } else {
            item.removeUserFromSubscribersList(userId);
        }

        itemRepository.save(item);
    }

    private void notifyObservers(Item item, List<String> alerts) {
        for (ItemObserver observer : observers) {
            observer.onItemUpdated(item, alerts);
        }
    }

    public void updateItem(Item item) throws SchedulerException {
        Item existingItem = this.getItem(item.getId());
        List<String> alerts = new ArrayList<>();

        boolean datesChanged = false;

        // --- Registration Closing Date ---
        if (!existingItem.getRegistrationClosingDate().equals(item.getRegistrationClosingDate())) {
            if (item.getRegistrationClosingDate().after(item.getAuctionStartDate())) {
                throw new IllegalArgumentException("Registration closing date cannot be after bid start date");
            }
            alerts.add(String.format("Registration Closing Date of %s was updated.", item.getTitle()));
        }

        // --- Auction Start Date ---
        if (!existingItem.getAuctionStartDate().equals(item.getAuctionStartDate())) {
            if (item.getRegistrationClosingDate().after(item.getAuctionStartDate())) {
                throw new IllegalArgumentException("Registration closing date cannot be after bid start date");
            }
            alerts.add(String.format("Auction Start Date of %s was updated.", item.getTitle()));
            datesChanged = true;
        }

        // --- Starting Price ---
        if (existingItem.getStartingPrice() != item.getStartingPrice()) {
            alerts.add(String.format("Starting Price of %s was updated.", item.getTitle()));
        }

        if (alerts.isEmpty()) {
            alerts.add(String.format("%s in your watchlist was updated.", item.getTitle()));
        }

        // Copy non-null properties
        BeanUtils.copyProperties(item, existingItem, getNullPropertyNames(item));
        itemRepository.save(existingItem);

        // --- Reschedule Quartz jobs if dates changed ---
        if (datesChanged) {
            // Cancel existing jobs
            auctionSchedulerService.deleteAuctionJobs(existingItem.getId());

            // Schedule new jobs with updated dates
            auctionSchedulerService.scheduleAuctionJobs(
                    existingItem.getId(),
                    existingItem.getAuctionStartDate()
            );
        }

        notifyObservers(existingItem, alerts);
    }

    private String[] getNullPropertyNames(Object source) {
        BeanWrapper src = new BeanWrapperImpl(source);
        return Arrays.stream(src.getPropertyDescriptors())
                .map(pd -> pd.getName())
                .filter(name -> src.getPropertyValue(name) == null)
                .toArray(String[]::new);
    }

    public List<Map<String, Object>> searchItems(String input, String userId) {
        String[] words = input.trim().split("\\s+");
        Date now = new Date();

        // Build OR criteria
        Criteria[] orCriteria = new Criteria[words.length * 4]; // 4 fields per word
        int index = 0;

        for (String word : words) {
            orCriteria[index++] = Criteria.where("title").regex(word, "i");
            orCriteria[index++] = Criteria.where("description").regex(word, "i");
            orCriteria[index++] = Criteria.where("category").regex(word, "i");
            orCriteria[index++] = Criteria.where("tags").in(word);
        }

//        Criteria mainCriteria = new Criteria()
//                .andOperator(
//                        Criteria.where("registrationClosingDate").gt(now),
//                        new Criteria().orOperator(orCriteria)
//                );

//        Query query = new Query(mainCriteria);
        Query query = new Query(new Criteria().orOperator(orCriteria));
        List<Item> results = mongoTemplate.find(query, Item.class);

        results.sort((a, b) -> {
            int scoreA = getMatchScore(a, words);
            int scoreB = getMatchScore(b, words);
            return Integer.compare(scoreB, scoreA); // higher score first
        });

        return ConstructListWithValues(userId, now, results);
    }

    private int getMatchScore(Item item, String[] words) {
        int score = 0;

        for (String word : words) {
            String w = word.toLowerCase();

            if (item.getTitle() != null && item.getTitle().toLowerCase().contains(w)) {
                score += 10; // highest priority
            }
            if (item.getDescription() != null && item.getDescription().toLowerCase().contains(w)) {
                score += 5;
            }
            if (item.getCategory() != null && item.getCategory().name().equalsIgnoreCase(w)) {
                score += 3;
            }
            if (item.getTags() != null && item.getTags().stream().anyMatch(tag -> tag.equalsIgnoreCase(w))) {
                score += 1; // lowest priority
            }
        }

        return score;
    }

    private List<Map<String, Object>> ConstructListWithValues(String userId, Date now, List<Item> results) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Item item : results) {
            long timeRemaining = item.getRegistrationClosingDate().getTime() - now.getTime();

            Map<String, Object> map = new HashMap<>();
            map.put("item", item);
            map.put("registrationClosingDate", item.getRegistrationClosingDate());
            map.put("timeRemainingMillis", timeRemaining > 0 ? timeRemaining : 0);

            // Add "registered" flag (true if userId in subscribers)
            boolean isRegistered = false;
            if (userId != null && item.getSubscribersId() != null) {
                isRegistered = item.getSubscribersId().contains(userId);
            }
            map.put("registered", isRegistered);

            list.add(map);
        }
        return list;
    }
}
