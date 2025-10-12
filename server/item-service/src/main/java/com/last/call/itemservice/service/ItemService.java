package com.last.call.itemservice.service;

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
    private ItemTagService itemTagService;

    @Autowired
    private ItemSubscriberService itemSubscriberService;

    @Autowired
    private ItemValidationService itemValidationService;

    @Autowired
    private SchedulerServiceClient schedulerServiceClient;

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public ItemWithSubscriptionDto getItemWithSubscription(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));
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

    public Item updateItem(Long id, Long userId, Item updatedItem) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + id));

        itemValidationService.validateItemOwnership(item, userId);
        itemValidationService.validateItemNotStarted(item);
        itemValidationService.validateItemDates(updatedItem);
        itemValidationService.validateStartingPrice(updatedItem.getStartingPrice());

        boolean datesChanged = !item.getRegistrationClosingDate().equals(updatedItem.getRegistrationClosingDate()) ||
                              !item.getAuctionStartDate().equals(updatedItem.getAuctionStartDate());

        item.setTitle(updatedItem.getTitle());
        item.setDescription(updatedItem.getDescription());
        item.setStartingPrice(updatedItem.getStartingPrice());
        item.setCategory(updatedItem.getCategory());
        item.setRegistrationClosingDate(updatedItem.getRegistrationClosingDate());
        item.setAuctionStartDate(updatedItem.getAuctionStartDate());

        Item savedItem = itemRepository.save(item);
        
        if (datesChanged) {
            try {
                schedulerServiceClient.rescheduleItemJobs(savedItem);
            } catch (Exception e) {
                System.err.println("Failed to reschedule jobs for item " + savedItem.getId() + ": " + e.getMessage());
            }
        }
        
        return savedItem;
    }

    public void register(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));

        itemSubscriberService.register(item, userId);
    }

    public void unregister(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));

        itemSubscriberService.unregister(item, userId);
    }

    public List<ItemWithSubscriptionDto> searchItems(String input, String userId) {
        if (input == null || input.trim().isEmpty()) {
            return null;
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