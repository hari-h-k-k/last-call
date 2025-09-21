package com.last.call.itemservice.service;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.entity.ItemTag;
import com.last.call.itemservice.entity.ItemSubscriber;
import com.last.call.itemservice.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemTagService itemTagService;

    @Autowired
    private ItemSubscriberService itemSubscriberService;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item updatedItem) {
        return itemRepository.findById(id)
                .map(item -> {
                    item.setTitle(updatedItem.getTitle());
                    item.setDescription(updatedItem.getDescription());
                    item.setStartingPrice(updatedItem.getStartingPrice());
                    item.setCategory(updatedItem.getCategory());
                    item.setRegistrationClosingDate(updatedItem.getRegistrationClosingDate());
                    item.setAuctionStartDate(updatedItem.getAuctionStartDate());
                    return itemRepository.save(item);
                })
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public void addTag(Long itemId, String tagName) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemTagService.addTag(item, tagName);
    }

    public void removeTag(Long itemId, String tagName) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemTagService.removeTag(item, tagName);
    }

    public void subscribe(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemSubscriberService.subscribe(item, userId);
    }

    public void unsubscribe(Long itemId, String userId) {
        Item item = getItemById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemSubscriberService.unsubscribe(item, userId);
    }
}