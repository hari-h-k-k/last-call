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
    public void register(Item item, Long userId) {
        itemValidationService.validateRegistrationEligibility(item, userId);

        boolean alreadyRegistered = item.getSubscribers() != null &&
                item.getSubscribers().stream().anyMatch(sub -> sub.getUserId().equals(userId));

        if (alreadyRegistered) {
            throw new IllegalArgumentException("User is already registered to this item");
        }

        ItemSubscriber newSubscriber = new ItemSubscriber(userId, item);
        item.getSubscribers().add(newSubscriber);
        itemRepository.save(item);
    }

    @Transactional
    public void unregister(Item item, Long userId) {
        if (item.getSubscribers().isEmpty()) {
            throw new IllegalArgumentException("User is not registered to this item");
        }

        boolean wasRegistered = item.getSubscribers().removeIf(sub -> sub.getUserId().equals(userId));

        if (!wasRegistered) {
            throw new IllegalArgumentException("User is not registered to this item");
        }

        itemRepository.save(item);
    }

    public boolean isUserRegistered(Item item, Long userId) {
        return itemSubscriberRepository.existsByItemIdAndUserId(item.getId(), userId);
    }

    public List<ItemWithSubscriptionDto> getRegisteredItems(Long userId) {
        List<Item> allItems = itemRepository.findAll();
        return allItems.stream()
                .filter(item -> isUserRegistered(item, userId))
                .map(item -> new ItemWithSubscriptionDto(item, true)).toList();
    }

    public void deleteAll() {
        itemSubscriberRepository.deleteAll();
    }
}