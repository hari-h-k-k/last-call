package com.last.call.itemservice.client;

import com.last.call.itemservice.dto.ItemRoomCreationDto;
import com.last.call.itemservice.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class KafkaClient {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void scheduleItemJobs(Item item, Date auctionStartDate) {
        ItemRoomCreationDto itemRoomCreationDto = new ItemRoomCreationDto(item.getId(), item.getStartingPrice(), item.getRegistrationClosingDate(), auctionStartDate);
        kafkaTemplate.send("schedule-item-jobs", item.getId().toString(), itemRoomCreationDto);
    }
}
