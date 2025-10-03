package com.last.call.itemservice.controller;

import com.last.call.itemservice.dto.ApiResponse;
import com.last.call.itemservice.dto.CategoryWithCountDto;
import com.last.call.itemservice.dto.ItemWithSubscriptionDto;
import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import com.last.call.itemservice.service.ItemService;
import com.last.call.itemservice.service.ItemSubscriberService;
import com.last.call.itemservice.service.ItemTagService;
import com.last.call.itemservice.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ItemController {

    @Autowired
    private ItemService itemService;
    
    @Autowired
    private ItemTagService itemTagService;

    @Autowired
    private ItemSubscriberService itemSubscriberService;

    @PostMapping("/place-item")
    public ResponseEntity<ApiResponse<Item>> placeItem(@RequestBody Item item) {
        Item savedItem = itemService.saveItem(item);
        return ResponseBuilder.success(savedItem, "Item created successfully");
    }

    @PutMapping("/update-item/{itemId}")
    public ResponseEntity<ApiResponse<Item>> updateItem(
            @PathVariable String itemId,
            @RequestBody Item item,
            @RequestHeader(value = "X-User-Id") String userId) {

        Long userIdLong = Long.parseLong(userId);
        Item updatedItem = itemService.updateItem(Long.parseLong(itemId), userIdLong, item);
        return ResponseBuilder.success(updatedItem, "Item updated successfully");
    }

    @GetMapping({"/items/{itemId}"})
    public ResponseEntity<ApiResponse<ItemWithSubscriptionDto>> getItems(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null) {
            Item item = itemService.getItemById(Long.parseLong(itemId))
                    .orElseThrow(() -> new RuntimeException("Item not found"));
            ItemWithSubscriptionDto itemWithSubscriptionDto = new ItemWithSubscriptionDto(item, false);
            return ResponseBuilder.success(itemWithSubscriptionDto, "Item retrieved successfully");
        }
        
        ItemWithSubscriptionDto itemWithSubscriptionDto = itemService.getItemWithSubscription(Long.parseLong(itemId), userId);
        return ResponseBuilder.success(itemWithSubscriptionDto, "Item retrieved successfully");
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse<List<Item>>> getMyItems(
            @RequestHeader(value = "X-User-Id") String userId) {
        
        Long userIdLong = Long.parseLong(userId);
        List<Item> items = itemService.getItemsBySellerId(userIdLong);
        return ResponseBuilder.success(items, "User items retrieved successfully");
    }

    @GetMapping("/get-upcoming-items")
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> getUpcomingItems(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        List<ItemWithSubscriptionDto> items = itemService.getUpcomingItemsWithSubscription(userId);
        return ResponseBuilder.success(items, "Upcoming items retrieved successfully");
    }

    @PutMapping("/item-subscribe")
    public ResponseEntity<ApiResponse<Void>> itemSubscribe(
            @RequestParam String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {

        itemService.subscribe(Long.parseLong(itemId), userId);
        return ResponseBuilder.success(null, "Successfully subscribed to item");
    }

    @PutMapping("/item-unsubscribe")
    public ResponseEntity<ApiResponse<Void>> itemUnsubscribe(
            @RequestParam String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {
        
        itemService.unsubscribe(Long.parseLong(itemId), userId);
        return ResponseBuilder.success(null, "Successfully unsubscribed from item");
    }

    @PostMapping("/add-tag")
    public ResponseEntity<ApiResponse<Void>> addTag(
            @RequestParam String itemId,
            @RequestParam String tagName,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Long userIdLong = Long.parseLong(userId != null ? userId : "1");
        itemTagService.addTag(Long.parseLong(itemId), tagName, userIdLong);
        return ResponseBuilder.success(null, "Tag added successfully");
    }

    @DeleteMapping("/remove-tag")
    public ResponseEntity<ApiResponse<Void>> removeTag(
            @RequestParam String itemId,
            @RequestParam String tagName,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Long userIdLong = Long.parseLong(userId != null ? userId : "1");
        itemTagService.removeTag(Long.parseLong(itemId), tagName, userIdLong);
        return ResponseBuilder.success(null, "Tag removed successfully");
    }

    @DeleteMapping("/remove-item/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {
        
        Long userIdLong = Long.parseLong(userId);
        itemService.deleteItem(Long.parseLong(itemId), userIdLong);
        return ResponseBuilder.success(null, "Item removed successfully");
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryWithCountDto>>> getCategories() {
        List<CategoryWithCountDto> categories = itemService.getCategoriesWithCount();
        return ResponseBuilder.success(categories, "Categories retrieved successfully");
    }

    @GetMapping("/search-items/{input}")
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> searchItems(
            @PathVariable String input,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        System.out.println("In here");

        List<ItemWithSubscriptionDto> items = itemService.searchItems(input, userId);
        return ResponseBuilder.success(items, "Search completed successfully");
    }

    @GetMapping("/subscribed-items")
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> getSubscribedItems(
            @RequestHeader(value = "X-User-Id") String userId) {

        List<ItemWithSubscriptionDto> items = itemSubscriberService.getSubscribedItems(userId);
        return ResponseBuilder.success(items, "Subscribed items retrieved successfully");
    }

    @GetMapping("/last-call-to-register")
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> getLastCallToRegister(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        List<ItemWithSubscriptionDto> items = itemService.getLastCallToRegister(userId);
        return ResponseBuilder.success(items, "Last call to register items retrieved successfully");
    }

}