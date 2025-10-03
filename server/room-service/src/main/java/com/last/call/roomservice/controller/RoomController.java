package com.last.call.roomservice.controller;

import com.last.call.roomservice.dto.ApiResponse;
import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.repository.RoomRepository;
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
    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomRepository.findById(id);
        return room.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<Room> getRoomByItemId(@PathVariable Long itemId) {
        Optional<Room> room = roomRepository.findByItemId(itemId);
        return room.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<Room> getActiveRooms() {
        return roomRepository.findActiveRooms(new java.util.Date());
    }

    @GetMapping("/live-auctions")
    public ResponseEntity<ApiResponse<List<Room>>> getLiveAuctions() {
        logger.info("Fetching live auctions");
        Date now = new Date();
        List<Room> liveRooms = roomRepository.findByStatusAndStartDateBefore("ACTIVE", now);
        logger.info("Found {} live auctions", liveRooms.size());
        return ResponseBuilder.success(liveRooms, "Live auctions retrieved successfully");
    }

    @GetMapping("/auction-of-the-day")
    public ResponseEntity<ApiResponse<List<Room>>> getAuctionOfTheDay() {
        logger.info("Fetching auction of the day");
        Date now = new Date();
        Date endOfDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        List<Room> todayRooms = roomRepository.findByStatusAndStartDateBetween("PENDING", now, endOfDay);
        logger.info("Found {} auctions starting today", todayRooms.size());
        return ResponseBuilder.success(todayRooms, "Auction of the day retrieved successfully");
    }
}