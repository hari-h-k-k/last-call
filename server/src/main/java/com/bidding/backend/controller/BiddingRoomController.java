package com.bidding.backend.controller;

import com.bidding.backend.entity.BiddingRoom;
import com.bidding.backend.service.BiddingRoomService;
import com.bidding.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class BiddingRoomController {

    private BiddingRoomService biddingRoomService;

    private UserService userService;

    @Autowired
    public BiddingRoomController(BiddingRoomService biddingRoomService, UserService userService) {
        this.biddingRoomService = biddingRoomService;
        this.userService = userService;
    }

    @RequestMapping("/get-room-by-id")
    public String getRoomById() {
        return biddingRoomService.getRoomById(BiddingRoom roomId);
    }
}
