package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.observer.ItemObserver;
import com.bidding.backend.observer.NotificationService;
import com.bidding.backend.repository.ItemRepository;
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

    private final MongoTemplate mongoTemplate;

    private final List<ItemObserver> observers = new ArrayList<>();

    @Autowired
    public ItemService(ItemRepository itemRepository, NotificationService notificationService, MongoTemplate mongoTemplate) {
        this.itemRepository = itemRepository;
        this.mongoTemplate = mongoTemplate;
        this.observers.add(notificationService);
    }


    public void saveItem(Item item) {
        if (item.getRegistrationClosingDate().after(item.getBidStartDate())) {
            throw new IllegalArgumentException("Registration closing date cannot be after bid start date");
        }
        itemRepository.save(item);
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

//    public Map<Item, Date> getUpcomingItems(String userId) {
//        Date now = new Date();
//
//        List<Item> items = itemRepository.getItemsByRegistrationClosingDateAndNotOwnedByUser(now, userId);
//        items.sort((i1, i2) -> Long.compare(i1.getRegistrationClosingDate().getTime() - now.getTime() ,i2.getRegistrationClosingDate().getTime() - now.getTime()));
//
//        Map<Item, Date> itemDateMap = new LinkedHashMap<>();
//
//        for(Item item : items) {
//            itemDateMap.put(item, new Date(System.currentTimeMillis() + item.getRegistrationClosingDate().getTime() - now.getTime()));
//        }
//
//        return itemDateMap;
//    }

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
        List<Map<String, Object>> list = new ArrayList<>();
        for (Item item : items) {
            long timeRemaining = item.getRegistrationClosingDate().getTime() - now.getTime();
            Map<String, Object> map = new HashMap<>();
            map.put("item", item);
            map.put("registrationClosingDate", item.getRegistrationClosingDate());
            map.put("timeRemainingMillis", timeRemaining > 0 ? timeRemaining : 0);
            list.add(map);
        }

        return list;
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

    public void updateItem(Item item) {
        Item existingItem = this.getItem(item.getId());

        List<String> alerts = new ArrayList<>();

        if(!existingItem.getRegistrationClosingDate().toString().equals(item.getRegistrationClosingDate().toString())) {
            alerts.add(String.format("Registration Closing Date of %s was updated.", item.getTitle()));
        }

        if(!existingItem.getBidStartDate().toString().equals(item.getBidStartDate().toString())) {
            alerts.add(String.format("Bid Start Date of %s was updated.", item.getTitle()));
        }

        if(existingItem.getStartingPrice() != item.getStartingPrice()) {
            alerts.add(String.format("Starting Price of %s was updated.", item.getTitle()));
        }

        if(alerts.isEmpty()) {
            alerts.add(String.format("%s in your watchlist was updated.", item.getTitle()));
        }

        BeanUtils.copyProperties(item, existingItem, getNullPropertyNames(item));

        itemRepository.save(existingItem);

        notifyObservers(existingItem, alerts);
    }

    private String[] getNullPropertyNames(Object source) {
        BeanWrapper src = new BeanWrapperImpl(source);
        return Arrays.stream(src.getPropertyDescriptors())
                .map(pd -> pd.getName())
                .filter(name -> src.getPropertyValue(name) == null)
                .toArray(String[]::new);
    }

    public List<Item> searchItems(String input) {
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

        Criteria mainCriteria = new Criteria()
                .andOperator(
                        Criteria.where("registrationClosingDate").gt(now),
                        new Criteria().orOperator(orCriteria)
                );

        Query query = new Query(mainCriteria);
        List<Item> results = mongoTemplate.find(query, Item.class);

        results.sort((a, b) -> {
            int scoreA = getMatchScore(a, words);
            int scoreB = getMatchScore(b, words);
            return Integer.compare(scoreB, scoreA); // higher score first
        });

        return results;
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
}
