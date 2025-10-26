package com.last.call.itemservice.controller;

import com.last.call.itemservice.dto.ApiResponse;
import com.last.call.itemservice.dto.CategoryWithCountDto;
import com.last.call.itemservice.dto.CreateItemRequestDto;
import com.last.call.itemservice.dto.ItemSearchRequestDto;
import com.last.call.itemservice.dto.ItemWithSubscriptionDto;
import com.last.call.itemservice.dto.PaginatedSearchResponseDto;
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
            request.getRegistrationClosingDate(),
            request.getAuctionStartDate()
        );
        
        Item savedItem = itemService.saveItem(item);
        return ResponseBuilder.success(savedItem, "Item created successfully");
    }

    @PutMapping("/update-item/{itemId}")
    public ResponseEntity<ApiResponse<Item>> updateItem(
            @PathVariable Long itemId,
            @RequestBody CreateItemRequestDto request,
            @RequestHeader(value="X-User-Id") String userId){

        Item existingItem= itemService.getItemById(itemId);

        existingItem.setTitle(request.getTitle());
        existingItem.setDescription(request.getDescription());
        existingItem.setStartingPrice(request.getStartingPrice());
        existingItem.setCategory(request.getCategory());
        existingItem.setRegistrationClosingDate(request.getRegistrationClosingDate());
        existingItem.setAuctionStartDate(request.getAuctionStartDate());

        Item updatedItem=itemService.saveItem(existingItem);

        return ResponseBuilder.success(updatedItem, "Item updated successfully" );

    }

    @GetMapping({"/my-items"})
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> getMyItems(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        System.out.println("in my-items");

        List<ItemWithSubscriptionDto> items = itemService.getItemsBySellerId(Long.valueOf(userId));
        return ResponseBuilder.success(items, "Items returned successfully");
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
        
        ItemWithSubscriptionDto itemWithSubscriptionDto = itemService.getItemWithSubscription(Long.parseLong(itemId), Long.valueOf(userId));
        return ResponseBuilder.success(itemWithSubscriptionDto, "Item retrieved successfully");
    }

    @PostMapping("/{itemId}/register")
    public ResponseEntity<ApiResponse<Void>> registerForAuction(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {

        itemService.register(Long.parseLong(itemId), Long.valueOf(userId));
        return ResponseBuilder.success(null, "Successfully registered for auction");
    }

    @DeleteMapping("/{itemId}/unregister")
    public ResponseEntity<ApiResponse<Void>> unregisterFromAuction(
            @PathVariable String itemId,
            @RequestHeader(value = "X-User-Id") String userId) {

        itemService.unregister(Long.parseLong(itemId), Long.valueOf(userId));
        return ResponseBuilder.success(null, "Successfully unregistered from auction");
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryWithCountDto>>> getCategories() {
        List<CategoryWithCountDto> categories = itemService.getCategoriesWithCount();
        return ResponseBuilder.success(categories, "Categories retrieved successfully");
    }

    @GetMapping("/last-call-to-register")
    public ResponseEntity<ApiResponse<List<ItemWithSubscriptionDto>>> getLastCallToRegister(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        Long userIdLong = userId != null ? Long.valueOf(userId) : null;

        List<ItemWithSubscriptionDto> items = itemService.getLastCallToRegister(userIdLong);
        return ResponseBuilder.success(items, "Last call to register items retrieved successfully");
    }

    @PostMapping("/search-with-filters")
    public ResponseEntity<ApiResponse<PaginatedSearchResponseDto>> searchItemsWithFilters(
            @RequestBody ItemSearchRequestDto request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        Long userIdLong = userId != null ? Long.valueOf(userId) : null;
        PaginatedSearchResponseDto result = itemService.searchItemsWithFilters(request, userIdLong);
        return ResponseBuilder.success(result, "Search completed successfully");
    }

    @DeleteMapping("/delete-item/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long itemId) {
        itemService.deleteById(itemId);
        return ResponseBuilder.success(null, "Item deleted successfully");
    }

}