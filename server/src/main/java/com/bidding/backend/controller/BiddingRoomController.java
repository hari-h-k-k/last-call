package com.bidding.backend.controller;

import com.bidding.backend.service.BiddingRoomService;
import com.bidding.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class BiddingRoomController {

    @Autowired
    private BiddingRoomService biddingRoomService;

    @Autowired
    private UserService userService;


}
