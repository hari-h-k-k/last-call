package com.last.call.schedulerservice.service;

import com.last.call.schedulerservice.job.RoomActivationJob;
import com.last.call.schedulerservice.job.RoomCloseJob;
import com.last.call.schedulerservice.job.RoomCreationJob;
import com.last.call.shared.dto.ItemRoomCreationDto;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class SchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);
    private final Scheduler scheduler;
    
    public SchedulerService(Scheduler scheduler) {
        this.scheduler = scheduler;
    }
    
    public void scheduleRoomCreationJob(ItemRoomCreationDto itemRoomCreationDto) throws SchedulerException {
        logger.info("Scheduling room creation job for item ID: {} at {}", itemRoomCreationDto.getItemId(), itemRoomCreationDto.getRegistrationClosingDate());

        JobDetail job = JobBuilder.newJob(RoomCreationJob.class)
                .withIdentity("roomCreation_" + itemRoomCreationDto.getItemId(), "itemJobs")
                .usingJobData("itemId", itemRoomCreationDto.getItemId())
                .usingJobData("startingPrice", itemRoomCreationDto.getStartingPrice())
                .usingJobData("auctionStartDate", itemRoomCreationDto.getAuctionStartDate().getTime())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("roomCreationTrigger_" + itemRoomCreationDto.getItemId(), "itemTriggers")
                .startAt(itemRoomCreationDto.getRegistrationClosingDate())
                .build();

        scheduler.scheduleJob(job, trigger);
    }

    public void scheduleRoomActivationJob(Long itemId, Date auctionStartDate) throws SchedulerException {
        logger.info("Scheduling room activation job for item ID: {} at {}", itemId, auctionStartDate);

        JobDetail job = JobBuilder.newJob(RoomActivationJob.class)
                .withIdentity("roomActivation_" + itemId, "itemJobs")
                .usingJobData("itemId", itemId)
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("roomActivationTrigger_" + itemId, "itemTriggers")
                .startAt(auctionStartDate)
                .build();

        scheduler.scheduleJob(job, trigger);
    }

    public void scheduleRoomCloseJob(Long roomId, Date auctionEndDate) throws SchedulerException {
        logger.info("Scheduling room close job for item ID: {} at {}", roomId, auctionEndDate);

        JobKey jobKey = JobKey.jobKey("roomClose_" + roomId, "itemJobs");
        if (scheduler.checkExists(jobKey)) {
            scheduler.deleteJob(jobKey);
        }

        JobDetail job = JobBuilder.newJob(RoomCloseJob.class)
                .withIdentity(jobKey)
                .usingJobData("roomId", roomId)
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("roomCloseTrigger_" + roomId, "roomTriggers")
                .startAt(auctionEndDate)
                .build();

        scheduler.scheduleJob(job, trigger);
    }

}