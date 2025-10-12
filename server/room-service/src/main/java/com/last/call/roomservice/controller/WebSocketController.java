//package com.last.call.roomservice.controller;
//
//import com.last.call.roomservice.dto.BidRequest;
//import com.last.call.roomservice.entity.Bid;
//import com.last.call.roomservice.service.BidService;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class WebSocketController {
//
//    private final BidService bidService;
//
//    public WebSocketController(BidService bidService) {
//        this.bidService = bidService;
//    }
//
//    @MessageMapping("/bid/{itemId}")
//    public void placeBid(@DestinationVariable Long itemId,
//                        @Payload BidRequest bidRequest,
//                        SimpMessageHeaderAccessor headerAccessor) {
//
//        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
//        if (userId != null) {
//            bidService.placeBid(itemId, userId, bidRequest.getBidAmount());
//        }
//    }
//}