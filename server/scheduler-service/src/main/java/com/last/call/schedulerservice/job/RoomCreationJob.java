package com.last.call.schedulerservice.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class RoomCreationJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(RoomCreationJob.class);
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    private static KafkaTemplate<String, Object> staticKafkaTemplate;
    
    @PostConstruct
    public void init() {
        staticKafkaTemplate = kafkaTemplate;
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        Long itemId = context.getJobDetail().getJobDataMap().getLong("itemId");
        String itemTitle = context.getJobDetail().getJobDataMap().getString("itemTitle");

        try {
            System.out.println("🏠 Creating room for item: " + itemTitle + " (ID: " + itemId + ")");

            staticKafkaTemplate.send("room-creation", itemId.toString());

            System.out.println("✅ Room creation request sent for item ID: " + itemId);
        } catch (Exception e) {
            throw new JobExecutionException("Failed to send Kafka message", e);
        }
    }
}
