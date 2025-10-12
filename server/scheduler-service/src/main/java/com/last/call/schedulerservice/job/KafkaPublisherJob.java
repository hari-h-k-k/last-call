package com.last.call.schedulerservice.job;

import com.last.call.schedulerservice.dto.ScheduledEvent;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaPublisherJob implements Job {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaPublisherJob.class);
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String eventType = context.getJobDetail().getJobDataMap().getString("eventType");
        Long entityId = context.getJobDetail().getJobDataMap().getLong("entityId");
        
        logger.info("Executing scheduled job: {} for entity {}", eventType, entityId);
        
        ScheduledEvent event = new ScheduledEvent(eventType, entityId);
        kafkaTemplate.send("scheduler-events", event);
        
        logger.info("Published scheduled event: {} for entity {}", eventType, entityId);
    }
}