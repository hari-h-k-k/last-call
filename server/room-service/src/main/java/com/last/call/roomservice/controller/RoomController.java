package com.last.call.roomservice.controller;

import com.last.call.roomservice.dto.ApiResponse;
import com.last.call.roomservice.dto.LeaderboardEntry;
import com.last.call.roomservice.entity.Bid;
import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.repository.RoomRepository;
import com.last.call.roomservice.service.BidService;
import com.last.call.roomservice.service.RoomService;
import com.last.call.roomservice.util.ResponseBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class RoomController {

    private static final Logger logger = LoggerFactory.getLogger(RoomController.class);
    private final RoomService roomService;
    private final BidService bidService;

    public RoomController(RoomService roomService, BidService bidService) {
        this.roomService = roomService;
        this.bidService = bidService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable("id") Long roomId) {
        Room room = roomService.getRoomById(roomId);
        return ResponseBuilder.success(room, "Room retrieved successfully");
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<Room>> getRoomByItemId(@PathVariable("itemId") Long itemId) {
        Room room = roomService.getRoomByItemId(itemId);
        return ResponseBuilder.success(room, "Room id retrieved successfully");
    }

    @GetMapping("/live-auctions")
    public ResponseEntity<ApiResponse<List<Room>>> getLiveAuctions() {
        logger.info("Fetching live auctions");
        List<Room> liveRooms = roomService.getLiveAuctions();
        logger.info("Found {} live auctions", liveRooms.size());
        return ResponseBuilder.success(liveRooms, "Live auctions retrieved successfully");
    }

    @GetMapping("/auction-of-the-day")
    public ResponseEntity<ApiResponse<List<Room>>> getAuctionOfTheDay() {
        logger.info("Fetching auction of the day");
        List<Room> todayRooms = roomService.getAuctionOfTheDay();
        logger.info("Found {} auctions starting today", todayRooms.size());
        return ResponseBuilder.success(todayRooms, "Auction of the day retrieved successfully");
    }

    @PostMapping("/{roomId}/bid")
    public ResponseEntity<ApiResponse<Bid>> placeBid(@PathVariable Long roomId, @RequestParam Double bidAmount, @RequestParam String name, @RequestHeader("X-User-Id") String userId) {
        logger.info("Placing bid in room {} by user {}", roomId, name);
        Bid bid = roomService.placeBid(roomId, Long.valueOf(userId), name, bidAmount);
        return ResponseBuilder.success(bid, "Bid placed successfully");
    }

    @GetMapping("/{roomId}/bid-history")
    public ResponseEntity<ApiResponse<List<Bid>>> getBidHistory(@PathVariable Long roomId) {
        logger.info("Fetching bid history for room {}", roomId);
        List<Bid> bidHistory = bidService.getBidHistory(roomId);
        return ResponseBuilder.success(bidHistory, "Bid history retrieved successfully");
    }

    @GetMapping("/{roomId}/leaderboard")
    public ResponseEntity<ApiResponse<List<LeaderboardEntry>>> getLeaderboard(@PathVariable Long roomId) {
        logger.info("Fetching leaderboard for room {}", roomId);
        List<LeaderboardEntry> leaderboard = bidService.getLeaderboard(roomId);
        return ResponseBuilder.success(leaderboard, "Leaderboard retrieved successfully");
    }
}