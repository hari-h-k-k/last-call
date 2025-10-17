package com.last.call.schedulerservice.service;

import com.last.call.schedulerservice.dto.ItemRoomCreationDto;
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
    
    public void scheduleRoomCreationJob(ItemRoomCreationDto itemRoomCreationDto) throws SchedulerException {
        logger.info("Scheduling room creation job for item ID: {} at {}", itemRoomCreationDto.getId(), itemRoomCreationDto.getRegistrationClosingDate());

        JobDetail job = JobBuilder.newJob(RoomCreationJob.class)
                .withIdentity("roomCreation_" + itemRoomCreationDto.getId(), "itemJobs")
                .usingJobData("itemId", itemRoomCreationDto.getId())
                .usingJobData("startingPrice", itemRoomCreationDto.getStartingPrice())
                .usingJobData("auctionStartDate", itemRoomCreationDto.getAuctionStartDate().getTime())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("roomCreationTrigger_" + itemRoomCreationDto.getId(), "itemTriggers")
                .startAt(itemRoomCreationDto.getRegistrationClosingDate())
                .build();

        scheduler.scheduleJob(job, trigger);
    }

}