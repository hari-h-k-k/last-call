package com.last.call.schedulerservice.listener;

import com.last.call.schedulerservice.service.SchedulerService;
import com.last.call.shared.dto.ItemRoomCreationDto;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ItemListener {

    @Autowired
    private SchedulerService schedulerService;

    @KafkaListener(topics = "schedule-item-jobs")
    public void handleScheduleItemJobs(ItemRoomCreationDto itemRoomCreationDto) throws SchedulerException {
        System.out.println("📥 Received schedule-item-jobs message for item ID: " + itemRoomCreationDto.getItemId());
        schedulerService.scheduleRoomCreationJob(itemRoomCreationDto);
        System.out.println("✅ Scheduled jobs for item ID: " + itemRoomCreationDto.getItemId());
    }
}