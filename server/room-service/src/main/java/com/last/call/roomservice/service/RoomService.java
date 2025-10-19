package com.last.call.roomservice.service;

import com.last.call.roomservice.client.KafkaClient;
import com.last.call.roomservice.dto.BidUpdateMessage;
import com.last.call.roomservice.entity.Bid;
import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.enums.RoomStatus;
import com.last.call.roomservice.repository.BidRepository;
import com.last.call.roomservice.repository.RoomRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RoomService {
    
    private final RoomRepository roomRepository;
    private final BidRepository bidRepository;
    private final BidService bidservice;
    private final SimpMessagingTemplate messagingTemplate;
    private final KafkaClient kafkaClient;
    
    public RoomService(RoomRepository roomRepository, BidRepository bidRepository, BidService bidservice, SimpMessagingTemplate messagingTemplate, KafkaClient kafkaClient) {
        this.roomRepository = roomRepository;
        this.bidRepository = bidRepository;
        this.bidservice = bidservice;
        this.messagingTemplate = messagingTemplate;
        this.kafkaClient = kafkaClient;
    }
    
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room createRoom(Long itemId, Double startingPrice, Date auctionStartDate) {
        Room room = new Room();
        room.setItemId(itemId);
        room.setCurrentPrice(startingPrice);
        room.setAuctionStartDate(auctionStartDate);
        room.setStatus(RoomStatus.PENDING);
        room.setCreatedAt(new java.util.Date());
        room.setUpdatedAt(new java.util.Date());
        return roomRepository.save(room);
    }

    @Transactional
    public void activateRoom(Long itemId) {
        Room room = roomRepository.findByItemId(itemId).orElseThrow(() -> new RuntimeException("Room not found"));
        room.setStatus(RoomStatus.ACTIVE);
        Date now = new Date();
        room.setEndDate(new Date(now.getTime() + 10 * 60 * 1000));
        room.setUpdatedAt(now);
        roomRepository.save(room);

        kafkaClient.scheduleRoomClose(room.getId(), room.getEndDate());
        System.out.println("Room activated: " + room.getId());
    }

    @Transactional
    public void closeRoom(Long roomId) {
        Room room = getRoomById(roomId);
        room.setStatus(RoomStatus.COMPLETED);
        room.setUpdatedAt(new Date());
        roomRepository.save(room);
    }
    
    public List<Room> getLiveAuctions() {
        Date now = new Date();
        return roomRepository.findByStatusAndAuctionStartDateBefore(RoomStatus.ACTIVE, now);
    }
    
    public List<Room> getAuctionOfTheDay() {
        Date now = new Date();
        Date endOfDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return roomRepository.findByStatusAndAuctionStartDateBetween(RoomStatus.PENDING, now, endOfDay);
    }

    @Transactional
    public Bid placeBid(Long roomId, Long userId, String name, Double bidAmount) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getStatus() != RoomStatus.ACTIVE) {
            throw new RuntimeException("Room is not active");
        }

        Double userHighestBid = bidRepository.findHighestBidByRoomAndUserId(roomId, userId);

        if (userHighestBid != null && bidAmount <= userHighestBid) {
            throw new RuntimeException("New bid must be higher than current bid");
        }

        Date date = new Date();
        Bid bid = new Bid(userId, name, bidAmount, room, date);
        bid = bidservice.saveBid(bid);

        if(bidAmount > room.getCurrentPrice()) {
            room.setWinnerId(userId);
            room.setCurrentPrice(bidAmount);

            Instant now = Instant.now();
            Instant currentEnd = room.getEndDate().toInstant();
            long remainingSeconds = Duration.between(now, currentEnd).getSeconds();

            if (remainingSeconds < 5 * 60) { // less than 5 minutes
                Instant newEnd = now.plus(Duration.ofMinutes(5));
                room.setEndDate(Date.from(newEnd));

                try {
                    kafkaClient.scheduleRoomClose(room.getId(), room.getEndDate());
                } catch (Exception e) {
                    throw new RuntimeException("Failed to reschedule room close job", e);
                }
            }

            room.setUpdatedAt(date);
            roomRepository.save(room);
        }

        // Send WebSocket update
        BidUpdateMessage message = new BidUpdateMessage();
        message.setCurrentPrice(bidAmount);
        message.setBid(bid);
        message.setRoomId(roomId);
        message.setLeaderboard(bidservice.getLeaderboard(roomId));
        message.setBidHistory(bidservice.getBidHistory(roomId));
        message.setRoomStatus(room.getStatus());
        message.setWinnerId(userId);
        message.setMyBid(bidAmount);

        messagingTemplate.convertAndSend("/topic/currentBid/" + roomId, message);

        return bid;
    }
}
