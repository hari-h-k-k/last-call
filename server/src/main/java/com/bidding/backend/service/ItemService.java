package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.observer.ItemObserver;
import com.bidding.backend.observer.NotificationService;
import com.bidding.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    private final List<ItemObserver> observers = new ArrayList<>();

    @Autowired
    public ItemService(ItemRepository itemRepository, NotificationService notificationService) {
        this.itemRepository = itemRepository;
        this.observers.add(notificationService);
    }

    public ItemService() {
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

    public Map<Item, Date> getUpcomingItems(String userId) {
        Date now = new Date();

        List<Item> items = itemRepository.getItemsByRegistrationClosingDateAndNotOwnedByUser(now, userId);
        items.sort((i1, i2) -> Long.compare(i1.getRegistrationClosingDate().getTime() - now.getTime() ,i2.getRegistrationClosingDate().getTime() - now.getTime()));

        Map<Item, Date> itemDateMap = new LinkedHashMap<>();

        for(Item item : items) {
            itemDateMap.put(item, new Date(System.currentTimeMillis() + item.getRegistrationClosingDate().getTime() - now.getTime()));
        }

        return itemDateMap;
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
        Item oldItem = this.getItem(item.getId());

        List<String> alerts = new ArrayList<>();

        if(!oldItem.getRegistrationClosingDate().toString().equals(item.getRegistrationClosingDate().toString())) {
            alerts.add(String.format("Registration Closing Date of %s was updated.", item.getTitle()));
        }

        if(!oldItem.getBidStartDate().toString().equals(item.getBidStartDate().toString())) {
            alerts.add(String.format("Bid Start Date of %s was updated.", item.getTitle()));
        }

        if(oldItem.getStartingPrice() != item.getStartingPrice()) {
            alerts.add(String.format("Starting Price of %s was updated.", item.getTitle()));
        }

        if(alerts.isEmpty()) {
            alerts.add(String.format("%s in your watchlist was updated.", item.getTitle()));
        }

        itemRepository.save(item);

        notifyObservers(item, alerts);
    }
}
