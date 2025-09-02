package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public ItemService() {
    }

    public void saveItem(Item item) {
        if (item.getRegistrationClosingDate().after(item.getBidStartDate())) {
            throw new IllegalArgumentException("Registration closing date cannot be after bid start date");
        }
        itemRepository.save(item);
    }

    public Item getItem(String id) {
        return itemRepository.findById(id).orElse(null);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
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

    public void itemRegisterUser(String itemId, String userId) {
        Item item = this.getItem(itemId);
        List<Item> itemsList = itemRepository.getItemsByRegistrationClosingDate(new Date());

        boolean itemFound = itemsList.stream()
                .anyMatch(i -> i.getId().equals(item.getId()));

        if (!itemFound) {
            throw new IllegalArgumentException("Deadline exceeded to express interest on this item");
        }

        if (item.getSellerId().equals(userId)) {
            throw new IllegalArgumentException("User cannot express interest on the item they listed");
        }

        item.addUserToRegisteredUsersList(userId);
        itemRepository.save(item);
    }
}
