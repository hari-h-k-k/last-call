package com.last.call.schedulerservice.listener;

import com.last.call.schedulerservice.service.SchedulerService;
import com.last.call.shared.dto.ItemRoomCreationDto;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class KafkaListener {

    @Autowired
    private SchedulerService schedulerService;

    @org.springframework.kafka.annotation.KafkaListener(topics = "schedule-room-close")
    public void handleScheduleRoomClose(ConsumerRecord<String, Date> record) throws SchedulerException {
        Long roomId = Long.parseLong(record.key());
        Date auctionEndDate = record.value();
        System.out.println("📥 Received message for room ID: " + roomId);
        schedulerService.scheduleRoomCloseJob(roomId, auctionEndDate);
        System.out.println("✅ Scheduled jobs for room ID: " + roomId);
    }

    @org.springframework.kafka.annotation.KafkaListener(topics = "schedule-item-jobs")
    public void handleScheduleItemJobs(ItemRoomCreationDto itemRoomCreationDto) throws SchedulerException {
        System.out.println("📥 Received schedule-item-jobs message for item ID: " + itemRoomCreationDto.getItemId());
        schedulerService.scheduleRoomCreationJob(itemRoomCreationDto);
        schedulerService.scheduleRoomActivationJob(itemRoomCreationDto.getItemId(), itemRoomCreationDto.getAuctionStartDate());
        System.out.println("✅ Scheduled jobs for item ID: " + itemRoomCreationDto.getItemId());
    }
}