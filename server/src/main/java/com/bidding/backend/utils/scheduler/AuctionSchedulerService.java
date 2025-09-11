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

        // --- Room Creation Job ---
        JobDetail roomCreationJob = JobBuilder.newJob(RoomCreationJob.class)
                .withIdentity("roomCreationJob_" + itemId, "auctionJobs")
                .usingJobData("itemId", itemId)
                .build();

        Trigger roomCreationTrigger = TriggerBuilder.newTrigger()
                .withIdentity("roomCreationTrigger_" + itemId, "auctionTriggers")
                .startAt(registrationClosingDate) // close registration at registrationClosingDate
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .build();

        scheduler.scheduleJob(roomCreationJob, roomCreationTrigger);

        // --- Start Auction Job ---
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
