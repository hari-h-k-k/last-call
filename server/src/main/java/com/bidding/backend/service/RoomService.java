package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.Room;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.repository.UserRepository;
import com.bidding.backend.utils.enums.RoomStatus;
import com.bidding.backend.utils.scheduler.AuctionSchedulerService;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
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

    @Autowired
    private AuctionSchedulerService auctionSchedulerService;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public void createRoom(Item item) {
        if (item == null) {
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

        Room savedRoom = roomRepository.save(room);

        item.setRoomId(savedRoom.getId());
        itemRepository.save(item);
    }


    public void openRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if (room != null) {
            Date endDate = Date.from(room.getStartDate().toInstant().plus(Duration.ofMinutes(15)));
            room.setStatus(RoomStatus.ACTIVE.name());
            room.setEndDate(endDate);
            room.setUpdatedAt(new Date());
            roomRepository.save(room);

            try {
                auctionSchedulerService.scheduleCloseRoomJob(itemId, endDate);
            } catch (SchedulerException e) {
                throw new RuntimeException("Failed to schedule room close job", e);
            }
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

        // Update room bid only if higher
        boolean isNewHigh = room.updateRoomBid(userId, bidAmount);

        if (isNewHigh) {
            room.setWinnerId(userId);
            room.setCurrentPrice(bidAmount);

            // --- Extend auction only if less than 5 mins remaining ---
            Instant now = Instant.now();
            Instant currentEnd = room.getEndDate().toInstant();
            long remainingSeconds = Duration.between(now, currentEnd).getSeconds();

            if (remainingSeconds < 5 * 60) { // less than 5 minutes
                Instant newEnd = now.plus(Duration.ofMinutes(5));
                room.setEndDate(Date.from(newEnd));

                try {
                    auctionSchedulerService.scheduleCloseRoomJob(room.getItemId(), room.getEndDate());
                } catch (SchedulerException e) {
                    throw new RuntimeException("Failed to reschedule room close job", e);
                }
            }

            room.setUpdatedAt(new Date());
            roomRepository.save(room);

            // Notify clients
            Map<String, Object> socketPayload = Map.of(
                    "currentPrice", bidAmount,
                    "leaderId", userId,
                    "roomId", roomId,
                    "newEndDate", room.getEndDate() // optional: notify new end date
            );
            messagingTemplate.convertAndSend("/topic/currentBid/" + roomId, socketPayload);
        }

        // Save user's bid history
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.updateUserBid(roomId, bidAmount);
        userRepository.save(user);
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
