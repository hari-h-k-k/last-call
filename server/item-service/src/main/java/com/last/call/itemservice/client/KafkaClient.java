package com.last.call.itemservice.client;

import com.last.call.shared.dto.ItemRoomCreationDto;  // Using shared DTO
import com.last.call.itemservice.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class KafkaClient {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void scheduleItemJobs(Item item) {
        ItemRoomCreationDto itemRoomCreationDto = new ItemRoomCreationDto(item.getId(), item.getStartingPrice(), item.getRegistrationClosingDate(), item.getAuctionStartDate());
        kafkaTemplate.send("schedule-item-jobs", item.getId().toString(), itemRoomCreationDto);
        System.out.println("✅ Scheduled jobs for item ID: " + item.getId());
    }
}
