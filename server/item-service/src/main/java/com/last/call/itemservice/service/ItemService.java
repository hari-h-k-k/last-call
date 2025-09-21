package com.last.call.itemservice.service;

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

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public ItemWithSubscriptionDto getItemWithSubscription(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));
        return new ItemWithSubscriptionDto(item, itemSubscriberService.isUserSubscribed(item, userId));
    }

    public Item saveItem(Item item) {
        itemValidationService.validateItemDates(item);
        itemValidationService.validateStartingPrice(item.getStartingPrice());
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Long userId, Item updatedItem) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + id));

        itemValidationService.validateItemOwnership(item, userId);
        itemValidationService.validateItemNotStarted(item);
        itemValidationService.validateItemDates(updatedItem);
        itemValidationService.validateStartingPrice(updatedItem.getStartingPrice());

        item.setTitle(updatedItem.getTitle());
        item.setDescription(updatedItem.getDescription());
        item.setStartingPrice(updatedItem.getStartingPrice());
        item.setCategory(updatedItem.getCategory());
        item.setRegistrationClosingDate(updatedItem.getRegistrationClosingDate());
        item.setAuctionStartDate(updatedItem.getAuctionStartDate());

        return itemRepository.save(item);
    }

    public void deleteItem(Long id, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + id));

        itemValidationService.validateItemOwnership(item, userId);
        itemValidationService.validateItemNotStarted(item);

        itemRepository.deleteById(id);
    }

    public void subscribe(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));

        itemSubscriberService.subscribe(item, userId);
    }

    public void unsubscribe(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));

        itemSubscriberService.unsubscribe(item, userId);
    }

    public List<ItemWithSubscriptionDto> searchItems(String input, String userId) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }

        String searchTerm = input.toLowerCase().trim();
        List<Item> allItems = itemRepository.findAll();
        List<Item> results = new java.util.ArrayList<>();

        // Priority 1: Title matches
        allItems.stream()
                .filter(item -> item.getTitle().toLowerCase().contains(searchTerm))
                .forEach(results::add);

        // Priority 2: Description matches (exclude already found)
        allItems.stream()
                .filter(item -> !results.contains(item))
                .filter(item -> item.getDescription() != null &&
                        item.getDescription().toLowerCase().contains(searchTerm))
                .forEach(results::add);

        // Priority 3: Category matches (exclude already found)
        allItems.stream()
                .filter(item -> !results.contains(item))
                .filter(item -> item.getCategory().name().toLowerCase().contains(searchTerm))
                .forEach(results::add);

        // Priority 4: Tag matches (exclude already found)
        allItems.stream()
                .filter(item -> !results.contains(item))
                .filter(item -> item.getTags() != null &&
                        item.getTags().stream()
                                .anyMatch(tag -> tag.getTag().toLowerCase().contains(searchTerm)))
                .forEach(results::add);

        return results.stream()
                .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserSubscribed(item, userId)))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Item> getItemsBySellerId(Long sellerId) {
        return itemRepository.findBySellerId(sellerId);
    }

    public List<Item> getUpcomingItems() {
        Date now = new Date();
        return itemRepository.findActiveItems(now)
                .stream()
                .sorted((a, b) -> a.getRegistrationClosingDate().compareTo(b.getRegistrationClosingDate()))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<ItemWithSubscriptionDto> getUpcomingItemsWithSubscription(String userId) {
        List<Item> items = getUpcomingItems();
        return items.stream()
                .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserSubscribed(item, userId)))
                .collect(java.util.stream.Collectors.toList());
    }

    public ItemCategory[] getAllCategories() {
        return ItemCategory.values();
    }
}