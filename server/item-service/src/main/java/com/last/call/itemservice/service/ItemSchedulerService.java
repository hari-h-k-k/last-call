package com.last.call.itemservice.service;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.job.AuctionStartJob;
import com.last.call.itemservice.job.RegistrationClosingJob;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemSchedulerService {

    @Autowired
    private Scheduler scheduler;

    public void scheduleItemJobs(Item item) throws SchedulerException {
        scheduleRegistrationClosingJob(item);
        scheduleAuctionStartJob(item);
    }

    public void rescheduleItemJobs(Item item) throws SchedulerException {
        deleteItemJobs(item.getId());
        scheduleItemJobs(item);
    }

    private void scheduleRegistrationClosingJob(Item item) throws SchedulerException {
        JobDetail job = JobBuilder.newJob(RegistrationClosingJob.class)
                .withIdentity("regClosing_" + item.getId(), "itemJobs")
                .usingJobData("itemId", item.getId())
                .usingJobData("itemTitle", item.getTitle())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("regClosingTrigger_" + item.getId(), "itemTriggers")
                .startAt(item.getRegistrationClosingDate())
                .build();

        scheduler.scheduleJob(job, trigger);
    }

    private void scheduleAuctionStartJob(Item item) throws SchedulerException {
        JobDetail job = JobBuilder.newJob(AuctionStartJob.class)
                .withIdentity("auctionStart_" + item.getId(), "itemJobs")
                .usingJobData("itemId", item.getId())
                .usingJobData("itemTitle", item.getTitle())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("auctionStartTrigger_" + item.getId(), "itemTriggers")
                .startAt(item.getAuctionStartDate())
                .build();

        scheduler.scheduleJob(job, trigger);
    }

    public void deleteItemJobs(Long itemId) throws SchedulerException {
        JobKey regClosingKey = new JobKey("regClosing_" + itemId, "itemJobs");
        JobKey auctionStartKey = new JobKey("auctionStart_" + itemId, "itemJobs");

        if (scheduler.checkExists(regClosingKey)) {
            scheduler.deleteJob(regClosingKey);
        }
        if (scheduler.checkExists(auctionStartKey)) {
            scheduler.deleteJob(auctionStartKey);
        }
    }
}