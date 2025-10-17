package com.last.call.schedulerservice.listener;

import com.last.call.schedulerservice.dto.ItemRoomCreationDto;
import com.last.call.schedulerservice.service.SchedulerService;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class ItemListener {

    @Autowired
    private SchedulerService schedulerService;

    @KafkaListener(topics = "schedule-item-jobs")
    public void handleScheduleItemJobs(ItemRoomCreationDto itemRoomCreationDto) throws SchedulerException {
        System.out.println("📥 Received schedule-item-jobs message for item ID: " + itemRoomCreationDto.getId());
        schedulerService.scheduleRoomCreationJob(itemRoomCreationDto);
        System.out.println("✅ Scheduled jobs for item ID: " + itemRoomCreationDto.getId());
    }
}