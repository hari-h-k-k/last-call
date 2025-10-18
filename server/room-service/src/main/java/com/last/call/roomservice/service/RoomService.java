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

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RoomService {
    
    private final RoomRepository roomRepository;
    private final BidService bidservice;
    private final SimpMessagingTemplate messagingTemplate;
    private final KafkaClient kafkaClient;
    
    public RoomService(RoomRepository roomRepository, BidService bidservice, SimpMessagingTemplate messagingTemplate, KafkaClient kafkaClient) {
        this.roomRepository = roomRepository;
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

        kafkaClient.scheduleRoomClose(itemId, room.getEndDate());
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
    public Bid placeBid(Long roomId, Long userId, Double bidAmount) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));

        if (bidAmount <= room.getCurrentPrice()) {
            throw new RuntimeException("Bid must be higher than current price");
        }

        Date date = new Date();
        room.setWinnerId(userId);
        room.setCurrentPrice(bidAmount);
        room.setUpdatedAt(date);
        roomRepository.save(room);

        Bid bid = new Bid(userId, bidAmount, room, date);
        bid = bidservice.saveBid(bid);

        // Send WebSocket update
        BidUpdateMessage message = new BidUpdateMessage();
        message.setCurrentPrice(bidAmount);
        message.setBid(bid);
        message.setRoomId(roomId);
        message.setLeaderboard(bidservice.getLeaderboard(roomId));
        message.setRoomStatus(room.getStatus());
        message.setWinnerId(userId);
        message.setMyBid(bidAmount);

        messagingTemplate.convertAndSend("/topic/currentBid/" + roomId, message);

        return bid;
    }
}
