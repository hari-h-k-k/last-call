package com.last.call.schedulerservice.job;

import com.last.call.shared.dto.ItemRoomCreationDto;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.context.ApplicationContext;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class RoomActivationJob implements Job {
    private static final Logger logger = LoggerFactory.getLogger(RoomActivationJob.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            ApplicationContext applicationContext = (ApplicationContext) context.getScheduler().getContext().get("applicationContext");
            KafkaTemplate<String, Object> kafkaTemplate = applicationContext.getBean(KafkaTemplate.class);

            Long itemId = context.getJobDetail().getJobDataMap().getLong("itemId");

            System.out.println("🏠 Activating room for item ID: " + itemId + ")");

            kafkaTemplate.send("room-activation", itemId.toString(), itemId);

            System.out.println("✅ Room activation request with data sent for item ID: " + itemId);
        } catch (Exception e) {
            logger.error("Error executing room activation job: {}", e.getMessage());
            throw new JobExecutionException(e);
        }
    }
}
