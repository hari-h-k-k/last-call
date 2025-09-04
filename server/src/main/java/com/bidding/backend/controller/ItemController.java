package com.bidding.backend.controller;

import com.bidding.backend.utils.common.ResponseBuilder;
import com.bidding.backend.entity.Item;
import com.bidding.backend.service.ItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Date;
import java.util.Map;

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
        itemService.saveItem(item);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item placed successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-item/{itemId}")
    public ResponseEntity<Object> getItem(@PathVariable String itemId) {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item fetched successfully!")
                .setInfo(Map.of(
                        "item", itemService.getItem(itemId)
                ))
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-items")
    public ResponseEntity<Object> getItems() {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Items fetched successfully!")
                .setInfo(Map.of(
                        "items", itemService.getAllItems()
                ))
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-items/{userId}")
    public ResponseEntity<Object> getItems(@PathVariable String userId) {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Items fetched successfully!")
                .setInfo(Map.of(
                        "items", itemService.getAllItemsBySellerId(userId)
                ))
                .build();
        return ResponseEntity.status(200).body(response);
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
                .setMessage("User subscribed to item successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

}
