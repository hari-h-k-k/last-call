package com.bidding.backend.controller;

import com.bidding.backend.service.RoomService;
import com.bidding.backend.service.UserService;
import com.bidding.backend.utils.common.ResponseBuilder;
import com.bidding.backend.utils.jwt.JwtUtil;
import com.bidding.backend.utils.scheduler.AuctionSchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RoomController {

    private final UserService userService;
    private final RoomService roomService;
    private final JwtUtil jwtUtil;

    @Autowired
    public RoomController(UserService userService, RoomService roomService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.roomService = roomService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/get-room")
    public ResponseEntity<Object> getRoom(@RequestParam String roomId) {
        Map<String, Object> rooms = new HashMap<>();
        rooms.put("room", roomService.getRoomById(roomId));

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Room fetched successfully!")
                .setInfo(rooms)
                .build();

        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/place-bid")
    public ResponseEntity<Object> placeBid(
            @RequestParam String roomId,
            @RequestParam Double bidAmount,
            @RequestHeader(value = "Authorization", required = false) String token
    ) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        String userId = jwtUtil.extractUserId(token.substring(7));
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        try {
            roomService.placeBid(roomId, userId, bidAmount);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Bid placed successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
