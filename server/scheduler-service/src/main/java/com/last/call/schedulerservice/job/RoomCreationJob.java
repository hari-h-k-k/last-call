package com.last.call.schedulerservice.job;

import com.last.call.schedulerservice.dto.ItemRoomCreationDto;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class RoomCreationJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(RoomCreationJob.class);

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        Long itemId = context.getJobDetail().getJobDataMap().getLong("itemId");
        Double startingPrice = context.getJobDetail().getJobDataMap().getDouble("startingPrice");
        String auctionStartDateString = context.getJobDetail().getJobDataMap().getString("auctionStartDate");
        Date auctionStartDate = new Date(Long.parseLong(auctionStartDateString));

        System.out.println("🏠 Creating room for item ID: " + itemId + ")");

        // Send complete item data for room creation
        ItemRoomCreationDto itemRoomCreationDto = new ItemRoomCreationDto(
            itemId, startingPrice, null, auctionStartDate
        );
        
        kafkaTemplate.send("room-creation-with-item", itemId.toString(), itemRoomCreationDto);

        System.out.println("✅ Room creation request with data sent for item ID: " + itemId);
    }
}
