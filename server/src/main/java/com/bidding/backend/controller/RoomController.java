package com.bidding.backend.controller;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.Room;
import com.bidding.backend.service.BidService;
import com.bidding.backend.service.ItemService;
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
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RoomController {

    private ItemService itemService;
    private final RoomService roomService;
    private BidService bidService;
    private final JwtUtil jwtUtil;

    @Autowired
    public RoomController(ItemService itemService, RoomService roomService, BidService bidService, JwtUtil jwtUtil) {
        this.itemService = itemService;
        this.roomService = roomService;
        this.bidService = bidService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/get-room")
    public ResponseEntity<Object> getRoom(
            @RequestParam String roomId,
            @RequestHeader(value = "Authorization") String token) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        String userId = jwtUtil.extractUserId(token.substring(7));
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized"));
        }

        Room room = roomService.getRoomById(roomId);
        String itemId = room.getItemId();
        Item item = itemService.getItem(room.getItemId()).get(0);
        boolean subscribed = item.getSubscribersId().contains(userId);

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Room fetched successfully!")
                .constructResponse("itemId", itemId)
                .constructResponse("itemTitle", item.getTitle())
                .constructResponse("startingPrice", item.getStartingPrice())
                .constructResponse("bidHistory", bidService.getBidHistory(roomId))
                .constructResponse("currentPrice", room.getCurrentPrice())
                .constructResponse("roomEndDate", room.getEndDate())
                .constructResponse("roomStatus", room.getStatus())
                .constructResponse("leaderboard", bidService.getTop5Bids(roomId))
                .constructResponse("myBid", bidService.getUserHighestBid(roomId, userId))
                .constructResponse("winnerId", room.getWinnerId())
                .constructResponse("registered", subscribed)
                .build();

        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/place-bid")
    public ResponseEntity<Object> placeBid(
            @RequestParam String roomId,
            @RequestParam Double bidAmount,
            @RequestHeader(value = "Authorization") String token
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
