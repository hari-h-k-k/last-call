package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.Room;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.repository.UserRepository;
import com.bidding.backend.utils.enums.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public void saveRoom(Room room) {
        roomRepository.save(room);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public void createRoom(Item item) {
        if(item == null) {
            return;
        }
        Room room = new Room.Builder()
                .itemId(item.getId())
                .startDate(item.getAuctionStartDate())
                .status(RoomStatus.PENDING.name())
                .currentPrice(item.getStartingPrice())
                .listOfUserIds(item.getSubscribersId())
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        roomRepository.save(room);
    }


    public void openRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.ACTIVE.name());
            room.setUpdatedAt(new Date());
            roomRepository.save(room);
        }
    }

    public void closeRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.CLOSED.name());
            room.setUpdatedAt(new Date());
            roomRepository.save(room);
        }
    }

    public void placeBid(String roomId, String userId, double bidAmount) {
        Room room = validateBid(roomId, bidAmount);

        // Update room bid
        room.updateRoomBid(userId, bidAmount);
        room.setWinnerId(userId); // current leader
        room.setUpdatedAt(new Date());
        roomRepository.save(room);

        // Update user's bid
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.updateUserBid(roomId, bidAmount);
        userRepository.save(user);

        Map<String, Object> socketPayload = Map.of(
                "currentPrice", bidAmount,
                "leaderId", userId,
                "roomId", roomId
        );
        messagingTemplate.convertAndSend("/topic/currentBid/" + roomId, socketPayload);
    }

    public Room validateBid(String roomId, double bidAmount) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getStatus().equals(RoomStatus.ACTIVE.name())) {
            throw new RuntimeException("Auction not active");
        }

        if (bidAmount <= room.getCurrentPrice()) {
            throw new RuntimeException("Bid too low");
        }

        return room;
    }
}
