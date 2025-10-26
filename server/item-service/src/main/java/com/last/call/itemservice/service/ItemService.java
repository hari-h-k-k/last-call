package com.last.call.itemservice.service;

import com.last.call.itemservice.client.KafkaClient;
import com.last.call.itemservice.dto.CategoryWithCountDto;
import com.last.call.itemservice.dto.ItemSearchRequestDto;
import com.last.call.itemservice.dto.ItemWithSubscriptionDto;
import com.last.call.itemservice.dto.PaginatedSearchResponseDto;
import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import com.last.call.itemservice.exception.ItemNotFoundException;
import com.last.call.itemservice.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

    public ItemWithSubscriptionDto getItemWithSubscription(Long itemId, Long userId) {
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

        boolean scheduleNeedsUpdate = isScheduleNeedsUpdate(updatedItem, existingItem);

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

    private static boolean isScheduleNeedsUpdate(Item updatedItem, Item existingItem) {
        boolean scheduleNeedsUpdate = !updatedItem.getRegistrationClosingDate().equals(existingItem.getRegistrationClosingDate());

        if (!updatedItem.getAuctionStartDate().equals(existingItem.getAuctionStartDate())) {
            scheduleNeedsUpdate = true;
        }

        if (updatedItem.getStartingPrice()!= existingItem.getStartingPrice()) {
            scheduleNeedsUpdate = true;
        }
        return scheduleNeedsUpdate;
    }

    public void register(Long itemId, Long userId) {
        Item item = getItemById(itemId);

        itemSubscriberService.register(item, userId);
    }

    public void unregister(Long itemId, Long userId) {
        Item item = getItemById(itemId);

        itemSubscriberService.unregister(item, userId);
    }

    public List<ItemWithSubscriptionDto> getItemsBySellerId(Long sellerId) {
        List<Item> items=  itemRepository.findBySellerId(sellerId);
        return items.stream()
                .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserRegistered(item, sellerId)))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<CategoryWithCountDto> getCategoriesWithCount() {
        List<Object[]> results = itemRepository.countByCategory();
        return results.stream()
                .map(result -> new CategoryWithCountDto((ItemCategory) result[0], (Long) result[1]))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<ItemWithSubscriptionDto> getLastCallToRegister(Long userId) {
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

    public void deleteById(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    public PaginatedSearchResponseDto searchItemsWithFilters(ItemSearchRequestDto request, Long userId) {
        ItemCategory categoryEnum = (request.getCategory() != null && !request.getCategory().equalsIgnoreCase("ALL"))
                ? ItemCategory.valueOf(request.getCategory().toUpperCase())
                : null;

        Double minPrice = (request.getPriceMin() != null && !request.getPriceMin().trim().isEmpty())
                ? Double.parseDouble(request.getPriceMin())
                : null;

        Double maxPrice = (request.getPriceMax() != null && !request.getPriceMax().trim().isEmpty())
                ? Double.parseDouble(request.getPriceMax())
                : null;

        String auctionStatus = "all".equalsIgnoreCase(request.getAuctionStatus()) ? null : request.getAuctionStatus();
        String registered = "all".equalsIgnoreCase(request.getRegistered()) ? null : request.getRegistered();

        long skip = (request.getSkip() != null && !request.getSkip().trim().isEmpty())
                ? Long.parseLong(request.getSkip())
                : 0L;

        long limit = (request.getLimit() != null && !request.getLimit().trim().isEmpty())
                ? Long.parseLong(request.getLimit())
                : Long.MAX_VALUE; // no limit if not provided

        List<Item> items;

        if (request.getQuery() != null && !request.getQuery().trim().isEmpty()) {
            items = itemRepository.searchItemsWithFilters(
                    request.getQuery().trim(),
                    categoryEnum,
                    minPrice,
                    maxPrice,
                    auctionStatus,
                    request.getSortBy(),
                    new Date()
            );
        } else {
            items = itemRepository.findItemsWithFilters(
                    categoryEnum,
                    minPrice,
                    maxPrice,
                    auctionStatus,
                    request.getSortBy(),
                    new Date()
            );
        }

        List<ItemWithSubscriptionDto> filteredItems = items.stream()
                // ✅ Apply filtering for registered users
                .filter(item -> registered == null ||
                        ("registered".equalsIgnoreCase(registered) && itemSubscriberService.isUserRegistered(item, userId)) ||
                        ("not-registered".equalsIgnoreCase(registered) && !itemSubscriberService.isUserRegistered(item, userId)))
                // ✅ Convert to DTO
                .map(item -> new ItemWithSubscriptionDto(item, itemSubscriberService.isUserRegistered(item, userId)))
                .toList();

        long totalCount = filteredItems.size();

        List<ItemWithSubscriptionDto> paginatedItems = filteredItems.stream()
                // ✅ Apply skip and limit for pagination
                .skip(skip)
                .limit(limit)
                .collect(Collectors.toList());

        return new PaginatedSearchResponseDto(paginatedItems, totalCount);
    }

}