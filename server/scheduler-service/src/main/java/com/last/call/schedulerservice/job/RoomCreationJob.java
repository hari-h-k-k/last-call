package com.last.call.schedulerservice.job;

import com.last.call.shared.dto.ItemRoomCreationDto;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class RoomCreationJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(RoomCreationJob.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            ApplicationContext applicationContext = (ApplicationContext) context.getScheduler().getContext().get("applicationContext");
            KafkaTemplate<String, Object> kafkaTemplate = applicationContext.getBean(KafkaTemplate.class);

            Long itemId = context.getJobDetail().getJobDataMap().getLong("itemId");
            Double startingPrice = context.getJobDetail().getJobDataMap().getDouble("startingPrice");
            Long auctionStartDateLong = context.getJobDetail().getJobDataMap().getLong("auctionStartDate");
            Date auctionStartDate = new Date(auctionStartDateLong);

            System.out.println("🏠 Creating room for item ID: " + itemId + ")");

            // Send complete item data for room creation
            ItemRoomCreationDto itemRoomCreationDto = new ItemRoomCreationDto(
                itemId, startingPrice, null, auctionStartDate
            );

            kafkaTemplate.send("room-creation-with-item", itemId.toString(), itemRoomCreationDto);

            System.out.println("✅ Room creation request with data sent for item ID: " + itemId);
        } catch (Exception e) {
            logger.error("Error executing room creation job: {}", e.getMessage());
            throw new JobExecutionException(e);
        }
    }
}
