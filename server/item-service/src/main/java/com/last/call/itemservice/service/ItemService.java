package com.last.call.itemservice.service;

import com.last.call.itemservice.client.KafkaClient;
import com.last.call.itemservice.dto.CategoryWithCountDto;
import com.last.call.itemservice.dto.ItemWithSubscriptionDto;
import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import com.last.call.itemservice.exception.ItemNotFoundException;
import com.last.call.itemservice.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemSubscriberService itemSubscriberService;

    @Autowired
    private ItemValidationService itemValidationService;

    @Autowired
    private KafkaClient schedulerServiceClient;

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + id));
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public ItemWithSubscriptionDto getItemWithSubscription(Long itemId, String userId) {
        Item item = getItemById(itemId);
        return new ItemWithSubscriptionDto(item, itemSubscriberService.isUserRegistered(item, userId));
    }

    public Item saveItem(Item item) {
        itemValidationService.validateItemDates(item);
        itemValidationService.validateStartingPrice(item.getStartingPrice());
        Item savedItem = itemRepository.save(item);
        
        try {
            schedulerServiceClient.scheduleItemJobs(savedItem);
        } catch (Exception e) {
            // Log error but don't fail the save operation
            System.err.println("Failed to schedule jobs for item " + savedItem.getId() + ": " + e.getMessage());
        }
        
        return savedItem;
    }

    public Item updateItem(Item updatedItem) {
        itemValidationService.validateItemDates(updatedItem);
        itemValidationService.validateStartingPrice(updatedItem.getStartingPrice());

        // Check if item exists
        Item existingItem = itemRepository.findById(updatedItem.getId())
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + updatedItem.getId()));

        boolean scheduleNeedsUpdate = false;

        // Check if scheduling-related fields changed
        if (!updatedItem.getRegistrationClosingDate().equals(existingItem.getRegistrationClosingDate())) {
            scheduleNeedsUpdate = true;
        }

        if (!updatedItem.getAuctionStartDate().equals(existingItem.getAuctionStartDate())) {
            scheduleNeedsUpdate = true;
        }

        if (updatedItem.getStartingPrice()!=existingItem.getStartingPrice()) {
            scheduleNeedsUpdate = true;
        }

        // Save the updated item
        Item savedItem = itemRepository.save(existingItem);

        // Re-schedule only if the relevant dates changed
        if (scheduleNeedsUpdate) {
            try {
                schedulerServiceClient.scheduleItemJobs(savedItem);
            } catch (Exception e) {
                System.err.println("Failed to re-schedule jobs for item " + savedItem.getId() + ": " + e.getMessage());
            }
        }

        return savedItem;

    }

    public void register(Long itemId, String userId) {
        Item item = getItemById(itemId);

        itemSubscriberService.register(item, userId);
    }

    public void unregister(Long itemId, String userId) {
        Item item = getItemById(itemId);

        itemSubscriberService.unregister(item, userId);
    }

    public List<ItemWithSubscriptionDto> searchItems(String input, String userId) {
        if (input == null || input.trim().isEmpty()) {
            List<Item> results = itemRepository.findAll();
            return results.stream()
                    .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserRegistered(item, userId)))
                    .collect(java.util.stream.Collectors.toList());
        }

        List<Item> results = itemRepository.searchItems(input.trim());
        return results.stream()
                .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserRegistered(item, userId)))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Item> getItemsBySellerId(Long sellerId) {
        return itemRepository.findBySellerId(sellerId);
    }

    public List<CategoryWithCountDto> getCategoriesWithCount() {
        List<Object[]> results = itemRepository.countByCategory();
        return results.stream()
                .map(result -> new CategoryWithCountDto((ItemCategory) result[0], (Long) result[1]))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<ItemWithSubscriptionDto> getLastCallToRegister(String userId) {
        Date now = new Date();
        Date fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        
        List<Item> items = itemRepository.findItemsWithRegistrationClosingBetween(now, fortyEightHoursFromNow);
        return items.stream()
                .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserRegistered(item, userId)))
                .collect(java.util.stream.Collectors.toList());
    }

    public void deleteAll() {
        itemRepository.deleteAll();
    }
}