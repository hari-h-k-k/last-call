package com.last.call.itemservice.service;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.entity.ItemTag;
import com.last.call.itemservice.exception.ItemNotFoundException;
import com.last.call.itemservice.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ItemTagService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemValidationService itemValidationService;

    @Transactional
    public void addTag(Long itemId, String tagName, Long userId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));
        
        itemValidationService.validateItemOwnership(item, userId);
        itemValidationService.validateTagName(tagName);
        
        boolean tagExists = item.getTags() != null && 
            item.getTags().stream().anyMatch(tag -> tag.getTag().equalsIgnoreCase(tagName));
        
        if (tagExists) {
            throw new IllegalArgumentException("Tag already exists for this item");
        }
        
        if (item.getTags() != null && item.getTags().size() >= 10) {
            throw new IllegalArgumentException("Maximum 10 tags allowed per item");
        }
        
        ItemTag newTag = new ItemTag(tagName.toLowerCase().trim(), item);
        item.getTags().add(newTag);
        itemRepository.save(item);
    }

    @Transactional
    public void removeTag(Long itemId, String tagName, Long userId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));
        
        itemValidationService.validateItemOwnership(item, userId);
        
        if (item.getTags().isEmpty()) {
            throw new IllegalArgumentException("No tags found for this item");
        }
        
        boolean tagRemoved = item.getTags().removeIf(tag -> tag.getTag().equalsIgnoreCase(tagName));
        
        if (!tagRemoved) {
            throw new IllegalArgumentException("Tag not found for this item");
        }
        
        itemRepository.save(item);
    }

    public void deleteAll() {
        // Tags are deleted automatically when items are deleted due to cascade
    }
}