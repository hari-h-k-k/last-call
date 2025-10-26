package com.last.call.roomservice.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.last.call.roomservice.repository.RoomRepository;
import com.last.call.roomservice.service.RoomService;
import com.last.call.shared.dto.ItemRoomCreationDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class KafkaListener {

    private static final Logger logger = LoggerFactory.getLogger(KafkaListener.class);

    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final ObjectMapper objectMapper;

    public KafkaListener(RoomRepository roomRepository, RoomService roomService, ObjectMapper objectMapper) {
        this.roomRepository = roomRepository;
        this.roomService = roomService;
        this.objectMapper = objectMapper;
    }

    @org.springframework.kafka.annotation.KafkaListener(topics = "room-creation-with-item")
    public void handleRoomCreationWithItem(String message) {
        try {
            ItemRoomCreationDto itemData = objectMapper.readValue(message, ItemRoomCreationDto.class);
            System.out.println("📥 Creating room with data for item ID: " + itemData.getItemId());

            if (roomRepository.findByItemId(itemData.getItemId()).isPresent()) {
                logger.warn("Room already exists for item ID: {}", itemData.getItemId());
                return;
            }

            roomService.createRoom(itemData.getItemId(), itemData.getStartingPrice(), itemData.getAuctionStartDate());

            System.out.println("✅ Room created in PENDING status for item id: " + itemData.getItemId());

        } catch (Exception e) {
            logger.error("Error creating room with data: {}", e.getMessage());
        }
    }

    @org.springframework.kafka.annotation.KafkaListener(topics = "room-activation")
    public void handleRoomActivation(Long itemId) {
        try {
            System.out.println("🏠 Activating room for item ID: " + itemId);
            roomService.activateRoom(itemId);
            System.out.println("✅ Room activated for item ID: " + itemId);
        } catch (Exception e) {
            logger.error("Error activating room for item ID {}: {}", itemId, e.getMessage());
        }
    }

    @org.springframework.kafka.annotation.KafkaListener(topics = "room-closure")
    public void handleRoomClosure(Long roomId) {
        try {
            System.out.println("🏠 Closing room for room ID: " + roomId);
            roomService.closeRoom(roomId);
            System.out.println("✅ Room closed for room ID: " + roomId);
        } catch (Exception e) {
            logger.error("Error closing room for room ID {}: {}", roomId, e.getMessage());
        }
    }
}
