package com.bidding.backend.utils.scheduler;

import com.bidding.backend.service.ItemService;
import com.bidding.backend.service.RoomService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoomCreationJob implements Job {

    @Autowired
    private RoomService roomService;

    @Autowired
    private ItemService itemService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String itemId = context.getJobDetail().getJobDataMap().getString("itemId");
        roomService.createRoom(itemService.getItem(itemId).get(0));
        System.out.println("Registration closed, Created Room for item: " + itemService.getItem(itemId).get(0).getTitle());
    }
}