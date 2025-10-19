package com.last.call.itemservice.service;

import com.last.call.itemservice.entity.Item;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ItemValidationService {

    public void validateItemDates(Item item) {
        Date now = new Date();
        
        if (item.getRegistrationClosingDate().before(now)) {
            throw new IllegalArgumentException("Registration closing date cannot be in the past");
        }
        
        if (item.getAuctionStartDate().before(now)) {
            throw new IllegalArgumentException("Auction start date cannot be in the past");
        }
        
        if (item.getRegistrationClosingDate().after(item.getAuctionStartDate())) {
            throw new IllegalArgumentException("Registration closing date cannot be after auction start date");
        }
    }

    public void validateStartingPrice(double price) {
        if (price <= 0) {
            throw new IllegalArgumentException("Starting price must be greater than 0");
        }
    }

    public void validateItemOwnership(Item item, Long userId) {
        if (!item.getSellerId().equals(userId)) {
            throw new IllegalArgumentException("User is not authorized to modify this item");
        }
    }

    public void validateItemNotStarted(Item item) {
        Date now = new Date();
        if (item.getRegistrationClosingDate().before(now)) {
            throw new IllegalArgumentException("Cannot modify item after registration has closed");
        }
    }

    public void validateTagName(String tagName) {
        if (tagName == null || tagName.trim().isEmpty()) {
            throw new IllegalArgumentException("Tag name cannot be empty");
        }
        
        if (tagName.length() > 50) {
            throw new IllegalArgumentException("Tag name cannot exceed 50 characters");
        }
    }

    public void validateRegistrationEligibility(Item item, Long userId) {
        Date now = new Date();

//        if (item.getRegistrationClosingDate().before(now)) {
//            throw new IllegalArgumentException("Deadline exceeded to express interest on this item");
//        }

        if (item.getSellerId().equals(userId)) {
            throw new IllegalArgumentException("User cannot express interest on the item they listed");
        }
    }
}