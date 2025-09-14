package com.bidding.backend.utils.scheduler;

import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuctionSchedulerService {

    @Autowired
    private Scheduler scheduler;

    public void scheduleAuctionJobs(String itemId, Date bidStartDate, Date registrationClosingDate) throws SchedulerException {
        scheduleRoomCreationJob(itemId, registrationClosingDate);
        scheduleAuctionStartJob(itemId, bidStartDate);
    }

    public void scheduleRoomCreationJob(String itemId, Date registrationClosingDate) throws SchedulerException {
        JobDetail roomCreationJob = JobBuilder.newJob(RoomCreationJob.class)
                .withIdentity("roomCreationJob_" + itemId, "auctionJobs")
                .usingJobData("itemId", itemId)
                .build();

        Trigger roomCreationTrigger = TriggerBuilder.newTrigger()
                .withIdentity("roomCreationTrigger_" + itemId, "auctionTriggers")
                .startAt(registrationClosingDate)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .build();

        scheduler.scheduleJob(roomCreationJob, roomCreationTrigger);
    }

    public void scheduleAuctionStartJob(String itemId, Date bidStartDate) throws SchedulerException {
        JobDetail startAuctionJob = JobBuilder.newJob(AuctionStartJob.class)
                .withIdentity("auctionStartJob_" + itemId, "auctionJobs")
                .usingJobData("itemId", itemId)
                .build();

        Trigger startTrigger = TriggerBuilder.newTrigger()
                .withIdentity("auctionStartTrigger_" + itemId, "auctionTriggers")
                .startAt(bidStartDate)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .build();

        scheduler.scheduleJob(startAuctionJob, startTrigger);
    }

    public void scheduleCloseRoomJob(String itemId, Date endDate) throws SchedulerException {
        JobKey closeJobKey = new JobKey("closeRoomJob_" + itemId, "roomJobs");

        // Delete existing job if it exists (so we can reschedule)
        if (scheduler.checkExists(closeJobKey)) {
            scheduler.deleteJob(closeJobKey);
        }

        JobDetail closeRoomJob = JobBuilder.newJob(CloseRoomJob.class)
                .withIdentity(closeJobKey)
                .usingJobData("itemId", itemId)
                .build();

        Trigger closeTrigger = TriggerBuilder.newTrigger()
                .withIdentity("closeRoomTrigger_" + itemId, "roomTriggers")
                .startAt(endDate)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .build();

        scheduler.scheduleJob(closeRoomJob, closeTrigger);
    }


    public void deleteAuctionJobs(String itemId) throws SchedulerException {
        JobKey startJobKey = new JobKey("auctionStartJob_" + itemId, "auctionJobs");
        JobKey closeJobKey = new JobKey("roomCreationJob_" + itemId, "auctionJobs");

        if (scheduler.checkExists(startJobKey)) {
            scheduler.deleteJob(startJobKey);
        }
        if (scheduler.checkExists(closeJobKey)) {
            scheduler.deleteJob(closeJobKey);
        }
    }
}
