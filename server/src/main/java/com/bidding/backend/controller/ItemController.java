package com.bidding.backend.controller;

import com.bidding.backend.commonUtils.ResponseBuilder;
import com.bidding.backend.entity.Item;
import com.bidding.backend.service.ItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    public ResponseEntity<?> placeItem(@RequestBody Item item) {
        itemService.saveItem(item);
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item placed successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-items")
    public ResponseEntity<?> getItems() {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Items fetched successfully!")
                .setInfo(Map.of(
                        "items", itemService.getAllItems()
                ))
                .build();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-items/{id}")
    public ResponseEntity<?> getItem(@PathVariable String id) {
        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item fetched successfully!")
                .setInfo(Map.of(
                        "item", itemService.getItem(id)
                ))
                .build();
        return ResponseEntity.status(200).body(response);
    }





}
