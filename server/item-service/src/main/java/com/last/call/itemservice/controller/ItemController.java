package com.last.call.itemservice.controller;

import com.last.call.itemservice.dto.ApiResponse;
import com.last.call.itemservice.dto.CategoryWithCountDto;
import com.last.call.itemservice.dto.CreateItemRequestDto;
import com.last.call.itemservice.dto.ItemWithSubscriptionDto;
import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.service.ItemService;
import com.last.call.itemservice.util.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ItemController {

    @Autowired
    private ItemService itemService;
    
    @PostMapping("/create-item")
    public ResponseEntity<ApiResponse<Item>> placeItem(
            @RequestBody CreateItemRequestDto request,
            @RequestHeader(value = "X-User-Id") String userId) {
        
        Item item = new Item(
            request.getTitle(),
            request.getDescription(),
            Long.parseLong(userId),
            request.getStartingPrice(),
            request.getCategory(),
            request.getRegistrationClosingDate()
        );
        
        Item savedItem = itemService.saveItem(item, request.getAuctionStartDate());
        return ResponseBuilder.success(savedItem, "Item created successfully");
    }

    @GetMapping({"/{itemId}"})
    public ResponseEntity<ApiResponse<ItemWithSubscriptionDto>> getItem(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        if (userId == null) {
            Item item = itemService.getItemById(Long.parseLong(itemId));
            ItemWithSubscriptionDto itemWithSubscriptionDto = new ItemWithSubscriptionDto(item, false);
            return ResponseBuilder.success(itemWithSubscriptionDto, "Item retrieved successfully");
        }
        
        ItemWithSubscriptionDto itemWithSubscriptionDto = itemService.getItemWithSubscription(Long.parseLong(itemId), userId);
        return ResponseBuilder.success(itemWithSubscriptionDto, "Item retrieved successfully");
    }

    @PostMapping("/{itemId}/register")
    public ResponseEntity<ApiResponse<Void>> registerForAuction(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {

        itemService.register(Long.parseLong(itemId), userId);
        return ResponseBuilder.success(null, "Successfully registered for auction");
    }

    @DeleteMapping("/{itemId}/unregister")
    public ResponseEntity<ApiResponse<Void>> unregisterFromAuction(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {

        itemService.unregister(Long.parseLong(itemId), userId);
        return ResponseBuilder.success(null, "Successfully unregistered from auction");
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

    @GetMapping("/last-call-to-register")
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> getLastCallToRegister(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        List<ItemWithSubscriptionDto> items = itemService.getLastCallToRegister(userId);
        return ResponseBuilder.success(items, "Last call to register items retrieved successfully");
    }

}