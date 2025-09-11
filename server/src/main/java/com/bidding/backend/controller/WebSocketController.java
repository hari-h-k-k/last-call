package com.bidding.backend.controller;

import com.bidding.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final RoomService roomService;

    @MessageMapping("/bid")
    public void placeBid(Map<String, Object> payload) {
        String roomId = (String) payload.get("roomId");
        String userId = (String) payload.get("userId");
        double amount = ((Number) payload.get("amount")).doubleValue();

        roomService.placeBid(roomId, userId, amount);
    }
}