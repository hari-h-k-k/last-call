package com.bidding.backend.utils.scheduler;

import com.bidding.backend.service.RoomService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CloseRoomJob implements Job {

    @Autowired
    private RoomService roomService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String itemId = context.getJobDetail().getJobDataMap().getString("itemId");
        roomService.closeRoomForItem(itemId);
        System.out.println("Closed room for item: " + itemId);
    }
}