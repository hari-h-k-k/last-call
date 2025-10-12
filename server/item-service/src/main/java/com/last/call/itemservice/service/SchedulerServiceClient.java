package com.last.call.itemservice.service;

import com.last.call.itemservice.dto.ItemScheduleDto;
import com.last.call.itemservice.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SchedulerServiceClient {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void scheduleItemJobs(Item item) {
        ItemScheduleDto dto = new ItemScheduleDto(item.getId(), item.getTitle(), 
            item.getRegistrationClosingDate(), item.getAuctionStartDate());
        kafkaTemplate.send("schedule-item-jobs", item.getId().toString(), dto);
    }

    public void rescheduleItemJobs(Item item) {
        ItemScheduleDto dto = new ItemScheduleDto(item.getId(), item.getTitle(), 
            item.getRegistrationClosingDate(), item.getAuctionStartDate());
        kafkaTemplate.send("reschedule-item-jobs", item.getId().toString(), dto);
        System.out.println("Message sent");
    }
}