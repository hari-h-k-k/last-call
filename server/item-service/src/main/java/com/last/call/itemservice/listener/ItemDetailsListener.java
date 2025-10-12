package com.last.call.itemservice.listener;

import com.last.call.itemservice.dto.ItemDetailsDto;
import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ItemDetailsListener {

    @Autowired
    private ItemService itemService;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "item-details-request")
    public void handleItemDetailsRequest(String itemId) {
        System.out.println("📥 Received item details request for ID: " + itemId);
        
        try {
            Long id = Long.parseLong(itemId);
            Optional<Item> itemOpt = itemService.getItemById(id);
            
            if (itemOpt.isPresent()) {
                Item item = itemOpt.get();
                ItemDetailsDto dto = new ItemDetailsDto(
                    item.getId(),
                    item.getTitle(),
                    item.getDescription(),
                    item.getSellerId(),
                    item.getStartingPrice(),
                    item.getCategory().toString(),
                    item.getRegistrationClosingDate(),
                    item.getAuctionStartDate()
                );
                
                kafkaTemplate.send("item-details-response", id.toString(), dto);
                System.out.println("📤 Sent item details for ID: " + id);
            } else {
                System.out.println("❌ Item not found for ID: " + id);
            }
        } catch (Exception e) {
            System.err.println("Error processing item details request: " + e.getMessage());
        }
    }
}