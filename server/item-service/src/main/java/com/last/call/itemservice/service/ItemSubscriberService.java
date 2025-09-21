package com.last.call.itemservice.service;

import com.last.call.itemservice.dto.ItemWithSubscriptionDto;
import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.entity.ItemSubscriber;
import com.last.call.itemservice.exception.ItemNotFoundException;
import com.last.call.itemservice.repository.ItemRepository;
import com.last.call.itemservice.repository.ItemSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ItemSubscriberService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemSubscriberRepository itemSubscriberRepository;

    @Autowired
    private ItemValidationService itemValidationService;

    @Transactional
    public void subscribe(Item item, String userId) {
        itemValidationService.validateSubscriptionEligibility(item, userId);
        
        boolean alreadySubscribed = item.getSubscribers() != null && 
            item.getSubscribers().stream().anyMatch(sub -> sub.getUserId().equals(userId));
        
        if (alreadySubscribed) {
            throw new IllegalArgumentException("User is already subscribed to this item");
        }
        
        ItemSubscriber newSubscriber = new ItemSubscriber(userId, item);
        item.getSubscribers().add(newSubscriber);
        itemRepository.save(item);
    }

    @Transactional
    public void unsubscribe(Item item, String userId) {
        if (item.getSubscribers().isEmpty()) {
            throw new IllegalArgumentException("User is not subscribed to this item");
        }
        
        boolean wasSubscribed = item.getSubscribers().removeIf(sub -> sub.getUserId().equals(userId));
        
        if (!wasSubscribed) {
            throw new IllegalArgumentException("User is not subscribed to this item");
        }
        
        itemRepository.save(item);
    }

    public boolean isUserSubscribed(Item item, String userId) {
        return itemSubscriberRepository.existsByItemIdAndUserId(item.getId(), userId);
    }

    public List<ItemWithSubscriptionDto> getSubscribedItems(String userId) {
        List<Item> allItems = itemRepository.findAll();
        return allItems.stream()
                .filter(item -> isUserSubscribed(item, userId))
                .map(item -> new ItemWithSubscriptionDto(item, true)).toList();
    }


}