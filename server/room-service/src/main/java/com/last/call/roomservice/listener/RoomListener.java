package com.last.call.roomservice.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.last.call.roomservice.repository.RoomRepository;
import com.last.call.roomservice.service.RoomService;
import com.last.call.shared.dto.ItemRoomCreationDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RoomListener {

    private static final Logger logger = LoggerFactory.getLogger(RoomListener.class);

    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final ObjectMapper objectMapper;

    public RoomListener(RoomRepository roomRepository, RoomService roomService, ObjectMapper objectMapper) {
        this.roomRepository = roomRepository;
        this.roomService = roomService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "room-creation-with-item")
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
}
