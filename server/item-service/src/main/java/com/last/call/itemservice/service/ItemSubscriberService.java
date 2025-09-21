package com.last.call.itemservice.service;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.entity.ItemSubscriber;
import com.last.call.itemservice.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemSubscriberService {

    @Autowired
    private ItemRepository itemRepository;

    public void subscribe(Item item, String userId) {
        // Check if user is already subscribed
        boolean alreadySubscribed = item.getSubscribers() != null && 
            item.getSubscribers().stream().anyMatch(sub -> sub.getUserId().equals(userId));
        
        if (!alreadySubscribed) {
            ItemSubscriber newSubscriber = new ItemSubscriber(userId, item);
            if (item.getSubscribers() == null) {
                item.setSubscribers(new java.util.ArrayList<>());
            }
            item.getSubscribers().add(newSubscriber);
            itemRepository.save(item);
        }
    }

    public void unsubscribe(Item item, String userId) {
        if (item.getSubscribers() != null) {
            item.getSubscribers().removeIf(sub -> sub.getUserId().equals(userId));
            itemRepository.save(item);
        }
    }
}