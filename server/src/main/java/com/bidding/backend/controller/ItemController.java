package com.bidding.backend.controller;

import com.bidding.backend.utils.common.ResponseBuilder;
import com.bidding.backend.entity.Item;
import com.bidding.backend.service.ItemService;

import com.bidding.backend.utils.enums.ItemCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RestController
@RequestMapping("/auctions")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/place-item")
    public ResponseEntity<Object> placeItem(@RequestBody Item item) {
        if(item.getId() != null) {
            itemService.updateItem(item);
            Map<String, Object> response = new ResponseBuilder()
                    .setStatus("success")
                    .setMessage("Item updated successfully!")
                    .build();
            return ResponseEntity.status(200).body(response);
        }
        itemService.saveItem(item);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item placed successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping({"/items", "/items/{itemId}", "/items/user/{userId}"})
    public ResponseEntity<Object> getItems(
            @PathVariable(required = false) String itemId,
            @PathVariable(required = false) String userId) {

        Map<String, Object> info = new HashMap<>();

        if (itemId != null) {
            info.put("item", itemService.getItem(itemId));
        } else if (userId != null) {
            info.put("items", itemService.getAllItemsBySellerId(userId));
        } else {
            info.put("items", itemService.getAllItems());
        }

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Items fetched successfully!")
                .setInfo(info)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-upcoming-items")
    public ResponseEntity<Object> getUpcomingItems(@RequestHeader String userId) {
        Map<Item, Date> upcomingItemsMap = itemService.getUpcomingItems(userId);

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item fetched successfully!")
                .setInfo(Map.of(
                        "upcomingItemsMap", upcomingItemsMap
                ))
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping("/item-subscribe")
    public ResponseEntity<Object> itemSubscribe(@RequestHeader String itemId, @RequestHeader String userId) {
        itemService.itemSubscribe(itemId, userId, true);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("User subscribed to item successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping("/item-unsubscribe")
    public ResponseEntity<Object> itemUnsubscribe(@RequestHeader String itemId, @RequestHeader String userId) {
        itemService.itemSubscribe(itemId, userId, false);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("User unsubscribed from item successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping("/update-item")
    public ResponseEntity<Object> itemRegisterUser(@RequestBody Item item) {
        itemService.updateItem(item);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item updated successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping("/remove-item/{itemId}")
    public ResponseEntity<Object> removeItem(@PathVariable String itemId) {
        itemService.removeItem(itemId);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item removed successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<Object> getCategories() {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Categories fetched successfully!")
                .setInfo(List.of(Arrays.stream(ItemCategory.values())
                        .map(Enum::name)
                        .toList()))
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/search-items/{input}")
    public ResponseEntity<Object> searchItems(@PathVariable String input) {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Categories fetched successfully!")
                .setInfo(List.of(itemService.searchItems(input)))
                .build();
        return ResponseEntity.status(200).body(response);
    }
}
