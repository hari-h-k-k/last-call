package com.last.call.schedulerservice.listener;

import com.last.call.schedulerservice.dto.ItemScheduleDto;
import com.last.call.schedulerservice.dto.ItemDetailsDto;
import com.last.call.schedulerservice.service.SchedulerService;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class ItemSchedulingListener {

    @Autowired
    private SchedulerService schedulerService;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "schedule-item-jobs")
    public void handleScheduleItemJobs(ItemScheduleDto item) throws SchedulerException {
        System.out.println("📥 Received schedule-item-jobs message for item ID: " + item.getId());
        schedulerService.scheduleRoomCreationJob(item);
        System.out.println("✅ Scheduled jobs for item ID: " + item.getId());
    }

    @KafkaListener(topics = "reschedule-item-jobs")
    public void handleRescheduleItemJobs(ItemScheduleDto item) throws SchedulerException {
        System.out.println("📥 Received reschedule-item-jobs message for item ID: " + item.getId());
        schedulerService.rescheduleRoomCreationJob(item);
        System.out.println("✅ Rescheduled jobs for item ID: " + item.getId());
    }

    @KafkaListener(topics = "item-details-response")
    public void handleItemDetailsResponse(ItemDetailsDto itemDetails) {
        System.out.println("📥 Received item details for ID: " + itemDetails.getId());
        
        kafkaTemplate.send("room-creation-with-details", itemDetails.getId().toString(), itemDetails);
        
        System.out.println("🏠 Sent room creation request with details for item ID: " + itemDetails.getId());
    }
}