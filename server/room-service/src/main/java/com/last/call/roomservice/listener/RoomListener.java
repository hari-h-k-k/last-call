package com.last.call.roomservice.listener;

import com.last.call.roomservice.dto.ItemRoomCreationDto;
import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.repository.RoomRepository;
import com.last.call.roomservice.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RoomListener {

    private static final Logger logger = LoggerFactory.getLogger(RoomListener.class);

    private final RoomRepository roomRepository;

    @Autowired
    private final RoomService roomService;

    public RoomListener(RoomRepository roomRepository, RoomService roomService) {
        this.roomRepository = roomRepository;
        this.roomService = roomService;
    }

    @KafkaListener(topics = "room-creation-with-item")
    public void handleRoomCreationWithItem(ItemRoomCreationDto itemData) {
        System.out.println("📥 Creating room with data for item ID: " + itemData.getId());
        try {
            if (roomRepository.findByItemId(itemData.getId()).isPresent()) {
                logger.warn("Room already exists for item ID: {}", itemData.getId());
                return;
            }

            roomService.createRoom(itemData.getId(), itemData.getStartingPrice(), itemData.getAuctionStartDate());

            System.out.println("✅ Room created in PENDING status for item id: " + itemData.getId());

        } catch (Exception e) {
            logger.error("Error creating room with data: {}", e.getMessage());
        }
    }
}
