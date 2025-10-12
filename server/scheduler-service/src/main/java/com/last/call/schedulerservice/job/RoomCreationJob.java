package com.last.call.schedulerservice.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class RoomCreationJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(RoomCreationJob.class);

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        Long itemId = context.getJobDetail().getJobDataMap().getLong("itemId");
        String itemTitle = context.getJobDetail().getJobDataMap().getString("itemTitle");

        System.out.println("🏠 Creating room for item: " + itemTitle + " (ID: " + itemId + ")");

        kafkaTemplate.send("room-creation", itemId.toString());

        System.out.println("✅ Room creation request sent for item ID: " + itemId);
    }
}
