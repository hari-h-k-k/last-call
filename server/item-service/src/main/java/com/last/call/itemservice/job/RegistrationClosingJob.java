package com.last.call.itemservice.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RegistrationClosingJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationClosingJob.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        Long itemId = context.getJobDetail().getJobDataMap().getLong("itemId");
        String itemTitle = context.getJobDetail().getJobDataMap().getString("itemTitle");
        
        logger.info("Registration closed for item: {} (ID: {})", itemTitle, itemId);
    }
}