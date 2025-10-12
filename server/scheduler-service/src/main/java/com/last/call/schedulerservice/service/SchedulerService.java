package com.last.call.schedulerservice.service;

import com.last.call.schedulerservice.dto.ScheduleJobRequest;
import com.last.call.schedulerservice.dto.ItemScheduleDto;
import com.last.call.schedulerservice.job.KafkaPublisherJob;
import com.last.call.schedulerservice.job.RegistrationClosingJob;
import com.last.call.schedulerservice.job.RoomCreationJob;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

@Service
public class SchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);
    private final Scheduler scheduler;
    
    public SchedulerService(Scheduler scheduler) {
        this.scheduler = scheduler;
    }
    
    public void scheduleRoomCreationJob(ItemScheduleDto item) throws SchedulerException {
        logger.info("Scheduling room creation job for item ID: {} at {}", item.getId(), item.getRegistrationClosingDate());

        JobDetail job = JobBuilder.newJob(RoomCreationJob.class)
                .withIdentity("roomCreation_" + item.getId(), "itemJobs")
                .usingJobData("itemId", item.getId())
                .usingJobData("itemTitle", item.getTitle())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("roomCreationTrigger_" + item.getId(), "itemTriggers")
                .startAt(item.getRegistrationClosingDate())
                .build();

        scheduler.scheduleJob(job, trigger);
    }

}